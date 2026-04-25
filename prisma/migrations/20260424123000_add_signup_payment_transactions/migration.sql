CREATE TABLE "public"."signup_payment_transactions" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "reference_id" text NOT NULL,
  "provider" text NOT NULL DEFAULT 'paymenku',
  "provider_transaction_id" text,
  "status" text NOT NULL DEFAULT 'pending',
  "channel_code" text NOT NULL,
  "amount" integer NOT NULL,
  "customer_name" text NOT NULL,
  "customer_email" text NOT NULL,
  "customer_phone" text,
  "message" text,
  "payment_name" text,
  "payment_number" text,
  "payment_url" text,
  "qr_image_url" text,
  "qr_string" text,
  "expires_at" text,
  "consumed_at" timestamptz,
  "paid_at" timestamptz,
  "raw_create_response" jsonb,
  "raw_status_response" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "signup_payment_transactions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "signup_payment_transactions_reference_id_key" UNIQUE ("reference_id")
);

CREATE INDEX "signup_payment_transactions_status_idx"
ON "public"."signup_payment_transactions" ("status", "created_at");
