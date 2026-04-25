import { PublishedMemberGuidesView } from "@/components/admin/published-member-guides-view";
import { getPublishedMemberGuidePosts } from "@/lib/member-guides";

type PublishedMemberGuidesPageProps = {
  searchParams: Promise<{ status?: string | string[] }>;
};

export default async function PublishedMemberGuidesPage({
  searchParams,
}: PublishedMemberGuidesPageProps) {
  const [guides, resolvedSearchParams] = await Promise.all([
    getPublishedMemberGuidePosts(),
    searchParams,
  ]);
  const status =
    typeof resolvedSearchParams.status === "string"
      ? resolvedSearchParams.status
      : resolvedSearchParams.status?.[0];

  return <PublishedMemberGuidesView guides={guides} status={status} />;
}
