-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."site_seo_settings" (
    "id" TEXT NOT NULL,
    "site_name" TEXT NOT NULL,
    "site_url" TEXT NOT NULL,
    "home_title" TEXT NOT NULL,
    "home_description" TEXT NOT NULL,
    "open_graph_title" TEXT NOT NULL,
    "open_graph_description" TEXT NOT NULL,
    "favicon_asset_id" TEXT,
    "favicon_url" TEXT,
    "open_graph_image_asset_id" TEXT,
    "open_graph_image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_seo_settings_pkey" PRIMARY KEY ("id")
);
