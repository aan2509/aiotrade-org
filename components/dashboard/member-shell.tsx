"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { MemberSidebar } from "@/components/dashboard/member-sidebar";
import { MemberThemeToggle } from "@/components/dashboard/member-theme-toggle";
import { SiteLanguageSelector } from "@/components/shared/site-language-selector";
import { defaultMemberShellLabels, type MemberShellLabels } from "@/lib/member-shell-labels";
import { MEMBER_THEME_COOKIE, type MemberTheme } from "@/lib/member-theme";
import type { SiteLanguage, SiteLanguageOption } from "@/lib/site-language";
import { cn } from "@/lib/utils";

type MemberShellProps = {
  children: React.ReactNode;
  currentLanguage: SiteLanguage;
  initialTheme: MemberTheme;
  isAdmin: boolean;
  labels?: MemberShellLabels;
  languageOptions: SiteLanguageOption[];
  pathname: string;
  username: string;
};

function setThemeCookie(theme: MemberTheme) {
  document.cookie = `${MEMBER_THEME_COOKIE}=${theme}; path=/dashboard; max-age=31536000; samesite=lax`;
}

function getMobileHeaderTitle(pathname: string, labels: MemberShellLabels) {
  if (pathname === "/dashboard") {
    return labels.mobileTitles.dashboard;
  }

  if (pathname === "/dashboard/subscription") {
    return labels.mobileTitles.subscription;
  }

  if (pathname === "/dashboard/guides/start") {
    return labels.mobileTitles.guideStart;
  }

  if (pathname === "/dashboard/guides/activation") {
    return labels.mobileTitles.guideSetupBot;
  }

  if (pathname === "/dashboard/guides/bot-settings") {
    return labels.mobileTitles.guideStrategy;
  }

  if (pathname === "/dashboard/guides/files" || pathname === "/dashboard/guides") {
    return labels.mobileTitles.guideFiles;
  }

  if (pathname === "/dashboard/account/profile" || pathname === "/dashboard/account") {
    return labels.mobileTitles.accountProfile;
  }

  if (
    pathname === "/dashboard/account/reset-password" ||
    pathname === "/dashboard/reset-password"
  ) {
    return labels.mobileTitles.accountResetPassword;
  }

  return labels.mobileTitles.fallback;
}

export function MemberShell({
  children,
  currentLanguage,
  initialTheme,
  isAdmin,
  labels = defaultMemberShellLabels,
  languageOptions,
  pathname,
  username,
}: MemberShellProps) {
  const [theme, setTheme] = useState<MemberTheme>(initialTheme);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileHeaderScrolled, setMobileHeaderScrolled] = useState(false);
  const mobileHeaderTitle = getMobileHeaderTitle(pathname, labels);

  function handleThemeChange(nextTheme: MemberTheme) {
    setTheme(nextTheme);
    setThemeCookie(nextTheme);
  }

  useEffect(() => {
    if (!mobileSidebarOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    if (!mobileSidebarOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    function syncHeaderScrolled() {
      setMobileHeaderScrolled(window.scrollY > 10);
    }

    syncHeaderScrolled();
    window.addEventListener("scroll", syncHeaderScrolled, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncHeaderScrolled);
    };
  }, []);

  return (
    <div className="member-theme-scope relative min-h-screen overflow-x-clip" data-theme={theme}>
      <div className="member-shell-bg pointer-events-none absolute inset-0" />
      <div className="member-shell-overlay pointer-events-none absolute inset-0" />
      <div className="member-shell-topglow pointer-events-none absolute inset-x-0 top-0 h-40" />
      <div className="member-shell-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex max-w-[1680px] flex-col gap-4 px-4 py-4 lg:flex-row lg:gap-6 lg:px-6 lg:py-6">
        <div
          className={cn(
            "member-glass-panel sticky top-2 z-30 rounded-[24px] px-4 py-3 transition duration-300 lg:hidden",
            mobileHeaderScrolled
              ? "shadow-[0_22px_42px_rgba(15,23,42,0.16)] backdrop-blur-3xl"
              : "shadow-[0_12px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl",
          )}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--member-text-muted)]">
                  {labels.memberArea}
                </p>
                <p className="mt-1 text-base font-semibold text-[var(--member-text-primary)]">{mobileHeaderTitle}</p>
              </div>
              <button
                aria-expanded={mobileSidebarOpen}
                aria-label={mobileSidebarOpen ? labels.closeMenu : labels.openMenu}
                className="member-row-surface inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[var(--member-text-primary)] transition"
                onClick={() => setMobileSidebarOpen((current) => !current)}
                type="button"
              >
                {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <SiteLanguageSelector
                  currentLanguage={currentLanguage}
                  languages={languageOptions}
                  variant="member"
                />
              </div>
              <MemberThemeToggle onChange={handleThemeChange} theme={theme} />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "fixed inset-0 z-40 bg-[rgba(15,23,42,0.36)] backdrop-blur-sm transition duration-300 lg:hidden",
            mobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          onClick={() => setMobileSidebarOpen(false)}
        />

        <aside
          className={cn(
            "fixed inset-y-3 left-3 z-50 w-[min(86vw,320px)] transition duration-300 lg:static lg:inset-auto lg:z-auto lg:w-[300px] lg:flex-none",
            mobileSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-[108%] opacity-0 lg:translate-x-0 lg:opacity-100",
          )}
        >
          <div className="h-full lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
            <MemberSidebar
              isAdmin={isAdmin}
              currentLanguage={currentLanguage}
              labels={labels}
              languageOptions={languageOptions}
              onNavigate={() => setMobileSidebarOpen(false)}
              onThemeChange={handleThemeChange}
              pathname={pathname}
              theme={theme}
              username={username}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
