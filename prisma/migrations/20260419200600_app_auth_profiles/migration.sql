-- DropPolicies
DROP POLICY IF EXISTS "profiles_select_active_public" ON "public"."profiles";
DROP POLICY IF EXISTS "profiles_select_own" ON "public"."profiles";
DROP POLICY IF EXISTS "profiles_insert_own" ON "public"."profiles";
DROP POLICY IF EXISTS "profiles_update_own" ON "public"."profiles";

-- DisableRLS
ALTER TABLE "public"."profiles" NO FORCE ROW LEVEL SECURITY;
ALTER TABLE "public"."profiles" DISABLE ROW LEVEL SECURITY;

-- DropForeignKey
ALTER TABLE "public"."profiles" DROP CONSTRAINT IF EXISTS "profiles_id_fkey";

-- AlterTable
ALTER TABLE "public"."profiles" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "password_hash" TEXT;

UPDATE "public"."profiles"
SET "password_hash" = ''
WHERE "password_hash" IS NULL;

ALTER TABLE "public"."profiles" ALTER COLUMN "password_hash" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "profiles_email_key" ON "public"."profiles"("email");
