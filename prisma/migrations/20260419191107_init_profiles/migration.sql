-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "username" TEXT NOT NULL,
    "is_lp_active" BOOLEAN NOT NULL DEFAULT false,
    "referred_by" TEXT,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");

-- CreateIndex
CREATE INDEX "profiles_referred_by_idx" ON "profiles"("referred_by");

-- AddForeignKey
ALTER TABLE "profiles"
ADD CONSTRAINT "profiles_id_fkey"
FOREIGN KEY ("id") REFERENCES "auth"."users"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- EnableRLS
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."profiles" FORCE ROW LEVEL SECURITY;

-- CreatePolicies
CREATE POLICY "profiles_select_active_public"
ON "public"."profiles"
FOR SELECT
TO anon, authenticated
USING ("is_lp_active" = true);

CREATE POLICY "profiles_select_own"
ON "public"."profiles"
FOR SELECT
TO authenticated
USING (auth.uid() = "id");

CREATE POLICY "profiles_insert_own"
ON "public"."profiles"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "id");

CREATE POLICY "profiles_update_own"
ON "public"."profiles"
FOR UPDATE
TO authenticated
USING (auth.uid() = "id")
WITH CHECK (auth.uid() = "id");
