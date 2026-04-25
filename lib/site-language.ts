export const SITE_LANGUAGE_COOKIE = "site-language";
export const DEFAULT_SITE_LANGUAGE = "id";

export type SiteLanguage = string;

export type SiteLanguageOption = {
  language: SiteLanguage;
  name: string;
};

const fallbackLanguages: SiteLanguageOption[] = [
  { language: "id", name: "Indonesia" },
  { language: "en", name: "English" },
];

const defaultOnlyLanguages: SiteLanguageOption[] = [{ language: "id", name: "Indonesia" }];

export function parseSiteLanguage(value: string | null | undefined): SiteLanguage {
  const normalized = value?.trim().toLowerCase();

  return normalized || DEFAULT_SITE_LANGUAGE;
}

export function getFallbackSiteLanguages() {
  return fallbackLanguages;
}

export function getDefaultOnlySiteLanguages() {
  return defaultOnlyLanguages;
}

export function prioritizeSiteLanguages(languages: SiteLanguageOption[]) {
  const seen = new Set<string>();
  const unique = languages.filter((language) => {
    const key = language.language.trim().toLowerCase();

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });

  const priority = ["id", "en"];

  return unique.sort((left, right) => {
    const leftPriority = priority.indexOf(left.language);
    const rightPriority = priority.indexOf(right.language);

    if (leftPriority !== -1 || rightPriority !== -1) {
      if (leftPriority === -1) {
        return 1;
      }

      if (rightPriority === -1) {
        return -1;
      }

      return leftPriority - rightPriority;
    }

    return left.name.localeCompare(right.name, "en", { sensitivity: "base" });
  });
}
