import { PublishedPostsView } from "@/components/admin/published-posts-view";
import { getPublishedBlogPosts } from "@/lib/blog-posts";

type PublishedPostsPageProps = {
  searchParams: Promise<{ status?: string | string[] }>;
};

export default async function PublishedPostsPage({ searchParams }: PublishedPostsPageProps) {
  const [posts, resolvedSearchParams] = await Promise.all([getPublishedBlogPosts(), searchParams]);
  const status = typeof resolvedSearchParams.status === "string"
    ? resolvedSearchParams.status
    : resolvedSearchParams.status?.[0];

  return <PublishedPostsView posts={posts} status={status} />;
}
