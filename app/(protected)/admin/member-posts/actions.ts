"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminProfile } from "@/lib/auth";
import { saveMemberGuidePost } from "@/lib/member-guides";
import { normalizeMemberGuideFileUrl, normalizeMemberGuideVideoUrl } from "@/lib/member-guide-utils";

const nullableString = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => (typeof value === "string" ? value.trim() || null : null));

const memberGuideSchema = z
  .object({
    description: z.string().trim().min(12, "Deskripsi panduan masih terlalu pendek."),
    embedUrl: nullableString,
    fileAssetId: nullableString,
    fileUrl: nullableString,
    guideId: nullableString,
    isPaid: z.string().transform((value) => value === "true"),
    isPublished: z.string().transform((value) => value === "true"),
    price: nullableString.transform((value) => {
      if (!value) {
        return null;
      }

      const parsed = Number.parseInt(value, 10);
      return Number.isFinite(parsed) ? parsed : null;
    }),
    publishedAt: nullableString,
    section: z.enum(["start", "activation", "bot_settings", "files"]),
    type: z.enum(["video", "pdf"]),
    sortOrder: z.coerce.number().int().min(0).max(9999),
    title: z.string().trim().min(4, "Judul panduan minimal 4 karakter."),
  })
  .superRefine((value, ctx) => {
    if (value.type === "video" && !value.embedUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Link embed video wajib diisi.",
        path: ["embedUrl"],
      });
    }

    if (value.type === "video" && value.embedUrl && !normalizeMemberGuideVideoUrl(value.embedUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Link video harus berupa URL YouTube atau Vimeo yang bisa di-embed.",
        path: ["embedUrl"],
      });
    }

    if (value.type === "pdf" && !value.fileUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File PDF wajib dipilih.",
        path: ["fileUrl"],
      });
    }

    if (value.type === "pdf" && !value.fileAssetId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Asset PDF wajib tersimpan sebelum panduan dipublish.",
        path: ["fileAssetId"],
      });
    }

    if (value.type === "pdf" && value.fileUrl && !normalizeMemberGuideFileUrl(value.fileUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "URL PDF tidak valid.",
        path: ["fileUrl"],
      });
    }

    if (value.isPaid && (!value.price || value.price < 1000)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nominal konten berbayar minimal Rp1.000.",
        path: ["price"],
      });
    }
  });

export async function saveMemberGuidePostAction(formData: FormData) {
  await requireAdminProfile();

  const parsed = memberGuideSchema.safeParse({
    description: formData.get("description"),
    embedUrl: formData.get("embedUrl"),
    fileAssetId: formData.get("fileAssetId"),
    fileUrl: formData.get("fileUrl"),
    guideId: formData.get("guideId"),
    isPaid: formData.get("isPaid"),
    isPublished: formData.get("isPublished"),
    price: formData.get("price"),
    publishedAt: formData.get("publishedAt"),
    section: formData.get("section"),
    type: formData.get("type"),
    sortOrder: formData.get("sortOrder"),
    title: formData.get("title"),
  });

  if (!parsed.success) {
    redirect("/admin/member-posts?status=invalid");
  }

  let redirectTo = "/admin/member-posts?status=error";

  try {
    const guide = await saveMemberGuidePost({
      description: parsed.data.description,
      embedUrl: parsed.data.embedUrl,
      fileAssetId: parsed.data.fileAssetId,
      fileUrl: parsed.data.fileUrl,
      id: parsed.data.guideId,
      isPaid: parsed.data.isPaid,
      isPublished: parsed.data.isPublished,
      price: parsed.data.price,
      publishedAt: parsed.data.publishedAt,
      section: parsed.data.section,
      sortOrder: parsed.data.sortOrder,
      title: parsed.data.title,
      type: parsed.data.type,
    });

    redirectTo = `/admin/member-posts?status=saved&guide=${encodeURIComponent(guide.id)}`;
  } catch (error) {
    console.error("Failed to save member guide post", error);

    const message =
      error instanceof Error && error.message.trim()
        ? error.message.trim()
        : "Panduan belum bisa disimpan sekarang.";

    redirectTo = `/admin/member-posts?status=error&message=${encodeURIComponent(message)}`;
  }

  redirect(redirectTo);
}
