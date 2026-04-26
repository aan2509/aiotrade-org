"use client";

import { useRef } from "react";
import Image from "next/image";
import { LogIn } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { landingImages, partnerLogos } from "@/components/landing/data";
import { LandingCtaButton } from "@/components/landing/landing-cta-button";
import { LandingThemeLogo } from "@/components/landing/landing-theme-logo";
import { SectionBackgroundLayer } from "@/components/landing/section-background-layer";
import { TickerStrip } from "@/components/landing/ticker-strip";
import { useLightLandingMotion } from "@/components/landing/use-light-landing-motion";
import { Reveal } from "@/components/ui/reveal";
import type { OverviewContent } from "@/components/landing/types";

const duplicatedPartnerLogos = [...partnerLogos, ...partnerLogos];

function buildResponsiveLogoWidth(mobileWidth: number, desktopWidth: number) {
  return {
    width: `min(100%, clamp(${mobileWidth}px, 24vw, ${desktopWidth}px))`,
  };
}

function buildResponsiveBrandTextSize(mobileSize: number, desktopSize: number) {
  return {
    fontSize: `clamp(${mobileSize}px, 8vw, ${desktopSize}px)`,
  };
}

type OverviewSectionProps = {
  content: OverviewContent;
  ctaExternal?: boolean;
  ctaHref: string;
  previewMode?: boolean;
};

export function OverviewSection({
  content,
  ctaExternal = false,
  ctaHref,
  previewMode = false,
}: OverviewSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const lightMotion = useLightLandingMotion();
  const brandText = (content.brandText?.trim() || `${content.titleBlue}${content.titleWhite}`).replace(/\s+/g, "");
  const accentLength = Math.min(
    Math.max(content.brandAccentLength ?? content.titleBlue.length, 1),
    brandText.length,
  );
  const brandAccentText = brandText.slice(0, accentLength);
  const brandRestText = brandText.slice(accentLength);
  const brandTextSize = content.brandTextSize ?? {
    desktopSize: 104,
    mobileSize: 48,
  };
  const brandAccentColor = content.brandAccentColor ?? "var(--landing-accent-blue)";
  const brandRestColor = content.brandRestColor ?? "var(--landing-text-primary)";

  return (
    <section className="relative overflow-hidden text-[var(--landing-text-primary)]" id="fitur" ref={sectionRef}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <SectionBackgroundLayer
          config={content.background}
          fallbackOverlayColor="#070a12"
          fallbackOverlayOpacity={74}
          fallbackPreset="dark-slate-cinematic"
        />
        <div className="landing-hero-ambient absolute inset-0" />
        <div
          className="absolute left-[-12%] top-10 h-48 w-48 rounded-full blur-[76px] sm:h-64 sm:w-64 sm:blur-[100px]"
          style={{ background: "color-mix(in srgb, var(--landing-accent-blue) 12%, transparent)" }}
        />
        <div
          className="absolute bottom-4 right-[-10%] h-52 w-52 rounded-full blur-[80px] sm:h-72 sm:w-72 sm:blur-[108px]"
          style={{ background: "color-mix(in srgb, var(--landing-accent-gold) 12%, transparent)" }}
        />
        <div className="landing-hero-grid pointer-events-none absolute inset-0 opacity-50" />
      </div>

      <motion.div
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        className="relative mx-auto flex min-h-[calc(100svh-106px)] max-w-7xl flex-col justify-center px-4 pb-8 pt-6 sm:min-h-[calc(100svh-70px)] sm:px-8 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10"
        initial={prefersReducedMotion ? false : { opacity: 1, y: lightMotion ? 8 : 14 }}
        transition={{ duration: lightMotion ? 0.45 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="landing-hero-shell relative flex flex-1 flex-col justify-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_42%,color-mix(in_srgb,var(--landing-accent-blue)_10%,transparent),transparent_28%),radial-gradient(circle_at_78%_28%,color-mix(in_srgb,var(--landing-accent-gold)_10%,transparent),transparent_28%)]" />
          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-12">
            <div className="relative flex min-h-[240px] items-center justify-center lg:min-h-0 lg:items-start lg:justify-start">
              <div className="landing-hero-phone-wrap relative mx-auto w-full max-w-[285px] sm:max-w-[440px] lg:mx-0 lg:max-w-[560px] lg:-ml-3">
                <div className="landing-hero-phone-glow absolute inset-x-[8%] bottom-6 h-16 rounded-full sm:bottom-8 sm:h-24" />
                <Image
                  alt="Mockup aplikasi mobile AIOTrade berisi trade history dan profit."
                  className="relative z-10 h-auto w-full drop-shadow-[0_28px_48px_rgba(0,0,0,0.22)] sm:drop-shadow-[0_38px_68px_rgba(0,0,0,0.26)] lg:origin-left lg:scale-[1.02]"
                  priority
                  sizes="(max-width: 1024px) 100vw, 560px"
                  src={landingImages.phoneImage}
                />
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-[24rem] flex-col items-center text-center lg:max-w-none lg:items-start lg:text-left">
              <Reveal className="w-full" delay={0.02} distance={lightMotion ? 14 : 24} duration={lightMotion ? 0.7 : 1.12} stable>
                <div className="w-full max-w-[22rem] mx-auto sm:max-w-[31rem] lg:mx-0 lg:max-w-[35rem]">
                  <div className="flex justify-center lg:justify-start">
                    {content.brandDisplayMode === "text" ? (
                      <h2
                        aria-label={brandText}
                        className="leading-none font-black text-[var(--landing-text-primary)]"
                        style={buildResponsiveBrandTextSize(
                          brandTextSize.mobileSize,
                          brandTextSize.desktopSize,
                        )}
                      >
                        <span style={{ color: brandAccentColor }}>{brandAccentText}</span>
                        <span style={{ color: brandRestColor }}>{brandRestText}</span>
                      </h2>
                    ) : (
                      <LandingThemeLogo
                        className="landing-overview-logo-image"
                        sizes="(max-width: 640px) 188px, (max-width: 1024px) 228px, 274px"
                        style={buildResponsiveLogoWidth(
                          content.logoSize.mobileWidth,
                          content.logoSize.desktopWidth,
                        )}
                      />
                    )}
                  </div>
                  <p className="landing-overview-description mx-auto mt-5 max-w-[21rem] text-[0.92rem] leading-[1.86] text-[var(--landing-text-secondary)] sm:mt-6 sm:max-w-[27rem] sm:text-[1.04rem] sm:leading-[1.94] lg:mx-0 lg:max-w-[31rem] lg:text-[1.12rem] lg:leading-[2]">
                    {content.description}
                  </p>
                </div>
              </Reveal>

              <Reveal
                className="relative mt-8 w-full max-w-[22rem] overflow-hidden rounded-[24px] sm:mt-9 sm:max-w-none"
                delay={lightMotion ? 0.08 : 0.14}
                distance={lightMotion ? 14 : 24}
                duration={lightMotion ? 0.72 : 1.12}
                stable
              >
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-[linear-gradient(90deg,var(--landing-page-bg)_0%,rgba(255,255,255,0)_100%)] sm:w-14" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-[linear-gradient(270deg,var(--landing-page-bg)_0%,rgba(255,255,255,0)_100%)] sm:w-14" />
                <motion.div
                  animate={prefersReducedMotion ? { x: "0%" } : { x: ["0%", "-50%"] }}
                  className="flex w-max items-stretch gap-3 py-1"
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : {
                          duration: lightMotion ? 34 : 28,
                          ease: "linear",
                          repeat: Number.POSITIVE_INFINITY,
                        }
                  }
                >
                  {duplicatedPartnerLogos.map((logo, index) => (
                    <div
                      className="landing-glass-card flex min-h-[72px] min-w-[128px] items-center justify-center rounded-[18px] px-4 py-3.5 sm:min-h-[80px] sm:min-w-[164px] sm:px-5"
                      key={`${logo.alt}-${index}`}
                    >
                      <Image
                        alt={logo.alt}
                        className="h-auto max-h-7 w-auto object-contain sm:max-h-9"
                        src={logo.src}
                      />
                    </div>
                  ))}
                </motion.div>
              </Reveal>

              <Reveal
                className="mt-8 flex w-full justify-center sm:mt-9 lg:justify-start"
                delay={lightMotion ? 0.12 : 0.18}
                distance={lightMotion ? 14 : 24}
                duration={lightMotion ? 0.72 : 1.12}
                stable
              >
                <LandingCtaButton
                  className="landing-overview-cta w-full max-w-[224px] sm:min-w-[304px] sm:max-w-none sm:w-auto"
                  external={ctaExternal}
                  href={content.ctaHref || ctaHref}
                  icon={LogIn}
                  label={content.ctaLabel}
                  palette={content.buttonPalette}
                />
              </Reveal>
            </div>
          </div>

          <div className="relative z-10 mt-10 sm:mt-12">
            <TickerStrip
              className="landing-hero-ticker rounded-none bg-transparent px-0 py-0"
              previewMode={previewMode}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
