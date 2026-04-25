"use server";

import { redirect } from "next/navigation";
import { requireAdminProfile } from "@/lib/auth";
import { deleteMemberGuidePost, setMemberGuidePublishedState } from "@/lib/member-guides";

export async function unpublishMemberGuidePostAction(formData: FormData) {
  await requireAdminProfile();

  const guideId = String(formData.get("guideId") ?? "").trim();

  if (!guideId) {
    redirect("/admin/member-posts/published?status=invalid");
  }

  await setMemberGuidePublishedState(guideId, false);
  redirect("/admin/member-posts/published?status=unpublished");
}

export async function deleteMemberGuidePostAction(formData: FormData) {
  await requireAdminProfile();

  const guideId = String(formData.get("guideId") ?? "").trim();

  if (!guideId) {
    redirect("/admin/member-posts/published?status=invalid");
  }

  await deleteMemberGuidePost(guideId);
  redirect("/admin/member-posts/published?status=deleted");
}
