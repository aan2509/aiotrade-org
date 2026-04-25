"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import type { ButtonPaletteKey } from "@/components/landing/types";
import { cn } from "@/lib/utils";

type LandingCtaButtonProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  className?: string;
  external?: boolean;
  palette?: ButtonPaletteKey;
  size?: "default" | "compact";
};

export function getLandingButtonPaletteClass(palette: ButtonPaletteKey) {
  return palette === "glass-default" ? undefined : `landing-button-palette-${palette}`;
}

export function LandingCtaButton({
  href,
  label,
  icon: Icon,
  className,
  external = false,
  palette = "glass-default",
  size = "default",
}: LandingCtaButtonProps) {
  const router = useRouter();
  const isInternalHref = href.startsWith("/") || href.startsWith("#");
  const shouldUseAnchor = external || !isInternalHref;

  useEffect(() => {
    if (shouldUseAnchor || !href.startsWith("/")) {
      return;
    }

    router.prefetch(href);
  }, [href, router, shouldUseAnchor]);

  const commonClassName = cn(
    "landing-glass-button group relative inline-flex touch-manipulation items-center justify-center gap-3 overflow-hidden rounded-[18px] text-[var(--landing-accent-blue)] transition-all duration-300",
    "active:scale-[0.985] hover:-translate-y-0.5",
    size === "default"
      ? "min-h-12 px-6 py-3 text-base font-semibold sm:min-h-14 sm:px-8 sm:py-4 sm:text-lg"
      : "min-h-11 px-5 py-2.5 text-[0.98rem] font-semibold sm:min-h-12 sm:px-6 sm:text-base",
    getLandingButtonPaletteClass(palette),
    className,
  );

  const content = (
    <>
      <span className="pointer-events-none absolute inset-0 rounded-[18px] bg-[linear-gradient(180deg,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0.04)_100%)] opacity-100 transition duration-300" />
      <span className="pointer-events-none absolute inset-0 rounded-[18px] bg-[linear-gradient(115deg,transparent_12%,rgba(255,255,255,0.34)_46%,transparent_84%)] opacity-0 transition duration-500 group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.72)_50%,rgba(255,255,255,0)_100%)]" />
      <span className="relative z-10 inline-flex items-center gap-3">
        <Icon className="pointer-events-none h-5 w-5 transition duration-300 group-hover:scale-110" />
        {label}
      </span>
    </>
  );

  if (shouldUseAnchor) {
    return (
      <a
        className={commonClassName}
        href={href}
        rel={external ? "noreferrer" : undefined}
        target={external ? "_blank" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      className={commonClassName}
      href={href}
      onMouseEnter={() => {
        if (href.startsWith("/")) {
          router.prefetch(href);
        }
      }}
      onTouchStart={() => {
        if (href.startsWith("/")) {
          router.prefetch(href);
        }
      }}
      prefetch
    >
      {content}
    </Link>
  );
}
