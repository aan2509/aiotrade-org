"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ADMIN_THEME_COOKIE, type AdminTheme } from "@/lib/admin-theme";

type AdminShellProps = {
  children: React.ReactNode;
  initialTheme: AdminTheme;
  pathname: string;
  username: string;
};

function setThemeCookie(theme: AdminTheme) {
  document.cookie = `${ADMIN_THEME_COOKIE}=${theme}; path=/admin; max-age=31536000; samesite=lax`;
}

export function AdminShell({ children, initialTheme, pathname, username }: AdminShellProps) {
  const [theme, setTheme] = useState<AdminTheme>(initialTheme);

  function handleThemeChange(nextTheme: AdminTheme) {
    setTheme(nextTheme);
    setThemeCookie(nextTheme);
  }

  return (
    <div
      className="admin-theme-scope admin-shell-bg relative min-h-screen overflow-x-hidden text-[var(--admin-text-primary)]"
      data-theme={theme}
    >
      <div className="admin-shell-overlay pointer-events-none absolute inset-0" />
      <div className="admin-shell-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-[-10%] top-0 h-[32rem] w-[32rem] rounded-full bg-sky-200/24 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-8rem] right-[-8%] h-[28rem] w-[28rem] rounded-full bg-cyan-100/28 blur-[120px]" />

      <div className="relative mx-auto flex max-w-[1720px] flex-col items-start gap-6 px-4 py-5 lg:h-[calc(100vh-4rem)] lg:flex-row lg:gap-8 lg:px-6 lg:py-8">
        <aside className="w-full self-start lg:h-full lg:w-[292px] lg:flex-none">
          <AdminSidebar
            onThemeChange={handleThemeChange}
            pathname={pathname}
            theme={theme}
            username={username}
          />
        </aside>

        <main className="min-w-0 flex-1 pt-1 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-1 lg:pt-5">
          {children}
        </main>
      </div>
    </div>
  );
}
