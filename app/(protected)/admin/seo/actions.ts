"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminProfile } from "@/lib/auth";
import {
  type SiteSeoSettings,
  updateSiteSeoSettings,
} from "@/lib/site-seo";

const seoSchema = z.object({
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

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function updateSeoSettingsAction(formData: FormData) {
  await requireAdminProfile();

  const parsed = seoSchema.safeParse({
    faviconAssetId: readString(formData, "faviconAssetId") || null,
    faviconUrl: readString(formData, "faviconUrl") || null,
    homeDescription: readString(formData, "homeDescription"),
    homeTitle: readString(formData, "homeTitle"),
    openGraphDescription: readString(formData, "openGraphDescription"),
    openGraphImageAssetId: readString(formData, "openGraphImageAssetId") || null,
    openGraphImageUrl: readString(formData, "openGraphImageUrl") || null,
    openGraphTitle: readString(formData, "openGraphTitle"),
    siteName: readString(formData, "siteName"),
    siteUrl: readString(formData, "siteUrl"),
  });

  if (!parsed.success) {
    redirect("/admin/seo?status=error");
  }

  const value: SiteSeoSettings = {
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

  await updateSiteSeoSettings(value);
  redirect("/admin/seo?status=saved");
}
