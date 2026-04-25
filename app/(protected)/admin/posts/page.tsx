import { PostsComposerView } from "@/components/admin/posts-composer-view";
import { getBlogPostDetailForAdminList } from "@/lib/blog-posts-admin";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { getHomepageAssets } from "@/lib/homepage-assets";

type AdminPostsPageProps = {
  searchParams: Promise<{
    post?: string | string[];
    status?: string | string[];
  }>;
};

export default async function AdminPostsPage({ searchParams }: AdminPostsPageProps) {
  const [assets, posts, resolvedSearchParams] = await Promise.all([
    getHomepageAssets(),
    getBlogPostDetailForAdminList(),
    searchParams,
  ]);

  const selectedPostId = typeof resolvedSearchParams.post === "string"
    ? resolvedSearchParams.post
    : resolvedSearchParams.post?.[0];
  const status = typeof resolvedSearchParams.status === "string"
    ? resolvedSearchParams.status
    : resolvedSearchParams.status?.[0];

  return (
    <PostsComposerView
      assets={assets}
      cloudinaryEnabled={isCloudinaryConfigured()}
      posts={posts}
      selectedPostId={selectedPostId}
      status={status}
    />
  );
}
