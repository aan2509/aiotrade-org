import "server-only";

import type { Metadata } from "next";
import type { BlogPostDetail, BlogPostInput } from "@/lib/blog-types";
import { createPostSlug } from "@/lib/blog-helpers";
import { prisma } from "@/lib/prisma";
import { getSiteSeoSettings } from "@/lib/site-seo";

type BlogPostRecord = {
  category: string;
  content: string;
  createdAt: Date;
  excerpt: string;
  id: string;
  isPublished: boolean;
  openGraphAssetId: string | null;
  openGraphImageUrl: string | null;
  publishedAt: Date;
  seoDescription: string | null;
  seoTitle: string | null;
  slug: string;
  thumbnailAssetId: string | null;
  thumbnailUrl: string | null;
  title: string;
  updatedAt: Date;
};

function hasBlogPostDelegate() {
  return (
    "blogPost" in prisma &&
    typeof prisma.blogPost?.findMany === "function" &&
    typeof prisma.blogPost?.findUnique === "function"
  );
}

function hasBlogPostWriteDelegate() {
  return (
    "blogPost" in prisma &&
    typeof prisma.blogPost?.create === "function" &&
    typeof prisma.blogPost?.update === "function" &&
    typeof prisma.blogPost?.delete === "function"
  );
}

async function hasBlogPostsTable() {
  try {
    const tables = await prisma.$queryRaw<Array<{ tableName: string | null }>>`
      SELECT to_regclass('public.blog_posts')::text AS "tableName"
    `;

    return Boolean(tables[0]?.tableName);
  } catch (error) {
    console.error("[blog-posts] Failed to reach database while checking blog_posts table.", error);
    return false;
  }
}

function mapBlogPost(record: BlogPostRecord): BlogPostDetail {
  return {
    category: record.category,
    content: record.content,
    createdAt: record.createdAt.toISOString(),
    excerpt: record.excerpt,
    id: record.id,
    isPublished: record.isPublished,
    openGraphAssetId: record.openGraphAssetId,
    openGraphImageUrl: record.openGraphImageUrl,
    publishedAt: record.publishedAt.toISOString(),
    seoDescription: record.seoDescription,
    seoTitle: record.seoTitle,
    slug: record.slug,
    thumbnailAssetId: record.thumbnailAssetId,
    thumbnailUrl: record.thumbnailUrl,
    title: record.title,
    updatedAt: record.updatedAt.toISOString(),
  };
}

function toDateOrNow(value: string | null | undefined) {
  if (!value) {
    return new Date();
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.valueOf()) ? new Date() : parsedDate;
}

async function getBlogPostRows(whereSql?: { clause: string; values: unknown[] }, limit?: number) {
  if (!(await hasBlogPostsTable())) {
    return [];
  }

  const limitValue = limit ?? null;

  if (hasBlogPostDelegate() && !whereSql) {
    const records = await prisma.blogPost.findMany({
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      ...(typeof limit === "number" ? { take: limit } : {}),
      select: {
        category: true,
        content: true,
        createdAt: true,
        excerpt: true,
        id: true,
        isPublished: true,
        openGraphAssetId: true,
        openGraphImageUrl: true,
        publishedAt: true,
        seoDescription: true,
        seoTitle: true,
        slug: true,
        thumbnailAssetId: true,
        thumbnailUrl: true,
        title: true,
        updatedAt: true,
      },
    });

    return records as BlogPostRecord[];
  }

  const baseQuery = `
    SELECT
      "id",
      "title",
      "slug",
      "category",
      "excerpt",
      "content",
      "seo_title" AS "seoTitle",
      "seo_description" AS "seoDescription",
      "thumbnail_asset_id" AS "thumbnailAssetId",
      "thumbnail_url" AS "thumbnailUrl",
      "open_graph_asset_id" AS "openGraphAssetId",
      "open_graph_image_url" AS "openGraphImageUrl",
      "is_published" AS "isPublished",
      "published_at" AS "publishedAt",
      "created_at" AS "createdAt",
      "updated_at" AS "updatedAt"
    FROM "public"."blog_posts"
  `;

  if (!whereSql) {
    return prisma.$queryRawUnsafe<BlogPostRecord[]>(
      `${baseQuery}
       ORDER BY "published_at" DESC, "created_at" DESC
       ${typeof limitValue === "number" ? "LIMIT $1" : ""}`,
      ...(typeof limitValue === "number" ? [limitValue] : []),
    );
  }

  return prisma.$queryRawUnsafe<BlogPostRecord[]>(
    `${baseQuery}
     WHERE ${whereSql.clause}
     ORDER BY "published_at" DESC, "created_at" DESC
     ${typeof limitValue === "number" ? `LIMIT $${whereSql.values.length + 1}` : ""}`,
    ...whereSql.values,
    ...(typeof limitValue === "number" ? [limitValue] : []),
  );
}

export async function getAdminBlogPosts() {
  if (!(await hasBlogPostsTable())) {
    return [];
  }

  const rows = hasBlogPostDelegate()
    ? await prisma.blogPost.findMany({
        orderBy: [{ updatedAt: "desc" }],
        select: {
          category: true,
          content: true,
          createdAt: true,
          excerpt: true,
          id: true,
          isPublished: true,
          openGraphAssetId: true,
          openGraphImageUrl: true,
          publishedAt: true,
          seoDescription: true,
          seoTitle: true,
          slug: true,
          thumbnailAssetId: true,
          thumbnailUrl: true,
          title: true,
          updatedAt: true,
        },
      })
    : await prisma.$queryRaw<BlogPostRecord[]>`
        SELECT
          "id",
          "title",
          "slug",
          "category",
          "excerpt",
          "content",
          "seo_title" AS "seoTitle",
          "seo_description" AS "seoDescription",
          "thumbnail_asset_id" AS "thumbnailAssetId",
          "thumbnail_url" AS "thumbnailUrl",
          "open_graph_asset_id" AS "openGraphAssetId",
          "open_graph_image_url" AS "openGraphImageUrl",
          "is_published" AS "isPublished",
          "published_at" AS "publishedAt",
          "created_at" AS "createdAt",
          "updated_at" AS "updatedAt"
        FROM "public"."blog_posts"
        ORDER BY "updated_at" DESC
      `;

  return rows.map(mapBlogPost);
}

export async function getPublishedBlogPosts(limit?: number) {
  if (!(await hasBlogPostsTable())) {
    return [];
  }

  const rows = hasBlogPostDelegate()
    ? await prisma.blogPost.findMany({
        where: {
          isPublished: true,
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        ...(typeof limit === "number" ? { take: limit } : {}),
        select: {
          category: true,
          content: true,
          createdAt: true,
          excerpt: true,
          id: true,
          isPublished: true,
          openGraphAssetId: true,
          openGraphImageUrl: true,
          publishedAt: true,
          seoDescription: true,
          seoTitle: true,
          slug: true,
          thumbnailAssetId: true,
          thumbnailUrl: true,
          title: true,
          updatedAt: true,
        },
      })
    : await getBlogPostRows({ clause: `"is_published" = true`, values: [] }, limit);

  return rows.map(mapBlogPost);
}

export async function getPublishedBlogPostBySlug(slug: string) {
  if (!(await hasBlogPostsTable())) {
    return null;
  }

  if (hasBlogPostDelegate()) {
    const record = await prisma.blogPost.findUnique({
      where: {
        slug,
      },
      select: {
        category: true,
        content: true,
        createdAt: true,
        excerpt: true,
        id: true,
        isPublished: true,
        openGraphAssetId: true,
        openGraphImageUrl: true,
        publishedAt: true,
        seoDescription: true,
        seoTitle: true,
        slug: true,
        thumbnailAssetId: true,
        thumbnailUrl: true,
        title: true,
        updatedAt: true,
      },
    });

    return record?.isPublished ? mapBlogPost(record as BlogPostRecord) : null;
  }

  const rows = await getBlogPostRows({ clause: `"slug" = $1 AND "is_published" = true`, values: [slug] }, 1);
  return rows[0] ? mapBlogPost(rows[0]) : null;
}

export async function getAdminBlogPostById(id: string) {
  if (!(await hasBlogPostsTable())) {
    return null;
  }

  if (hasBlogPostDelegate()) {
    const record = await prisma.blogPost.findUnique({
      where: {
        id,
      },
      select: {
        category: true,
        content: true,
        createdAt: true,
        excerpt: true,
        id: true,
        isPublished: true,
        openGraphAssetId: true,
        openGraphImageUrl: true,
        publishedAt: true,
        seoDescription: true,
        seoTitle: true,
        slug: true,
        thumbnailAssetId: true,
        thumbnailUrl: true,
        title: true,
        updatedAt: true,
      },
    });

    return record ? mapBlogPost(record as BlogPostRecord) : null;
  }

  const rows = await getBlogPostRows({ clause: `"id" = $1`, values: [id] }, 1);
  return rows[0] ? mapBlogPost(rows[0]) : null;
}

export async function saveBlogPost(input: BlogPostInput) {
  const payload = {
    category: input.category.trim() || "Crypto News",
    content: input.content.trim(),
    excerpt: input.excerpt.trim(),
    isPublished: input.isPublished,
    openGraphAssetId: input.openGraphAssetId?.trim() || null,
    openGraphImageUrl: input.openGraphImageUrl?.trim() || null,
    publishedAt: toDateOrNow(input.publishedAt),
    seoDescription: input.seoDescription?.trim() || null,
    seoTitle: input.seoTitle?.trim() || null,
    slug: createPostSlug(input.slug || input.title),
    thumbnailAssetId: input.thumbnailAssetId?.trim() || null,
    thumbnailUrl: input.thumbnailUrl?.trim() || null,
    title: input.title.trim(),
  };

  if (hasBlogPostWriteDelegate()) {
    const record = input.id
      ? await prisma.blogPost.update({
          where: { id: input.id },
          data: payload,
          select: {
            category: true,
            content: true,
            createdAt: true,
            excerpt: true,
            id: true,
            isPublished: true,
            openGraphAssetId: true,
            openGraphImageUrl: true,
            publishedAt: true,
            seoDescription: true,
            seoTitle: true,
            slug: true,
            thumbnailAssetId: true,
            thumbnailUrl: true,
            title: true,
            updatedAt: true,
          },
        })
      : await prisma.blogPost.create({
          data: payload,
          select: {
            category: true,
            content: true,
            createdAt: true,
            excerpt: true,
            id: true,
            isPublished: true,
            openGraphAssetId: true,
            openGraphImageUrl: true,
            publishedAt: true,
            seoDescription: true,
            seoTitle: true,
            slug: true,
            thumbnailAssetId: true,
            thumbnailUrl: true,
            title: true,
            updatedAt: true,
          },
        });

    return mapBlogPost(record as BlogPostRecord);
  }

  const rows = input.id
    ? await prisma.$queryRaw<BlogPostRecord[]>`
        UPDATE "public"."blog_posts"
        SET
          "title" = ${payload.title},
          "slug" = ${payload.slug},
          "category" = ${payload.category},
          "excerpt" = ${payload.excerpt},
          "content" = ${payload.content},
          "seo_title" = ${payload.seoTitle},
          "seo_description" = ${payload.seoDescription},
          "thumbnail_asset_id" = ${payload.thumbnailAssetId},
          "thumbnail_url" = ${payload.thumbnailUrl},
          "open_graph_asset_id" = ${payload.openGraphAssetId},
          "open_graph_image_url" = ${payload.openGraphImageUrl},
          "is_published" = ${payload.isPublished},
          "published_at" = ${payload.publishedAt},
          "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = ${input.id}
        RETURNING
          "id",
          "title",
          "slug",
          "category",
          "excerpt",
          "content",
          "seo_title" AS "seoTitle",
          "seo_description" AS "seoDescription",
          "thumbnail_asset_id" AS "thumbnailAssetId",
          "thumbnail_url" AS "thumbnailUrl",
          "open_graph_asset_id" AS "openGraphAssetId",
          "open_graph_image_url" AS "openGraphImageUrl",
          "is_published" AS "isPublished",
          "published_at" AS "publishedAt",
          "created_at" AS "createdAt",
          "updated_at" AS "updatedAt"
      `
    : await prisma.$queryRaw<BlogPostRecord[]>`
        INSERT INTO "public"."blog_posts" (
          "title",
          "slug",
          "category",
          "excerpt",
          "content",
          "seo_title",
          "seo_description",
          "thumbnail_asset_id",
          "thumbnail_url",
          "open_graph_asset_id",
          "open_graph_image_url",
          "is_published",
          "published_at"
        )
        VALUES (
          ${payload.title},
          ${payload.slug},
          ${payload.category},
          ${payload.excerpt},
          ${payload.content},
          ${payload.seoTitle},
          ${payload.seoDescription},
          ${payload.thumbnailAssetId},
          ${payload.thumbnailUrl},
          ${payload.openGraphAssetId},
          ${payload.openGraphImageUrl},
          ${payload.isPublished},
          ${payload.publishedAt}
        )
        RETURNING
          "id",
          "title",
          "slug",
          "category",
          "excerpt",
          "content",
          "seo_title" AS "seoTitle",
          "seo_description" AS "seoDescription",
          "thumbnail_asset_id" AS "thumbnailAssetId",
          "thumbnail_url" AS "thumbnailUrl",
          "open_graph_asset_id" AS "openGraphAssetId",
          "open_graph_image_url" AS "openGraphImageUrl",
          "is_published" AS "isPublished",
          "published_at" AS "publishedAt",
          "created_at" AS "createdAt",
          "updated_at" AS "updatedAt"
      `;

  return mapBlogPost(rows[0]);
}

export async function setBlogPostPublishedState(id: string, isPublished: boolean) {
  if (hasBlogPostWriteDelegate()) {
    const record = await prisma.blogPost.update({
      where: { id },
      data: {
        isPublished,
      },
      select: {
        category: true,
        content: true,
        createdAt: true,
        excerpt: true,
        id: true,
        isPublished: true,
        openGraphAssetId: true,
        openGraphImageUrl: true,
        publishedAt: true,
        seoDescription: true,
        seoTitle: true,
        slug: true,
        thumbnailAssetId: true,
        thumbnailUrl: true,
        title: true,
        updatedAt: true,
      },
    });

    return mapBlogPost(record as BlogPostRecord);
  }

  const rows = await prisma.$queryRaw<BlogPostRecord[]>`
    UPDATE "public"."blog_posts"
    SET
      "is_published" = ${isPublished},
      "updated_at" = CURRENT_TIMESTAMP
    WHERE "id" = ${id}
    RETURNING
      "id",
      "title",
      "slug",
      "category",
      "excerpt",
      "content",
      "seo_title" AS "seoTitle",
      "seo_description" AS "seoDescription",
      "thumbnail_asset_id" AS "thumbnailAssetId",
      "thumbnail_url" AS "thumbnailUrl",
      "open_graph_asset_id" AS "openGraphAssetId",
      "open_graph_image_url" AS "openGraphImageUrl",
      "is_published" AS "isPublished",
      "published_at" AS "publishedAt",
      "created_at" AS "createdAt",
      "updated_at" AS "updatedAt"
  `;

  return rows[0] ? mapBlogPost(rows[0]) : null;
}

export async function deleteBlogPost(id: string) {
  if (hasBlogPostWriteDelegate()) {
    await prisma.blogPost.delete({
      where: { id },
    });

    return;
  }

  await prisma.$executeRaw`
    DELETE FROM "public"."blog_posts"
    WHERE "id" = ${id}
  `;
}

export async function buildBlogPostMetadata(post: BlogPostDetail): Promise<Metadata> {
  const seo = await getSiteSeoSettings();
  const siteUrl = seo.siteUrl.replace(/\/$/, "");
  const imageUrl = post.openGraphImageUrl ?? post.thumbnailUrl ?? seo.openGraphImageUrl ?? null;
  const title = post.seoTitle ?? `${post.title} | ${seo.siteName}`;
  const description = post.seoDescription ?? post.excerpt;
  const url = `${siteUrl}/blog/${post.slug}`;

  return {
    title,
    description,
    openGraph: {
      description,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      title,
      type: "article",
      url,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      description,
      images: imageUrl ? [imageUrl] : undefined,
      title,
    },
  };
}
