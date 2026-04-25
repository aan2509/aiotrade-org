"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, CloudUpload, ImagePlus } from "lucide-react";
import type { HomepageAsset } from "@/components/landing/types";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type HomepageAssetPickerProps = {
  assets: HomepageAsset[];
  cloudinaryEnabled: boolean;
  label?: string;
  onAssetsChange: (assets: HomepageAsset[]) => void;
  onChange: (value: { assetId?: string; imageUrl?: string }) => void;
  previewAspectClassName?: string;
  value: {
    assetId?: string;
    imageUrl?: string;
  };
};

export function HomepageAssetPicker({
  assets,
  cloudinaryEnabled,
  label = "Foto",
  onAssetsChange,
  onChange,
  previewAspectClassName = "aspect-[4/5]",
  value,
}: HomepageAssetPickerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [assetLabel, setAssetLabel] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.id === value.assetId) ?? null,
    [assets, value.assetId],
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
      onChange({
        assetId: payload.asset.id,
        imageUrl: payload.asset.secureUrl,
      });
      setUploadMessage("Foto berhasil diupload dan siap dipakai.");
      setAssetLabel("");
      setFile(null);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload asset gagal.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-4">
      <div className="space-y-2">
        <Label>{label}</Label>
        <select
          className="h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
          onChange={(event) => {
            const nextAsset = assets.find((asset) => asset.id === event.target.value) ?? null;

            onChange({
              assetId: nextAsset?.id,
              imageUrl: nextAsset?.secureUrl,
            });
          }}
          value={value.assetId ?? ""}
        >
          <option value="">Pilih asset dari library</option>
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-dashed border-stone-300 bg-stone-50">
        <div className={cn("relative w-full overflow-hidden bg-[linear-gradient(135deg,#eef5ff_0%,#f8fafc_54%,#fff8e9_100%)]", previewAspectClassName)}>
          {selectedAsset?.secureUrl || value.imageUrl ? (
            <Image
              alt={selectedAsset?.label || "Preview foto"}
              className="h-full w-full object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 30vw"
              src={selectedAsset?.secureUrl || value.imageUrl || ""}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-stone-500">
              Belum ada foto dipilih
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
        <p className="text-sm font-semibold text-stone-900">Upload foto baru</p>
        <div className="mt-3 grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="testimonial-asset-label">Label Asset</Label>
            <Input
              id="testimonial-asset-label"
              onChange={(event) => setAssetLabel(event.target.value)}
              placeholder="Mis. Testimoni member 01"
              value={assetLabel}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="testimonial-asset-file">File Gambar</Label>
            <Input
              accept="image/*"
              id="testimonial-asset-file"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              type="file"
            />
          </div>

          {uploadError ? <Alert variant="error">{uploadError}</Alert> : null}
          {uploadMessage ? <Alert variant="success">{uploadMessage}</Alert> : null}

          <Button disabled={uploading || !file} onClick={handleUpload} type="button">
            {uploading ? (
              <>
                <CloudUpload className="h-4 w-4 animate-pulse" />
                Mengupload...
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" />
                Upload Foto
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {assets.slice(0, 6).map((asset) => {
          const active = asset.id === value.assetId;

          return (
            <button
              className={cn(
                "flex items-center gap-3 rounded-xl border p-2 text-left transition",
                active
                  ? "border-emerald-500 bg-emerald-50 shadow-sm"
                  : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50",
              )}
              key={asset.id}
              onClick={() =>
                onChange({
                  assetId: asset.id,
                  imageUrl: asset.secureUrl,
                })
              }
              type="button"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-stone-100">
                <Image
                  alt={asset.label}
                  className="h-full w-full object-cover"
                  fill
                  sizes="56px"
                  src={asset.secureUrl}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-stone-900">{asset.label}</p>
                <p className="mt-1 text-xs text-stone-500">{asset.format?.toUpperCase() ?? "IMG"}</p>
              </div>
              {active ? <Check className="h-4 w-4 text-emerald-600" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
