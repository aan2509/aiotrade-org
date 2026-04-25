"use client";

import Link from "next/link";
import { ExternalLink, EyeOff, PencilLine, Trash2 } from "lucide-react";
import { deleteBlogPostAction, unpublishBlogPostAction } from "@/app/(protected)/admin/posts/published/actions";
import { formatBlogDate } from "@/lib/blog-helpers";
import type { BlogPostDetail } from "@/lib/blog-types";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PublishedPostsViewProps = {
  posts: BlogPostDetail[];
  status?: string;
};

function statusAlert(status?: string) {
  switch (status) {
    case "unpublished":
      return { message: "Postingan berhasil dipindahkan ke draft.", variant: "success" as const };
    case "deleted":
      return { message: "Postingan berhasil dihapus.", variant: "success" as const };
    case "invalid":
      return { message: "Postingan tidak ditemukan.", variant: "error" as const };
    default:
      return null;
  }
}

export function PublishedPostsView({ posts, status }: PublishedPostsViewProps) {
  const activeAlert = statusAlert(status);

  return (
    <div className="space-y-6">
      {activeAlert ? <Alert variant={activeAlert.variant}>{activeAlert.message}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>Post Published</CardTitle>
          <CardDescription>
            Daftar artikel yang sedang tampil di halaman blog dan section blog homepage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200 text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  <th className="px-3 py-3">Judul</th>
                  <th className="px-3 py-3">Kategori</th>
                  <th className="px-3 py-3">Tanggal</th>
                  <th className="px-3 py-3">Slug</th>
                  <th className="px-3 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {posts.map((post) => (
                  <tr className="align-top text-stone-700" key={post.id}>
                    <td className="px-3 py-4">
                      <div className="max-w-[420px]">
                        <p className="font-semibold text-stone-950">{post.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-stone-500">{post.excerpt}</p>
                      </div>
                    </td>
                    <td className="px-3 py-4">{post.category}</td>
                    <td className="px-3 py-4">{formatBlogDate(post.publishedAt)}</td>
                    <td className="px-3 py-4 text-xs text-stone-500">/blog/{post.slug}</td>
                    <td className="px-3 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium text-stone-900 transition hover:bg-stone-50"
                          href={`/admin/posts?post=${post.id}`}
                        >
                          <PencilLine className="h-4 w-4" />
                          Edit
                        </Link>
                        <Link
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-sky-300 bg-sky-50 px-3 text-sm font-medium text-sky-800 transition hover:bg-sky-100"
                          href={`/blog/${post.slug}`}
                          target="_blank"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Lihat
                        </Link>
                        <form action={unpublishBlogPostAction}>
                          <input name="postId" type="hidden" value={post.id} />
                          <button
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
                            type="submit"
                          >
                            <EyeOff className="h-4 w-4" />
                            Unpublish
                          </button>
                        </form>
                        <form action={deleteBlogPostAction}>
                          <input name="postId" type="hidden" value={post.id} />
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

          {!posts.length ? (
            <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">
              Belum ada postingan yang dipublish.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
