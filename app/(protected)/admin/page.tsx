import { HomepageSettingsView } from "@/components/admin/homepage-settings-view";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { getHomepageAssets } from "@/lib/homepage-assets";
import { getHomepageContent } from "@/lib/homepage-content";

type AdminPageProps = {
  searchParams: Promise<{
    section?: string;
    status?: string;
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const [assets, content, query] = await Promise.all([
    getHomepageAssets(),
    getHomepageContent(),
    searchParams,
  ]);

  return (
    <HomepageSettingsView
      assets={assets}
      cloudinaryEnabled={isCloudinaryConfigured()}
      content={content}
      section={query.section}
      status={query.status}
    />
  );
}
