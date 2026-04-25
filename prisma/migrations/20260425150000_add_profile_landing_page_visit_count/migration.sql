ALTER TABLE "public"."profiles"
ADD COLUMN IF NOT EXISTS "landing_page_visit_count" INTEGER NOT NULL DEFAULT 0;
