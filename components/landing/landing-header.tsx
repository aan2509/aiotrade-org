"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ChevronRight, LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { navItems } from "@/components/landing/data";
import { LandingThemeToggle } from "@/components/landing/landing-theme-toggle";
import { LandingThemeLogo } from "@/components/landing/landing-theme-logo";
import { SiteLanguageSelector } from "@/components/shared/site-language-selector";
import { useLightLandingMotion } from "@/components/landing/use-light-landing-motion";
import type { LandingTheme } from "@/lib/landing-theme";
import type { NavItem } from "@/components/landing/types";
import type { SiteLanguage, SiteLanguageOption } from "@/lib/site-language";
import { cn } from "@/lib/utils";

type LandingHeaderProps = {
  accountHref?: string;
  currentLanguage?: SiteLanguage;
  isAuthenticated?: boolean;
  languages?: SiteLanguageOption[];
  navItems?: NavItem[];
  onThemeChange?: (theme: LandingTheme) => void;
  previewMode?: boolean;
  theme?: LandingTheme;
};

function buildResponsiveLogoWidth() {
  return {
    width: "min(100%, clamp(100px, 13vw, 100px))",
  };
}

export function LandingHeader({
  accountHref = "/signup",
  currentLanguage = "id",
  isAuthenticated = false,
  languages = [],
  navItems: headerItems = navItems,
  onThemeChange,
  previewMode = false,
  theme = "light",
}: LandingHeaderProps) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const lightMotion = useLightLandingMotion();
  const { scrollY } = useScroll();
  const [activeHref, setActiveHref] = useState(headerItems[0]?.href ?? "#fitur");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    if (!previewMode) {
      setIsScrolled(value > 32);
    }
  });

  useEffect(() => {
    if (previewMode) {
      return;
    }

    const sections = headerItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return;
    }

    let frame = 0;

    const syncActiveSection = () => {
      const marker = window.scrollY + 180;
      let nextActiveHref = headerItems[0]?.href ?? "#fitur";

      sections.forEach((section) => {
        if (marker >= section.offsetTop) {
          nextActiveHref = `#${section.id}`;
        }
      });

      setActiveHref((current) => (current === nextActiveHref ? current : nextActiveHref));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(syncActiveSection);
    };

    syncActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headerItems, previewMode]);

  useEffect(() => {
    if (previewMode) {
      return;
    }

    let frame = 0;

    const syncPinnedState = () => {
      const top = anchorRef.current?.getBoundingClientRect().top ?? 1;
      setIsPinned((current) => {
        const next = top <= 0;
        return current === next ? current : next;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(syncPinnedState);
    };

    syncPinnedState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [previewMode]);

  useEffect(() => {
    const closeMenuOnDesktop = () => {
      if (window.innerWidth >= 640) {
        setIsMobileMenuOpen(false);
      }
    };

    closeMenuOnDesktop();
    window.addEventListener("resize", closeMenuOnDesktop);

    return () => {
      window.removeEventListener("resize", closeMenuOnDesktop);
    };
  }, []);

  const activeItem = headerItems.find((item) => item.href === activeHref) ?? headerItems[0];
  const AccountIcon = isAuthenticated ? LayoutDashboard : LogIn;
  const MobileMenuIcon = isMobileMenuOpen ? X : Menu;
  const homeLabel = currentLanguage === "en" ? "AIOTrade home" : "Beranda AIOTrade";
  const accountLabel = currentLanguage === "en"
    ? isAuthenticated
      ? "Dashboard"
      : "Register"
    : isAuthenticated
      ? "Dashboard"
      : "Register";
  const mobileBadgeLabel = currentLanguage === "en" ? "Navigation" : "Navigasi";
  const controls = !previewMode && onThemeChange ? (
    <div className="flex items-center justify-end gap-2">
      <Link
        aria-label={accountLabel}
        className="landing-glass-button inline-flex h-10 items-center justify-center gap-2 rounded-full px-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--landing-toggle-text)] transition duration-300 hover:-translate-y-0.5"
        href={accountHref}
        title={accountLabel}
      >
        <AccountIcon className="h-4 w-4" />
        <span>{accountLabel}</span>
      </Link>
      <SiteLanguageSelector
        currentLanguage={currentLanguage}
        languages={languages}
        variant="landing"
      />
      <LandingThemeToggle onChange={onThemeChange} theme={theme} />
    </div>
  ) : null;

  return (
    <div className="relative z-40 h-[72px] sm:h-[58px]" ref={anchorRef}>
      <header
        className={cn(
          "landing-header-shell left-0 right-0 z-40 w-full backdrop-blur-lg transition duration-300 sm:backdrop-blur-2xl",
          previewMode ? "absolute top-0" : isPinned ? "fixed top-0" : "absolute top-0",
          !previewMode && isScrolled && "landing-header-shell-scrolled shadow-[0_12px_30px_rgba(0,0,0,0.28)] sm:shadow-[0_16px_42px_rgba(0,0,0,0.36)]",
        )}
      >
        <motion.div
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          className="relative mx-auto flex min-h-[72px] w-full max-w-7xl items-center justify-center px-3 py-2 sm:min-h-[58px] sm:px-8 sm:py-0 lg:px-10"
          initial={prefersReducedMotion ? false : { opacity: 0, y: lightMotion ? -8 : -18 }}
          transition={{ duration: lightMotion ? 0.35 : 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex w-full flex-col gap-2 sm:grid sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
            <div className="relative flex items-center justify-between gap-3 sm:hidden">
              <Link
                aria-label={homeLabel}
                className="inline-flex min-w-0 items-center"
                href="#top"
              >
                <LandingThemeLogo
                  className="max-w-[74px]"
                  lightClassName="drop-shadow-[0_8px_16px_rgba(255,255,255,0.14)]"
                  sizes="74px"
                  style={{ width: "74px" }}
                />
              </Link>
              {!previewMode && onThemeChange ? (
                <button
                  aria-expanded={isMobileMenuOpen}
                  aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
                  className="landing-mobile-menu-row inline-flex h-11 w-11 items-center justify-center rounded-[20px] text-[var(--landing-text-primary)] transition duration-300"
                  onClick={() => setIsMobileMenuOpen((current) => !current)}
                  type="button"
                >
                  <MobileMenuIcon className="h-[1.15rem] w-[1.15rem]" />
                </button>
              ) : null}
              {!previewMode && onThemeChange && isMobileMenuOpen ? (
                <>
                  <div className="fixed inset-0 -z-10 bg-[rgba(15,23,42,0.16)] backdrop-blur-[2px]" />
                  <div className="landing-mobile-menu-panel absolute left-0 right-0 top-[calc(100%+0.7rem)] overflow-hidden rounded-[30px] px-5 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="landing-mobile-menu-pill inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.24em]">
                        <Menu className="h-3.5 w-3.5" />
                        {mobileBadgeLabel}
                      </div>
                      <p className="mt-4 text-[1.45rem] font-semibold tracking-tight text-[var(--landing-text-primary)]">
                        {homeLabel}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        aria-label="Tutup menu"
                        className="landing-mobile-menu-row inline-flex h-11 w-11 items-center justify-center rounded-[20px] text-[var(--landing-text-primary)] transition duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                        type="button"
                      >
                        <X className="h-[1.15rem] w-[1.15rem]" />
                      </button>
                      <LandingThemeToggle onChange={onThemeChange} theme={theme} />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <SiteLanguageSelector
                      currentLanguage={currentLanguage}
                      languages={languages}
                      variant="member"
                    />
                  </div>
                  <div className="mx-1 mt-5 h-px bg-[linear-gradient(90deg,transparent_0%,var(--landing-header-border)_18%,var(--landing-header-border)_82%,transparent_100%)]" />
                  <nav className="mt-5">
                    <div className="space-y-3">
                      {headerItems.map((item) => (
                        <Link
                          className={cn(
                            "group relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl px-4 py-3.5 text-sm font-semibold transition duration-300",
                            activeHref === item.href
                              ? "landing-mobile-menu-active"
                              : "landing-mobile-menu-row text-[var(--landing-text-secondary)] hover:text-[var(--landing-text-primary)]",
                          )}
                          href={item.href}
                          key={`mobile-${item.href}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {activeHref === item.href ? (
                            <>
                              <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-[var(--landing-mobile-menu-active-highlight)]" />
                              <span className="pointer-events-none absolute -right-8 top-1/2 h-16 w-24 -translate-y-1/2 rounded-full bg-[var(--landing-mobile-menu-active-glow)] blur-2xl" />
                            </>
                          ) : null}
                          <span className="relative z-10 inline-flex items-center gap-3">
                            <span
                              className={cn(
                                "inline-flex h-10 w-10 items-center justify-center rounded-2xl transition",
                                activeHref === item.href
                                  ? "bg-white/18 text-[var(--landing-mobile-menu-active-text)]"
                                  : "landing-mobile-menu-icon",
                              )}
                            >
                              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.accent }} />
                            </span>
                            <span className="relative z-10">{item.label}</span>
                          </span>
                          <ChevronRight
                            className={cn(
                              "relative z-10 h-4 w-4 transition duration-300",
                              activeHref === item.href ? "text-[var(--landing-mobile-menu-active-text)]" : "text-[var(--landing-text-muted)]",
                            )}
                          />
                        </Link>
                      ))}
                    </div>
                  </nav>
                  <div className="mx-1 mt-5 h-px bg-[linear-gradient(90deg,transparent_0%,var(--landing-header-border)_18%,var(--landing-header-border)_82%,transparent_100%)]" />
                  <div className="mt-5">
                    <Link
                      aria-label={accountLabel}
                      className="landing-mobile-menu-row inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-[var(--landing-text-primary)] transition duration-300"
                      href={accountHref}
                      onClick={() => setIsMobileMenuOpen(false)}
                      title={accountLabel}
                    >
                      <AccountIcon className="h-4 w-4" />
                      <span>{accountLabel}</span>
                    </Link>
                  </div>
                  </div>
                </>
              ) : null}
            </div>
            <div className="hidden sm:flex sm:min-w-0 sm:items-center sm:justify-start">
              <Link
                aria-label={homeLabel}
                className="inline-flex min-w-0 items-center"
                href="#top"
              >
                <LandingThemeLogo
                  className="max-w-[156px]"
                  lightClassName="drop-shadow-[0_10px_22px_rgba(255,255,255,0.12)]"
                  sizes="156px"
                  style={buildResponsiveLogoWidth()}
                />
              </Link>
            </div>
            <nav
              className="landing-header-nav no-scrollbar relative hidden min-w-0 w-full items-center justify-start overflow-x-auto px-1 text-[0.82rem] sm:flex sm:justify-center sm:px-4 sm:text-[1rem]"
              style={
                {
                  "--active-nav-accent": activeItem?.accent ?? "#10a7ff",
                } as CSSProperties
              }
            >
              <div className="flex min-w-max items-center gap-2 sm:gap-6">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-80"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--active-nav-accent) 58%, white 42%) 50%, transparent 100%)",
                  }}
                />
                {headerItems.map((item, index) => (
                  <div className="flex items-center gap-2 sm:gap-6" key={item.href}>
                    {index > 0 ? <span className="landing-header-divider">|</span> : null}
                    <motion.div
                      whileHover={prefersReducedMotion || lightMotion ? undefined : { y: -1 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                    >
                      <Link
                        className={cn(
                          "group relative inline-flex whitespace-nowrap rounded-md px-2 py-2 transition duration-300 hover:text-[var(--landing-header-active-text)] sm:px-3",
                          activeHref === item.href
                            ? "text-[var(--landing-header-active-text)]"
                            : "text-[var(--landing-header-text)]",
                        )}
                        href={item.href}
                        style={
                          activeHref === item.href
                            ? {
                                color: item.accent,
                                textShadow: `0 0 18px ${item.accent}22`,
                              }
                            : undefined
                        }
                      >
                        <span>{item.label}</span>
                        {activeHref === item.href ? (
                          <motion.span
                            className="absolute inset-x-2 bottom-0 h-[2px] rounded-full sm:inset-x-3"
                            layoutId="landing-active-nav"
                            style={{
                              backgroundColor: item.accent,
                              boxShadow: `0 0 18px ${item.accent}73`,
                            }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          />
                        ) : (
                          <span
                            className="absolute inset-x-2 bottom-0 h-px origin-center scale-x-0 transition duration-300 group-hover:scale-x-100 sm:inset-x-3"
                            style={{ backgroundColor: item.accent }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </div>
            </nav>
            {controls ? (
              <div className="hidden sm:flex sm:items-center sm:justify-end sm:gap-2">
                <span className="landing-header-divider hidden sm:inline">|</span>
                {controls}
              </div>
            ) : null}
          </div>
        </motion.div>
      </header>
    </div>
  );
}
