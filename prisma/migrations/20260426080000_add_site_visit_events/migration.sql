CREATE TABLE IF NOT EXISTS "public"."site_visit_events" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "visitor_id" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "referrer" TEXT,
  "user_agent" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "site_visit_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "site_visit_events_created_at_idx"
ON "public"."site_visit_events" ("created_at");

CREATE INDEX IF NOT EXISTS "site_visit_events_visitor_id_idx"
ON "public"."site_visit_events" ("visitor_id");
