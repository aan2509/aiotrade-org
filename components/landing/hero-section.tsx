"use client";

import { useRef } from "react";
import { Users } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { landingImages } from "@/components/landing/data";
import { LandingCtaButton } from "@/components/landing/landing-cta-button";
import { SectionBackgroundLayer } from "@/components/landing/section-background-layer";
import type { HeroContent, LandingPageUIProps } from "@/components/landing/types";

type HeroSectionProps = Pick<LandingPageUIProps, "ctaExternal" | "ctaHref" | "ctaLabel"> & {
  content: HeroContent;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.11,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function HeroSection({
  content,
  ctaExternal = false,
  ctaHref,
  ctaLabel,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 86]);
  const contentY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -28]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.76]);

  return (
    <section className="relative isolate overflow-hidden bg-[#0b1322] text-white" ref={sectionRef}>
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <motion.div
          animate={prefersReducedMotion ? { scale: 1 } : { scale: 1.02 }}
          className="absolute inset-0"
          initial={prefersReducedMotion ? false : { scale: 1.08 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionBackgroundLayer
            config={content.background}
            fallbackImageUrl={landingImages.heroImage.src}
            fallbackOverlayColor="#07101d"
            fallbackOverlayOpacity={40}
            fallbackPreset="dark-slate-cinematic"
          />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,16,0.1)_0%,rgba(4,8,16,0.22)_38%,rgba(4,8,16,0.42)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(9,15,26,0.02)_0%,rgba(9,15,26,0.26)_70%,rgba(9,15,26,0.42)_100%)]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col px-6 pb-6 pt-5 sm:px-8 lg:px-10">
        <div className="flex flex-1 items-center justify-center">
          <motion.div
            animate="show"
            className="mx-auto flex w-full max-w-6xl flex-col items-center text-center"
            initial="hidden"
            style={{ opacity: contentOpacity, y: contentY }}
            variants={containerVariants}
          >
            <motion.p
              className="text-[0.65rem] uppercase tracking-[0.28em] text-white/82 sm:text-sm sm:tracking-[0.5em]"
              variants={itemVariants}
            >
              {content.eyebrow}
            </motion.p>

            <motion.h1
              className="mt-5 text-[3rem] font-semibold uppercase leading-[0.95] tracking-[0.015em] text-white sm:mt-6 sm:text-[6.15rem] sm:tracking-[0.045em] lg:text-[8.15rem]"
              variants={itemVariants}
            >
              <span className="text-[#0ea5ff]">{content.titleBlue}</span>
              {content.titleWhite}
            </motion.h1>

            <motion.p
              className="mt-4 max-w-[18rem] text-[1rem] font-normal leading-[1.38] text-white/88 sm:mt-5 sm:max-w-5xl sm:text-[1.7rem] lg:text-[2.15rem]"
              variants={itemVariants}
            >
              {content.subtitle}
            </motion.p>
            <motion.div
              className="mt-8 w-full sm:mt-10 sm:w-auto"
              variants={itemVariants}
              whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.01 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            >
              <LandingCtaButton
                className="w-auto sm:min-w-[304px]"
                external={ctaExternal}
                href={ctaHref}
                icon={Users}
                label={ctaLabel ?? content.ctaLabel}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
