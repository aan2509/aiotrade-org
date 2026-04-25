"use server";

import { redirect } from "next/navigation";
import { requireAdminProfile } from "@/lib/auth";
import { deleteBlogPost, setBlogPostPublishedState } from "@/lib/blog-posts";

export async function unpublishBlogPostAction(formData: FormData) {
  await requireAdminProfile();

  const postId = String(formData.get("postId") ?? "").trim();

  if (!postId) {
    redirect("/admin/posts/published?status=invalid");
  }

  await setBlogPostPublishedState(postId, false);
  redirect("/admin/posts/published?status=unpublished");
}

export async function deleteBlogPostAction(formData: FormData) {
  await requireAdminProfile();

  const postId = String(formData.get("postId") ?? "").trim();

  if (!postId) {
    redirect("/admin/posts/published?status=invalid");
  }

  await deleteBlogPost(postId);
  redirect("/admin/posts/published?status=deleted");
}
