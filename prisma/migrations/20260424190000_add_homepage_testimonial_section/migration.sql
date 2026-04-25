ALTER TABLE "public"."homepage_content"
ADD COLUMN IF NOT EXISTS "testimonial" jsonb NOT NULL DEFAULT '{}'::jsonb;
