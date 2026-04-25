import { MemberGuideComposerView } from "@/components/admin/member-guide-composer-view";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { getMemberGuideAssets, getAdminMemberGuidePosts } from "@/lib/member-guides";

type MemberPostsPageProps = {
  searchParams: Promise<{
    guide?: string | string[];
    message?: string | string[];
    status?: string | string[];
  }>;
};

export default async function MemberPostsPage({ searchParams }: MemberPostsPageProps) {
  const [assets, guides, resolvedSearchParams] = await Promise.all([
    getMemberGuideAssets(),
    getAdminMemberGuidePosts(),
    searchParams,
  ]);
  const selectedGuideId =
    typeof resolvedSearchParams.guide === "string"
      ? resolvedSearchParams.guide
      : resolvedSearchParams.guide?.[0];
  const status =
    typeof resolvedSearchParams.status === "string"
      ? resolvedSearchParams.status
      : resolvedSearchParams.status?.[0];
  const message =
    typeof resolvedSearchParams.message === "string"
      ? resolvedSearchParams.message
      : resolvedSearchParams.message?.[0];

  return (
    <MemberGuideComposerView
      assets={assets}
      cloudinaryEnabled={isCloudinaryConfigured()}
      guides={guides}
      message={message}
      selectedGuideId={selectedGuideId}
      status={status}
    />
  );
}
