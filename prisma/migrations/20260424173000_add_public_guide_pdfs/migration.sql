CREATE TABLE IF NOT EXISTS "public"."public_guide_assets" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "label" TEXT NOT NULL,
  "public_id" TEXT NOT NULL,
  "secure_url" TEXT NOT NULL,
  "original_filename" TEXT,
  "bytes" INTEGER,
  "format" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "public_guide_assets_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "public_guide_assets_public_id_key"
  ON "public"."public_guide_assets" ("public_id");

CREATE TABLE IF NOT EXISTS "public"."public_guide_pdf_posts" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "file_asset_id" UUID,
  "file_url" TEXT NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_published" BOOLEAN NOT NULL DEFAULT true,
  "published_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "public_guide_pdf_posts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "public_guide_pdf_posts_published_idx"
  ON "public"."public_guide_pdf_posts" ("is_published", "sort_order", "published_at" DESC);
