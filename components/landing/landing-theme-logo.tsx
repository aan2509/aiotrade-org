"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { landingImages } from "@/components/landing/data";
import { cn } from "@/lib/utils";

type LandingThemeLogoProps = {
  alt?: string;
  className?: string;
  darkClassName?: string;
  lightClassName?: string;
  priority?: boolean;
  sizes: string;
  style?: CSSProperties;
};

export function LandingThemeLogo({
  alt = "AIOTrade",
  className,
  darkClassName,
  lightClassName,
  priority = false,
  sizes,
  style,
}: LandingThemeLogoProps) {
  return (
    <span className={cn("relative inline-flex max-w-full shrink-0 items-center", className)} style={style}>
      <Image
        alt={alt}
        className={cn("landing-theme-logo landing-theme-logo-light h-auto w-full max-w-full object-contain", lightClassName)}
        priority={priority}
        sizes={sizes}
        src={landingImages.logoLightImage}
      />
      <Image
        alt={alt}
        className={cn("landing-theme-logo landing-theme-logo-dark absolute inset-0 h-auto w-full max-w-full object-contain", darkClassName)}
        priority={priority}
        sizes={sizes}
        src={landingImages.logoDarkImage}
      />
    </span>
  );
}
