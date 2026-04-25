import { HomepagePreviewPage } from "@/components/admin/homepage-preview-page";
import { requireAdminProfile } from "@/lib/auth";
import { getHomepageContent } from "@/lib/homepage-content";

export const dynamic = "force-dynamic";

export default async function AdminPreviewPage() {
  await requireAdminProfile();
  const content = await getHomepageContent();

  return <HomepagePreviewPage initialContent={content} />;
}

