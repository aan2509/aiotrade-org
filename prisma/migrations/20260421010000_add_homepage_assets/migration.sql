-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."homepage_assets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "secure_url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "bytes" INTEGER,
    "format" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "homepage_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "homepage_assets_public_id_key"
ON "public"."homepage_assets"("public_id");
