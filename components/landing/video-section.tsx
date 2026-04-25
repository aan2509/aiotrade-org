"use client";

import { useMemo } from "react";
import { SectionBackgroundLayer } from "@/components/landing/section-background-layer";
import { useLightLandingMotion } from "@/components/landing/use-light-landing-motion";
import type { VideoSectionContent } from "@/components/landing/types";
import { Reveal } from "@/components/ui/reveal";
import { normalizeMemberGuideVideoUrl } from "@/lib/member-guide-utils";

type VideoSectionProps = {
  content: VideoSectionContent;
};

export function VideoSection({ content }: VideoSectionProps) {
  const lightMotion = useLightLandingMotion();

  const normalizedEmbedUrl = useMemo(
    () => normalizeMemberGuideVideoUrl(content.embedUrl),
    [content.embedUrl],
  );

  if (!content.isVisible || !normalizedEmbedUrl) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-20 sm:py-24" id="video">
      <SectionBackgroundLayer
        config={content.background}
        fallbackOverlayColor="#0b1322"
        fallbackOverlayOpacity={34}
        fallbackPreset="dark-slate-cinematic"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--landing-accent-blue)_10%,transparent),transparent_34%)]" />
      <div className="pointer-events-none absolute left-[-10%] top-20 h-48 w-48 rounded-full blur-[76px] sm:h-60 sm:w-60 sm:blur-[92px]" style={{ background: "color-mix(in srgb, var(--landing-accent-blue) 10%, transparent)" }} />
      <div className="pointer-events-none absolute bottom-0 right-[-8%] h-48 w-48 rounded-full blur-[76px] sm:h-60 sm:w-60 sm:blur-[92px]" style={{ background: "color-mix(in srgb, var(--landing-accent-gold) 10%, transparent)" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <Reveal className="mx-auto max-w-4xl text-center" distance={lightMotion ? 14 : 24} duration={lightMotion ? 0.72 : 1.12}>
          <p className="text-[0.96rem] font-semibold tracking-[-0.02em] text-[var(--landing-accent-blue)] sm:text-[1.18rem] lg:text-[1.3rem]">
            {content.eyebrow}
          </p>
          <h2 className="mt-5 text-[2.35rem] font-semibold leading-none tracking-[-0.045em] text-[var(--landing-text-primary)] sm:text-[3.45rem] lg:text-[4.45rem]">
            {content.title}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-[0.94rem] leading-[1.72] text-[var(--landing-text-secondary)] sm:text-[1.02rem] lg:text-[1.08rem]">
            {content.description}
          </p>
        </Reveal>

        <Reveal className="mt-12" delay={0.08} direction="right" distance={lightMotion ? 18 : 34} duration={lightMotion ? 0.76 : 1.04}>
          <div className="landing-glass-dark-panel overflow-hidden rounded-[30px]">
            <div className="p-4 sm:p-6">
              <div className="relative overflow-hidden rounded-[26px] border border-[var(--landing-dark-panel-border)] bg-[var(--landing-page-bg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_22px_48px_rgba(2,6,23,0.28)]">
                <div className="aspect-video">
                  <iframe
                    allowFullScreen
                    className="h-full w-full"
                    loading="lazy"
                    src={normalizedEmbedUrl}
                    title={content.title}
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
