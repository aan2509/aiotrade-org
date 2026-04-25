"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionBackgroundLayer } from "@/components/landing/section-background-layer";
import type { BannerAdsContent } from "@/components/landing/types";
import { Reveal } from "@/components/ui/reveal";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type BannerAdsSectionProps = {
  content: BannerAdsContent;
};

export function BannerAdsSection({ content }: BannerAdsSectionProps) {
  const whatsappHref = content.whatsappNumber
    ? buildWhatsAppUrl(content.whatsappNumber, {
        message: "Halo admin, saya tertarik untuk membeli kaos komunitas AIOTrade.",
      })
    : null;

  if (!content.isVisible) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-16 sm:py-18" id="banner-ads">
      <SectionBackgroundLayer
        config={content.background}
        fallbackOverlayColor="#f8f6f0"
        fallbackOverlayOpacity={18}
        fallbackPreset="warm-ivory"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(27,116,223,0.08),transparent_30%),linear-gradient(180deg,rgba(246,190,79,0.05)_0%,rgba(246,190,79,0)_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <Reveal>
          <div className="relative aspect-[21/8] min-h-[188px] w-full overflow-hidden rounded-[16px] sm:min-h-[220px] sm:rounded-[18px] lg:min-h-[300px] lg:rounded-[20px]">
            {content.imageUrl ? (
              <>
                <Image
                  alt={content.imageAlt || content.title}
                  className="h-full w-full object-cover"
                  fill
                  sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 1024px) calc(100vw - 4rem), 1280px"
                  src={content.imageUrl}
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.22)_0%,rgba(15,23,42,0.10)_34%,rgba(15,23,42,0.04)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(0,0,0,0.08)_100%)]" />
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#ffffff_0%,#fbfaf7_52%,#eef5ff_100%)] px-6 text-center">
                <div className="rounded-[18px] border border-dashed border-[#c9d9ef] bg-white/70 px-6 py-5 text-sm font-medium leading-7 text-[#6480a3] shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
                  Placeholder banner 21:8
                  <br />
                  Cocok untuk kaos, merchandise, atau promosi komunitas.
                </div>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-start p-3 sm:p-5 lg:p-6">
              {whatsappHref ? (
                <Link
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/22 bg-[rgba(34,197,94,0.94)] px-4 text-[0.92rem] font-semibold text-white shadow-[0_14px_32px_rgba(15,23,42,0.26),inset_0_1px_0_rgba(255,255,255,0.24)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-[rgba(34,197,94,1)] hover:shadow-[0_18px_36px_rgba(15,23,42,0.3)] sm:min-h-11 sm:px-5 sm:text-[0.96rem] lg:min-h-12 lg:px-6"
                  href={whatsappHref}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {content.buttonLabel}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/32 bg-[rgba(255,255,255,0.9)] px-4 text-[0.92rem] font-semibold text-stone-500 shadow-[0_12px_28px_rgba(15,23,42,0.14)] backdrop-blur sm:min-h-11 sm:px-5 lg:min-h-12 lg:px-6">
                  Nomor WhatsApp belum diatur
                </span>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
