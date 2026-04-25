ALTER TABLE "public"."payment_gateway_settings"
ADD COLUMN IF NOT EXISTS "subscription_plans" jsonb NOT NULL DEFAULT '[{"id":"1-year","label":"Langganan 1 Tahun","description":"Akses member standard selama 12 bulan.","durationMonths":12,"price":1000}]'::jsonb,
ADD COLUMN IF NOT EXISTS "default_plan_id" text NOT NULL DEFAULT '1-year';
