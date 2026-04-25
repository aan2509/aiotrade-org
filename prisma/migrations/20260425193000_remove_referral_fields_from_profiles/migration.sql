DROP INDEX IF EXISTS "profiles_referred_by_idx";

ALTER TABLE "public"."profiles"
DROP COLUMN IF EXISTS "landing_page_visit_count",
DROP COLUMN IF EXISTS "referral_link",
DROP COLUMN IF EXISTS "is_lp_active",
DROP COLUMN IF EXISTS "referred_by";
