import "server-only";

import { createHash } from "node:crypto";
import { unstable_cache } from "next/cache";
import {
  DEFAULT_SITE_LANGUAGE,
  getDefaultOnlySiteLanguages,
  prioritizeSiteLanguages,
  type SiteLanguage,
} from "@/lib/site-language";

const TRANSLATEX_BASE_URL = "https://api.translatex.com";

type TranslateXSupportedLanguagesResponse = {
  languages?: Array<{
    language?: string;
    name?: string;
  }>;
};

type TranslateXTranslateResponse = {
  translation?: string[] | string;
};

type TranslationLeaf = {
  path: Array<number | string>;
  value: string;
};

function getTranslateXApiKey() {
  return process.env.TRANSLATEX_API_KEY?.trim() ?? "";
}

function hasTranslateXApiKey() {
  return Boolean(getTranslateXApiKey());
}

async function fetchTranslateX(pathname: string, init?: RequestInit) {
  const apiKey = getTranslateXApiKey();

  if (!apiKey) {
    throw new Error("TRANSLATEX_API_KEY is not configured");
  }

  return fetch(`${TRANSLATEX_BASE_URL}${pathname}`, {
    ...init,
    cache: "no-store",
    headers: {
      "X-API-Key": apiKey,
      ...(init?.headers ?? {}),
    },
    next: { revalidate: 0 },
    signal: AbortSignal.timeout(12000),
  });
}

const getSupportedLanguagesCached = unstable_cache(
  async () => {
    const response = await fetchTranslateX("/supported-languages");

    if (!response.ok) {
      throw new Error(`TranslateX supported-languages failed with ${response.status}`);
    }

    const payload = (await response.json()) as TranslateXSupportedLanguagesResponse;
    const languages = (payload.languages ?? [])
      .map((language) => ({
        language: language.language?.trim().toLowerCase() ?? "",
        name: language.name?.trim() ?? "",
      }))
      .filter((language) => language.language && language.name);

    return prioritizeSiteLanguages(languages);
  },
  ["translatex-supported-languages"],
  { revalidate: 60 * 60 * 24 },
);

const translateTextsCached = unstable_cache(
  async (sourceLanguage: string, targetLanguage: string, payloadHash: string, texts: string[]) => {
    void payloadHash;

    const body = new URLSearchParams();
    texts.forEach((text) => body.append("text", text));

    const response = await fetchTranslateX(
      `/translate?sl=${encodeURIComponent(sourceLanguage)}&tl=${encodeURIComponent(targetLanguage)}`,
      {
        body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      },
    );

    if (!response.ok) {
      throw new Error(`TranslateX translate failed with ${response.status}`);
    }

    const payload = (await response.json()) as TranslateXTranslateResponse;

    if (Array.isArray(payload.translation)) {
      return payload.translation;
    }

    if (typeof payload.translation === "string") {
      return [payload.translation];
    }

    throw new Error("TranslateX response did not include translation data");
  },
  ["translatex-batch"],
  { revalidate: 60 * 60 * 24 * 30 },
);

export async function getSupportedSiteLanguages() {
  if (!hasTranslateXApiKey()) {
    return getDefaultOnlySiteLanguages();
  }

  try {
    const languages = await getSupportedLanguagesCached();

    return languages.length ? languages : getDefaultOnlySiteLanguages();
  } catch {
    return getDefaultOnlySiteLanguages();
  }
}

export async function translateTextBatch({
  sourceLanguage = DEFAULT_SITE_LANGUAGE,
  targetLanguage,
  texts,
}: {
  sourceLanguage?: SiteLanguage;
  targetLanguage: SiteLanguage;
  texts: string[];
}) {
  if (!texts.length || targetLanguage === sourceLanguage || targetLanguage === DEFAULT_SITE_LANGUAGE) {
    return texts;
  }

  if (!hasTranslateXApiKey()) {
    return texts;
  }

  const payloadHash = createHash("sha1")
    .update(JSON.stringify({ sourceLanguage, targetLanguage, texts }))
    .digest("hex");

  try {
    const translated = await translateTextsCached(sourceLanguage, targetLanguage, payloadHash, texts);

    return translated.length === texts.length ? translated : texts;
  } catch {
    return texts;
  }
}

export async function translateRecordStrings<T extends Record<string, string>>({
  record,
  sourceLanguage = DEFAULT_SITE_LANGUAGE,
  targetLanguage,
}: {
  record: T;
  sourceLanguage?: SiteLanguage;
  targetLanguage: SiteLanguage;
}) {
  const entries = Object.entries(record);

  if (!entries.length || targetLanguage === sourceLanguage || targetLanguage === DEFAULT_SITE_LANGUAGE) {
    return record;
  }

  const translated = await translateTextBatch({
    sourceLanguage,
    targetLanguage,
    texts: entries.map(([, value]) => value),
  });

  return Object.fromEntries(entries.map(([key], index) => [key, translated[index] ?? record[key]])) as T;
}

function collectTranslationLeaves(
  value: unknown,
  path: Array<number | string>,
  shouldTranslate: (path: Array<number | string>, value: string) => boolean,
  output: TranslationLeaf[],
) {
  if (typeof value === "string") {
    if (value.trim() && shouldTranslate(path, value)) {
      output.push({ path, value });
    }

    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectTranslationLeaves(entry, [...path, index], shouldTranslate, output));
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, entry]) =>
      collectTranslationLeaves(entry, [...path, key], shouldTranslate, output),
    );
  }
}

function setValueAtPath(target: unknown, path: Array<number | string>, value: string) {
  if (!path.length) {
    return value;
  }

  const [segment, ...rest] = path;

  if (Array.isArray(target)) {
    const clone = [...target];
    const index = Number(segment);
    clone[index] = setValueAtPath(clone[index], rest, value);
    return clone;
  }

  if (target && typeof target === "object") {
    const clone = { ...(target as Record<string, unknown>) };
    clone[String(segment)] = setValueAtPath(clone[String(segment)], rest, value);
    return clone;
  }

  return target;
}

export async function translateStructuredStrings<T>({
  sourceLanguage = DEFAULT_SITE_LANGUAGE,
  targetLanguage,
  value,
  shouldTranslate = () => true,
}: {
  sourceLanguage?: SiteLanguage;
  targetLanguage: SiteLanguage;
  value: T;
  shouldTranslate?: (path: Array<number | string>, value: string) => boolean;
}) {
  if (targetLanguage === sourceLanguage || targetLanguage === DEFAULT_SITE_LANGUAGE) {
    return value;
  }

  const leaves: TranslationLeaf[] = [];
  collectTranslationLeaves(value, [], shouldTranslate, leaves);

  if (!leaves.length) {
    return value;
  }

  const translated = await translateTextBatch({
    sourceLanguage,
    targetLanguage,
    texts: leaves.map((leaf) => leaf.value),
  });

  return leaves.reduce<T>((current, leaf, index) => {
    const replacement = translated[index];

    if (!replacement) {
      return current;
    }

    return setValueAtPath(current, leaf.path, replacement) as T;
  }, value);
}
