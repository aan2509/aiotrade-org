"use client";

import Link from "next/link";
import { ExternalLink, EyeOff, PencilLine, PlayCircle, Trash2, FileText } from "lucide-react";
import {
  deleteMemberGuidePostAction,
  unpublishMemberGuidePostAction,
} from "@/app/(protected)/admin/member-posts/published/actions";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMemberGuideSectionLabel, type MemberGuidePost } from "@/lib/member-guide-types";
import { formatIdrCurrency } from "@/lib/payment-gateway-config";

type PublishedMemberGuidesViewProps = {
  guides: MemberGuidePost[];
  status?: string;
};

function statusAlert(status?: string) {
  switch (status) {
    case "unpublished":
      return { message: "Panduan berhasil dipindahkan ke draft.", variant: "success" as const };
    case "deleted":
      return { message: "Panduan berhasil dihapus.", variant: "success" as const };
    case "invalid":
      return { message: "Panduan tidak ditemukan.", variant: "error" as const };
    default:
      return null;
  }
}

export function PublishedMemberGuidesView({ guides, status }: PublishedMemberGuidesViewProps) {
  const activeAlert = statusAlert(status);

  return (
    <div className="space-y-6">
      {activeAlert ? <Alert variant={activeAlert.variant}>{activeAlert.message}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>Published Guides</CardTitle>
          <CardDescription>
            Menampilkan semua materi Pusat Belajar yang sedang tampil di dashboard member.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200 text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  <th className="px-3 py-3">Panduan</th>
                  <th className="px-3 py-3">Tipe</th>
                  <th className="px-3 py-3">Akses</th>
                  <th className="px-3 py-3">Menu Member</th>
                  <th className="px-3 py-3">Urutan</th>
                  <th className="px-3 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {guides.map((guide) => (
                  <tr className="align-top text-stone-700" key={guide.id}>
                    <td className="px-3 py-4">
                      <p className="font-semibold text-stone-950">{guide.title}</p>
                      <p className="mt-1 max-w-[420px] text-xs leading-5 text-stone-500">{guide.description}</p>
                    </td>
                    <td className="px-3 py-4">
                      <span className="inline-flex items-center gap-2">
                        {guide.type === "video" ? (
                          <PlayCircle className="h-4 w-4 text-sky-600" />
                        ) : (
                          <FileText className="h-4 w-4 text-rose-600" />
                        )}
                        {guide.type === "video" ? "Video" : "PDF"}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-stone-600">
                      {guide.isPaid && guide.price ? (
                        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                          {formatIdrCurrency(guide.price)}
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Gratis
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-stone-600">{getMemberGuideSectionLabel(guide.section)}</td>
                    <td className="px-3 py-4 font-semibold text-stone-950">{guide.sortOrder}</td>
                    <td className="px-3 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium text-stone-900 transition hover:bg-stone-50"
                          href={`/admin/member-posts?guide=${guide.id}`}
                        >
                          <PencilLine className="h-4 w-4" />
                          Edit
                        </Link>
                        {guide.type === "video" && guide.embedUrl ? (
                          <Link
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-sky-300 bg-sky-50 px-3 text-sm font-medium text-sky-800 transition hover:bg-sky-100"
                            href={guide.embedUrl}
                            target="_blank"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open
                          </Link>
                        ) : null}
                        {guide.type === "pdf" && guide.fileUrl ? (
                          <Link
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-sky-300 bg-sky-50 px-3 text-sm font-medium text-sky-800 transition hover:bg-sky-100"
                            href={guide.fileUrl}
                            target="_blank"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open
                          </Link>
                        ) : null}
                        <form action={unpublishMemberGuidePostAction}>
                          <input name="guideId" type="hidden" value={guide.id} />
                          <button
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
                            type="submit"
                          >
                            <EyeOff className="h-4 w-4" />
                            Unpublish
                          </button>
                        </form>
                        <form action={deleteMemberGuidePostAction}>
                          <input name="guideId" type="hidden" value={guide.id} />
                          <button
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-rose-300 bg-rose-50 px-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                            type="submit"
                          >
                            <Trash2 className="h-4 w-4" />
                            Hapus
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!guides.length ? (
            <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">
              Belum ada panduan yang dipublish.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
