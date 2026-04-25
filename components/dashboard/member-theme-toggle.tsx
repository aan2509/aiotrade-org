"use client";

import { Moon, Sun } from "lucide-react";
import type { MemberTheme } from "@/lib/member-theme";

type MemberThemeToggleProps = {
  onChange: (theme: MemberTheme) => void;
  theme: MemberTheme;
};

export function MemberThemeToggle({ onChange, theme }: MemberThemeToggleProps) {
  const nextTheme = theme === "light" ? "dark" : "light";
  const Icon = nextTheme === "dark" ? Moon : Sun;

  return (
    <button
      aria-label={nextTheme === "dark" ? "Aktifkan mode gelap" : "Aktifkan mode terang"}
      className="member-soft-button inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--member-text-primary)] transition duration-300 hover:-translate-y-0.5"
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
