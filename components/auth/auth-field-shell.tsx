"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthFieldShellProps = {
  children: ReactNode;
  error?: string;
};

export function AuthFieldShell({ children, error }: AuthFieldShellProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white/80 p-3 transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-[0_14px_30px_rgba(14,165,233,0.12)]",
        error
          ? "border-rose-300 shadow-[0_8px_24px_rgba(244,63,94,0.08)]"
          : "border-sky-100 hover:border-sky-200 focus-within:border-sky-400",
      )}
    >
      {children}
    </div>
  );
}
