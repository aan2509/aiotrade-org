"use client";

import { BookOpen } from "lucide-react";
import { LandingCtaButton } from "@/components/landing/landing-cta-button";
import { SectionBackgroundLayer } from "@/components/landing/section-background-layer";
import { useLightLandingMotion } from "@/components/landing/use-light-landing-motion";
import type { GuideContent } from "@/components/landing/types";
import { Reveal } from "@/components/ui/reveal";

type GuideSectionProps = {
  content: GuideContent;
};

export function GuideSection({ content }: GuideSectionProps) {
  const lightMotion = useLightLandingMotion();

  return (
    <section className="relative overflow-hidden py-20" id="panduan">
      <SectionBackgroundLayer
        config={content.background}
        fallbackOverlayColor="#ffffff"
        fallbackOverlayOpacity={20}
        fallbackPreset="sky-blue-accent"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(37,99,235,0.05)_0%,rgba(37,99,235,0)_100%)]" />
      <div className="pointer-events-none absolute left-[-5%] top-24 h-40 w-40 rounded-full bg-[#76a9ff]/10 blur-[70px] sm:h-48 sm:w-48 sm:blur-[86px]" />
      <div className="pointer-events-none absolute bottom-0 right-[-8%] h-48 w-48 rounded-full bg-[#ffd673]/16 blur-[76px] sm:h-60 sm:w-60 sm:blur-[92px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <Reveal className="mx-auto max-w-4xl text-center" distance={lightMotion ? 14 : 24} duration={lightMotion ? 0.72 : 1.12}>
          <p className="text-[0.96rem] font-semibold tracking-[-0.02em] text-[var(--landing-accent-blue)] sm:text-[1.18rem] lg:text-[1.3rem]">
            {content.eyebrow}
          </p>
          <h2 className="mt-5 text-[2.35rem] font-semibold leading-none tracking-[-0.045em] text-[var(--landing-accent-gold)] sm:text-[3.45rem] lg:text-[4.45rem]">
            {content.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {content.steps.map((step, index) => (
            <Reveal
              className="landing-glass-card landing-glass-card-hover rounded-[28px] px-7 py-9 text-center"
              delay={index * 0.08}
              direction="right"
              distance={lightMotion ? 18 : 32}
              duration={lightMotion ? 0.78 : 1.02}
              hover={!lightMotion}
              key={step.number}
            >
              <p className="text-[3.15rem] font-bold leading-none tracking-[-0.05em] text-[var(--landing-accent-blue)] sm:text-[3.8rem] lg:text-[4.7rem]">
                {step.number}.
              </p>
              <h3 className="mt-4 text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--landing-text-primary)] sm:text-[1.75rem] lg:text-[1.95rem]">
                {step.title}
              </h3>
              <p className="mx-auto mt-5 max-w-[21rem] text-[0.94rem] leading-[1.68] text-[var(--landing-text-secondary)] sm:text-[0.98rem] lg:text-[1.02rem]">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center" delay={0.12} distance={lightMotion ? 12 : 24} duration={lightMotion ? 0.7 : 1}>
          <LandingCtaButton
            className="landing-guide-cta"
            href="/guide"
            icon={BookOpen}
            label={content.buttonLabel}
            palette={content.buttonPalette}
          />
        </Reveal>
      </div>
    </section>
  );
}
