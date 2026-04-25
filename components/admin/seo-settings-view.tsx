"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, CloudUpload, Search, Share2 } from "lucide-react";
import { updateSeoSettingsAction } from "@/app/(protected)/admin/seo/actions";
import type { HomepageAsset } from "@/components/landing/types";
import type { SiteSeoSettings } from "@/lib/site-seo";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type SeoSettingsViewProps = {
  assets: HomepageAsset[];
  cloudinaryEnabled: boolean;
  seo: SiteSeoSettings;
  status?: string;
};

type AssetPickerProps = {
  assets: HomepageAsset[];
  cloudinaryEnabled: boolean;
  fieldKey: "favicon" | "openGraphImage";
  label: string;
  onAssetsChange: (assets: HomepageAsset[]) => void;
  onChange: (value: { assetId: string | null; url: string | null }) => void;
  selectedAssetId: string | null;
  selectedUrl: string | null;
};

function TextField({
  label,
  name,
  onChange,
  value,
}: {
  label: string;
  name: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} onChange={(event) => onChange(event.target.value)} value={value} />
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
        name={name}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        value={value}
      />
    </div>
  );
}

function SeoAssetPicker({
  assets,
  cloudinaryEnabled,
  fieldKey,
  label,
  onAssetsChange,
  onChange,
  selectedAssetId,
  selectedUrl,
}: AssetPickerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [assetLabel, setAssetLabel] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.id === selectedAssetId) ?? null,
    [assets, selectedAssetId],
  );

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
      <input name={`${fieldKey}AssetId`} type="hidden" value={selectedAssetId ?? ""} />
      <input name={`${fieldKey}Url`} type="hidden" value={selectedUrl ?? ""} />

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-stone-900">{label}</p>
          <p className="text-xs text-stone-500">Pilih dari media library atau upload asset baru.</p>
        </div>
        {selectedAsset ? (
          <Button onClick={() => onChange({ assetId: null, url: null })} size="sm" type="button" variant="outline">
            Reset
          </Button>
        ) : null}
      </div>

      {!cloudinaryEnabled ? <Alert variant="error">Cloudinary belum dikonfigurasi.</Alert> : null}
      {uploadError ? <Alert variant="error">{uploadError}</Alert> : null}
      {uploadMessage ? <Alert variant="success">{uploadMessage}</Alert> : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-3">
          <div className="grid gap-2">
            <Label htmlFor={`${fieldKey}-upload-label`}>Label Asset Baru</Label>
            <Input
              id={`${fieldKey}-upload-label`}
              onChange={(event) => setAssetLabel(event.target.value)}
              placeholder={label}
              value={assetLabel}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${fieldKey}-upload-file`}>Upload File</Label>
            <Input
              accept="image/*"
              id={`${fieldKey}-upload-file`}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              type="file"
            />
          </div>
          <Button disabled={!cloudinaryEnabled || uploading} onClick={handleUpload} type="button">
            <CloudUpload className="h-4 w-4" />
            {uploading ? "Uploading..." : `Upload ${label}`}
          </Button>
        </div>

        <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm font-semibold text-stone-900">Asset Terpilih</p>
          {selectedUrl ? (
            <>
              <div className="relative aspect-[1/1] w-full overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                <Image alt={label} className="object-cover" fill sizes="220px" src={selectedUrl} unoptimized />
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
              <div className="relative aspect-[1/1] w-full">
                <Image alt={asset.label} className="object-cover" fill sizes="220px" src={asset.secureUrl} unoptimized />
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
        {!assets.length ? (
          <div className="rounded-xl border border-dashed border-stone-300 bg-white px-4 py-6 text-sm text-stone-500">
            Belum ada asset yang bisa dipilih.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function SeoSettingsView({
  assets,
  cloudinaryEnabled,
  seo,
  status,
}: SeoSettingsViewProps) {
  const [draft, setDraft] = useState(seo);
  const [library, setLibrary] = useState(assets);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.94fr)_minmax(360px,0.86fr)]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>
              Atur metadata homepage, favicon, dan kartu share agar hasil pencarian dan preview link lebih rapi.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata Utama</CardTitle>
            <CardDescription>Data ini dipakai untuk title, description, dan URL utama situs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "saved" ? (
              <Alert variant="success">SEO settings berhasil diperbarui.</Alert>
            ) : status === "error" ? (
              <Alert variant="error">Ada data SEO yang belum valid. Cek lagi inputnya.</Alert>
            ) : null}

            <form action={updateSeoSettingsAction} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Site Name"
                  name="siteName"
                  onChange={(value) => setDraft((current) => ({ ...current, siteName: value }))}
                  value={draft.siteName}
                />
                <TextField
                  label="Site URL"
                  name="siteUrl"
                  onChange={(value) => setDraft((current) => ({ ...current, siteUrl: value }))}
                  value={draft.siteUrl}
                />
              </div>

              <TextField
                label="Homepage Title"
                name="homeTitle"
                onChange={(value) => setDraft((current) => ({ ...current, homeTitle: value }))}
                value={draft.homeTitle}
              />
              <TextAreaField
                label="Homepage Description"
                name="homeDescription"
                onChange={(value) => setDraft((current) => ({ ...current, homeDescription: value }))}
                rows={4}
                value={draft.homeDescription}
              />

              <div className="grid gap-4">
                <TextField
                  label="Open Graph Title"
                  name="openGraphTitle"
                  onChange={(value) => setDraft((current) => ({ ...current, openGraphTitle: value }))}
                  value={draft.openGraphTitle}
                />
                <TextAreaField
                  label="Open Graph Description"
                  name="openGraphDescription"
                  onChange={(value) => setDraft((current) => ({ ...current, openGraphDescription: value }))}
                  rows={4}
                  value={draft.openGraphDescription}
                />
              </div>

              <SeoAssetPicker
                assets={library}
                cloudinaryEnabled={cloudinaryEnabled}
                fieldKey="favicon"
                label="Favicon"
                onAssetsChange={setLibrary}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    faviconAssetId: value.assetId,
                    faviconUrl: value.url,
                  }))
                }
                selectedAssetId={draft.faviconAssetId}
                selectedUrl={draft.faviconUrl}
              />

              <SeoAssetPicker
                assets={library}
                cloudinaryEnabled={cloudinaryEnabled}
                fieldKey="openGraphImage"
                label="Open Graph Image"
                onAssetsChange={setLibrary}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    openGraphImageAssetId: value.assetId,
                    openGraphImageUrl: value.url,
                  }))
                }
                selectedAssetId={draft.openGraphImageAssetId}
                selectedUrl={draft.openGraphImageUrl}
              />

              <Button type="submit">Simpan SEO Settings</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="xl:sticky xl:top-6 xl:self-start">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-stone-200">
            <CardTitle>SEO Live Preview</CardTitle>
            <CardDescription>
              Preview hasil metadata untuk tab browser, hasil pencarian, dan kartu share.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 bg-stone-100 p-4">
            <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4">
              <div className="flex items-center gap-3">
                {draft.faviconUrl ? (
                  <div className="relative h-8 w-8 overflow-hidden rounded-md border border-stone-200">
                    <Image alt="Favicon preview" className="object-cover" fill sizes="32px" src={draft.faviconUrl} unoptimized />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-200 bg-stone-100 text-xs font-semibold text-stone-500">
                    ICO
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Browser tab</p>
                  <p className="text-sm font-semibold text-stone-900">{draft.homeTitle}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                <Search className="h-3.5 w-3.5" />
                Search Result
              </div>
              <div className="space-y-1">
                <p className="text-sm text-[#1a0dab]">{draft.siteUrl}</p>
                <p className="text-[1.15rem] font-medium leading-6 text-[#1a0dab]">{draft.homeTitle}</p>
                <p className="text-sm leading-6 text-stone-600">{draft.homeDescription}</p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                <Share2 className="h-3.5 w-3.5" />
                Social Share
              </div>
              <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_18px_38px_rgba(15,23,42,0.08)]">
                <div className="relative aspect-[1200/630] w-full bg-stone-100">
                  {draft.openGraphImageUrl ? (
                    <Image
                      alt="Open Graph preview"
                      className="object-cover"
                      fill
                      sizes="640px"
                      src={draft.openGraphImageUrl}
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#0f1728_0%,#1d4ed8_55%,#f6be4f_100%)] text-white">
                      <span className="text-lg font-semibold">{draft.siteName}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-stone-500">{draft.siteName}</p>
                  <p className="text-lg font-semibold leading-6 text-stone-900">{draft.openGraphTitle}</p>
                  <p className="text-sm leading-6 text-stone-600">{draft.openGraphDescription}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
