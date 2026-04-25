"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { landingImages } from "@/components/landing/data";
import { SectionBackgroundLayer } from "@/components/landing/section-background-layer";
import { useLightLandingMotion } from "@/components/landing/use-light-landing-motion";
import { PrefetchedLink } from "@/components/shared/prefetched-link";
import type { BlogContent, BlogPreviewItem } from "@/components/landing/types";
import { Reveal } from "@/components/ui/reveal";

type BlogSectionProps = {
  content: BlogContent;
  posts: BlogPreviewItem[];
};

export function BlogSection({ content, posts }: BlogSectionProps) {
  const lightMotion = useLightLandingMotion();
  const fallbackItems: BlogPreviewItem[] = content.items.map((item, index) => ({
    category: item.label,
    excerpt: item.description,
    publishedAt: `2026-01-${String(index + 10).padStart(2, "0")}T00:00:00.000Z`,
    slug: "#blog",
    thumbnailUrl: null,
    title: item.title,
  }));
  const items = posts.length ? posts : fallbackItems;

  return (
    <section className="relative overflow-hidden py-20" id="blog">
      <SectionBackgroundLayer
        config={content.background}
        fallbackOverlayColor="#f8f6f0"
        fallbackOverlayOpacity={18}
        fallbackPreset="warm-ivory"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(246,190,79,0.08)_0%,rgba(246,190,79,0)_100%)]" />
      <div className="pointer-events-none absolute left-[-8%] top-14 h-44 w-44 rounded-full bg-[#f4cf73]/14 blur-[70px] sm:h-52 sm:w-52 sm:blur-[84px]" />
      <div className="pointer-events-none absolute bottom-0 right-[-5%] h-48 w-48 rounded-full bg-[#75b9ff]/8 blur-[74px] sm:h-56 sm:w-56 sm:blur-[88px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <Reveal className="text-center lg:text-left" distance={lightMotion ? 14 : 24} duration={lightMotion ? 0.72 : 1.12}>
          <h2 className="text-[2.35rem] font-semibold leading-none tracking-[-0.05em] text-[var(--landing-accent-gold)] sm:text-[3.35rem] lg:text-[4.3rem]">
            {content.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {items.map((article, index) => (
            <Reveal
              className="rounded-[28px]"
              delay={index * 0.08}
              direction="right"
              distance={lightMotion ? 18 : 34}
              duration={lightMotion ? 0.78 : 1.04}
              hover={!lightMotion}
              key={article.title}
            >
              <PrefetchedLink
                className="landing-glass-card landing-glass-card-hover block overflow-hidden rounded-[28px] touch-manipulation"
                href={article.slug === "#blog" ? "/blog" : `/blog/${article.slug}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0d1728]">
                  <Image
                    alt={article.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-55"
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    src={article.thumbnailUrl ?? landingImages.chartImage}
                    unoptimized={Boolean(article.thumbnailUrl)}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,12,22,0.2)_0%,rgba(6,12,22,0.48)_46%,rgba(6,12,22,0.82)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(17,167,255,0.18)_0%,rgba(17,167,255,0)_34%)]" />
                  <span className="absolute right-5 top-5 rounded-full bg-[#58d56f] px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.04em] text-white">
                    {article.category}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 flex h-full flex-col justify-end p-5">
                    <p className="max-w-[16rem] text-[0.92rem] font-medium leading-[1.35] text-white sm:text-[1rem] lg:text-[1.05rem]">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
                <div className="px-7 pb-7 pt-5">
                  <h3 className="text-[1.55rem] font-semibold leading-[1.18] tracking-[-0.035em] text-[var(--landing-text-primary)] sm:text-[1.8rem] lg:text-[2rem]">
                    {article.title}
                  </h3>
                  <span className="mt-7 inline-flex items-center gap-1 text-[0.98rem] font-medium uppercase tracking-[0.01em] text-[var(--landing-text-muted)] transition duration-300 hover:text-[var(--landing-accent-blue)]">
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </PrefetchedLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
