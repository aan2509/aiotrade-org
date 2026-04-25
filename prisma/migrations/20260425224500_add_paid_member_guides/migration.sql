ALTER TABLE "public"."member_guide_posts"
ADD COLUMN "is_paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "price" INTEGER;

CREATE TABLE "public"."member_guide_payment_transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reference_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'paymenku',
    "provider_transaction_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "profile_id" UUID NOT NULL,
    "guide_post_id" UUID NOT NULL,
    "channel_code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_phone" TEXT,
    "guide_title" TEXT NOT NULL,
    "message" TEXT,
    "payment_name" TEXT,
    "payment_number" TEXT,
    "payment_url" TEXT,
    "qr_image_url" TEXT,
    "qr_string" TEXT,
    "expires_at" TEXT,
    "consumed_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "raw_create_response" JSONB,
    "raw_status_response" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_guide_payment_transactions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."member_guide_unlocks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profile_id" UUID NOT NULL,
    "guide_post_id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "payment_reference_id" TEXT,
    "unlocked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_guide_unlocks_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "member_guide_payment_transactions_reference_id_key" ON "public"."member_guide_payment_transactions"("reference_id");
CREATE INDEX "member_guide_payment_transactions_status_idx" ON "public"."member_guide_payment_transactions"("status", "created_at");
CREATE INDEX "member_guide_payment_transactions_profile_guide_status_idx" ON "public"."member_guide_payment_transactions"("profile_id", "guide_post_id", "status");

CREATE UNIQUE INDEX "member_guide_unlocks_payment_reference_id_key" ON "public"."member_guide_unlocks"("payment_reference_id");
CREATE UNIQUE INDEX "member_guide_unlocks_profile_id_guide_post_id_key" ON "public"."member_guide_unlocks"("profile_id", "guide_post_id");
CREATE INDEX "member_guide_unlocks_guide_post_id_idx" ON "public"."member_guide_unlocks"("guide_post_id");

ALTER TABLE "public"."member_guide_payment_transactions"
ADD CONSTRAINT "member_guide_payment_transactions_profile_id_fkey"
FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."member_guide_payment_transactions"
ADD CONSTRAINT "member_guide_payment_transactions_guide_post_id_fkey"
FOREIGN KEY ("guide_post_id") REFERENCES "public"."member_guide_posts"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."member_guide_unlocks"
ADD CONSTRAINT "member_guide_unlocks_profile_id_fkey"
FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."member_guide_unlocks"
ADD CONSTRAINT "member_guide_unlocks_guide_post_id_fkey"
FOREIGN KEY ("guide_post_id") REFERENCES "public"."member_guide_posts"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
