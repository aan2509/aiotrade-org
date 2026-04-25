"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionBackgroundLayer } from "@/components/landing/section-background-layer";
import { useLightLandingMotion } from "@/components/landing/use-light-landing-motion";
import type { FaqContent } from "@/components/landing/types";
import { Reveal } from "@/components/ui/reveal";

type FaqSectionProps = {
  content: FaqContent;
};

export function FaqSection({ content }: FaqSectionProps) {
  const lightMotion = useLightLandingMotion();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative py-20 text-[var(--landing-text-primary)]" id="faq">
      <SectionBackgroundLayer
        config={content.background}
        fallbackOverlayColor="#f4f2ec"
        fallbackOverlayOpacity={18}
        fallbackPreset="warm-ivory"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <Reveal className="landing-glass-panel faq-panel-shell overflow-hidden rounded-[30px]" distance={lightMotion ? 14 : 24} duration={lightMotion ? 0.72 : 1.12}>
          <div className="faq-panel-head px-6 py-8 text-center sm:px-10 sm:py-10">
            <p className="faq-panel-title text-[2.3rem] font-bold tracking-[0.04em] text-[var(--landing-accent-gold)] sm:text-[3.2rem] lg:text-[4rem]">
              {content.title}
            </p>
            <p className="mt-2 text-[0.95rem] text-[var(--landing-text-secondary)] sm:text-[1.02rem] lg:text-[1.05rem]">
              {content.subtitle}
            </p>
          </div>

          <div className="bg-transparent">
            {content.items.map((entry, index) => (
              <Reveal delay={index * 0.03} direction="right" distance={lightMotion ? 12 : 20} duration={lightMotion ? 0.64 : 0.9} key={entry.question}>
                <div className="faq-accordion-row border-b border-white/60 last:border-b-0">
                  <button
                    aria-controls={`faq-panel-${index}`}
                    aria-expanded={openIndex === index}
                    className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[0.98rem] font-medium transition duration-300 sm:px-7 sm:text-[1.08rem] lg:text-[1.15rem] ${
                      openIndex === index
                        ? "faq-accordion-trigger-active text-[#0f3f67]"
                        : "faq-accordion-trigger-idle text-[var(--landing-text-primary)]"
                    }`}
                    onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}
                    type="button"
                  >
                    <span>{entry.question}</span>
                    <motion.span
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center ${
                        openIndex === index ? "text-[#0f3f67]" : "text-[var(--landing-text-primary)]"
                      }`}
                      transition={{ duration: 0.22 }}
                    >
                      <ChevronDown className="h-4 w-4" strokeWidth={2.4} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index ? (
                      <motion.div
                        animate={{ height: "auto", opacity: 1 }}
                        className="overflow-hidden"
                        exit={{ height: 0, opacity: 0 }}
                        id={`faq-panel-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="faq-accordion-content px-6 pb-5 pt-4 text-[0.92rem] leading-7 text-[var(--landing-text-secondary)] backdrop-blur-sm sm:px-7 sm:text-[0.96rem] sm:leading-8 lg:text-[0.98rem]">
                          {entry.answer}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
