import type { CSSProperties } from "react";
import type { BackgroundPaletteKey, SectionBackgroundConfig } from "@/components/landing/types";

type SectionBackgroundLayerProps = {
  config: SectionBackgroundConfig;
  fallbackImageUrl?: string;
  fallbackOverlayColor?: string;
  fallbackOverlayOpacity?: number;
  fallbackPreset: BackgroundPaletteKey;
  imageClassName?: string;
  overlayClassName?: string;
  paletteClassName?: string;
};

export function SectionBackgroundLayer({
  config,
  fallbackImageUrl,
  fallbackOverlayColor,
  fallbackOverlayOpacity = 58,
  fallbackPreset,
  imageClassName,
  overlayClassName,
  paletteClassName,
}: SectionBackgroundLayerProps) {
  void config;
  void fallbackImageUrl;
  void fallbackOverlayColor;
  void fallbackOverlayOpacity;
  void fallbackPreset;
  const className = imageClassName ?? overlayClassName ?? paletteClassName ?? "absolute inset-0";

  return (
    <div className={`${className} landing-section-background`} style={{} as CSSProperties} />
  );
}
