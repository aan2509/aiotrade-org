-- AlterTable
ALTER TABLE "public"."profiles"
ADD COLUMN IF NOT EXISTS "is_admin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."homepage_content" (
    "id" TEXT NOT NULL,
    "hero" JSONB NOT NULL,
    "overview" JSONB NOT NULL,
    "benefits" JSONB NOT NULL,
    "pricing" JSONB NOT NULL,
    "faq" JSONB NOT NULL,
    "guide" JSONB NOT NULL,
    "blog" JSONB NOT NULL,
    "footer" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "homepage_content_pkey" PRIMARY KEY ("id")
);
