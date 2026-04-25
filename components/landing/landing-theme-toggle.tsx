"use client";

import { Moon, Sun } from "lucide-react";
import type { LandingTheme } from "@/lib/landing-theme";

type LandingThemeToggleProps = {
  onChange: (theme: LandingTheme) => void;
  theme: LandingTheme;
};

export function LandingThemeToggle({ onChange, theme }: LandingThemeToggleProps) {
  const nextTheme = theme === "light" ? "dark" : "light";
  const Icon = nextTheme === "dark" ? Moon : Sun;

  return (
    <button
      aria-label={nextTheme === "dark" ? "Aktifkan mode gelap" : "Aktifkan mode terang"}
      className="landing-glass-button inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--landing-toggle-text)] transition duration-300 hover:-translate-y-0.5"
      onClick={() => onChange(nextTheme)}
      title={nextTheme === "dark" ? "Ganti ke dark mode" : "Ganti ke light mode"}
      type="button"
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">{nextTheme === "dark" ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}
