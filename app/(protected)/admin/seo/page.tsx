import { SeoSettingsView } from "@/components/admin/seo-settings-view";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { getHomepageAssets } from "@/lib/homepage-assets";
import { getSiteSeoSettings } from "@/lib/site-seo";

type AdminSeoPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function AdminSeoPage({ searchParams }: AdminSeoPageProps) {
  const [assets, seo, query] = await Promise.all([
    getHomepageAssets(),
    getSiteSeoSettings(),
    searchParams,
  ]);

  return (
    <SeoSettingsView
      assets={assets}
      cloudinaryEnabled={isCloudinaryConfigured()}
      seo={seo}
      status={query.status}
    />
  );
}

