ALTER TABLE "public"."signup_payment_transactions"
ADD COLUMN IF NOT EXISTS "plan_id" text,
ADD COLUMN IF NOT EXISTS "plan_label" text;
