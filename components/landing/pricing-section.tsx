"use client";

import { LogIn } from "lucide-react";
import { LandingCtaButton } from "@/components/landing/landing-cta-button";
import { SectionBackgroundLayer } from "@/components/landing/section-background-layer";
import { useLightLandingMotion } from "@/components/landing/use-light-landing-motion";
import type { PricingContent } from "@/components/landing/types";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type PricingSectionProps = {
  content: PricingContent;
  ctaExternal?: boolean;
  ctaHref: string;
};

export function PricingSection({ content, ctaExternal = false, ctaHref }: PricingSectionProps) {
  const lightMotion = useLightLandingMotion();

  return (
    <section className="relative overflow-hidden py-20 sm:py-24" id="harga">
      <SectionBackgroundLayer
        config={content.background}
        fallbackOverlayColor="#f8f6f0"
        fallbackOverlayOpacity={24}
        fallbackPreset="warm-ivory"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--landing-accent-gold)_14%,transparent)_0%,transparent_100%)]" />
      <div className="pointer-events-none absolute left-[-10%] top-16 h-44 w-44 rounded-full blur-[72px] sm:h-56 sm:w-56 sm:blur-[88px]" style={{ background: "color-mix(in srgb, var(--landing-accent-gold) 14%, transparent)" }} />
      <div className="pointer-events-none absolute bottom-8 right-[-6%] h-48 w-48 rounded-full blur-[76px] sm:h-64 sm:w-64 sm:blur-[92px]" style={{ background: "color-mix(in srgb, var(--landing-accent-blue) 10%, transparent)" }} />
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <Reveal className="mx-auto max-w-4xl text-center" distance={lightMotion ? 14 : 24} duration={lightMotion ? 0.72 : 1.12}>
          <p className="text-[0.98rem] font-semibold tracking-[-0.015em] text-[var(--landing-accent-blue)] sm:text-[1.75rem] lg:text-[2.05rem]">
            {content.eyebrow}
          </p>
          <h2 className="mt-4 text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-[var(--landing-accent-gold)] sm:text-[3.55rem] lg:text-[4.5rem]">
            {content.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-center">
          {content.plans.map((plan, index) => (
            <Reveal
              className={cn(plan.emphasis ? "lg:-my-6" : undefined)}
              delay={index * 0.08}
              direction="right"
              distance={lightMotion ? 20 : 40}
              duration={lightMotion ? 0.8 : 1.08}
              hover={!lightMotion}
              key={plan.name}
            >
              <Card
                className={cn(
                  "landing-glass-card landing-glass-card-hover relative overflow-hidden rounded-[30px] px-0 py-0 text-center transition duration-300",
                  plan.emphasis
                    ? "lg:shadow-[0_34px_74px_rgba(148,163,184,0.22),0_14px_34px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.94)]"
                    : undefined,
                )}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(27,116,223,0.06)_0%,rgba(27,116,223,0)_100%)]" />
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.82)_50%,rgba(255,255,255,0)_100%)]" />

                {plan.highlight ? (
                  <span className="absolute right-6 top-5 inline-flex rounded-full bg-[#ffcc45] px-4 py-2 text-sm font-bold uppercase text-[#1f2937]">
                    {plan.highlight}
                  </span>
                ) : null}

                <CardContent
                  className={cn(
                    "px-8 py-10 lg:px-7 lg:py-9",
                    plan.emphasis && "lg:px-8 lg:py-12",
                  )}
                >
                  {!plan.emphasis ? (
                    <p className="text-[3.5rem] font-bold leading-none tracking-[-0.05em] text-[var(--landing-accent-blue)] sm:text-[4.2rem] lg:text-[4.55rem]">
                      #{content.plans.slice(0, index + 1).filter((entry) => !entry.emphasis).length}
                    </p>
                  ) : null}

                  {plan.emphasis ? (
                    <h3 className="text-[3rem] font-semibold leading-none tracking-[-0.055em] text-[var(--landing-accent-blue)] sm:text-[4rem] lg:text-[4.9rem]">
                      {plan.name}
                    </h3>
                  ) : null}

                  <p
                    className={cn(
                      "mt-3 font-semibold tracking-[-0.025em] text-[var(--landing-text-primary)]",
                      plan.emphasis ? "text-[1.58rem] sm:text-[1.95rem] lg:text-[2.2rem]" : "text-[1.45rem] sm:text-[1.68rem] lg:text-[1.78rem]",
                    )}
                  >
                    {plan.emphasis ? "Akses Bot Crypto & Saham" : plan.name}
                  </p>

                  <div className="mt-6 flex items-end justify-center gap-3">
                    <span className="text-[2.5rem] font-bold leading-none tracking-[-0.04em] text-[var(--landing-text-primary)] sm:text-[2.95rem] lg:text-[3.2rem]">
                      {plan.price}
                    </span>
                    <span className="pb-1 text-[0.98rem] font-semibold text-[var(--landing-accent-green)] sm:text-[1.08rem] lg:text-[1.15rem]">Lifetime</span>
                  </div>

                  <p className="mx-auto mt-8 max-w-[24rem] text-[0.94rem] leading-[1.72] text-[var(--landing-text-secondary)] sm:text-[0.98rem] lg:text-[1.02rem]">
                    {plan.description}
                  </p>

                  <div className="mt-8 flex justify-center">
                    <LandingCtaButton
                      className={cn(
                        "landing-pricing-cta min-w-[212px]",
                        plan.emphasis && "landing-cta-emphasis",
                      )}
                      external={ctaExternal}
                      href={content.ctaHref || ctaHref}
                      icon={LogIn}
                      label={content.buttonLabel}
                      palette={content.buttonPalette}
                      size="compact"
                    />
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
