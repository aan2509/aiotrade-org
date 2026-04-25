import { PublishedPublicGuidePdfsView } from "@/components/admin/published-public-guide-pdfs-view";
import { getPublishedPublicGuidePdfPosts } from "@/lib/public-guides";

type PublishedPublicGuidePdfsPageProps = {
  searchParams: Promise<{ status?: string | string[] }>;
};

export default async function PublishedPublicGuidePdfsPage({
  searchParams,
}: PublishedPublicGuidePdfsPageProps) {
  const [pdfs, resolvedSearchParams] = await Promise.all([
    getPublishedPublicGuidePdfPosts(),
    searchParams,
  ]);
  const status =
    typeof resolvedSearchParams.status === "string"
      ? resolvedSearchParams.status
      : resolvedSearchParams.status?.[0];

  return <PublishedPublicGuidePdfsView pdfs={pdfs} status={status} />;
}
