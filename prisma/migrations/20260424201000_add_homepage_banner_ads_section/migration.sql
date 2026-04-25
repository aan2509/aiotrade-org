ALTER TABLE "public"."homepage_content"
ADD COLUMN IF NOT EXISTS "banner_ads" jsonb NOT NULL DEFAULT '{}'::jsonb;
