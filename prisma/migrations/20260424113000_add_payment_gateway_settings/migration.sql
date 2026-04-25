CREATE TABLE IF NOT EXISTS "public"."payment_gateway_settings" (
    "id" TEXT NOT NULL DEFAULT 'signup',
    "provider" TEXT NOT NULL DEFAULT 'paymenku',
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,
    "paymenku_api_key" TEXT,
    "active_channel_codes" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "default_channel_code" TEXT,
    "registration_price" INTEGER NOT NULL DEFAULT 1000,
    "price_label" TEXT NOT NULL DEFAULT 'Biaya Pendaftaran',
    "checkout_note" TEXT NOT NULL DEFAULT 'Pilih metode pembayaran yang tersedia untuk menyelesaikan pendaftaran.',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_gateway_settings_pkey" PRIMARY KEY ("id")
);
