import "server-only";

import { z } from "zod";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

const SITE_SEO_SETTINGS_ID = "site";

export type SiteSeoSettings = {
  faviconAssetId: string | null;
  faviconUrl: string | null;
  homeDescription: string;
  homeTitle: string;
  openGraphDescription: string;
  openGraphImageAssetId: string | null;
  openGraphImageUrl: string | null;
  openGraphTitle: string;
  siteName: string;
  siteUrl: string;
};

const siteSeoSchema = z.object({
  faviconAssetId: z.string().trim().optional().nullable(),
  faviconUrl: z.string().trim().url().optional().nullable(),
  homeDescription: z.string().trim().min(1),
  homeTitle: z.string().trim().min(1),
  openGraphDescription: z.string().trim().min(1),
  openGraphImageAssetId: z.string().trim().optional().nullable(),
  openGraphImageUrl: z.string().trim().url().optional().nullable(),
  openGraphTitle: z.string().trim().min(1),
  siteName: z.string().trim().min(1),
  siteUrl: z.string().trim().url(),
});

export const defaultSiteSeoSettings: SiteSeoSettings = {
  faviconAssetId: null,
  faviconUrl: null,
  homeDescription:
    "Landing page AIOTrade untuk edukasi, komunitas, dan trading otomatis dengan alur signup yang tetap utuh.",
  homeTitle: "AIOTrade | Edukasi & Trading Otomatis",
  openGraphDescription:
    "Gabung komunitas AIOTrade untuk edukasi, komunitas, dan trading otomatis dengan alur invite yang tetap rapi.",
  openGraphImageAssetId: null,
  openGraphImageUrl: null,
  openGraphTitle: "AIOTrade | Edukasi & Trading Otomatis",
  siteName: "AIOTrade",
  siteUrl: "http://127.0.0.1:3000",
};

type SiteSeoRecord = SiteSeoSettings & {
  createdAt?: Date;
  updatedAt?: Date;
};

function getMetadataBase(siteUrl: string) {
  try {
    return new URL(siteUrl);
  } catch {
    return undefined;
  }
}

function hasSiteSeoDelegate() {
  return (
    "siteSeoSettings" in prisma &&
    typeof prisma.siteSeoSettings?.findUnique === "function" &&
    typeof prisma.siteSeoSettings?.upsert === "function"
  );
}

function normalizeSiteSeoSettings(value: unknown): SiteSeoSettings {
  const parsed = siteSeoSchema.safeParse(value);

  if (!parsed.success) {
    return defaultSiteSeoSettings;
  }

  return {
    faviconAssetId: parsed.data.faviconAssetId ?? null,
    faviconUrl: parsed.data.faviconUrl ?? null,
    homeDescription: parsed.data.homeDescription,
    homeTitle: parsed.data.homeTitle,
    openGraphDescription: parsed.data.openGraphDescription,
    openGraphImageAssetId: parsed.data.openGraphImageAssetId ?? null,
    openGraphImageUrl: parsed.data.openGraphImageUrl ?? null,
    openGraphTitle: parsed.data.openGraphTitle,
    siteName: parsed.data.siteName,
    siteUrl: parsed.data.siteUrl,
  };
}

export async function getSiteSeoSettings(): Promise<SiteSeoSettings> {
  try {
    const tables = await prisma.$queryRaw<Array<{ tableName: string | null }>>`
      SELECT to_regclass('public.site_seo_settings')::text AS "tableName"
    `;

    if (!tables[0]?.tableName) {
      return defaultSiteSeoSettings;
    }

    const record = hasSiteSeoDelegate()
      ? await prisma.siteSeoSettings.findUnique({
          where: { id: SITE_SEO_SETTINGS_ID },
          select: {
            faviconAssetId: true,
            faviconUrl: true,
            homeDescription: true,
            homeTitle: true,
            openGraphDescription: true,
            openGraphImageAssetId: true,
            openGraphImageUrl: true,
            openGraphTitle: true,
            siteName: true,
            siteUrl: true,
          },
        })
      : (
          await prisma.$queryRaw<SiteSeoRecord[]>`
            SELECT
              "favicon_asset_id" AS "faviconAssetId",
              "favicon_url" AS "faviconUrl",
              "home_description" AS "homeDescription",
              "home_title" AS "homeTitle",
              "open_graph_description" AS "openGraphDescription",
              "open_graph_image_asset_id" AS "openGraphImageAssetId",
              "open_graph_image_url" AS "openGraphImageUrl",
              "open_graph_title" AS "openGraphTitle",
              "site_name" AS "siteName",
              "site_url" AS "siteUrl"
            FROM "public"."site_seo_settings"
            WHERE "id" = ${SITE_SEO_SETTINGS_ID}
            LIMIT 1
          `
        )[0] ?? null;

    return normalizeSiteSeoSettings(record);
  } catch (error) {
    console.error("[site-seo] Failed to load SEO settings, using defaults.", error);
    return defaultSiteSeoSettings;
  }
}

export async function updateSiteSeoSettings(value: SiteSeoSettings) {
  const parsed = siteSeoSchema.parse(value);

  if (hasSiteSeoDelegate()) {
    await prisma.siteSeoSettings.upsert({
      where: { id: SITE_SEO_SETTINGS_ID },
      create: {
        id: SITE_SEO_SETTINGS_ID,
        ...parsed,
      },
      update: parsed,
    });

    return;
  }

  await prisma.$executeRaw`
    INSERT INTO "public"."site_seo_settings" (
      "id",
      "site_name",
      "site_url",
      "home_title",
      "home_description",
      "open_graph_title",
      "open_graph_description",
      "favicon_asset_id",
      "favicon_url",
      "open_graph_image_asset_id",
      "open_graph_image_url"
    )
    VALUES (
      ${SITE_SEO_SETTINGS_ID},
      ${parsed.siteName},
      ${parsed.siteUrl},
      ${parsed.homeTitle},
      ${parsed.homeDescription},
      ${parsed.openGraphTitle},
      ${parsed.openGraphDescription},
      ${parsed.faviconAssetId ?? null},
      ${parsed.faviconUrl ?? null},
      ${parsed.openGraphImageAssetId ?? null},
      ${parsed.openGraphImageUrl ?? null}
    )
    ON CONFLICT ("id") DO UPDATE SET
      "site_name" = EXCLUDED."site_name",
      "site_url" = EXCLUDED."site_url",
      "home_title" = EXCLUDED."home_title",
      "home_description" = EXCLUDED."home_description",
      "open_graph_title" = EXCLUDED."open_graph_title",
      "open_graph_description" = EXCLUDED."open_graph_description",
      "favicon_asset_id" = EXCLUDED."favicon_asset_id",
      "favicon_url" = EXCLUDED."favicon_url",
      "open_graph_image_asset_id" = EXCLUDED."open_graph_image_asset_id",
      "open_graph_image_url" = EXCLUDED."open_graph_image_url",
      "updated_at" = CURRENT_TIMESTAMP
  `;
}

export function buildRootMetadata(seo: SiteSeoSettings): Metadata {
  const fallbackIconUrl = "/favicon-default.ico";
  const faviconRouteUrl = "/favicon.ico";

  return {
    applicationName: seo.siteName,
    description: seo.homeDescription,
    icons: {
      apple: [{ url: seo.faviconUrl ?? fallbackIconUrl }],
      icon: [{ url: faviconRouteUrl }],
      shortcut: [faviconRouteUrl],
    },
    metadataBase: getMetadataBase(seo.siteUrl),
    title: {
      default: seo.homeTitle,
      template: `%s | ${seo.siteName}`,
    },
  };
}

export function buildHomePageMetadata(seo: SiteSeoSettings): Metadata {
  return {
    description: seo.homeDescription,
    openGraph: {
      description: seo.openGraphDescription,
      images: seo.openGraphImageUrl
        ? [
            {
              alt: seo.openGraphTitle,
              url: seo.openGraphImageUrl,
            },
          ]
        : undefined,
      siteName: seo.siteName,
      title: seo.openGraphTitle,
      type: "website",
      url: seo.siteUrl,
    },
    title: seo.homeTitle,
    twitter: {
      card: seo.openGraphImageUrl ? "summary_large_image" : "summary",
      description: seo.openGraphDescription,
      images: seo.openGraphImageUrl ? [seo.openGraphImageUrl] : undefined,
      title: seo.openGraphTitle,
    },
  };
}
