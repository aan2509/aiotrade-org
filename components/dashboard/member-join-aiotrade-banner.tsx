import Link from "next/link";
import { ArrowUpRight, BadgePlus } from "lucide-react";
import type { OverviewContent } from "@/components/landing/types";
import { memberSolidButtonClass } from "@/components/dashboard/member-ui";
import { hexToRgba } from "@/lib/homepage-backgrounds";

type MemberJoinAiotradeBannerProps = {
  cta: OverviewContent["memberCta"];
};

export function MemberJoinAiotradeBanner({ cta }: MemberJoinAiotradeBannerProps) {
  const overlayColor = cta.overlayColor ?? "#07101d";
  const overlayOpacity = cta.overlayOpacity ?? 52;
  const imageUrl = cta.backgroundImageUrl?.trim() || null;

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 shadow-[0_28px_60px_rgba(15,23,42,0.24)]">
      <div
        className="absolute inset-0"
        style={
          imageUrl
            ? {
                backgroundImage: `url(${imageUrl})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }
            : {
                background:
                  "linear-gradient(135deg, rgba(8,145,178,0.24) 0%, rgba(15,23,42,0.9) 42%, rgba(37,99,235,0.72) 100%)",
              }
        }
      />
      <div
        className="absolute inset-0"
        style={{
          background: imageUrl
            ? `linear-gradient(135deg, ${hexToRgba(overlayColor, Math.min(100, overlayOpacity + 8))} 0%, ${hexToRgba(overlayColor, overlayOpacity)} 42%, ${hexToRgba(overlayColor, Math.max(28, overlayOpacity - 10))} 100%)`
            : "linear-gradient(135deg, rgba(8,145,178,0.18) 0%, rgba(255,255,255,0) 40%, rgba(245,158,11,0.14) 100%)",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_32%)]" />

      <div className="relative px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/92 backdrop-blur-xl">
            <BadgePlus className="h-3.5 w-3.5" />
            Join AIOTrade
          </div>
          <h2 className="mt-5 max-w-2xl text-[1.9rem] font-semibold tracking-tight text-white sm:text-[2.25rem] lg:text-[2.7rem]">
            {cta.title}
          </h2>
          <p className="mt-4 max-w-2xl text-[0.98rem] leading-8 text-white/80 sm:text-base">
            {cta.description}
          </p>
          <div className="mt-7">
            <Link
              className={`${memberSolidButtonClass} min-w-[220px] justify-center px-6 text-base shadow-[0_18px_38px_rgba(37,99,235,0.34)]`}
              href={cta.buttonHref}
            >
              <ArrowUpRight className="h-4 w-4" />
              {cta.buttonLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
