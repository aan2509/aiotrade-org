ALTER TABLE "public"."member_guide_posts"
ADD COLUMN IF NOT EXISTS "section" TEXT;

UPDATE "public"."member_guide_posts"
SET "section" = CASE
  WHEN "type" = 'pdf' THEN 'files'
  WHEN lower(coalesce("title", '') || ' ' || coalesce("description", '')) LIKE ANY (
    ARRAY[
      '%pengaturan%',
      '%setting%',
      '%settings%',
      '%config%',
      '%konfigurasi%',
      '%strategi%',
      '%strategy%',
      '%risk%',
      '%parameter%',
      '%bot%'
    ]
  ) THEN 'bot_settings'
  ELSE 'activation'
END
WHERE "section" IS NULL;

ALTER TABLE "public"."member_guide_posts"
ALTER COLUMN "section" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "member_guide_posts_section_idx"
  ON "public"."member_guide_posts" ("section", "is_published", "sort_order");
