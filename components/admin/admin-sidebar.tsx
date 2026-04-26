"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ChartColumn,
  ChevronDown,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Moon,
  Newspaper,
  Search,
  Settings2,
  Sun,
  Users,
} from "lucide-react";
import { logoutAction } from "@/app/(protected)/account/actions";
import { AdminThemeToggle } from "@/components/admin/admin-theme-toggle";
import type { AdminTheme } from "@/lib/admin-theme";
import { cn } from "@/lib/utils";

const homepageItems = [
  { href: "/admin#overview-section", id: "overview-section", label: "Overview Section", section: "overview" },
  { href: "/admin#benefits-section", id: "benefits-section", label: "Benefit Section", section: "benefits" },
  { href: "/admin#pricing-section", id: "pricing-section", label: "Pricing Section", section: "pricing" },
  { href: "/admin#video-section", id: "video-section", label: "Video Section", section: "video" },
  { href: "/admin#faq-section", id: "faq-section", label: "FAQ Section", section: "faq" },
  { href: "/admin#guide-section", id: "guide-section", label: "Guide Section", section: "guide" },
  { href: "/admin#testimonial-section", id: "testimonial-section", label: "Testimoni Section", section: "testimonial" },
  { href: "/admin#blog-section", id: "blog-section", label: "Blog Section", section: "blog" },
  { href: "/admin#banner-ads-section", id: "banner-ads-section", label: "Banner Ads Section", section: "bannerAds" },
  { href: "/admin#footer-section", id: "footer-section", label: "Footer Section", section: "footer" },
] as const;

const postItems = [
  { href: "/admin/posts", label: "Composer Post" },
  { href: "/admin/posts/published", label: "Post Published" },
  { href: "/admin/posts/pdfs", label: "Posting PDF" },
  { href: "/admin/posts/pdfs/published", label: "PDF Published" },
] as const;

const memberPostItems = [
  { href: "/admin/member-posts", label: "Composer Guide" },
  { href: "/admin/member-posts/published", label: "Published Guides" },
] as const;

type AdminSidebarProps = {
  onThemeChange: (theme: AdminTheme) => void;
  pathname: string;
  theme: AdminTheme;
  username: string;
};

function primaryLinkClass(active: boolean) {
  return cn(
    "flex items-center gap-3 rounded-[22px] px-4 py-3.5 text-sm font-semibold transition duration-300",
    active
      ? "admin-active-surface text-[var(--admin-sidebar-active-text)]"
      : "admin-row-surface admin-row-surface-hover text-[var(--admin-text-secondary)] hover:-translate-y-0.5 hover:text-[var(--admin-text-primary)]",
  );
}

function groupTriggerClass(active: boolean) {
  return cn(
    "flex w-full items-center justify-between gap-3 rounded-[22px] px-4 py-3.5 text-left text-sm font-semibold transition duration-300",
    active
      ? "admin-active-surface text-[var(--admin-sidebar-active-text)]"
      : "admin-soft-button text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)]",
  );
}

function subItemClass(active: boolean) {
  return cn(
    "block w-full rounded-[18px] px-3.5 py-2.5 text-left text-sm font-medium transition duration-300",
    active
      ? "admin-active-surface text-[var(--admin-sidebar-active-text)]"
      : "admin-soft-button text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)]",
  );
}

export function AdminSidebar({ onThemeChange, pathname, theme, username }: AdminSidebarProps) {
  const resolvedPathname = usePathname() ?? pathname;
  const searchParams = useSearchParams();
  const currentHomepageSection = searchParams.get("section");
  const isHomepageRoute = resolvedPathname === "/admin";
  const isPostsRoute = resolvedPathname.startsWith("/admin/posts");
  const isPostComposerRoute = resolvedPathname === "/admin/posts";
  const isPublishedPostsRoute = resolvedPathname === "/admin/posts/published";
  const isPdfComposerRoute = resolvedPathname === "/admin/posts/pdfs";
  const isPdfPublishedRoute = resolvedPathname === "/admin/posts/pdfs/published";
  const isMemberPostsRoute = resolvedPathname.startsWith("/admin/member-posts");
  const isMemberPostComposerRoute = resolvedPathname === "/admin/member-posts";
  const isMemberPublishedPostsRoute = resolvedPathname === "/admin/member-posts/published";
  const isResetPasswordRoute = resolvedPathname === "/admin/reset-password";
  const isPaymentsRoute = resolvedPathname === "/admin/payments";
  const isSeoRoute = resolvedPathname === "/admin/seo";
  const isUsersRoute = resolvedPathname === "/admin/users";
  const isStatsRoute = resolvedPathname === "/admin/stats";
  const [homepageExpanded, setHomepageExpanded] = useState(isHomepageRoute);
  const [postsExpanded, setPostsExpanded] = useState(isPostsRoute);
  const [memberPostsExpanded, setMemberPostsExpanded] = useState(isMemberPostsRoute);
  const [activeHomepageSection, setActiveHomepageSection] = useState(currentHomepageSection);
  const homepageOpen = isHomepageRoute || homepageExpanded;
  const postsOpen = isPostsRoute || postsExpanded;
  const memberPostsOpen = isMemberPostsRoute || memberPostsExpanded;
  const ThemePreviewIcon = theme === "dark" ? Moon : Sun;

  const homepageSectionIds = useMemo(
    () => homepageItems.map((item) => item.id),
    [],
  );

  useEffect(() => {
    if (!isHomepageRoute) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setActiveHomepageSection((current) => current ?? currentHomepageSection);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [currentHomepageSection, isHomepageRoute]);

  useEffect(() => {
    if (!isHomepageRoute || typeof window === "undefined") {
      return;
    }

    const sections = homepageSectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const nextVisible = visibleEntries[0];

        if (!nextVisible?.target.id) {
          return;
        }

        const matchedItem = homepageItems.find((item) => item.id === nextVisible.target.id);

        if (!matchedItem) {
          return;
        }

        setActiveHomepageSection(matchedItem.section);
      },
      {
        root: null,
        rootMargin: "-22% 0px -58% 0px",
        threshold: [0.1, 0.25, 0.4, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [homepageSectionIds, isHomepageRoute]);

  function scrollToHomepageSection(sectionId: string, sectionKey: string) {
    const target = document.getElementById(sectionId);

    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveHomepageSection(sectionKey);
    window.history.replaceState(null, "", `#${sectionId}`);
  }

  return (
    <div className="admin-glass-panel flex h-full flex-col rounded-[30px] border-transparent text-[var(--admin-text-primary)] backdrop-blur-2xl">
      <div className="px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="admin-page-badge inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
            <Settings2 className="h-3.5 w-3.5" />
            Admin Panel
          </div>
          <div className="flex items-center gap-2">
            <span className="admin-row-surface inline-flex h-10 items-center gap-2 rounded-full px-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--admin-text-muted)]">
              <ThemePreviewIcon className="h-3.5 w-3.5" />
              {theme}
            </span>
            <AdminThemeToggle onChange={onThemeChange} theme={theme} />
          </div>
        </div>
        <h1 className="mt-4 text-[1.75rem] font-semibold tracking-tight text-[var(--admin-text-primary)]">Control Center</h1>
        <p className="mt-2 text-sm leading-7 text-[var(--admin-text-secondary)]">
          Kelola homepage, data user, dan pengaturan lain.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <nav className="space-y-2.5">
          <Link
            className={primaryLinkClass(isStatsRoute)}
            href="/admin/stats"
          >
            <ChartColumn className="h-4 w-4" />
            Statistik
          </Link>

          <Link
            className={primaryLinkClass(isUsersRoute)}
            href="/admin/users"
          >
            <Users className="h-4 w-4" />
            User Management
          </Link>

          <Link
            className={primaryLinkClass(isPaymentsRoute)}
            href="/admin/payments"
          >
            <CreditCard className="h-4 w-4" />
            Payment Settings
          </Link>

          <div className="admin-glass-row rounded-[24px] border-transparent p-1.5">
            <button
              className={groupTriggerClass(isMemberPostsRoute)}
              onClick={() => setMemberPostsExpanded((current) => !current)}
              type="button"
            >
              <span className="inline-flex items-center gap-3">
                <Newspaper className="h-4 w-4" />
                Post to Member
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  memberPostsOpen && "rotate-180",
                )}
              />
            </button>

            <div
              className={cn(
                "grid overflow-hidden transition-[grid-template-rows] duration-300",
                memberPostsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0">
                <div className="space-y-1 px-2 pb-2 pt-1">
                  {memberPostItems.map((item) => {
                    const active =
                      (item.href === "/admin/member-posts" && isMemberPostComposerRoute) ||
                      (item.href === "/admin/member-posts/published" && isMemberPublishedPostsRoute);

                    return (
                      <Link
                        className={subItemClass(active)}
                        href={item.href}
                        key={item.href}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="admin-glass-row rounded-[24px] border-transparent p-1.5">
            <button
              className={groupTriggerClass(isPostsRoute)}
              onClick={() => setPostsExpanded((current) => !current)}
              type="button"
            >
              <span className="inline-flex items-center gap-3">
                <Newspaper className="h-4 w-4" />
                Posting Konten
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  postsOpen && "rotate-180",
                )}
              />
            </button>

            <div
              className={cn(
                "grid overflow-hidden transition-[grid-template-rows] duration-300",
                postsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0">
                <div className="space-y-1 px-2 pb-2 pt-1">
                  {postItems.map((item) => {
                    const active =
                      (item.href === "/admin/posts" && isPostComposerRoute) ||
                      (item.href === "/admin/posts/published" && isPublishedPostsRoute) ||
                      (item.href === "/admin/posts/pdfs" && isPdfComposerRoute) ||
                      (item.href === "/admin/posts/pdfs/published" && isPdfPublishedRoute);

                    return (
                      <Link
                        className={subItemClass(active)}
                        href={item.href}
                        key={item.href}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="admin-glass-row rounded-[24px] border-transparent p-1.5">
            <button
              className={groupTriggerClass(isHomepageRoute)}
              onClick={() => setHomepageExpanded((current) => !current)}
              type="button"
            >
              <span className="inline-flex items-center gap-3">
                <Settings2 className="h-4 w-4" />
                Setting Homepage
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  homepageOpen && "rotate-180",
                )}
              />
            </button>

            <div
              className={cn(
                "grid overflow-hidden transition-[grid-template-rows] duration-300",
                homepageOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0">
                <div className="space-y-1 px-2 pb-2 pt-1">
                  <Link
                    className={subItemClass(isHomepageRoute && !activeHomepageSection)}
                    href="/admin"
                    onClick={(event) => {
                      if (!isHomepageRoute) {
                        return;
                      }

                      event.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      setActiveHomepageSection(null);
                      window.history.replaceState(null, "", "/admin");
                    }}
                  >
                    Semua Section
                  </Link>
                  {homepageItems.map((item) =>
                    isHomepageRoute ? (
                      <button
                        className={subItemClass(activeHomepageSection === item.section)}
                        key={item.id}
                        onClick={() => scrollToHomepageSection(item.id, item.section)}
                        type="button"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        className={subItemClass(false)}
                        href={item.href}
                        key={item.id}
                      >
                        {item.label}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          <Link
            className={primaryLinkClass(isSeoRoute)}
            href="/admin/seo"
          >
            <Search className="h-4 w-4" />
            SEO Settings
          </Link>
        </nav>
      </div>

      <div className="px-4 py-4">
        <div className="admin-glass-row rounded-[24px] border-transparent px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--admin-text-muted)]">
            Login sebagai
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--admin-text-primary)]">@{username}</p>
        </div>
        <Link
          className={cn("mt-3", primaryLinkClass(isResetPasswordRoute))}
          href="/admin/reset-password"
        >
          <KeyRound className="h-4 w-4" />
          Reset Password
        </Link>
        <Link
          className="admin-row-surface admin-row-surface-hover mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[20px] px-4 py-3 text-sm font-medium text-[var(--admin-text-primary)] transition duration-300 hover:-translate-y-0.5"
          href="/dashboard"
        >
          <LayoutDashboard className="h-4 w-4" />
          Kembali ke Dashboard
        </Link>
        <form action={logoutAction}>
          <button
            className="admin-solid-button mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[20px] px-4 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5"
            type="submit"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}
