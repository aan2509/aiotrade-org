CREATE TABLE "public"."member_subscriptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profile_id" UUID NOT NULL,
    "plan_id" TEXT NOT NULL,
    "plan_label" TEXT NOT NULL,
    "is_lifetime" BOOLEAN NOT NULL DEFAULT false,
    "duration_months" INTEGER NOT NULL DEFAULT 12,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "payment_reference_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "member_subscriptions_profile_id_key" ON "public"."member_subscriptions"("profile_id");
CREATE UNIQUE INDEX "member_subscriptions_payment_reference_id_key" ON "public"."member_subscriptions"("payment_reference_id");
CREATE INDEX "member_subscriptions_status_idx" ON "public"."member_subscriptions"("status", "expires_at");

ALTER TABLE "public"."member_subscriptions"
ADD CONSTRAINT "member_subscriptions_profile_id_fkey"
FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
