"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check, CloudUpload, ImagePlus, Paintbrush2 } from "lucide-react";
import type {
  HomepageAsset,
  SectionBackgroundConfig,
} from "@/components/landing/types";
import {
  homepageBackgroundPresetOrder,
  homepageBackgroundPresets,
} from "@/lib/homepage-backgrounds";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type HomepageBackgroundEditorProps = {
  assets: HomepageAsset[];
  cloudinaryEnabled: boolean;
  inputPrefix?: string;
  onAssetsChange: (assets: HomepageAsset[]) => void;
  onChange: (value: SectionBackgroundConfig) => void;
  value: SectionBackgroundConfig;
};

export function HomepageBackgroundEditor({
  assets,
  cloudinaryEnabled,
  inputPrefix = "background",
  onAssetsChange,
  onChange,
  value,
}: HomepageBackgroundEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.id === value.image.assetId) ?? null,
    [assets, value.image.assetId],
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  function update(nextValue: {
    image?: Partial<SectionBackgroundConfig["image"]>;
    mode?: SectionBackgroundConfig["mode"];
    palette?: Partial<SectionBackgroundConfig["palette"]>;
  }) {
    onChange({
      ...value,
      ...nextValue,
      image: {
        ...value.image,
        ...nextValue.image,
      },
      palette: {
        ...value.palette,
        ...nextValue.palette,
      },
    });
  }

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
        headers: {
          "Content-Type": "application/json",
        },
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
          label: label.trim() || uploaded.original_filename || file.name.replace(/\.[^.]+$/, ""),
          publicId: uploaded.public_id,
          secureUrl: uploaded.secure_url,
          width: uploaded.width ?? null,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!persistResponse.ok) {
        const payload = (await persistResponse.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Gagal menyimpan metadata asset.");
      }

      const payload = (await persistResponse.json()) as { asset: HomepageAsset };
      const nextAssets = [payload.asset, ...assets.filter((asset) => asset.id !== payload.asset.id)];
      onAssetsChange(nextAssets);
      update({
        image: {
          assetId: payload.asset.id,
          imageUrl: payload.asset.secureUrl,
        },
        mode: "image",
      });
      setUploadMessage("Asset berhasil diupload dan siap dipakai.");
      setLabel("");
      setFile(null);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload asset gagal.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
      <input name={`${inputPrefix}-mode`} type="hidden" value={value.mode} />
      <input
        name={`${inputPrefix}-palette-preset`}
        type="hidden"
        value={value.palette.preset}
      />
      <input
        name={`${inputPrefix}-palette-customHex`}
        type="hidden"
        value={value.palette.customHex ?? ""}
      />
      <input
        name={`${inputPrefix}-image-assetId`}
        type="hidden"
        value={value.image.assetId ?? ""}
      />
      <input
        name={`${inputPrefix}-image-url`}
        type="hidden"
        value={value.image.imageUrl ?? ""}
      />
      <input
        name={`${inputPrefix}-image-overlayColor`}
        type="hidden"
        value={value.image.overlayColor ?? ""}
      />
      <input
        name={`${inputPrefix}-image-overlayOpacity`}
        type="hidden"
        value={String(value.image.overlayOpacity ?? 58)}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          className={cn(value.mode === "palette" ? "bg-stone-900 text-white" : undefined)}
          onClick={() => update({ mode: "palette" })}
          size="sm"
          type="button"
          variant={value.mode === "palette" ? "secondary" : "outline"}
        >
          <Paintbrush2 className="h-4 w-4" />
          Palette
        </Button>
        <Button
          className={cn(value.mode === "image" ? "bg-stone-900 text-white" : undefined)}
          onClick={() => update({ mode: "image" })}
          size="sm"
          type="button"
          variant={value.mode === "image" ? "secondary" : "outline"}
        >
          <ImagePlus className="h-4 w-4" />
          Image
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label>Preset Palette</Label>
            <select
              className="h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
              onChange={(event) =>
                update({
                  palette: {
                    preset: event.target.value as SectionBackgroundConfig["palette"]["preset"],
                  },
                })
              }
              value={value.palette.preset}
            >
              {homepageBackgroundPresetOrder.map((preset) => (
                <option key={preset} value={preset}>
                  {homepageBackgroundPresets[preset].label}
                </option>
              ))}
            </select>
            <p className="text-xs leading-5 text-stone-500">
              {homepageBackgroundPresets[value.palette.preset].description}
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`${inputPrefix}-customHex`}>Custom Hex</Label>
            <div className="flex items-center gap-3">
              {mounted ? (
                <input
                  className="h-11 w-14 rounded-lg border border-stone-300 bg-white p-1"
                  id={`${inputPrefix}-customHex`}
                  onChange={(event) =>
                    update({
                      palette: {
                        customHex: event.target.value,
                      },
                    })
                  }
                  type="color"
                  value={value.palette.customHex ?? homepageBackgroundPresets[value.palette.preset].base}
                />
              ) : (
                <div className="h-11 w-14 rounded-lg border border-stone-300 bg-white p-1">
                  <div
                    className="h-full w-full rounded-md"
                    style={{
                      backgroundColor:
                        value.palette.customHex ?? homepageBackgroundPresets[value.palette.preset].base,
                    }}
                  />
                </div>
              )}
              <Input
                onChange={(event) =>
                  update({
                    palette: {
                      customHex: event.target.value || undefined,
                    },
                  })
                }
                placeholder="#0f1728"
                value={value.palette.customHex ?? ""}
              />
            </div>
            <p className="text-xs text-stone-500">
              Kosongkan kalau ingin kembali ke warna preset.
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm font-semibold text-stone-900">Palette Preview</p>
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 rounded-lg border border-stone-200 p-3">
            <div
              className="h-14 rounded-md border border-black/5"
              style={{
                backgroundColor:
                  value.palette.customHex ?? homepageBackgroundPresets[value.palette.preset].base,
              }}
            />
            <div
              className="h-14 w-10 rounded-md border border-black/5"
              style={{ backgroundColor: homepageBackgroundPresets[value.palette.preset].accent }}
            />
            <div
              className="h-14 w-10 rounded-md border border-black/5"
              style={{ backgroundColor: homepageBackgroundPresets[value.palette.preset].glow }}
            />
          </div>
          <p className="text-xs leading-5 text-stone-500">
            Kolom besar menunjukkan warna dasar. Dua kolom kecil menunjukkan accent dan glow preset.
          </p>
        </div>
      </div>

      {value.mode === "image" ? (
        <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-4">
          {!cloudinaryEnabled ? (
            <Alert variant="error">
              Upload asset belum aktif. Isi `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, dan
              `CLOUDINARY_API_SECRET` dulu.
            </Alert>
          ) : null}

          {uploadError ? <Alert variant="error">{uploadError}</Alert> : null}
          {uploadMessage ? <Alert variant="success">{uploadMessage}</Alert> : null}

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor={`${inputPrefix}-asset-label`}>Label Asset Baru</Label>
                <Input
                  id={`${inputPrefix}-asset-label`}
                  onChange={(event) => setLabel(event.target.value)}
                  placeholder="Hero komunitas April"
                  value={label}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${inputPrefix}-asset-file`}>Upload File</Label>
                <Input
                  accept="image/*"
                  id={`${inputPrefix}-asset-file`}
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  type="file"
                />
              </div>
              <Button disabled={!cloudinaryEnabled || uploading} onClick={handleUpload} type="button">
                <CloudUpload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload ke Cloudinary"}
              </Button>
            </div>

            <div className="space-y-3 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-900">Asset Terpilih</p>
              {selectedAsset ? (
                <>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
                    <Image
                      alt={selectedAsset.label}
                      className="object-cover"
                      fill
                      sizes="320px"
                      src={selectedAsset.secureUrl}
                      unoptimized
                    />
                  </div>
                  <div className="space-y-1 text-sm text-stone-600">
                    <p className="font-medium text-stone-900">{selectedAsset.label}</p>
                    <p className="break-all text-xs text-stone-500">{selectedAsset.secureUrl}</p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-stone-500">Belum ada asset yang dipilih.</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`${inputPrefix}-overlayColor`}>Overlay Color</Label>
              <div className="flex items-center gap-3">
                {mounted ? (
                  <input
                    className="h-11 w-14 rounded-lg border border-stone-300 bg-white p-1"
                    id={`${inputPrefix}-overlayColor`}
                    onChange={(event) =>
                      update({
                        image: {
                          overlayColor: event.target.value,
                        },
                      })
                    }
                    type="color"
                    value={value.image.overlayColor ?? "#0f1728"}
                  />
                ) : (
                  <div className="h-11 w-14 rounded-lg border border-stone-300 bg-white p-1">
                    <div
                      className="h-full w-full rounded-md"
                      style={{ backgroundColor: value.image.overlayColor ?? "#0f1728" }}
                    />
                  </div>
                )}
                <Input
                  onChange={(event) =>
                    update({
                      image: {
                        overlayColor: event.target.value || undefined,
                      },
                    })
                  }
                  placeholder="#0f1728"
                  value={value.image.overlayColor ?? ""}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`${inputPrefix}-overlayOpacity`}>Overlay Opacity</Label>
              <div className="flex items-center gap-3">
                <input
                  className="h-2 flex-1 accent-emerald-600"
                  id={`${inputPrefix}-overlayOpacity`}
                  max="100"
                  min="0"
                  onChange={(event) =>
                    update({
                      image: {
                        overlayOpacity: Number.parseInt(event.target.value, 10),
                      },
                    })
                  }
                  type="range"
                  value={String(value.image.overlayOpacity ?? 58)}
                />
                <Input
                  className="w-20"
                  max={100}
                  min={0}
                  onChange={(event) =>
                    update({
                      image: {
                        overlayOpacity:
                          Number.parseInt(event.target.value, 10) || 0,
                      },
                    })
                  }
                  type="number"
                  value={String(value.image.overlayOpacity ?? 58)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-stone-900">Media Library</p>
              <span className="text-xs text-stone-500">{assets.length} asset</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {assets.length ? (
                assets.map((asset) => {
                  const isSelected = value.image.assetId === asset.id;

                  return (
                    <button
                      className={cn(
                        "overflow-hidden rounded-xl border text-left transition",
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]"
                          : "border-stone-200 bg-white hover:border-stone-300",
                      )}
                      key={asset.id}
                      onClick={() =>
                        update({
                          image: {
                            assetId: asset.id,
                            imageUrl: asset.secureUrl,
                          },
                          mode: "image",
                        })
                      }
                      type="button"
                    >
                      <div className="relative aspect-[16/10] w-full">
                        <Image
                          alt={asset.label}
                          className="object-cover"
                          fill
                          sizes="240px"
                          src={asset.secureUrl}
                          unoptimized
                        />
                      </div>
                      <div className="space-y-1 px-3 py-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-2 text-sm font-medium text-stone-900">
                            {asset.label}
                          </p>
                          {isSelected ? <Check className="mt-0.5 h-4 w-4 text-emerald-600" /> : null}
                        </div>
                        <p className="text-xs text-stone-500">
                          {asset.width ?? "-"} x {asset.height ?? "-"}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-sm text-stone-500">
                  Belum ada asset background yang tersimpan.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
