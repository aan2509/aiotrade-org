"use client";

import Link from "next/link";
import { ExternalLink, EyeOff, FileText, PencilLine, Trash2 } from "lucide-react";
import {
  deletePublicGuidePdfPostAction,
  unpublishPublicGuidePdfPostAction,
} from "@/app/(protected)/admin/posts/pdfs/published/actions";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicGuidePdfPost } from "@/lib/public-guide-types";

type PublishedPublicGuidePdfsViewProps = {
  pdfs: PublicGuidePdfPost[];
  status?: string;
};

function statusAlert(status?: string) {
  switch (status) {
    case "unpublished":
      return { message: "PDF publik berhasil dipindahkan ke draft.", variant: "success" as const };
    case "deleted":
      return { message: "PDF publik berhasil dihapus.", variant: "success" as const };
    case "invalid":
      return { message: "PDF publik tidak ditemukan.", variant: "error" as const };
    default:
      return null;
  }
}

export function PublishedPublicGuidePdfsView({
  pdfs,
  status,
}: PublishedPublicGuidePdfsViewProps) {
  const activeAlert = statusAlert(status);

  return (
    <div className="space-y-6">
      {activeAlert ? <Alert variant={activeAlert.variant}>{activeAlert.message}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>PDF Published</CardTitle>
          <CardDescription>Menampilkan semua file panduan PDF yang sedang tampil di halaman guide.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200 text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  <th className="px-3 py-3">PDF</th>
                  <th className="px-3 py-3">Urutan</th>
                  <th className="px-3 py-3">Published</th>
                  <th className="px-3 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {pdfs.map((pdf) => (
                  <tr className="align-top text-stone-700" key={pdf.id}>
                    <td className="px-3 py-4">
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
                          <FileText className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-semibold text-stone-950">{pdf.title}</p>
                          <p className="mt-1 max-w-[420px] text-xs leading-5 text-stone-500">{pdf.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 font-semibold text-stone-950">{pdf.sortOrder}</td>
                    <td className="px-3 py-4 text-stone-600">{new Date(pdf.publishedAt).toLocaleDateString("id-ID")}</td>
                    <td className="px-3 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium text-stone-900 transition hover:bg-stone-50"
                          href={`/admin/posts/pdfs?pdf=${pdf.id}`}
                        >
                          <PencilLine className="h-4 w-4" />
                          Edit
                        </Link>
                        <Link
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-sky-300 bg-sky-50 px-3 text-sm font-medium text-sky-800 transition hover:bg-sky-100"
                          href={pdf.fileUrl}
                          target="_blank"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open
                        </Link>
                        <form action={unpublishPublicGuidePdfPostAction}>
                          <input name="pdfId" type="hidden" value={pdf.id} />
                          <button
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
                            type="submit"
                          >
                            <EyeOff className="h-4 w-4" />
                            Unpublish
                          </button>
                        </form>
                        <form action={deletePublicGuidePdfPostAction}>
                          <input name="pdfId" type="hidden" value={pdf.id} />
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

          {!pdfs.length ? (
            <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">
              Belum ada PDF publik yang dipublish.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
