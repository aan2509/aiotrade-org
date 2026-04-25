"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { navItems as defaultNavItems } from "@/components/landing/data";
import { LandingThemeLogo } from "@/components/landing/landing-theme-logo";
import { SectionBackgroundLayer } from "@/components/landing/section-background-layer";
import type { FooterContent, NavItem } from "@/components/landing/types";
import { Reveal } from "@/components/ui/reveal";
import type { SiteLanguage } from "@/lib/site-language";

function buildResponsiveLogoWidth(mobileWidth: number, desktopWidth: number) {
  return {
    width: `min(100%, clamp(${mobileWidth}px, 18vw, ${desktopWidth}px))`,
  };
}

type FooterSectionProps = {
  content: FooterContent;
  ctaExternal?: boolean;
  ctaHref: string;
  currentLanguage?: SiteLanguage;
  navItems?: NavItem[];
  previewMode?: boolean;
};

export function FooterSection({
  content,
  currentLanguage = "id",
  ctaExternal = false,
  ctaHref,
  navItems = defaultNavItems,
  previewMode = false,
}: FooterSectionProps) {
  const guideTitle = currentLanguage === "en" ? "User Guide" : "Panduan Pengguna";
  const quickAccessTitle = currentLanguage === "en" ? "Quick Access" : "Akses Cepat";

  return (
    <footer className="relative overflow-hidden py-18 text-[var(--landing-text-primary)] sm:py-20">
      <SectionBackgroundLayer
        config={content.background}
        fallbackOverlayColor="#121a2d"
        fallbackOverlayOpacity={22}
        fallbackPreset="dark-slate-cinematic"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--landing-accent-blue)_10%,transparent)_0%,transparent_34%)]" />
      <div className="pointer-events-none absolute bottom-[-5rem] left-[-3rem] h-44 w-44 rounded-full blur-[74px] sm:h-56 sm:w-56 sm:blur-[88px]" style={{ background: "color-mix(in srgb, var(--landing-accent-blue) 10%, transparent)" }} />
      <div className="pointer-events-none absolute right-[-4rem] top-[-2rem] h-40 w-40 rounded-full blur-[70px] sm:h-52 sm:w-52 sm:blur-[84px]" style={{ background: "color-mix(in srgb, var(--landing-accent-gold) 8%, transparent)" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.45fr_0.72fr_0.52fr] lg:gap-14">
          <Reveal className="mx-auto max-w-[36rem] text-center lg:mx-0 lg:text-left">
            <Link className="inline-flex items-center justify-center lg:justify-start" href="#top">
              <LandingThemeLogo
                className="mx-auto lg:mx-0"
                sizes="(max-width: 640px) 176px, 208px"
                style={buildResponsiveLogoWidth(
                  content.logoSize.mobileWidth,
                  content.logoSize.desktopWidth,
                )}
              />
            </Link>
            <p className="mt-5 max-w-[35rem] text-[1.02rem] leading-[1.72] text-[var(--landing-text-secondary)] sm:text-[1.06rem]">
              {content.description}
            </p>

            
          </Reveal>

          <Reveal className="lg:justify-self-center lg:pt-2" delay={0.08}>
            <h3 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-[var(--landing-accent-gold)]">
              {guideTitle}
            </h3>
            <ul className="mt-5 space-y-4 text-[1.06rem] leading-none text-[var(--landing-text-secondary)]">
              {content.guideLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    className="transition duration-300 hover:text-[var(--landing-text-primary)]"
                    href={item.href === "/signup" ? ctaHref : item.href}
                    rel={item.href === "/signup" && ctaExternal ? "noreferrer" : undefined}
                    target={item.href === "/signup" && ctaExternal ? "_blank" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="lg:justify-self-end lg:pt-2" delay={0.12}>
            <h3 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-[var(--landing-accent-gold)]">
              {quickAccessTitle}
            </h3>
            <ul className="mt-5 space-y-4 text-[1.06rem] leading-none text-[var(--landing-text-secondary)]">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link className="transition duration-300 hover:text-[var(--landing-text-primary)]" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="mt-16 flex items-center justify-center text-center text-[1.02rem] text-[var(--landing-text-muted)] sm:mt-18">
          <p>{content.copyright}</p>
        </Reveal>
      </div>

      <Reveal
        className={previewMode ? "absolute bottom-5 right-5 z-30" : "fixed bottom-5 right-5 z-30"}
        delay={0.16}
      >
        <Link
          aria-label="Kembali ke atas"
          className="landing-glass-button inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--landing-text-primary)] transition duration-300"
          href="#top"
        >
          <ArrowUp className="h-5 w-5" />
        </Link>
      </Reveal>
    </footer>
  );
}
