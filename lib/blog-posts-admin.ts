import "server-only";

import { getAdminBlogPosts } from "@/lib/blog-posts";

export async function getBlogPostDetailForAdminList() {
  return getAdminBlogPosts();
}
