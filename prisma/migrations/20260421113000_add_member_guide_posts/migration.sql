CREATE TABLE IF NOT EXISTS "public"."member_guide_assets" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "label" TEXT NOT NULL,
  "public_id" TEXT NOT NULL UNIQUE,
  "secure_url" TEXT NOT NULL,
  "original_filename" TEXT,
  "bytes" INTEGER,
  "format" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "public"."member_guide_posts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "embed_url" TEXT,
  "file_asset_id" UUID,
  "file_url" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_published" BOOLEAN NOT NULL DEFAULT true,
  "published_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "member_guide_posts_published_idx"
  ON "public"."member_guide_posts" ("is_published", "sort_order", "published_at" DESC);
