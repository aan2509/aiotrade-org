"use client";

import { Moon, Sun } from "lucide-react";
import type { AdminTheme } from "@/lib/admin-theme";

type AdminThemeToggleProps = {
  onChange: (theme: AdminTheme) => void;
  theme: AdminTheme;
};

export function AdminThemeToggle({ onChange, theme }: AdminThemeToggleProps) {
  const nextTheme = theme === "light" ? "dark" : "light";
  const Icon = nextTheme === "dark" ? Moon : Sun;

  return (
    <button
      aria-label={nextTheme === "dark" ? "Aktifkan mode gelap" : "Aktifkan mode terang"}
      className="admin-soft-button inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--admin-text-primary)] transition duration-300 hover:-translate-y-0.5"
      onClick={() => onChange(nextTheme)}
      style={{
        backdropFilter: "blur(18px)",
      }}
      title={nextTheme === "dark" ? "Ganti ke dark mode" : "Ganti ke light mode"}
      type="button"
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">{nextTheme === "dark" ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}
