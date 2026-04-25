ALTER TABLE "public"."homepage_content"
ADD COLUMN IF NOT EXISTS "video" jsonb NOT NULL DEFAULT '{}'::jsonb;
