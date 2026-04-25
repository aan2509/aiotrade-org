"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminProfile } from "@/lib/auth";
import { normalizePublicGuideFileUrl } from "@/lib/public-guide-utils";
import { savePublicGuidePdfPost } from "@/lib/public-guides";

const nullableString = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => (typeof value === "string" ? value.trim() || null : null));

const publicGuidePdfSchema = z
  .object({
    description: z.string().trim().min(12, "Deskripsi PDF masih terlalu pendek."),
    fileAssetId: nullableString,
    fileUrl: nullableString,
    isPublished: z.string().transform((value) => value === "true"),
    pdfId: nullableString,
    publishedAt: nullableString,
    sortOrder: z.coerce.number().int().min(0).max(9999),
    title: z.string().trim().min(4, "Judul PDF minimal 4 karakter."),
  })
  .superRefine((value, ctx) => {
    if (!value.fileAssetId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Asset PDF wajib tersimpan sebelum disimpan.",
        path: ["fileAssetId"],
      });
    }

    if (!value.fileUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File PDF wajib dipilih.",
        path: ["fileUrl"],
      });
    }

    if (value.fileUrl && !normalizePublicGuideFileUrl(value.fileUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "URL PDF tidak valid.",
        path: ["fileUrl"],
      });
    }
  });

export async function savePublicGuidePdfPostAction(formData: FormData) {
  await requireAdminProfile();

  const parsed = publicGuidePdfSchema.safeParse({
    description: formData.get("description"),
    fileAssetId: formData.get("fileAssetId"),
    fileUrl: formData.get("fileUrl"),
    isPublished: formData.get("isPublished"),
    pdfId: formData.get("pdfId"),
    publishedAt: formData.get("publishedAt"),
    sortOrder: formData.get("sortOrder"),
    title: formData.get("title"),
  });

  if (!parsed.success) {
    redirect("/admin/posts/pdfs?status=invalid");
  }

  let redirectTo = "/admin/posts/pdfs?status=error";

  try {
    const pdf = await savePublicGuidePdfPost({
      description: parsed.data.description,
      fileAssetId: parsed.data.fileAssetId,
      fileUrl: parsed.data.fileUrl,
      id: parsed.data.pdfId,
      isPublished: parsed.data.isPublished,
      publishedAt: parsed.data.publishedAt,
      sortOrder: parsed.data.sortOrder,
      title: parsed.data.title,
    });

    redirectTo = `/admin/posts/pdfs?status=saved&pdf=${encodeURIComponent(pdf.id)}`;
  } catch (error) {
    console.error("Failed to save public guide pdf post", error);

    const message =
      error instanceof Error && error.message.trim()
        ? error.message.trim()
        : "PDF publik belum bisa disimpan sekarang.";

    redirectTo = `/admin/posts/pdfs?status=error&message=${encodeURIComponent(message)}`;
  }

  redirect(redirectTo);
}
