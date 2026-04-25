import { z } from "zod";
import type {
  BackgroundPaletteKey,
  ImageBackgroundConfig,
  PaletteBackgroundConfig,
  SectionBackgroundConfig,
} from "@/components/landing/types";

type BackgroundPresetDefinition = {
  accent: string;
  base: string;
  description: string;
  glow: string;
  label: string;
  overlay: string;
};

const hexColorPattern = /^#(?:[0-9a-fA-F]{6})$/;

export const homepageBackgroundPresetOrder: BackgroundPaletteKey[] = [
  "dark-navy",
  "warm-ivory",
  "gold-accent",
  "sky-blue-accent",
  "dark-slate-cinematic",
];

export const homepageBackgroundPresets: Record<
  BackgroundPaletteKey,
  BackgroundPresetDefinition
> = {
  "dark-navy": {
    accent: "#10a7ff",
    base: "#0f1728",
    description: "Gelap, fokus, dan paling dekat dengan visual AIOTrade saat ini.",
    glow: "#0b4d88",
    label: "Dark Navy",
    overlay: "#07101d",
  },
  "warm-ivory": {
    accent: "#f6be4f",
    base: "#f4f2ec",
    description: "Terang dan hangat untuk section informatif seperti harga dan FAQ.",
    glow: "#f1dfae",
    label: "Warm Ivory",
    overlay: "#f8f6f0",
  },
  "gold-accent": {
    accent: "#ffc84a",
    base: "#3d2b10",
    description: "Latar hangat dengan nuansa emas untuk section yang ingin terasa premium.",
    glow: "#7c5a1b",
    label: "Gold Accent",
    overlay: "#241708",
  },
  "sky-blue-accent": {
    accent: "#58a6ff",
    base: "#eaf4ff",
    description: "Terang dengan nuansa biru yang segar dan sedikit lebih modern.",
    glow: "#a8cbef",
    label: "Sky Blue Accent",
    overlay: "#dcecff",
  },
  "dark-slate-cinematic": {
    accent: "#f6be4f",
    base: "#121a2d",
    description: "Gelap sinematik untuk section penutup atau background image dengan overlay tegas.",
    glow: "#26314b",
    label: "Dark Slate Cinematic",
    overlay: "#0d1322",
  },
};

export const backgroundPaletteKeySchema = z.enum(homepageBackgroundPresetOrder);

const hexColorSchema = z
  .string()
  .trim()
  .regex(hexColorPattern)
  .optional();

export const paletteBackgroundSchema: z.ZodType<PaletteBackgroundConfig> = z.object({
  customHex: hexColorSchema,
  preset: backgroundPaletteKeySchema,
});

export const imageBackgroundSchema: z.ZodType<ImageBackgroundConfig> = z.object({
  assetId: z.string().trim().min(1).optional(),
  imageUrl: z.string().trim().min(1).optional(),
  overlayColor: hexColorSchema,
  overlayOpacity: z.number().min(0).max(100).optional(),
});

export const sectionBackgroundSchema: z.ZodType<SectionBackgroundConfig> = z.object({
  image: imageBackgroundSchema,
  mode: z.enum(["palette", "image"]),
  palette: paletteBackgroundSchema,
});

export function createDefaultSectionBackground(
  preset: BackgroundPaletteKey,
  options?: {
    imageUrl?: string;
    overlayColor?: string;
    overlayOpacity?: number;
  },
): SectionBackgroundConfig {
  return {
    image: {
      assetId: undefined,
      imageUrl: options?.imageUrl,
      overlayColor: normalizeHexColor(options?.overlayColor),
      overlayOpacity: clampOpacity(options?.overlayOpacity),
    },
    mode: options?.imageUrl ? "image" : "palette",
    palette: {
      customHex: undefined,
      preset,
    },
  };
}

export function isValidHexColor(value?: string | null): value is `#${string}` {
  return Boolean(value && hexColorPattern.test(value.trim()));
}

export function normalizeHexColor(value?: string | null, fallback?: string) {
  if (isValidHexColor(value)) {
    return value.trim();
  }

  if (isValidHexColor(fallback)) {
    return fallback.trim();
  }

  return undefined;
}

export function clampOpacity(value?: number | null, fallback = 58) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

export function getBackgroundPreset(
  key?: BackgroundPaletteKey | null,
  fallback: BackgroundPaletteKey = "dark-navy",
) {
  return homepageBackgroundPresets[key ?? fallback] ?? homepageBackgroundPresets[fallback];
}

export function resolvePaletteBaseColor(
  config: SectionBackgroundConfig,
  fallbackPreset: BackgroundPaletteKey,
) {
  return normalizeHexColor(config.palette.customHex) ?? getBackgroundPreset(config.palette.preset, fallbackPreset).base;
}

export function resolvePaletteAccentColor(
  config: SectionBackgroundConfig,
  fallbackPreset: BackgroundPaletteKey,
) {
  return getBackgroundPreset(config.palette.preset, fallbackPreset).accent;
}

export function resolvePaletteGlowColor(
  config: SectionBackgroundConfig,
  fallbackPreset: BackgroundPaletteKey,
) {
  return getBackgroundPreset(config.palette.preset, fallbackPreset).glow;
}

export function resolveImageUrl(
  config: SectionBackgroundConfig,
  fallbackImageUrl?: string,
) {
  return config.mode === "image" ? config.image.imageUrl ?? fallbackImageUrl : undefined;
}

export function resolveOverlayColor(
  config: SectionBackgroundConfig,
  fallbackPreset: BackgroundPaletteKey,
  fallbackColor?: string,
) {
  return (
    normalizeHexColor(config.image.overlayColor) ??
    normalizeHexColor(fallbackColor) ??
    getBackgroundPreset(config.palette.preset, fallbackPreset).overlay
  );
}

export function resolveOverlayOpacity(
  config: SectionBackgroundConfig,
  fallbackOpacity = 58,
) {
  return clampOpacity(config.image.overlayOpacity, fallbackOpacity);
}

export function hexToRgba(hex: string | undefined, opacityPercent: number) {
  const normalized = normalizeHexColor(hex, "#000000") ?? "#000000";
  const clean = normalized.replace("#", "");
  const red = Number.parseInt(clean.slice(0, 2), 16);
  const green = Number.parseInt(clean.slice(2, 4), 16);
  const blue = Number.parseInt(clean.slice(4, 6), 16);
  const alpha = Math.min(1, Math.max(0, opacityPercent / 100));

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function normalizeSectionBackground(
  value: unknown,
  fallback: SectionBackgroundConfig,
  legacyImageUrl?: string,
): SectionBackgroundConfig {
  const fallbackImage = fallback.image ?? createDefaultSectionBackground(fallback.palette.preset).image;
  const source =
    value && typeof value === "object" ? (value as Partial<SectionBackgroundConfig>) : undefined;

  const normalized: SectionBackgroundConfig = {
    image: {
      assetId:
        typeof source?.image?.assetId === "string" && source.image.assetId.trim()
          ? source.image.assetId.trim()
          : fallbackImage.assetId,
      imageUrl:
        typeof source?.image?.imageUrl === "string" && source.image.imageUrl.trim()
          ? source.image.imageUrl.trim()
          : typeof legacyImageUrl === "string" && legacyImageUrl.trim()
            ? legacyImageUrl.trim()
            : fallbackImage.imageUrl,
      overlayColor: normalizeHexColor(source?.image?.overlayColor, fallbackImage.overlayColor),
      overlayOpacity: clampOpacity(source?.image?.overlayOpacity, fallbackImage.overlayOpacity),
    },
    mode: source?.mode === "image" ? "image" : source?.mode === "palette" ? "palette" : fallback.mode,
    palette: {
      customHex: normalizeHexColor(source?.palette?.customHex, fallback.palette.customHex),
      preset: backgroundPaletteKeySchema.safeParse(source?.palette?.preset).success
        ? source!.palette!.preset
        : fallback.palette.preset,
    },
  };

  return sectionBackgroundSchema.parse(normalized);
}
