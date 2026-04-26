"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SESSION_STORAGE_KEY = "aiotrade:visit-tracked";

function shouldTrackPath(pathname: string | null) {
  if (!pathname) {
    return false;
  }

  return !pathname.startsWith("/admin") && !pathname.startsWith("/dashboard");
}

export function SiteVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldTrackPath(pathname) || typeof window === "undefined") {
      return;
    }

    if (window.sessionStorage.getItem(SESSION_STORAGE_KEY) === "1") {
      return;
    }

    window.sessionStorage.setItem(SESSION_STORAGE_KEY, "1");

    void fetch("/api/analytics/visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
      }),
      keepalive: true,
    }).catch(() => {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    });
  }, [pathname]);

  return null;
}
