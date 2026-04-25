"use client";

import { useEffect, useRef, useState } from "react";
import {
  PlusCircle,
  Monitor,
  Smartphone,
  Trash2,
} from "lucide-react";
import {
  updateBenefitsSectionAction,
  updateBlogSectionAction,
  updateFaqSectionAction,
  updateFooterSectionAction,
  updateGuideSectionAction,
  updateOverviewSectionAction,
  updatePricingSectionAction,
  updateBannerAdsSectionAction,
  updateTestimonialSectionAction,
  updateVideoSectionAction,
} from "@/app/(protected)/admin/actions";
import { HomepageAssetPicker } from "@/components/admin/homepage-asset-picker";
import type { HomepageAsset, HomepageContent } from "@/components/landing/types";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { homepageBackgroundPresetOrder, homepageBackgroundPresets } from "@/lib/homepage-backgrounds";
import { cn } from "@/lib/utils";
import type { ButtonPaletteKey } from "@/components/landing/types";

type HomepageSettingsViewProps = {
  assets: HomepageAsset[];
  cloudinaryEnabled: boolean;
  content: HomepageContent;
  status?: string;
  section?: string;
};

type FieldProps = {
  label: string;
  name: string;
  onChange: (value: string) => void;
  rows?: number;
  value: string;
};

const adminCardClass = "admin-panel-card rounded-[30px] border-transparent";

function TextField({ label, name, onChange, value }: FieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        className="rounded-[18px] border-transparent px-4"
        id={name}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </div>
  );
}

function NumberField({
  label,
  name,
  onChange,
  value,
}: {
  label: string;
  name: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        className="rounded-[18px] border-transparent px-4"
        id={name}
        min={150}
        name={name}
        onChange={(event) => onChange(Number.parseInt(event.target.value || "0", 10) || 0)}
        step={1}
        type="number"
        value={value}
      />
    </div>
  );
}

const buttonPaletteOptions: Array<{
  description: string;
  key: ButtonPaletteKey;
  label: string;
  recommendation: string;
}> = [
  {
    key: "glass-default",
    label: "Glass Default",
    description: "Tombol glass netral yang paling aman untuk semua background.",
    recommendation: "Cocok untuk UI yang ingin tetap halus dan premium.",
  },
  {
    key: "brand-blue",
    label: "Brand Blue",
    description: "Biru brand yang tegas dan paling aman untuk CTA utama.",
    recommendation: "Paling cocok untuk Overview dan CTA daftar utama.",
  },
  {
    key: "sky",
    label: "Sky Blue",
    description: "Biru muda yang terasa lebih ringan dan fresh.",
    recommendation: "Cocok untuk Guide dan section yang lebih edukatif.",
  },
  {
    key: "emerald",
    label: "Emerald",
    description: "Hijau terang untuk kesan action yang bersih dan positif.",
    recommendation: "Bagus untuk tombol langkah lanjut atau aktivasi.",
  },
  {
    key: "gold",
    label: "Gold",
    description: "Emas hangat untuk aksen promo atau penekanan harga.",
    recommendation: "Cocok untuk Pricing jika ingin CTA lebih menonjol.",
  },
  {
    key: "midnight",
    label: "Midnight",
    description: "Gelap elegan untuk light mode dan brand feel yang lebih formal.",
    recommendation: "Bagus untuk footer-like tone atau style yang lebih dewasa.",
  },
];

function SelectField({
  label,
  name,
  onChange,
  options,
  value,
}: {
  label: string;
  name: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <select
        className="h-11 rounded-[18px] border border-transparent px-4 text-sm outline-none transition"
        id={name}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function PaletteOnlyBackgroundFields({
  description,
  onChange,
  value,
}: {
  description: string;
  onChange: (value: HomepageContent[keyof HomepageContent]["background"]) => void;
  value: HomepageContent[keyof HomepageContent]["background"];
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
      <input name="background-mode" type="hidden" value="palette" />
      <input name="background-palette-preset" type="hidden" value={value.palette.preset} />
      <input name="background-palette-customHex" type="hidden" value={value.palette.customHex ?? ""} />
      <input name="background-image-assetId" type="hidden" value="" />
      <input name="background-image-url" type="hidden" value="" />
      <input name="background-image-overlayColor" type="hidden" value="" />
      <input name="background-image-overlayOpacity" type="hidden" value="58" />

      <p className="text-sm font-semibold text-stone-900">Tone background section</p>
      <p className="mt-1 text-xs leading-6 text-stone-500">{description}</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <SelectField
          label="Preset warna"
          name="backgroundPalettePreset"
          onChange={(nextPreset) =>
            onChange({
              ...value,
              mode: "palette",
              palette: {
                ...value.palette,
                preset: nextPreset as typeof value.palette.preset,
              },
            })
          }
          options={homepageBackgroundPresetOrder.map((preset) => ({
            label: homepageBackgroundPresets[preset].label,
            value: preset,
          }))}
          value={value.palette.preset}
        />
        <TextField
          label="Custom hex (opsional)"
          name="backgroundPaletteCustomHex"
          onChange={(nextHex) =>
            onChange({
              ...value,
              mode: "palette",
              palette: {
                ...value.palette,
                customHex: nextHex || undefined,
              },
            })
          }
          value={value.palette.customHex ?? ""}
        />
      </div>
    </div>
  );
}

function TextAreaField({ label, name, onChange, rows = 4, value }: FieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <textarea
        className="min-h-28 w-full rounded-[18px] border border-transparent px-4 py-3 text-sm outline-none transition"
        id={name}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        value={value}
      />
    </div>
  );
}

function SectionAlert({
  currentSection,
  label,
  section,
  status,
}: {
  currentSection?: string;
  label: string;
  section: string;
  status?: string;
}) {
  if (currentSection !== section || !status) {
    return null;
  }

  return status === "saved" ? (
    <Alert variant="success">{label} berhasil diperbarui.</Alert>
  ) : (
    <Alert variant="error">Ada data {label.toLowerCase()} yang belum valid. Cek lagi inputnya.</Alert>
  );
}

type PreviewViewportProps = {
  content: HomepageContent;
  preset: PreviewPresetKey;
};

const previewPresets = {
  "desktop-1366": {
    device: "desktop",
    frameAspect: "aspect-[16/10]",
    height: 768,
    label: "Laptop 1366",
    width: 1366,
  },
  "desktop-1440": {
    device: "desktop",
    frameAspect: "aspect-[16/10]",
    height: 900,
    label: "Desktop 1440",
    width: 1440,
  },
  "desktop-1920": {
    device: "desktop",
    frameAspect: "aspect-[16/10]",
    height: 1080,
    label: "Desktop 1920",
    width: 1920,
  },
  "mobile-390": {
    device: "mobile",
    frameAspect: "aspect-[390/844]",
    height: 844,
    label: "Mobile 390",
    width: 390,
  },
  "mobile-412": {
    device: "mobile",
    frameAspect: "aspect-[412/915]",
    height: 915,
    label: "Mobile 412",
    width: 412,
  },
  "tablet-820": {
    device: "mobile",
    frameAspect: "aspect-[820/1180]",
    height: 1180,
    label: "Tablet 820",
    width: 820,
  },
} as const;

type PreviewPresetKey = keyof typeof previewPresets;

const previewPresetGroups = {
  desktop: ["desktop-1366", "desktop-1440", "desktop-1920"],
  mobile: ["mobile-390", "mobile-412", "tablet-820"],
} as const satisfies Record<"desktop" | "mobile", PreviewPresetKey[]>;

function PreviewViewport({ content, preset }: PreviewViewportProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [frameWidth, setFrameWidth] = useState(0);
  const config = previewPresets[preset];

  const viewportWidth = config.width;
  const viewportHeight = config.height;
  const maxViewportHeight = config.device === "desktop" ? 640 : 720;
  const scaleFromWidth = frameWidth > 0 ? frameWidth / viewportWidth : 1;
  const scaleFromHeight = maxViewportHeight / viewportHeight;
  const scale = Math.min(scaleFromWidth, scaleFromHeight, 1);
  const scaledWidth = viewportWidth * scale;
  const scaledHeight = viewportHeight * scale;

  useEffect(() => {
    const node = frameRef.current;

    if (!node) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width ?? 0;
      setFrameWidth((current) => (Math.abs(current - nextWidth) < 0.5 ? current : nextWidth));
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe?.contentWindow) {
      return;
    }

    iframe.contentWindow.postMessage(
      {
        content,
        type: "homepage-preview:update",
      },
      window.location.origin,
    );
  }, [content, preset]);

  return (
    <div
      className={cn(
        "admin-glass-row rounded-[28px] border-transparent p-3",
        config.frameAspect,
      )}
      ref={frameRef}
    >
      <div className="admin-preview-shell-surface flex h-full w-full items-center justify-center overflow-hidden rounded-[22px] p-3">
        <div
          className="admin-preview-frame-surface relative shrink-0 overflow-hidden rounded-[18px]"
          style={{
            height: `${scaledHeight}px`,
            width: `${scaledWidth}px`,
          }}
        >
          <iframe
            className="origin-top-left border-0 bg-[var(--admin-preview-frame-bg)]"
            onLoad={() => {
              if (!iframeRef.current?.contentWindow) {
                return;
              }

              iframeRef.current.contentWindow.postMessage(
                {
                  content,
                  type: "homepage-preview:update",
                },
                window.location.origin,
              );
            }}
            ref={iframeRef}
            src="/admin-preview"
            style={{
              height: `${viewportHeight}px`,
              transform: `scale(${scale})`,
              width: `${viewportWidth}px`,
            }}
            title={`Homepage preview ${config.label}`}
          />
        </div>
      </div>
    </div>
  );
}

export function HomepageSettingsView({
  assets,
  cloudinaryEnabled,
  content,
  section,
  status,
}: HomepageSettingsViewProps) {
  const [draft, setDraft] = useState(content);
  const [library, setLibrary] = useState(assets);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewPreset, setPreviewPreset] = useState<PreviewPresetKey>("desktop-1440");

  useEffect(() => {
    if (!section || typeof window === "undefined") {
      return;
    }

    const sectionId = `${section === "bannerAds" ? "banner-ads" : section}-section`;
    const target = document.getElementById(sectionId);

    if (!target) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [section]);

  function updateSection<K extends keyof HomepageContent>(
    key: K,
    updates: Partial<HomepageContent[K]>,
  ) {
    setDraft((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...updates,
      },
    }));
  }

  return (
    <div className="admin-homepage-composer grid gap-6 xl:min-h-[calc(100vh-7rem)] xl:grid-cols-[minmax(0,0.94fr)_minmax(380px,0.86fr)] xl:items-start">
      <div className="space-y-6 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto xl:pr-2">
        <Card className={adminCardClass}>
          <CardHeader>
            <CardTitle>Homepage Content Manager</CardTitle>
            <CardDescription>
              Atur background, copy, dan asset visual homepage dari satu composer. Preview di kanan
              akan mengikuti perubahan draft secara langsung sebelum kamu simpan.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className={cn(adminCardClass, "scroll-mt-24")} id="floating-whatsapp-section">
          <CardHeader>
            <CardTitle>Floating WhatsApp</CardTitle>
            <CardDescription>
              Shortcut cepat untuk nomor WhatsApp admin yang dipakai oleh tombol floating WhatsApp
              di landing page. Nilai ini tetap sinkron dengan section Banner Ads di bawah.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SectionAlert currentSection={section} label="Banner ads section" section="bannerAds" status={status} />
            <form action={updateBannerAdsSectionAction} className="space-y-5">
              <input name="title" type="hidden" value={draft.bannerAds.title} />
              <input name="buttonLabel" type="hidden" value={draft.bannerAds.buttonLabel} />
              <input name="description" type="hidden" value={draft.bannerAds.description} />
              <input name="imageAlt" type="hidden" value={draft.bannerAds.imageAlt ?? ""} />
              <input name="imageAssetId" type="hidden" value={draft.bannerAds.imageAssetId ?? ""} />
              <input name="imageUrl" type="hidden" value={draft.bannerAds.imageUrl ?? ""} />
              <input name="isVisible" type="hidden" value={String(draft.bannerAds.isVisible)} />
              <input name="background-mode" type="hidden" value={draft.bannerAds.background.mode} />
              <input
                name="background-palette-preset"
                type="hidden"
                value={draft.bannerAds.background.palette.preset}
              />
              <input
                name="background-palette-customHex"
                type="hidden"
                value={draft.bannerAds.background.palette.customHex ?? ""}
              />
              <input
                name="background-image-assetId"
                type="hidden"
                value={draft.bannerAds.background.image.assetId ?? ""}
              />
              <input
                name="background-image-url"
                type="hidden"
                value={draft.bannerAds.background.image.imageUrl ?? ""}
              />
              <input
                name="background-image-overlayColor"
                type="hidden"
                value={draft.bannerAds.background.image.overlayColor ?? ""}
              />
              <input
                name="background-image-overlayOpacity"
                type="hidden"
                value={String(draft.bannerAds.background.image.overlayOpacity ?? 18)}
              />
              <div className="admin-note-surface rounded-2xl px-4 py-3 text-sm leading-6">
                Isi nomor dengan format yang paling aman, misalnya <code>6281234567890</code>.
                Setelah disimpan, tombol floating WhatsApp di landing page akan otomatis memakai
                nomor ini.
              </div>
              <TextField
                label="Nomor WhatsApp Admin"
                name="whatsappNumber"
                onChange={(value) => updateSection("bannerAds", { whatsappNumber: value })}
                value={draft.bannerAds.whatsappNumber ?? ""}
              />
              <Button type="submit">Simpan Nomor WhatsApp</Button>
            </form>
          </CardContent>
        </Card>

        <Card className={cn(adminCardClass, "scroll-mt-24")} id="overview-section">
          <CardHeader>
            <CardTitle>Overview Section</CardTitle>
            <CardDescription>
              Atur section pembuka homepage, deskripsi, CTA, dan background. Logo brand overview
              sekarang mengikuti asset logo AIOTrade yang tetap.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SectionAlert currentSection={section} label="Overview section" section="overview" status={status} />
            <form action={updateOverviewSectionAction} className="space-y-5">
              <input name="titleBlue" type="hidden" value={draft.overview.titleBlue} />
              <input name="titleWhite" type="hidden" value={draft.overview.titleWhite} />
              <div className="admin-note-surface rounded-2xl px-4 py-3 text-sm leading-6">
                Logo overview memakai asset brand yang sama dengan footer agar tampil konsisten di
                desktop dan mobile. Ukuran tampilnya bisa kamu atur di bawah tanpa mengganti asset
                logo. Judul teks lama disimpan otomatis supaya konfigurasi homepage tetap aman.
              </div>
              <input name="background-mode" type="hidden" value="palette" />
              <input
                name="background-palette-preset"
                type="hidden"
                value={draft.overview.background.palette.preset}
              />
              <input
                name="background-palette-customHex"
                type="hidden"
                value={draft.overview.background.palette.customHex ?? ""}
              />
              <input name="background-image-assetId" type="hidden" value="" />
              <input name="background-image-url" type="hidden" value="" />
              <input name="background-image-overlayColor" type="hidden" value="" />
              <input name="background-image-overlayOpacity" type="hidden" value="58" />
              <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <p className="text-sm font-semibold text-stone-900">Ukuran logo overview</p>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-stone-200 bg-white px-4 py-4">
                    <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                      <Smartphone className="h-4 w-4" />
                      Mobile
                    </div>
                    <NumberField
                      label="Lebar logo mobile (px)"
                      name="logoMobileWidth"
                      onChange={(value) =>
                        updateSection("overview", {
                          logoSize: {
                            ...draft.overview.logoSize,
                            mobileWidth: value,
                          },
                        })
                      }
                      value={draft.overview.logoSize.mobileWidth}
                    />
                  </div>
                  <div className="rounded-lg border border-stone-200 bg-white px-4 py-4">
                    <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                      <Monitor className="h-4 w-4" />
                      Desktop
                    </div>
                    <NumberField
                      label="Lebar logo desktop (px)"
                      name="logoDesktopWidth"
                      onChange={(value) =>
                        updateSection("overview", {
                          logoSize: {
                            ...draft.overview.logoSize,
                            desktopWidth: value,
                          },
                        })
                      }
                      value={draft.overview.logoSize.desktopWidth}
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs leading-6 text-stone-500">
                  Rekomendasi aman: mobile 160 - 220 px dan desktop 220 - 300 px agar hero tetap
                  seimbang dengan phone mockup.
                </p>
              </div>
              <TextAreaField
                label="Deskripsi"
                name="description"
                onChange={(value) => updateSection("overview", { description: value })}
                rows={5}
                value={draft.overview.description}
              />
              <TextField
                label="Label Tombol"
                name="ctaLabel"
                onChange={(value) => updateSection("overview", { ctaLabel: value })}
                value={draft.overview.ctaLabel}
              />
              <div className="grid gap-2">
                <TextField
                  label="Link Tombol"
                  name="ctaHref"
                  onChange={(value) => updateSection("overview", { ctaHref: value })}
                  value={draft.overview.ctaHref}
                />
                <p className="text-xs leading-6 text-stone-500">
                  Contoh: <code>/signup</code>, <code>/guide</code>, <code>#harga</code>, atau link eksternal penuh.
                </p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <SelectField
                  label="Warna Tombol Overview"
                  name="buttonPalette"
                  onChange={(value) =>
                    updateSection("overview", { buttonPalette: value as ButtonPaletteKey })
                  }
                  options={buttonPaletteOptions.map((option) => ({
                    label: option.label,
                    value: option.key,
                  }))}
                  value={draft.overview.buttonPalette}
                />
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {buttonPaletteOptions.map((option) => (
                    <div className="rounded-lg border border-stone-200 bg-white px-3 py-3" key={option.key}>
                      <p className="text-sm font-semibold text-stone-900">{option.label}</p>
                      <p className="mt-1 text-xs leading-6 text-stone-500">{option.description}</p>
                      <p className="admin-note-accent mt-2 text-xs font-medium">{option.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm leading-6 text-stone-600">
                Background image overview sudah tidak dipakai lagi. Section hero sekarang mengikuti
                tone landing global agar hasil light/dark mode lebih rapi dan konsisten.
              </div>
              <Button type="submit">Simpan Overview Section</Button>
            </form>
          </CardContent>
        </Card>

        <Card className={cn(adminCardClass, "scroll-mt-24")} id="benefits-section">
          <CardHeader>
            <CardTitle>Benefit Section</CardTitle>
            <CardDescription>Atur heading, card benefit, dan background section manfaat.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SectionAlert currentSection={section} label="Benefit section" section="benefits" status={status} />
            <form action={updateBenefitsSectionAction} className="space-y-5">
              <input name="itemCount" type="hidden" value={draft.benefits.items.length} />
              <input name="background-mode" type="hidden" value="palette" />
              <input
                name="background-palette-preset"
                type="hidden"
                value={draft.benefits.background.palette.preset}
              />
              <input
                name="background-palette-customHex"
                type="hidden"
                value={draft.benefits.background.palette.customHex ?? ""}
              />
              <input name="background-image-assetId" type="hidden" value="" />
              <input name="background-image-url" type="hidden" value="" />
              <input name="background-image-overlayColor" type="hidden" value="" />
              <input name="background-image-overlayOpacity" type="hidden" value="58" />
              <TextField
                label="Heading"
                name="heading"
                onChange={(value) => updateSection("benefits", { heading: value })}
                value={draft.benefits.heading}
              />
              <TextAreaField
                label="Subheading"
                name="description"
                onChange={(value) => updateSection("benefits", { description: value })}
                rows={3}
                value={draft.benefits.description}
              />
              <PaletteOnlyBackgroundFields
                description="Benefit section sekarang tidak memakai background image. Yang diatur di sini hanya tone warna dasar agar tetap selaras dengan landing page."
                onChange={(background) => updateSection("benefits", { background })}
                value={draft.benefits.background}
              />
              <div className="space-y-4">
                {draft.benefits.items.map((item, index) => (
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-4" key={`${item.title}-${index}`}>
                    <p className="text-sm font-semibold text-stone-900">Benefit Card {index + 1}</p>
                    <div className="mt-3 grid gap-4">
                      <TextField
                        label="Judul"
                        name={`item-${index}-title`}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            benefits: {
                              ...current.benefits,
                              items: current.benefits.items.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, title: value } : entry,
                              ),
                            },
                          }))
                        }
                        value={item.title}
                      />
                      <TextAreaField
                        label="Deskripsi"
                        name={`item-${index}-description`}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            benefits: {
                              ...current.benefits,
                              items: current.benefits.items.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, description: value } : entry,
                              ),
                            },
                          }))
                        }
                        rows={3}
                        value={item.description}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button type="submit">Simpan Benefit Section</Button>
            </form>
          </CardContent>
        </Card>

        <Card className={cn(adminCardClass, "scroll-mt-24")} id="pricing-section">
          <CardHeader>
            <CardTitle>Pricing Section</CardTitle>
            <CardDescription>Atur judul harga, paket, dan background section pricing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SectionAlert currentSection={section} label="Pricing section" section="pricing" status={status} />
            <form action={updatePricingSectionAction} className="space-y-5">
              <input name="planCount" type="hidden" value={draft.pricing.plans.length} />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Eyebrow"
                  name="eyebrow"
                  onChange={(value) => updateSection("pricing", { eyebrow: value })}
                  value={draft.pricing.eyebrow}
                />
                <TextField
                  label="Judul"
                  name="title"
                  onChange={(value) => updateSection("pricing", { title: value })}
                  value={draft.pricing.title}
                />
              </div>
              <TextField
                label="Label Tombol"
                name="buttonLabel"
                onChange={(value) => updateSection("pricing", { buttonLabel: value })}
                value={draft.pricing.buttonLabel}
              />
              <div className="grid gap-2">
                <TextField
                  label="Link Tombol"
                  name="ctaHref"
                  onChange={(value) => updateSection("pricing", { ctaHref: value })}
                  value={draft.pricing.ctaHref}
                />
                <p className="text-xs leading-6 text-stone-500">
                  Contoh: <code>/signup</code>, <code>/guide</code>, <code>#faq</code>, atau link eksternal penuh.
                </p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <SelectField
                  label="Warna Tombol Pricing"
                  name="buttonPalette"
                  onChange={(value) =>
                    updateSection("pricing", { buttonPalette: value as ButtonPaletteKey })
                  }
                  options={buttonPaletteOptions.map((option) => ({
                    label: option.label,
                    value: option.key,
                  }))}
                  value={draft.pricing.buttonPalette}
                />
                <p className="mt-3 text-xs leading-6 text-stone-500">
                  Saran cepat: <strong>Brand Blue</strong> untuk CTA daftar yang aman, atau{" "}
                  <strong>Gold</strong> kalau tombol pricing ingin terasa lebih promo.
                </p>
              </div>
              <PaletteOnlyBackgroundFields
                description="Pricing section sekarang memakai tone warna dasar saja. Background image sudah tidak dipakai agar visual landing tetap konsisten."
                onChange={(background) => updateSection("pricing", { background })}
                value={draft.pricing.background}
              />
              <div className="space-y-4">
                {draft.pricing.plans.map((plan, index) => (
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-4" key={`${plan.name}-${index}`}>
                    <input name={`plan-${index}-emphasis`} type="hidden" value={String(Boolean(plan.emphasis))} />
                    <p className="text-sm font-semibold text-stone-900">Plan {index + 1}</p>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <TextField
                        label="Nama Plan"
                        name={`plan-${index}-name`}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            pricing: {
                              ...current.pricing,
                              plans: current.pricing.plans.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, name: value } : entry,
                              ),
                            },
                          }))
                        }
                        value={plan.name}
                      />
                      <TextField
                        label="Harga"
                        name={`plan-${index}-price`}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            pricing: {
                              ...current.pricing,
                              plans: current.pricing.plans.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, price: value } : entry,
                              ),
                            },
                          }))
                        }
                        value={plan.price}
                      />
                    </div>
                    <div className="mt-4 grid gap-4">
                      <TextField
                        label="Badge Highlight"
                        name={`plan-${index}-highlight`}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            pricing: {
                              ...current.pricing,
                              plans: current.pricing.plans.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, highlight: value || undefined } : entry,
                              ),
                            },
                          }))
                        }
                        value={plan.highlight ?? ""}
                      />
                      <TextAreaField
                        label="Deskripsi"
                        name={`plan-${index}-description`}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            pricing: {
                              ...current.pricing,
                              plans: current.pricing.plans.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, description: value } : entry,
                              ),
                            },
                          }))
                        }
                        rows={4}
                        value={plan.description}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button type="submit">Simpan Pricing Section</Button>
            </form>
          </CardContent>
        </Card>

        <Card className={cn(adminCardClass, "scroll-mt-24")} id="video-section">
          <CardHeader>
            <CardTitle>Video Section</CardTitle>
            <CardDescription>Atur section video embed yang tampil setelah pricing section.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SectionAlert currentSection={section} label="Video section" section="video" status={status} />
            <form action={updateVideoSectionAction} className="space-y-5">
              <input name="isVisible" type="hidden" value={String(draft.video.isVisible)} />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Eyebrow"
                  name="eyebrow"
                  onChange={(value) => updateSection("video", { eyebrow: value })}
                  value={draft.video.eyebrow}
                />
                <TextField
                  label="Judul"
                  name="title"
                  onChange={(value) => updateSection("video", { title: value })}
                  value={draft.video.title}
                />
              </div>
              <TextAreaField
                label="Deskripsi"
                name="description"
                onChange={(value) => updateSection("video", { description: value })}
                rows={4}
                value={draft.video.description}
              />
              <TextField
                label="Link Embed Video"
                name="embedUrl"
                onChange={(value) => updateSection("video", { embedUrl: value })}
                value={draft.video.embedUrl}
              />
              <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
                <input
                  checked={draft.video.isVisible}
                  className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-600"
                  onChange={(event) => updateSection("video", { isVisible: event.target.checked })}
                  type="checkbox"
                />
                <span className="text-sm font-medium text-stone-900">Tampilkan video section di homepage</span>
              </label>
              <PaletteOnlyBackgroundFields
                description="Video section sekarang mengikuti tone background landing. Background image tambahan sudah tidak dipakai."
                onChange={(background) => updateSection("video", { background })}
                value={draft.video.background}
              />
              <Button type="submit">Simpan Video Section</Button>
            </form>
          </CardContent>
        </Card>

        <Card className={cn(adminCardClass, "scroll-mt-24")} id="faq-section">
          <CardHeader>
            <CardTitle>FAQ Section</CardTitle>
            <CardDescription>Atur judul FAQ, item pertanyaan, dan background.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SectionAlert currentSection={section} label="FAQ section" section="faq" status={status} />
            <form action={updateFaqSectionAction} className="space-y-5">
              <input name="itemCount" type="hidden" value={draft.faq.items.length} />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Judul"
                  name="title"
                  onChange={(value) => updateSection("faq", { title: value })}
                  value={draft.faq.title}
                />
                <TextField
                  label="Subjudul"
                  name="subtitle"
                  onChange={(value) => updateSection("faq", { subtitle: value })}
                  value={draft.faq.subtitle}
                />
              </div>
              <PaletteOnlyBackgroundFields
                description="FAQ section sekarang hanya memakai palette background agar panel dan akordion tetap bersih."
                onChange={(background) => updateSection("faq", { background })}
                value={draft.faq.background}
              />
              <div className="space-y-4">
                {draft.faq.items.map((item, index) => (
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-4" key={`${item.question}-${index}`}>
                    <p className="text-sm font-semibold text-stone-900">FAQ Item {index + 1}</p>
                    <div className="mt-3 grid gap-4">
                      <TextField
                        label="Pertanyaan"
                        name={`item-${index}-question`}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            faq: {
                              ...current.faq,
                              items: current.faq.items.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, question: value } : entry,
                              ),
                            },
                          }))
                        }
                        value={item.question}
                      />
                      <TextAreaField
                        label="Jawaban"
                        name={`item-${index}-answer`}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            faq: {
                              ...current.faq,
                              items: current.faq.items.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, answer: value } : entry,
                              ),
                            },
                          }))
                        }
                        rows={4}
                        value={item.answer}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button type="submit">Simpan FAQ Section</Button>
            </form>
          </CardContent>
        </Card>

        <Card className={cn(adminCardClass, "scroll-mt-24")} id="guide-section">
          <CardHeader>
            <CardTitle>Guide Section</CardTitle>
            <CardDescription>Atur panduan langkah dan background section user guide.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SectionAlert currentSection={section} label="Guide section" section="guide" status={status} />
            <form action={updateGuideSectionAction} className="space-y-5">
              <input name="stepCount" type="hidden" value={draft.guide.steps.length} />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Eyebrow"
                  name="eyebrow"
                  onChange={(value) => updateSection("guide", { eyebrow: value })}
                  value={draft.guide.eyebrow}
                />
                <TextField
                  label="Judul"
                  name="title"
                  onChange={(value) => updateSection("guide", { title: value })}
                  value={draft.guide.title}
                />
              </div>
              <TextField
                label="Label Tombol"
                name="buttonLabel"
                onChange={(value) => updateSection("guide", { buttonLabel: value })}
                value={draft.guide.buttonLabel}
              />
              <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <SelectField
                  label="Warna Tombol Guide"
                  name="buttonPalette"
                  onChange={(value) =>
                    updateSection("guide", { buttonPalette: value as ButtonPaletteKey })
                  }
                  options={buttonPaletteOptions.map((option) => ({
                    label: option.label,
                    value: option.key,
                  }))}
                  value={draft.guide.buttonPalette}
                />
                <p className="mt-3 text-xs leading-6 text-stone-500">
                  Saran cepat: <strong>Sky Blue</strong> untuk nuansa edukasi yang ringan, atau{" "}
                  <strong>Emerald</strong> untuk action yang terasa lebih jelas.
                </p>
              </div>
              <PaletteOnlyBackgroundFields
                description="Guide section sekarang memakai tone warna dasar saja. Background image sudah tidak dipakai."
                onChange={(background) => updateSection("guide", { background })}
                value={draft.guide.background}
              />
              <div className="space-y-4">
                {draft.guide.steps.map((step, index) => (
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-4" key={`${step.number}-${index}`}>
                    <p className="text-sm font-semibold text-stone-900">Langkah {index + 1}</p>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <TextField
                        label="Nomor"
                        name={`step-${index}-number`}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            guide: {
                              ...current.guide,
                              steps: current.guide.steps.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, number: value } : entry,
                              ),
                            },
                          }))
                        }
                        value={step.number}
                      />
                      <TextField
                        label="Judul"
                        name={`step-${index}-title`}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            guide: {
                              ...current.guide,
                              steps: current.guide.steps.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, title: value } : entry,
                              ),
                            },
                          }))
                        }
                        value={step.title}
                      />
                    </div>
                    <div className="mt-4">
                      <TextAreaField
                        label="Deskripsi"
                        name={`step-${index}-description`}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            guide: {
                              ...current.guide,
                              steps: current.guide.steps.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, description: value } : entry,
                              ),
                            },
                          }))
                        }
                        rows={4}
                        value={step.description}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button type="submit">Simpan Guide Section</Button>
            </form>
          </CardContent>
        </Card>

        <Card className={cn(adminCardClass, "scroll-mt-24")} id="testimonial-section">
          <CardHeader>
            <CardTitle>Testimoni Section</CardTitle>
            <CardDescription>Atur slider foto testimonial yang tampil setelah guide section.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SectionAlert currentSection={section} label="Testimoni section" section="testimonial" status={status} />
            <form action={updateTestimonialSectionAction} className="space-y-5">
              <input name="itemCount" type="hidden" value={draft.testimonial.items.length} />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Eyebrow"
                  name="eyebrow"
                  onChange={(value) => updateSection("testimonial", { eyebrow: value })}
                  value={draft.testimonial.eyebrow}
                />
                <TextField
                  label="Judul"
                  name="title"
                  onChange={(value) => updateSection("testimonial", { title: value })}
                  value={draft.testimonial.title}
                />
              </div>
              <TextAreaField
                label="Subjudul"
                name="subtitle"
                onChange={(value) => updateSection("testimonial", { subtitle: value })}
                rows={3}
                value={draft.testimonial.subtitle}
              />
              <PaletteOnlyBackgroundFields
                description="Testimoni section sekarang memakai palette background. Foto testimoni tetap diatur per item di bawah."
                onChange={(background) => updateSection("testimonial", { background })}
                value={draft.testimonial.background}
              />

              <div className="space-y-4">
                {draft.testimonial.items.map((item, index) => (
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-4" key={`${item.name}-${index}`}>
                    <input name={`item-${index}-imageAssetId`} type="hidden" value={item.imageAssetId ?? ""} />
                    <input name={`item-${index}-imageUrl`} type="hidden" value={item.imageUrl ?? ""} />

                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-stone-900">Testimoni {index + 1}</p>
                      {draft.testimonial.items.length > 1 ? (
                        <Button
                          onClick={() =>
                            setDraft((current) => ({
                              ...current,
                              testimonial: {
                                ...current.testimonial,
                                items: current.testimonial.items.filter((_, entryIndex) => entryIndex !== index),
                              },
                            }))
                          }
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          <Trash2 className="h-4 w-4" />
                          Hapus
                        </Button>
                      ) : null}
                    </div>

                    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <TextField
                            label="Nama"
                            name={`item-${index}-name`}
                            onChange={(value) =>
                              setDraft((current) => ({
                                ...current,
                                testimonial: {
                                  ...current.testimonial,
                                  items: current.testimonial.items.map((entry, entryIndex) =>
                                    entryIndex === index ? { ...entry, name: value } : entry,
                                  ),
                                },
                              }))
                            }
                            value={item.name}
                          />
                          <TextField
                            label="Role"
                            name={`item-${index}-role`}
                            onChange={(value) =>
                              setDraft((current) => ({
                                ...current,
                                testimonial: {
                                  ...current.testimonial,
                                  items: current.testimonial.items.map((entry, entryIndex) =>
                                    entryIndex === index ? { ...entry, role: value } : entry,
                                  ),
                                },
                              }))
                            }
                            value={item.role}
                          />
                        </div>

                        <TextField
                          label="Alt Foto"
                          name={`item-${index}-imageAlt`}
                          onChange={(value) =>
                            setDraft((current) => ({
                              ...current,
                              testimonial: {
                                ...current.testimonial,
                                items: current.testimonial.items.map((entry, entryIndex) =>
                                  entryIndex === index ? { ...entry, imageAlt: value } : entry,
                                ),
                              },
                            }))
                          }
                          value={item.imageAlt ?? ""}
                        />

                        <TextAreaField
                          label="Quote"
                          name={`item-${index}-quote`}
                          onChange={(value) =>
                            setDraft((current) => ({
                              ...current,
                              testimonial: {
                                ...current.testimonial,
                                items: current.testimonial.items.map((entry, entryIndex) =>
                                  entryIndex === index ? { ...entry, quote: value } : entry,
                                ),
                              },
                            }))
                          }
                          rows={5}
                          value={item.quote}
                        />
                      </div>

                      <HomepageAssetPicker
                        assets={library}
                        cloudinaryEnabled={cloudinaryEnabled}
                        label="Foto Testimoni"
                        onAssetsChange={setLibrary}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            testimonial: {
                              ...current.testimonial,
                              items: current.testimonial.items.map((entry, entryIndex) =>
                                entryIndex === index
                                  ? {
                                      ...entry,
                                      imageAssetId: value.assetId,
                                      imageUrl: value.imageUrl,
                                    }
                                  : entry,
                              ),
                            },
                          }))
                        }
                        value={{
                          assetId: item.imageAssetId,
                          imageUrl: item.imageUrl,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    testimonial: {
                      ...current.testimonial,
                      items: [
                        ...current.testimonial.items,
                        {
                          name: "Member Baru",
                          quote: "Tulis pengalaman singkat member di sini.",
                          role: "Komunitas AIOTrade",
                        },
                      ],
                    },
                  }))
                }
                type="button"
                variant="outline"
              >
                <PlusCircle className="h-4 w-4" />
                Tambah Testimoni
              </Button>

              <Button type="submit">Simpan Testimoni Section</Button>
            </form>
          </CardContent>
        </Card>

        <Card className={cn(adminCardClass, "scroll-mt-24")} id="blog-section">
          <CardHeader>
            <CardTitle>Blog Section</CardTitle>
            <CardDescription>Atur judul blog card, item artikel, dan background.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SectionAlert currentSection={section} label="Blog section" section="blog" status={status} />
            <form action={updateBlogSectionAction} className="space-y-5">
              <input name="itemCount" type="hidden" value={draft.blog.items.length} />
              <TextField
                label="Judul"
                name="title"
                onChange={(value) => updateSection("blog", { title: value })}
                value={draft.blog.title}
              />
              <PaletteOnlyBackgroundFields
                description="Blog section mengikuti tone warna landing. Background image tambahan sudah tidak dipakai."
                onChange={(background) => updateSection("blog", { background })}
                value={draft.blog.background}
              />
              <div className="space-y-4">
                {draft.blog.items.map((item, index) => (
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-4" key={`${item.title}-${index}`}>
                    <p className="text-sm font-semibold text-stone-900">Artikel {index + 1}</p>
                    <div className="mt-3 grid gap-4">
                      <TextField
                        label="Judul Artikel"
                        name={`item-${index}-title`}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            blog: {
                              ...current.blog,
                              items: current.blog.items.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, title: value } : entry,
                              ),
                            },
                          }))
                        }
                        value={item.title}
                      />
                      <TextAreaField
                        label="Deskripsi Pendek"
                        name={`item-${index}-description`}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            blog: {
                              ...current.blog,
                              items: current.blog.items.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, description: value } : entry,
                              ),
                            },
                          }))
                        }
                        rows={3}
                        value={item.description}
                      />
                      <TextField
                        label="Label Badge"
                        name={`item-${index}-label`}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            blog: {
                              ...current.blog,
                              items: current.blog.items.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, label: value } : entry,
                              ),
                            },
                          }))
                        }
                        value={item.label}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button type="submit">Simpan Blog Section</Button>
            </form>
          </CardContent>
        </Card>

        <Card className={cn(adminCardClass, "scroll-mt-24")} id="banner-ads-section">
          <CardHeader>
            <CardTitle>Banner Ads Section</CardTitle>
            <CardDescription>Atur banner promosi memanjang yang tampil setelah blog section.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SectionAlert currentSection={section} label="Banner ads section" section="bannerAds" status={status} />
            <form action={updateBannerAdsSectionAction} className="space-y-5">
              <input name="imageAssetId" type="hidden" value={draft.bannerAds.imageAssetId ?? ""} />
              <input name="imageUrl" type="hidden" value={draft.bannerAds.imageUrl ?? ""} />
              <input name="isVisible" type="hidden" value={String(draft.bannerAds.isVisible)} />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Judul"
                  name="title"
                  onChange={(value) => updateSection("bannerAds", { title: value })}
                  value={draft.bannerAds.title}
                />
                <TextField
                  label="Label Tombol"
                  name="buttonLabel"
                  onChange={(value) => updateSection("bannerAds", { buttonLabel: value })}
                  value={draft.bannerAds.buttonLabel}
                />
              </div>
              <TextAreaField
                label="Deskripsi"
                name="description"
                onChange={(value) => updateSection("bannerAds", { description: value })}
                rows={3}
                value={draft.bannerAds.description}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Nomor WhatsApp Admin"
                  name="whatsappNumber"
                  onChange={(value) => updateSection("bannerAds", { whatsappNumber: value })}
                  value={draft.bannerAds.whatsappNumber ?? ""}
                />
                <TextField
                  label="Alt Banner"
                  name="imageAlt"
                  onChange={(value) => updateSection("bannerAds", { imageAlt: value })}
                  value={draft.bannerAds.imageAlt ?? ""}
                />
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
                <input
                  checked={draft.bannerAds.isVisible}
                  className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-600"
                  onChange={(event) => updateSection("bannerAds", { isVisible: event.target.checked })}
                  type="checkbox"
                />
                <span className="text-sm font-medium text-stone-900">Tampilkan banner ads section di homepage</span>
              </label>
              <PaletteOnlyBackgroundFields
                description="Banner ads section memakai palette background untuk area section. Gambar banner utama tetap diatur terpisah di bawah."
                onChange={(background) => updateSection("bannerAds", { background })}
                value={draft.bannerAds.background}
              />
              <HomepageAssetPicker
                assets={library}
                cloudinaryEnabled={cloudinaryEnabled}
                label="Banner Kaos"
                onAssetsChange={setLibrary}
                onChange={(value) => updateSection("bannerAds", { imageAssetId: value.assetId, imageUrl: value.imageUrl })}
                previewAspectClassName="aspect-[21/8]"
                value={{
                  assetId: draft.bannerAds.imageAssetId,
                  imageUrl: draft.bannerAds.imageUrl,
                }}
              />
              <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <p className="text-sm font-semibold text-stone-900">Panduan ukuran banner</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-stone-200 bg-white px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Desktop</p>
                    <p className="mt-2 text-sm font-medium text-stone-900">2100 x 800 px</p>
                    <p className="mt-1 text-xs leading-6 text-stone-500">
                      Rasio utama memanjang sekitar 21:8 agar banner memenuhi section desktop dengan padding tipis.
                    </p>
                  </div>
                  <div className="rounded-lg border border-stone-200 bg-white px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Mobile</p>
                    <p className="mt-2 text-sm font-medium text-stone-900">1200 x 900 px</p>
                    <p className="mt-1 text-xs leading-6 text-stone-500">
                      Simpan area penting di tengah supaya tetap aman saat banner dipotong lebih tinggi pada layar mobile.
                    </p>
                  </div>
                </div>
              </div>
              <Button type="submit">Simpan Banner Ads Section</Button>
            </form>
          </CardContent>
        </Card>

        <Card className={cn(adminCardClass, "scroll-mt-24")} id="footer-section">
          <CardHeader>
            <CardTitle>Footer Section</CardTitle>
            <CardDescription>Atur footer, link, dan background penutup homepage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SectionAlert currentSection={section} label="Footer section" section="footer" status={status} />
            <form action={updateFooterSectionAction} className="space-y-5">
              <input name="linkCount" type="hidden" value={draft.footer.guideLinks.length} />
              <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <p className="text-sm font-semibold text-stone-900">Ukuran logo footer</p>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-stone-200 bg-white px-4 py-4">
                    <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                      <Smartphone className="h-4 w-4" />
                      Mobile
                    </div>
                    <NumberField
                      label="Lebar logo mobile (px)"
                      name="logoMobileWidth"
                      onChange={(value) =>
                        updateSection("footer", {
                          logoSize: {
                            ...draft.footer.logoSize,
                            mobileWidth: value,
                          },
                        })
                      }
                      value={draft.footer.logoSize.mobileWidth}
                    />
                  </div>
                  <div className="rounded-lg border border-stone-200 bg-white px-4 py-4">
                    <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                      <Monitor className="h-4 w-4" />
                      Desktop
                    </div>
                    <NumberField
                      label="Lebar logo desktop (px)"
                      name="logoDesktopWidth"
                      onChange={(value) =>
                        updateSection("footer", {
                          logoSize: {
                            ...draft.footer.logoSize,
                            desktopWidth: value,
                          },
                        })
                      }
                      value={draft.footer.logoSize.desktopWidth}
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs leading-6 text-stone-500">
                  Rekomendasi aman: mobile 160 - 200 px dan desktop 190 - 230 px supaya footer
                  tetap rapi dan tidak terlalu dominan.
                </p>
              </div>
              <TextAreaField
                label="Deskripsi Footer"
                name="description"
                onChange={(value) => updateSection("footer", { description: value })}
                rows={5}
                value={draft.footer.description}
              />
              <TextField
                label="Copyright"
                name="copyright"
                onChange={(value) => updateSection("footer", { copyright: value })}
                value={draft.footer.copyright}
              />
              <PaletteOnlyBackgroundFields
                description="Footer sekarang memakai tone warna dasar agar konsisten dengan dark/light mode landing. Background image sudah tidak dipakai."
                onChange={(background) => updateSection("footer", { background })}
                value={draft.footer.background}
              />
              <div className="space-y-4">
                {draft.footer.guideLinks.map((link, index) => (
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-4" key={`${link.label}-${index}`}>
                    <p className="text-sm font-semibold text-stone-900">Footer Link {index + 1}</p>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <TextField
                        label="Label"
                        name={`link-${index}-label`}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            footer: {
                              ...current.footer,
                              guideLinks: current.footer.guideLinks.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, label: value } : entry,
                              ),
                            },
                          }))
                        }
                        value={link.label}
                      />
                      <TextField
                        label="Href"
                        name={`link-${index}-href`}
                        onChange={(value) =>
                          setDraft((current) => ({
                            ...current,
                            footer: {
                              ...current.footer,
                              guideLinks: current.footer.guideLinks.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, href: value } : entry,
                              ),
                            },
                          }))
                        }
                        value={link.href}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button type="submit">Simpan Footer Section</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="xl:sticky xl:top-8 xl:self-start">
        <Card className={cn(adminCardClass, "overflow-hidden xl:flex xl:max-h-[calc(100vh-7rem)] xl:flex-col")}>
          <CardHeader className="border-b border-stone-200">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  Draft di form kiri akan langsung muncul di preview ini sebelum disimpan.
                </CardDescription>
              </div>
              <div className="inline-flex rounded-xl border border-stone-200 bg-stone-50 p-1">
                <Button
                  className={cn(
                    "rounded-[14px]",
                    previewDevice === "desktop"
                      ? "bg-[var(--admin-solid-button-bg)] text-white shadow-[var(--admin-solid-button-shadow)] hover:bg-[var(--admin-solid-button-hover-bg)]"
                      : "admin-soft-button text-[var(--admin-text-secondary)] shadow-none hover:text-[var(--admin-text-primary)]",
                  )}
                  onClick={() => {
                    setPreviewDevice("desktop");
                    setPreviewPreset("desktop-1440");
                  }}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <Monitor className="h-4 w-4" />
                  Desktop
                </Button>
                <Button
                  className={cn(
                    "rounded-[14px]",
                    previewDevice === "mobile"
                      ? "bg-[var(--admin-solid-button-bg)] text-white shadow-[var(--admin-solid-button-shadow)] hover:bg-[var(--admin-solid-button-hover-bg)]"
                      : "admin-soft-button text-[var(--admin-text-secondary)] shadow-none hover:text-[var(--admin-text-primary)]",
                  )}
                  onClick={() => {
                    setPreviewDevice("mobile");
                    setPreviewPreset("mobile-390");
                  }}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-transparent p-4 xl:min-h-0 xl:flex-1 xl:overflow-hidden">
            <div className="space-y-3 xl:flex xl:h-full xl:flex-col">
              <div className="admin-glass-row flex flex-col gap-3 rounded-[24px] border-transparent px-4 py-3 text-xs font-medium text-[var(--admin-text-muted)] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span>
                    {previewDevice === "desktop" ? "Desktop Landscape" : "Mobile Portrait"}
                  </span>
                  <select
                    className="h-9 rounded-[16px] border border-transparent px-3 text-xs font-medium outline-none transition"
                    onChange={(event) => setPreviewPreset(event.target.value as PreviewPresetKey)}
                    value={previewPreset}
                  >
                    {previewPresetGroups[previewDevice].map((presetKey) => (
                      <option key={presetKey} value={presetKey}>
                        {previewPresets[presetKey].label}
                      </option>
                    ))}
                  </select>
                </div>
                <span>
                  {previewPresets[previewPreset].width} x {previewPresets[previewPreset].height}
                </span>
              </div>
              <div className="admin-glass-row max-h-[84vh] overflow-auto rounded-[28px] border-transparent p-3 xl:min-h-0 xl:flex-1">
                <PreviewViewport content={draft} preset={previewPreset} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
