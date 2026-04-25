"use client";

import { useRef } from "react";
import { features } from "@/components/landing/data";
import { SectionBackgroundLayer } from "@/components/landing/section-background-layer";
import { useLightLandingMotion } from "@/components/landing/use-light-landing-motion";
import { Reveal } from "@/components/ui/reveal";
import type { BenefitsContent } from "@/components/landing/types";

type BenefitsSectionProps = {
  content: BenefitsContent;
};

export function BenefitsSection({ content }: BenefitsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lightMotion = useLightLandingMotion();

  return (
    <section className="relative overflow-hidden py-20 text-[var(--landing-text-primary)] sm:py-24" ref={sectionRef}>
      <div className="absolute inset-0">
        <SectionBackgroundLayer
          config={content.background}
          fallbackOverlayColor="#070a12"
          fallbackOverlayOpacity={74}
          fallbackPreset="dark-slate-cinematic"
        />
      </div>
      <div className="absolute left-[-6%] top-10 h-40 w-40 rounded-full blur-[72px] sm:h-52 sm:w-52 sm:blur-[88px]" style={{ background: "color-mix(in srgb, var(--landing-accent-blue) 10%, transparent)" }} />
      <div className="absolute bottom-0 right-[-8%] h-48 w-48 rounded-full blur-[78px] sm:h-60 sm:w-60 sm:blur-[92px]" style={{ background: "color-mix(in srgb, var(--landing-accent-gold) 10%, transparent)" }} />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <Reveal className="mx-auto max-w-5xl text-center" distance={lightMotion ? 14 : 24} duration={lightMotion ? 0.72 : 1.12}>
          <p className="text-lg font-semibold text-[var(--landing-accent-gold)] sm:text-[2.2rem]">
            {content.heading}
          </p>
          <p className="mx-auto mt-4 max-w-4xl text-base leading-8 text-[var(--landing-text-secondary)] sm:text-[1.05rem]">
            {content.description}
          </p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-3">
          {content.items.map((feature, index) => {
            const Icon = features[index % features.length]?.icon ?? features[0].icon;

            return (
              <Reveal
                className="landing-glass-dark-panel rounded-[24px] px-6 py-8 text-center sm:px-7"
                delay={index * 0.08}
                direction="right"
                distance={lightMotion ? 18 : 32}
                duration={lightMotion ? 0.76 : 1.02}
                hover={!lightMotion}
                key={feature.title}
              >
                <span className="inline-flex h-16 w-16 items-center justify-center text-[#ffbf00]">
                  <Icon className="h-12 w-12" strokeWidth={2.1} />
                </span>
                <h3 className="mt-5 text-[1.9rem] font-semibold leading-tight text-[var(--landing-text-primary)]">
                  {feature.title}
                </h3>
                <p className="mt-4 text-lg leading-8 text-[var(--landing-text-secondary)]">{feature.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
