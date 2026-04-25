"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { TickerItem } from "@/components/landing/types";
import { fallbackTickerItems, getTickerInitials } from "@/lib/market";
import { useLightLandingMotion } from "@/components/landing/use-light-landing-motion";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type TickerStripProps = {
  className?: string;
  previewMode?: boolean;
};

const duplicatedFallbackItems = [...fallbackTickerItems, ...fallbackTickerItems];

export function TickerStrip({ className, previewMode = false }: TickerStripProps) {
  const prefersReducedMotion = useReducedMotion();
  const lightMotion = useLightLandingMotion();
  const [items, setItems] = useState<TickerItem[]>(fallbackTickerItems);

  useEffect(() => {
    if (previewMode) {
      return;
    }

    let isMounted = true;

    async function loadTicker() {
      try {
        const response = await fetch("/api/market/ticker", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch ticker");
        }

        const payload = (await response.json()) as { items?: TickerItem[] };

        if (isMounted && payload.items?.length) {
          setItems(payload.items);
        }
      } catch {
        if (isMounted) {
          setItems(fallbackTickerItems);
        }
      }
    }

    void loadTicker();
    const intervalId = window.setInterval(() => {
      void loadTicker();
    }, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [previewMode]);

  const tickerItems = useMemo(() => {
    if (!items.length) {
      return duplicatedFallbackItems;
    }

    return [...items, ...items];
  }, [items]);

  return (
    <Reveal
      className={[
        "relative overflow-hidden bg-transparent py-4 text-[var(--landing-text-primary)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      distance={lightMotion ? 12 : 24}
      duration={lightMotion ? 0.68 : 1.12}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-[linear-gradient(90deg,var(--landing-panel-bg)_0%,rgba(255,255,255,0)_100%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-[linear-gradient(270deg,var(--landing-panel-bg)_0%,rgba(255,255,255,0)_100%)]" />

      <motion.div
        animate={prefersReducedMotion ? { x: "0%" } : { x: ["0%", "-50%"] }}
        className="flex w-max items-stretch gap-3 px-3 sm:gap-4 sm:px-5 lg:px-6"
        transition={
          prefersReducedMotion
            ? undefined
            : {
                duration: lightMotion ? 40 : 34,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              }
        }
      >
        {tickerItems.map((item, index) => (
          <article
            className="landing-glass-card min-w-[144px] rounded-[20px] px-3.5 py-3.5 sm:min-w-[168px] sm:px-4"
            key={`${item.symbol}-${index}`}
          >
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                {item.logoUrl ? (
                  <Image
                    alt={item.name ?? item.symbol}
                    className="h-6 w-6 rounded-full bg-white/5 object-cover sm:h-7 sm:w-7"
                    height="28"
                    loading="lazy"
                    src={item.logoUrl}
                    width="28"
                    unoptimized
                  />
                ) : (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[0.55rem] font-semibold tracking-[0.08em] text-[var(--landing-text-primary)] sm:h-7 sm:w-7 sm:text-[0.62rem]">
                    {getTickerInitials(item.symbol)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-[0.82rem] font-semibold tracking-[0.02em] text-[var(--landing-text-primary)] sm:text-[0.9rem]">{item.symbol}</p>
                  
                </div>
              </div>
              <span className={cn("text-xs sm:text-sm", item.positive ? "text-[#34d399]" : "text-[#f87171]")}>
                {item.change}
              </span>
            </div>
            <p className="mt-2.5 text-[1.22rem] font-semibold tracking-[-0.03em] text-[var(--landing-text-primary)] sm:text-[1.4rem]">{item.price}</p>
          </article>
        ))}
      </motion.div>
    </Reveal>
  );
}
