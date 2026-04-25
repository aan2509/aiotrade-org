import type { LucideIcon } from "lucide-react";

export const memberGlassPanelClass =
  "member-glass-panel rounded-[30px] backdrop-blur-2xl";

export const memberGlassRowClass =
  "member-glass-row rounded-[24px] px-5 py-5";

export const memberTextPrimaryClass = "text-[var(--member-text-primary)]";
export const memberTextSecondaryClass = "text-[var(--member-text-secondary)]";
export const memberTextMutedClass = "text-[var(--member-text-muted)]";
export const memberIconSurfaceClass =
  "member-icon-surface inline-flex h-12 w-12 items-center justify-center rounded-2xl";
export const memberSoftButtonClass =
  "member-soft-button inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-medium text-[var(--member-text-primary)] transition duration-300 hover:-translate-y-0.5";
export const memberSolidButtonClass =
  "member-solid-button inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5";

type MemberPageHeaderProps = {
  badge: string;
  description: string;
  icon: LucideIcon;
  title: string;
  toneClassName?: string;
};

export function MemberPageHeader({
  badge,
  description,
  icon: Icon,
  title,
  toneClassName = "bg-[linear-gradient(135deg,rgba(16,185,129,0.09)_0%,rgba(255,255,255,0)_38%,rgba(245,158,11,0.08)_100%)]",
}: MemberPageHeaderProps) {
  return (
    <section
      className={`relative overflow-hidden px-6 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8 ${memberGlassPanelClass}`}
    >
      <div className={`pointer-events-none absolute inset-0 ${toneClassName}`} />
      <div className="relative space-y-4">
        <div className="member-page-badge inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.24em]">
          <Icon className="h-3.5 w-3.5" />
          {badge}
        </div>
        <div>
          <h1 className={`text-[1.78rem] font-semibold tracking-tight sm:text-[2.2rem] lg:text-[2.5rem] ${memberTextPrimaryClass}`}>
            {title}
          </h1>
          <p className={`mt-3 max-w-3xl text-[0.96rem] leading-7 sm:text-base sm:leading-8 ${memberTextSecondaryClass}`}>{description}</p>
        </div>
      </div>
    </section>
  );
}
