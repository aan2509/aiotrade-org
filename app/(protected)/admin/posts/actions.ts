"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { extractPlainTextFromArticleContent } from "@/lib/article-content";
import { requireAdminProfile } from "@/lib/auth";
import { createPostSlug } from "@/lib/blog-helpers";
import { saveBlogPost } from "@/lib/blog-posts";

const nullableString = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => (typeof value === "string" ? value.trim() || null : null));

const blogPostSchema = z.object({
  category: z.string().trim().min(1, "Kategori wajib diisi."),
  content: z
    .string()
    .trim()
    .refine((value) => extractPlainTextFromArticleContent(value).length >= 40, "Isi artikel masih terlalu pendek."),
  excerpt: z.string().trim().min(20, "Ringkasan artikel minimal 20 karakter."),
  isPublished: z.string().transform((value) => value === "true"),
  openGraphAssetId: nullableString,
  openGraphImageUrl: nullableString,
  postId: nullableString,
  publishedAt: nullableString,
  seoDescription: nullableString,
  seoTitle: nullableString,
  slug: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? ""),
  thumbnailAssetId: nullableString,
  thumbnailUrl: nullableString,
  title: z.string().trim().min(6, "Judul artikel minimal 6 karakter."),
});

function isUniqueConstraintError(error: unknown): error is { code: string } {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function saveBlogPostAction(formData: FormData) {
  await requireAdminProfile();

  const parsed = blogPostSchema.safeParse({
    category: formData.get("category"),
    content: formData.get("content"),
    excerpt: formData.get("excerpt"),
    isPublished: formData.get("isPublished"),
    openGraphAssetId: formData.get("openGraphAssetId"),
    openGraphImageUrl: formData.get("openGraphImageUrl"),
    postId: formData.get("postId"),
    publishedAt: formData.get("publishedAt"),
    seoDescription: formData.get("seoDescription"),
    seoTitle: formData.get("seoTitle"),
    slug: formData.get("slug"),
    thumbnailAssetId: formData.get("thumbnailAssetId"),
    thumbnailUrl: formData.get("thumbnailUrl"),
    title: formData.get("title"),
  });

  if (!parsed.success) {
    redirect("/admin/posts?status=invalid");
  }

  const payload = parsed.data;
  let redirectTo = "/admin/posts?status=error";

  try {
    const post = await saveBlogPost({
      category: payload.category,
      content: payload.content,
      excerpt: payload.excerpt,
      id: payload.postId,
      isPublished: payload.isPublished,
      openGraphAssetId: payload.openGraphAssetId,
      openGraphImageUrl: payload.openGraphImageUrl,
      publishedAt: payload.publishedAt,
      seoDescription: payload.seoDescription,
      seoTitle: payload.seoTitle,
      slug: payload.slug || createPostSlug(payload.title),
      thumbnailAssetId: payload.thumbnailAssetId,
      thumbnailUrl: payload.thumbnailUrl,
      title: payload.title,
    });

    redirectTo = `/admin/posts?status=saved&post=${encodeURIComponent(post.id)}`;
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      redirectTo = "/admin/posts?status=duplicate-slug";
    }
  }

  redirect(redirectTo);
}
