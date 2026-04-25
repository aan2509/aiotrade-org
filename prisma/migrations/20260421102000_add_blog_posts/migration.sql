CREATE TABLE IF NOT EXISTS "public"."blog_posts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "category" TEXT NOT NULL DEFAULT 'Crypto News',
  "excerpt" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "seo_title" TEXT,
  "seo_description" TEXT,
  "thumbnail_asset_id" UUID,
  "thumbnail_url" TEXT,
  "open_graph_asset_id" UUID,
  "open_graph_image_url" TEXT,
  "is_published" BOOLEAN NOT NULL DEFAULT true,
  "published_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "blog_posts_published_idx"
  ON "public"."blog_posts" ("is_published", "published_at" DESC);
