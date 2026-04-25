"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, CloudUpload, Eye, FileText, PencilLine, Search, Sparkles } from "lucide-react";
import { saveBlogPostAction } from "@/app/(protected)/admin/posts/actions";
import { ArticleRichEditor } from "@/components/admin/article-rich-editor";
import type { HomepageAsset } from "@/components/landing/types";
import { normalizeArticleContent } from "@/lib/article-content";
import { createPostSlug, estimateReadingTime, formatBlogDate } from "@/lib/blog-helpers";
import type { BlogPostDetail } from "@/lib/blog-types";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type PostsComposerViewProps = {
  assets: HomepageAsset[];
  cloudinaryEnabled: boolean;
  posts: BlogPostDetail[];
  selectedPostId?: string;
  status?: string;
};

type DraftPost = {
  category: string;
  content: string;
  excerpt: string;
  id: string | null;
  isPublished: boolean;
  openGraphAssetId: string | null;
  openGraphImageUrl: string | null;
  publishedAt: string;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  thumbnailAssetId: string | null;
  thumbnailUrl: string | null;
  title: string;
};

type AssetPickerProps = {
  assets: HomepageAsset[];
  cloudinaryEnabled: boolean;
  fieldKey: "thumbnail" | "openGraph";
  label: string;
  onAssetsChange: (assets: HomepageAsset[]) => void;
  onChange: (value: { assetId: string | null; url: string | null }) => void;
  selectedAssetId: string | null;
  selectedUrl: string | null;
};

const EMPTY_POST: DraftPost = {
  category: "Crypto News",
  content: "",
  excerpt: "",
  id: null,
  isPublished: true,
  openGraphAssetId: null,
  openGraphImageUrl: null,
  publishedAt: new Date().toISOString().slice(0, 16),
  seoDescription: "",
  seoTitle: "",
  slug: "",
  thumbnailAssetId: null,
  thumbnailUrl: null,
  title: "",
};

function toDraft(post: BlogPostDetail | null | undefined): DraftPost {
  if (!post) {
    return EMPTY_POST;
  }

  return {
    category: post.category,
    content: post.content,
    excerpt: post.excerpt,
    id: post.id,
    isPublished: post.isPublished,
    openGraphAssetId: post.openGraphAssetId,
    openGraphImageUrl: post.openGraphImageUrl,
    publishedAt: post.publishedAt.slice(0, 16),
    seoDescription: post.seoDescription ?? "",
    seoTitle: post.seoTitle ?? "",
    slug: post.slug,
    thumbnailAssetId: post.thumbnailAssetId,
    thumbnailUrl: post.thumbnailUrl,
    title: post.title,
  };
}

function statusAlert(status?: string) {
  switch (status) {
    case "saved":
      return { message: "Postingan berhasil disimpan.", variant: "success" as const };
    case "duplicate-slug":
      return { message: "Slug sudah dipakai. Ganti slug artikel ini.", variant: "error" as const };
    case "invalid":
      return { message: "Data postingan belum lengkap. Cek lagi form-nya.", variant: "error" as const };
    case "error":
      return { message: "Postingan belum bisa disimpan sekarang.", variant: "error" as const };
    default:
      return null;
  }
}

function TextField({
  label,
  name,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  name: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
}

function TextAreaField({
  label,
  name,
  onChange,
  rows = 4,
  value,
}: {
  label: string;
  name: string;
  onChange: (value: string) => void;
  rows?: number;
  value: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <textarea
        className="min-h-24 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
        id={name}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        value={value}
      />
    </div>
  );
}

function PostAssetPicker({
  assets,
  cloudinaryEnabled,
  fieldKey,
  label,
  onAssetsChange,
  onChange,
  selectedAssetId,
  selectedUrl,
}: AssetPickerProps) {
  const [assetLabel, setAssetLabel] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!cloudinaryEnabled) {
      setUploadError("Cloudinary belum dikonfigurasi.");
      return;
    }

    if (!file) {
      setUploadError("Pilih file gambar dulu.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadMessage(null);

    try {
      const signatureResponse = await fetch("/api/admin/homepage-assets/signature", {
        body: JSON.stringify({ filename: file.name }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!signatureResponse.ok) {
        const payload = (await signatureResponse.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Gagal membuat signature upload.");
      }

      const signaturePayload = (await signatureResponse.json()) as {
        apiKey: string;
        cloudName: string;
        folder: string;
        signature: string;
        timestamp: number;
      };

      const cloudinaryBody = new FormData();
      cloudinaryBody.append("file", file);
      cloudinaryBody.append("api_key", signaturePayload.apiKey);
      cloudinaryBody.append("timestamp", String(signaturePayload.timestamp));
      cloudinaryBody.append("signature", signaturePayload.signature);
      cloudinaryBody.append("folder", signaturePayload.folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/image/upload`,
        {
          body: cloudinaryBody,
          method: "POST",
        },
      );

      if (!uploadResponse.ok) {
        const payload = (await uploadResponse.json().catch(() => null)) as {
          error?: { message?: string };
        } | null;
        throw new Error(payload?.error?.message ?? "Upload ke Cloudinary gagal.");
      }

      const uploaded = (await uploadResponse.json()) as {
        bytes?: number;
        format?: string;
        height?: number;
        original_filename?: string;
        public_id: string;
        secure_url: string;
        width?: number;
      };

      const persistResponse = await fetch("/api/admin/homepage-assets", {
        body: JSON.stringify({
          bytes: uploaded.bytes ?? null,
          format: uploaded.format ?? null,
          height: uploaded.height ?? null,
          label: assetLabel.trim() || uploaded.original_filename || file.name.replace(/\.[^.]+$/, ""),
          publicId: uploaded.public_id,
          secureUrl: uploaded.secure_url,
          width: uploaded.width ?? null,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!persistResponse.ok) {
        const payload = (await persistResponse.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Gagal menyimpan metadata asset.");
      }

      const payload = (await persistResponse.json()) as { asset: HomepageAsset };
      const nextAssets = [payload.asset, ...assets.filter((asset) => asset.id !== payload.asset.id)];
      onAssetsChange(nextAssets);
      onChange({ assetId: payload.asset.id, url: payload.asset.secureUrl });
      setUploadMessage(`${label} berhasil diupload dan dipilih.`);
      setAssetLabel("");
      setFile(null);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload asset gagal.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-stone-900">{label}</p>
          <p className="text-xs text-stone-500">Pilih dari media library atau upload asset baru.</p>
        </div>
        {selectedUrl ? (
          <Button onClick={() => onChange({ assetId: null, url: null })} size="sm" variant="outline">
            Reset
          </Button>
        ) : null}
      </div>

      {!cloudinaryEnabled ? <Alert variant="error">Cloudinary belum dikonfigurasi.</Alert> : null}
      {uploadError ? <Alert variant="error">{uploadError}</Alert> : null}
      {uploadMessage ? <Alert variant="success">{uploadMessage}</Alert> : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_0.92fr]">
        <div className="space-y-3">
          <TextField
            label="Label Asset Baru"
            name={`${fieldKey}-asset-label`}
            onChange={setAssetLabel}
            placeholder={label}
            value={assetLabel}
          />
          <div className="grid gap-2">
            <Label htmlFor={`${fieldKey}-upload-file`}>Upload File</Label>
            <Input
              accept="image/*"
              id={`${fieldKey}-upload-file`}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              type="file"
            />
          </div>
          <Button disabled={!cloudinaryEnabled || uploading} onClick={handleUpload}>
            <CloudUpload className="h-4 w-4" />
            {uploading ? "Uploading..." : `Upload ${label}`}
          </Button>
        </div>

        <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm font-semibold text-stone-900">Asset Terpilih</p>
          {selectedUrl ? (
            <>
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                <Image alt={label} className="object-cover" fill sizes="420px" src={selectedUrl} unoptimized />
              </div>
              <p className="break-all text-xs text-stone-500">{selectedUrl}</p>
            </>
          ) : (
            <p className="text-sm text-stone-500">Belum ada asset yang dipilih.</p>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => {
          const isSelected = asset.id === selectedAssetId;

          return (
            <button
              className={cn(
                "overflow-hidden rounded-xl border text-left transition",
                isSelected
                  ? "border-emerald-500 bg-emerald-50 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]"
                  : "border-stone-200 bg-white hover:border-stone-300",
              )}
              key={`${fieldKey}-${asset.id}`}
              onClick={() => onChange({ assetId: asset.id, url: asset.secureUrl })}
              type="button"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image alt={asset.label} className="object-cover" fill sizes="320px" src={asset.secureUrl} unoptimized />
              </div>
              <div className="space-y-1 px-3 py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-sm font-medium text-stone-900">{asset.label}</p>
                  {isSelected ? <Check className="mt-0.5 h-4 w-4 text-emerald-600" /> : null}
                </div>
                <p className="text-xs text-stone-500">
                  {asset.width ?? "-"} x {asset.height ?? "-"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PostsComposerView({
  assets,
  cloudinaryEnabled,
  posts,
  selectedPostId,
  status,
}: PostsComposerViewProps) {
  const [library, setLibrary] = useState(assets);
  const [slugTouched, setSlugTouched] = useState(false);
  const selectedPost = useMemo(
    () => (selectedPostId ? posts.find((post) => post.id === selectedPostId) ?? null : null),
    [posts, selectedPostId],
  );
  const [draft, setDraft] = useState<DraftPost>(() => toDraft(selectedPost));

  function updateDraft<K extends keyof DraftPost>(key: K, value: DraftPost[K]) {
    setDraft((current) => {
      const nextDraft = {
        ...current,
        [key]: value,
      };

      if (key === "title" && !slugTouched) {
        nextDraft.slug = createPostSlug(String(value));
      }

      return nextDraft;
    });
  }

  function resetComposer() {
    setDraft(EMPTY_POST);
    setSlugTouched(false);
  }

  const activeAlert = statusAlert(status);
  const previewTitle = draft.title.trim() || "Judul artikel akan tampil di sini";
  const previewExcerpt =
    draft.excerpt.trim() || "Ringkasan artikel akan membantu visitor mengenali isi tulisan dengan cepat.";
  const previewCategory = draft.category.trim() || "Crypto News";
  const previewImage = draft.thumbnailUrl || draft.openGraphImageUrl;
  const previewHtml = normalizeArticleContent(draft.content);
  const readingTime = estimateReadingTime(draft.content || draft.excerpt);

  return (
    <div className="space-y-6">
      {activeAlert ? <Alert variant={activeAlert.variant}>{activeAlert.message}</Alert> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_380px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>Posting Konten</CardTitle>
                  <CardDescription>
                    Buat artikel blog yang langsung tampil di section blog dan halaman news.
                  </CardDescription>
                </div>
                <Button onClick={resetComposer} variant="outline">
                  <PencilLine className="h-4 w-4" />
                  Post Baru
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form action={saveBlogPostAction} className="space-y-6">
                <input name="postId" type="hidden" value={draft.id ?? ""} />
                <input name="title" type="hidden" value={draft.title} />
                <input name="slug" type="hidden" value={draft.slug} />
                <input name="category" type="hidden" value={draft.category} />
                <input name="excerpt" type="hidden" value={draft.excerpt} />
                <input name="content" type="hidden" value={draft.content} />
                <input name="seoTitle" type="hidden" value={draft.seoTitle} />
                <input name="seoDescription" type="hidden" value={draft.seoDescription} />
                <input name="publishedAt" type="hidden" value={draft.publishedAt} />
                <input name="thumbnailAssetId" type="hidden" value={draft.thumbnailAssetId ?? ""} />
                <input name="thumbnailUrl" type="hidden" value={draft.thumbnailUrl ?? ""} />
                <input name="openGraphAssetId" type="hidden" value={draft.openGraphAssetId ?? ""} />
                <input name="openGraphImageUrl" type="hidden" value={draft.openGraphImageUrl ?? ""} />
                <input name="isPublished" type="hidden" value={String(draft.isPublished)} />

                <div className="grid gap-4 lg:grid-cols-2">
                  <TextField
                    label="Judul Artikel"
                    name="post-title"
                    onChange={(value) => updateDraft("title", value)}
                    placeholder="Mis. Bitcoin Rebound Saat Volume Market Menguat"
                    value={draft.title}
                  />
                  <TextField
                    label="Kategori / Label"
                    name="post-category"
                    onChange={(value) => updateDraft("category", value)}
                    placeholder="Crypto News"
                    value={draft.category}
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                  <TextField
                    label="Slug URL"
                    name="post-slug"
                    onChange={(value) => {
                      setSlugTouched(true);
                      updateDraft("slug", createPostSlug(value));
                    }}
                    placeholder="bitcoin-rebound-saat-volume-market-menguat"
                    value={draft.slug}
                  />
                  <div className="grid gap-2">
                    <Label htmlFor="post-published-at">Tanggal Publish</Label>
                    <Input
                      id="post-published-at"
                      onChange={(event) => updateDraft("publishedAt", event.target.value)}
                      type="datetime-local"
                      value={draft.publishedAt}
                    />
                  </div>
                </div>

                <TextAreaField
                  label="Ringkasan Artikel"
                  name="post-excerpt"
                  onChange={(value) => updateDraft("excerpt", value)}
                  rows={4}
                  value={draft.excerpt}
                />

                <div className="space-y-2">
                  <Label>Isi Artikel</Label>
                  <ArticleRichEditor
                    assets={library}
                    cloudinaryEnabled={cloudinaryEnabled}
                    onAssetsChange={setLibrary}
                    onChange={(value) => updateDraft("content", value)}
                    value={draft.content}
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <TextField
                    label="SEO Title"
                    name="post-seo-title"
                    onChange={(value) => updateDraft("seoTitle", value)}
                    placeholder="Kosongkan untuk ikut judul artikel"
                    value={draft.seoTitle}
                  />
                  <TextAreaField
                    label="SEO Description"
                    name="post-seo-description"
                    onChange={(value) => updateDraft("seoDescription", value)}
                    rows={4}
                    value={draft.seoDescription}
                  />
                </div>

                <PostAssetPicker
                  assets={library}
                  cloudinaryEnabled={cloudinaryEnabled}
                  fieldKey="thumbnail"
                  label="Thumbnail"
                  onAssetsChange={setLibrary}
                  onChange={(value) => {
                    updateDraft("thumbnailAssetId", value.assetId);
                    updateDraft("thumbnailUrl", value.url);
                  }}
                  selectedAssetId={draft.thumbnailAssetId}
                  selectedUrl={draft.thumbnailUrl}
                />

                <PostAssetPicker
                  assets={library}
                  cloudinaryEnabled={cloudinaryEnabled}
                  fieldKey="openGraph"
                  label="Open Graph Image"
                  onAssetsChange={setLibrary}
                  onChange={(value) => {
                    updateDraft("openGraphAssetId", value.assetId);
                    updateDraft("openGraphImageUrl", value.url);
                  }}
                  selectedAssetId={draft.openGraphAssetId}
                  selectedUrl={draft.openGraphImageUrl}
                />

                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                  <label className="inline-flex items-center gap-3 text-sm font-medium text-stone-800">
                    <input
                      checked={draft.isPublished}
                      className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                      onChange={(event) => updateDraft("isPublished", event.target.checked)}
                      type="checkbox"
                    />
                    Langsung publish artikel ini
                  </label>

                  <Button type="submit">
                    <Sparkles className="h-4 w-4" />
                    Simpan Postingan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                Melihat gaya card homepage, SEO snippet, dan hero artikel sebelum dipublish.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="relative aspect-[16/10] bg-[#0d1728]">
                  {previewImage ? (
                    <Image
                      alt={previewTitle}
                      className="object-cover opacity-80"
                      fill
                      sizes="420px"
                      src={previewImage}
                      unoptimized
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,12,22,0.18)_0%,rgba(6,12,22,0.46)_48%,rgba(6,12,22,0.82)_100%)]" />
                  <span className="absolute right-4 top-4 rounded-full bg-[#58d56f] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.04em] text-white">
                    {previewCategory}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="text-sm text-white/78">{previewExcerpt}</p>
                  </div>
                </div>
                <div className="space-y-3 px-5 py-5">
                  <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em] text-[#151b28]">
                    {previewTitle}
                  </h3>
                  <p className="text-sm text-stone-500">{readingTime} menit baca</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="border-b border-stone-200 px-5 py-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                    <Eye className="h-3.5 w-3.5" />
                    Preview Artikel
                  </div>
                  <p className="mt-3 text-sm text-stone-500">
                    {formatBlogDate(draft.publishedAt || EMPTY_POST.publishedAt)} • {readingTime} menit baca
                  </p>
                  <h4 className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.04em] text-stone-950">
                    {previewTitle}
                  </h4>
                </div>
                {previewImage ? (
                  <div className="relative aspect-[16/9] bg-[#0d1728]">
                    <Image
                      alt={previewTitle}
                      className="object-cover"
                      fill
                      sizes="380px"
                      src={previewImage}
                      unoptimized
                    />
                  </div>
                ) : null}
                <div className="px-5 py-5">
                  {previewHtml ? (
                    <div
                      className="article-content article-preview max-w-none"
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  ) : (
                    <p className="text-sm leading-7 text-stone-500">
                      Mulai tulis isi artikel. Paragraf, list, link, dan gambar akan tampil di sini.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                  <Search className="h-3.5 w-3.5" />
                  SEO Snippet
                </div>
                <p className="mt-3 text-lg font-medium text-[#1a0dab]">
                  {draft.seoTitle.trim() || previewTitle}
                </p>
                <p className="mt-1 text-sm text-emerald-700">https://domainanda.com/blog/{draft.slug || "slug-artikel"}</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {draft.seoDescription.trim() || previewExcerpt}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Postingan</CardTitle>
              <CardDescription>Pilih artikel yang sudah ada untuk diedit lagi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {posts.map((post) => {
                const active = draft.id === post.id;

                return (
                  <div
                    className={cn(
                      "rounded-xl border px-4 py-4 transition",
                      active
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-stone-50 hover:bg-stone-100",
                    )}
                    key={post.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button
                        className="min-w-0 flex-1 text-left"
                        onClick={() => {
                          setDraft(toDraft(post));
                          setSlugTouched(true);
                        }}
                        type="button"
                      >
                        <p className="line-clamp-2 text-sm font-semibold">{post.title}</p>
                        <p className={cn("mt-2 text-xs", active ? "text-white/70" : "text-stone-500")}>
                          {post.category} • {formatBlogDate(post.publishedAt)}
                        </p>
                      </button>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[0.72rem] font-semibold uppercase",
                          post.isPublished
                            ? active
                              ? "bg-white/16 text-white"
                              : "bg-emerald-100 text-emerald-700"
                            : active
                              ? "bg-white/14 text-white/78"
                              : "bg-stone-200 text-stone-700",
                        )}
                      >
                        {post.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className={cn("text-xs", active ? "text-white/70" : "text-stone-500")}>
                        /blog/{post.slug}
                      </span>
                      {post.isPublished ? (
                        <Link
                          className={cn(
                            "text-xs font-medium underline-offset-4 hover:underline",
                            active ? "text-white" : "text-sky-700",
                          )}
                          href={`/blog/${post.slug}`}
                          target="_blank"
                        >
                          Lihat
                        </Link>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              {!posts.length ? (
                <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-sm text-stone-500">
                  Belum ada postingan. Mulai dari composer di kiri.
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Catatan Composer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-6 text-stone-600">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-sky-600" />
                <p>Slug akan mengikuti judul sampai kamu edit manual.</p>
              </div>
              <div className="flex items-start gap-3">
                <Search className="mt-0.5 h-4 w-4 text-amber-600" />
                <p>Kalau SEO title atau description dikosongkan, sistem akan pakai judul dan ringkasan artikel.</p>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="mt-0.5 h-4 w-4 text-emerald-600" />
                <p>
                  Section blog homepage akan otomatis menampilkan 3 postingan terbaru yang sudah dipublish.
                  Sekarang preview kanan juga menampilkan bentuk artikel sebenarnya.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-rose-500" />
                <p>
                  Isi artikel sekarang disimpan sebagai rich text HTML, jadi paragraf, bold, list, link, dan gambar akan tetap rapi di halaman publik.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
