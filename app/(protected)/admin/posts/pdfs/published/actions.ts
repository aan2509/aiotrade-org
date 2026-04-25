"use server";

import { redirect } from "next/navigation";
import { requireAdminProfile } from "@/lib/auth";
import { deletePublicGuidePdfPost, setPublicGuidePdfPublishedState } from "@/lib/public-guides";

export async function unpublishPublicGuidePdfPostAction(formData: FormData) {
  await requireAdminProfile();

  const pdfId = String(formData.get("pdfId") ?? "").trim();

  if (!pdfId) {
    redirect("/admin/posts/pdfs/published?status=invalid");
  }

  await setPublicGuidePdfPublishedState(pdfId, false);
  redirect("/admin/posts/pdfs/published?status=unpublished");
}

export async function deletePublicGuidePdfPostAction(formData: FormData) {
  await requireAdminProfile();

  const pdfId = String(formData.get("pdfId") ?? "").trim();

  if (!pdfId) {
    redirect("/admin/posts/pdfs/published?status=invalid");
  }

  await deletePublicGuidePdfPost(pdfId);
  redirect("/admin/posts/pdfs/published?status=deleted");
}
