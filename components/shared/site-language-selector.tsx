"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Globe2, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  SITE_LANGUAGE_COOKIE,
  type SiteLanguage,
  type SiteLanguageOption,
} from "@/lib/site-language";
import { cn } from "@/lib/utils";

type SiteLanguageSelectorProps = {
  currentLanguage: SiteLanguage;
  languages: SiteLanguageOption[];
  variant?: "landing" | "member";
};

type LanguageUiCopy = {
  selectorDescription: string;
  selectorTitle: string;
  sheetDescription: string;
  sheetTitle: string;
  waitLabel: string;
  waitingDescription: string;
  waitingTitle: string;
};

type PanelPosition = {
  left: number;
  top: number;
  width: number;
};

type ScopedCssVariableStyle = CSSProperties & Record<`--${string}`, string>;

const MEMBER_PORTAL_VAR_NAMES = [
  "--member-text-primary",
  "--member-text-secondary",
  "--member-text-muted",
  "--member-language-panel-bg",
  "--member-language-panel-border",
  "--member-language-panel-shadow",
  "--member-language-divider",
  "--member-language-head-icon-bg",
  "--member-language-head-icon-text",
  "--member-language-flag-bg",
  "--member-language-flag-shadow",
  "--member-language-row-hover-bg",
  "--member-language-row-active-bg",
  "--member-language-row-active-shadow",
  "--member-language-badge-bg",
  "--member-language-badge-text",
] as const satisfies readonly `--${string}`[];

const LANGUAGE_UI_COPY: Record<"id" | "en", LanguageUiCopy> = {
  en: {
    selectorDescription: "Choose your website language",
    selectorTitle: "Language",
    sheetDescription: "The website will be translated",
    sheetTitle: "Choose language",
    waitLabel: "Please wait a moment",
    waitingDescription: "The page is being translated",
    waitingTitle: "Switching language",
  },
  id: {
    selectorDescription: "Pilih bahasa tampilan website",
    selectorTitle: "Bahasa",
    sheetDescription: "Website akan diterjemahkan.",
    sheetTitle: "Pilih bahasa",
    waitLabel: "Mohon tunggu sebentar",
    waitingDescription: "Halaman sedang diterjemahkan",
    waitingTitle: "Mengganti bahasa",
  },
};

const LANGUAGE_LABELS: Record<string, { primary: string; secondary: string }> = {
  ar: { primary: "العربية", secondary: "Arabic" },
  bg: { primary: "Български", secondary: "Bulgarian" },
  bn: { primary: "বাংলা", secondary: "Bengali" },
  cs: { primary: "Čeština", secondary: "Czech" },
  da: { primary: "Dansk", secondary: "Danish" },
  de: { primary: "Deutsch", secondary: "German" },
  el: { primary: "Ελληνικά", secondary: "Greek" },
  en: { primary: "English", secondary: "English" },
  es: { primary: "Español", secondary: "Spanish" },
  fa: { primary: "فارسی", secondary: "Persian" },
  fi: { primary: "Suomi", secondary: "Finnish" },
  fr: { primary: "Français", secondary: "French" },
  hi: { primary: "हिन्दी", secondary: "Hindi" },
  hr: { primary: "Hrvatski", secondary: "Croatian" },
  hu: { primary: "Magyar", secondary: "Hungarian" },
  id: { primary: "Bahasa Indonesia", secondary: "Indonesian" },
  it: { primary: "Italiano", secondary: "Italian" },
  ja: { primary: "日本語", secondary: "Japanese" },
  ko: { primary: "한국어", secondary: "Korean" },
  ms: { primary: "Bahasa Melayu", secondary: "Malay" },
  nl: { primary: "Nederlands", secondary: "Dutch" },
  no: { primary: "Norsk", secondary: "Norwegian" },
  pl: { primary: "Polski", secondary: "Polish" },
  pt: { primary: "Português", secondary: "Portuguese" },
  "pt-br": { primary: "Português (Brasil)", secondary: "Brazilian Portuguese" },
  ro: { primary: "Română", secondary: "Romanian" },
  ru: { primary: "Русский", secondary: "Russian" },
  sv: { primary: "Svenska", secondary: "Swedish" },
  th: { primary: "ไทย", secondary: "Thai" },
  tr: { primary: "Türkçe", secondary: "Turkish" },
  uk: { primary: "Українська", secondary: "Ukrainian" },
  ur: { primary: "اردو", secondary: "Urdu" },
  vi: { primary: "Tiếng Việt", secondary: "Vietnamese" },
  zh: { primary: "中文", secondary: "Chinese" },
  "zh-cn": { primary: "简体中文", secondary: "Chinese (Simplified)" },
  "zh-hans": { primary: "简体中文", secondary: "Chinese (Simplified)" },
  "zh-hant": { primary: "繁體中文", secondary: "Chinese (Traditional)" },
  "zh-tw": { primary: "繁體中文", secondary: "Chinese (Traditional)" },
};

function getLanguageFlag(language: string) {
  const normalized = language.trim().toLowerCase();

  if (normalized === "id") return "🇮🇩";
  if (normalized === "en") return "🇺🇸";
  if (normalized.startsWith("ar")) return "🇸🇦";
  if (normalized.startsWith("bn")) return "🇧🇩";
  if (normalized.startsWith("bg")) return "🇧🇬";
  if (normalized === "zh-cn" || normalized === "zh-hans" || normalized === "zh") return "🇨🇳";
  if (normalized === "zh-tw" || normalized === "zh-hant") return "🇹🇼";
  if (normalized.startsWith("hr")) return "🇭🇷";
  if (normalized.startsWith("cs")) return "🇨🇿";
  if (normalized.startsWith("da")) return "🇩🇰";
  if (normalized.startsWith("nl")) return "🇳🇱";
  if (normalized.startsWith("fi")) return "🇫🇮";
  if (normalized.startsWith("fr")) return "🇫🇷";
  if (normalized.startsWith("de")) return "🇩🇪";
  if (normalized.startsWith("el")) return "🇬🇷";
  if (normalized.startsWith("hi")) return "🇮🇳";
  if (normalized.startsWith("hu")) return "🇭🇺";
  if (normalized.startsWith("it")) return "🇮🇹";
  if (normalized.startsWith("ja")) return "🇯🇵";
  if (normalized.startsWith("ko")) return "🇰🇷";
  if (normalized.startsWith("ms")) return "🇲🇾";
  if (normalized.startsWith("no")) return "🇳🇴";
  if (normalized.startsWith("fa")) return "🇮🇷";
  if (normalized.startsWith("pl")) return "🇵🇱";
  if (normalized.startsWith("pt")) return "🇵🇹";
  if (normalized === "pt-br") return "🇧🇷";
  if (normalized.startsWith("ro")) return "🇷🇴";
  if (normalized.startsWith("ru")) return "🇷🇺";
  if (normalized.startsWith("es")) return "🇪🇸";
  if (normalized.startsWith("sv")) return "🇸🇪";
  if (normalized.startsWith("th")) return "🇹🇭";
  if (normalized.startsWith("tr")) return "🇹🇷";
  if (normalized.startsWith("uk")) return "🇺🇦";
  if (normalized.startsWith("ur")) return "🇵🇰";
  if (normalized.startsWith("vi")) return "🇻🇳";

  return "🌐";
}

function getLanguageCodeLabel(language: string) {
  return language.replace(/_/g, "-").toUpperCase();
}

function getLanguageDisplay(language: SiteLanguageOption) {
  const normalized = language.language.trim().toLowerCase();
  const known = LANGUAGE_LABELS[normalized];

  if (known) {
    return known;
  }

  return {
    primary: language.name,
    secondary: getLanguageCodeLabel(language.language),
  };
}

function getUiCopy(currentLanguage: SiteLanguage) {
  return currentLanguage.trim().toLowerCase().startsWith("en")
    ? LANGUAGE_UI_COPY.en
    : LANGUAGE_UI_COPY.id;
}

function writeSiteLanguageCookie(nextLanguage: SiteLanguage) {
  document.cookie = `${SITE_LANGUAGE_COOKIE}=${nextLanguage}; path=/; max-age=31536000; samesite=lax`;
}

function buildDesktopPanelPosition(trigger: HTMLElement): PanelPosition {
  const rect = trigger.getBoundingClientRect();
  const viewportPadding = 16;
  const width = Math.min(336, window.innerWidth - viewportPadding * 2);
  const left = Math.min(
    Math.max(viewportPadding, rect.right - width),
    window.innerWidth - width - viewportPadding,
  );

  return {
    left,
    top: rect.bottom + 12,
    width,
  };
}

function readScopedCssVariables(
  element: HTMLElement | null,
  names: readonly `--${string}`[],
): ScopedCssVariableStyle | undefined {
  if (!element || typeof window === "undefined") {
    return undefined;
  }

  const themeScope = element.closest(".member-theme-scope, .landing-theme-scope");

  if (!(themeScope instanceof HTMLElement)) {
    return undefined;
  }

  const computed = window.getComputedStyle(themeScope);
  const nextStyle: ScopedCssVariableStyle = {};

  for (const name of names) {
    const value = computed.getPropertyValue(name).trim();

    if (value) {
      nextStyle[name] = value;
    }
  }

  const theme = themeScope.getAttribute("data-theme");

  if (theme) {
    nextStyle.colorScheme = theme === "dark" ? "dark" : "light";
  }

  return nextStyle;
}

export function SiteLanguageSelector({
  currentLanguage,
  languages,
  variant = "landing",
}: SiteLanguageSelectorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingLanguage, setPendingLanguage] = useState<SiteLanguage | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [desktopPanelPosition, setDesktopPanelPosition] = useState<PanelPosition | null>(null);
  const [memberPortalStyle, setMemberPortalStyle] = useState<ScopedCssVariableStyle | undefined>(undefined);
  const selectorRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const desktopPanelRef = useRef<HTMLDivElement | null>(null);
  const mobileSheetRef = useRef<HTMLDivElement | null>(null);
  const effectivePendingLanguage =
    pendingLanguage && pendingLanguage !== currentLanguage ? pendingLanguage : null;
  const activeLanguage =
    languages.find((language) => language.language === (effectivePendingLanguage ?? currentLanguage)) ??
    languages[0];
  const activeCodeLabel = getLanguageCodeLabel(
    (effectivePendingLanguage ?? activeLanguage?.language ?? currentLanguage) || "id",
  );
  const uiCopy = getUiCopy(currentLanguage);
  const canUseDom = typeof window !== "undefined" && typeof document !== "undefined";

  const pendingLanguageLabel = useMemo(() => {
    const match = languages.find((language) => language.language === effectivePendingLanguage);
    return match ? getLanguageDisplay(match).primary : effectivePendingLanguage;
  }, [effectivePendingLanguage, languages]);

  useEffect(() => {
    if (!isOpen || !triggerRef.current) {
      return;
    }

    function syncDesktopPosition() {
      if (!triggerRef.current) {
        return;
      }

      setDesktopPanelPosition(buildDesktopPanelPosition(triggerRef.current));

      if (variant === "member") {
        setMemberPortalStyle(readScopedCssVariables(triggerRef.current, MEMBER_PORTAL_VAR_NAMES));
      }
    }

    syncDesktopPosition();
    window.addEventListener("resize", syncDesktopPosition);
    window.addEventListener("scroll", syncDesktopPosition, true);

    return () => {
      window.removeEventListener("resize", syncDesktopPosition);
      window.removeEventListener("scroll", syncDesktopPosition, true);
    };
  }, [isOpen, variant]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        selectorRef.current?.contains(target) ||
        desktopPanelRef.current?.contains(target) ||
        mobileSheetRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleChange(nextLanguage: SiteLanguage) {
    if (!nextLanguage || nextLanguage === currentLanguage) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    setPendingLanguage(nextLanguage);
    writeSiteLanguageCookie(nextLanguage);
    startTransition(() => {
      router.refresh();
    });
  }

  const trigger = (
    <div className="relative" ref={selectorRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={uiCopy.selectorTitle}
        className={cn(
          "relative inline-flex h-10 min-w-[84px] items-center gap-2 overflow-hidden rounded-2xl border pl-2.5 pr-8 backdrop-blur-xl transition duration-300",
          variant === "landing"
            ? "border-white/14 bg-white/8 text-[var(--landing-header-text)] shadow-[0_10px_28px_rgba(15,23,42,0.12)] hover:bg-white/12"
            : "border-[var(--member-row-border)] bg-[var(--member-soft-button-bg)] text-[var(--member-text-primary)] shadow-[var(--member-soft-button-shadow)] hover:bg-[var(--member-soft-button-hover-bg)]",
          (isPending || effectivePendingLanguage) && "opacity-90",
        )}
        disabled={isPending || Boolean(effectivePendingLanguage)}
        onClick={() => setIsOpen((current) => !current)}
        ref={triggerRef}
        type="button"
      >
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/12 text-[0.95rem]">
          {getLanguageFlag(effectivePendingLanguage ?? currentLanguage)}
        </span>
        <span className="min-w-0 text-left">
          <span className="block truncate text-[0.8rem] font-semibold uppercase leading-none tracking-[0.16em]">
            {activeCodeLabel}
          </span>
        </span>
        {isPending || effectivePendingLanguage ? (
          <LoaderCircle
            className={cn(
              "pointer-events-none absolute right-3 h-4 w-4 animate-spin",
              variant === "landing"
                ? "text-[var(--landing-header-text)]"
                : "text-[var(--member-text-secondary)]",
            )}
          />
        ) : (
          <ChevronDown
            className={cn(
              "pointer-events-none absolute right-3 h-4 w-4 transition duration-300",
              isOpen && "rotate-180",
              variant === "landing"
                ? "text-[var(--landing-header-text)]"
                : "text-[var(--member-text-secondary)]",
            )}
          />
        )}
      </button>
    </div>
  );

  const desktopPanel =
    canUseDom && isOpen && desktopPanelPosition
      ? createPortal(
          <div className="pointer-events-none fixed inset-0 z-[110] hidden sm:block">
            <div
              className={cn(
                "pointer-events-auto fixed overflow-hidden rounded-[26px] border backdrop-blur-2xl transition duration-200",
                variant === "landing"
                  ? "border-white/14 bg-[rgba(10,18,34,0.92)] text-white shadow-[0_28px_60px_rgba(2,6,23,0.34)]"
                  : "member-language-panel text-[var(--member-text-primary)]",
              )}
              ref={desktopPanelRef}
              style={{
                left: desktopPanelPosition.left,
                top: desktopPanelPosition.top,
                width: desktopPanelPosition.width,
                ...(variant === "member" ? memberPortalStyle : undefined),
              }}
            >
              <div className={cn("px-4 py-3", variant === "landing" ? "border-b border-white/8" : "member-language-divider border-b")}>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-2xl",
                      variant === "landing"
                        ? "bg-white/10 text-white"
                        : "member-language-head-icon",
                    )}
                  >
                    <Globe2 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{uiCopy.selectorTitle}</p>
                    <p
                      className={cn(
                        "mt-0.5 text-xs",
                        variant === "landing" ? "text-white/58" : "text-[var(--member-text-secondary)]",
                      )}
                    >
                      {uiCopy.selectorDescription}
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-h-[22rem] overflow-y-auto p-2">
                {languages.map((language) => {
                  const active = language.language === (effectivePendingLanguage ?? currentLanguage);
                  const display = getLanguageDisplay(language);

                  return (
                    <button
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition duration-200",
                        active
                          ? variant === "landing"
                            ? "bg-white/10 text-white"
                            : "member-language-row-active text-[var(--member-text-primary)]"
                          : variant === "landing"
                            ? "text-white/86 hover:bg-white/6"
                            : "member-language-row-hover text-[var(--member-text-secondary)] hover:text-[var(--member-text-primary)]",
                      )}
                      key={language.language}
                      onClick={() => handleChange(language.language)}
                      type="button"
                    >
                      <span
                        className={cn(
                          "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[1.1rem]",
                          variant === "landing"
                            ? "bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                            : "member-language-flag",
                        )}
                      >
                        {getLanguageFlag(language.language)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{display.primary}</span>
                        <span
                          className={cn(
                            "mt-0.5 block truncate text-[0.76rem]",
                            variant === "landing" ? "text-white/56" : "text-[var(--member-text-muted)]",
                          )}
                        >
                          {display.secondary}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em]",
                          variant === "landing" ? "bg-white/8 text-white/62" : "member-language-badge",
                        )}
                      >
                        {getLanguageCodeLabel(language.language)}
                      </span>
                      {active ? <Check className="h-4 w-4 shrink-0" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  const mobileSheet =
    canUseDom && isOpen
      ? createPortal(
          <div
            className="fixed inset-0 z-[115] flex items-end bg-[rgba(8,15,28,0.38)] px-3 pb-3 pt-16 backdrop-blur-sm sm:hidden"
            onClick={() => setIsOpen(false)}
          >
            <div
              className={cn(
                "w-full overflow-hidden rounded-[28px] border backdrop-blur-2xl",
                variant === "landing"
                  ? "border-white/14 bg-[rgba(10,18,34,0.96)] text-white shadow-[0_28px_60px_rgba(2,6,23,0.38)]"
                  : "member-language-panel text-[var(--member-text-primary)]",
              )}
              onClick={(event) => event.stopPropagation()}
              ref={mobileSheetRef}
              style={variant === "member" ? memberPortalStyle : undefined}
            >
              <div className={cn("px-4 py-4", variant === "landing" ? "border-b border-white/8" : "member-language-divider border-b")}>
                <div className={cn("mx-auto mb-3 h-1.5 w-12 rounded-full", variant === "landing" ? "bg-white/16" : "bg-[var(--member-language-divider)]")} />
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex h-11 w-11 items-center justify-center rounded-2xl",
                      variant === "landing"
                        ? "bg-white/10 text-white"
                        : "member-language-head-icon",
                    )}
                  >
                    <Globe2 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{uiCopy.sheetTitle}</p>
                    <p
                      className={cn(
                        "mt-0.5 text-xs",
                        variant === "landing" ? "text-white/58" : "text-[var(--member-text-secondary)]",
                      )}
                    >
                      {uiCopy.sheetDescription}
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-h-[68vh] overflow-y-auto p-2">
                {languages.map((language) => {
                  const active = language.language === (effectivePendingLanguage ?? currentLanguage);
                  const display = getLanguageDisplay(language);

                  return (
                    <button
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition duration-200",
                        active
                          ? variant === "landing"
                            ? "bg-white/10 text-white"
                            : "member-language-row-active text-[var(--member-text-primary)]"
                          : variant === "landing"
                            ? "text-white/86 hover:bg-white/6"
                            : "member-language-row-hover text-[var(--member-text-secondary)] hover:text-[var(--member-text-primary)]",
                      )}
                      key={`mobile-${language.language}`}
                      onClick={() => handleChange(language.language)}
                      type="button"
                    >
                      <span
                        className={cn(
                          "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[1.1rem]",
                          variant === "landing"
                            ? "bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                            : "member-language-flag",
                        )}
                      >
                        {getLanguageFlag(language.language)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{display.primary}</span>
                        <span
                          className={cn(
                            "mt-0.5 block truncate text-[0.76rem]",
                            variant === "landing" ? "text-white/56" : "text-[var(--member-text-muted)]",
                          )}
                        >
                          {display.secondary}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em]",
                          variant === "landing" ? "bg-white/8 text-white/62" : "member-language-badge",
                        )}
                      >
                        {getLanguageCodeLabel(language.language)}
                      </span>
                      {active ? <Check className="h-4 w-4 shrink-0" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  const loadingOverlay =
    canUseDom && (isPending || effectivePendingLanguage)
      ? createPortal(
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(8,15,28,0.28)] px-4 backdrop-blur-sm">
            <div
              className={cn(
                "w-full max-w-sm rounded-[28px] border px-5 py-5 shadow-[0_28px_70px_rgba(15,23,42,0.18)] backdrop-blur-2xl",
                variant === "landing"
                  ? "border-white/14 bg-[rgba(255,255,255,0.82)] text-slate-900"
                  : "border-[var(--member-row-border)] bg-[var(--member-panel-bg)] text-[var(--member-text-primary)]",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                    variant === "landing"
                      ? "bg-sky-500/12 text-sky-700"
                      : "bg-[var(--member-soft-button-hover-bg)] text-[var(--member-text-primary)]",
                  )}
                >
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{uiCopy.waitingTitle}</p>
                  <p
                    className={cn(
                      "mt-1 text-sm leading-6",
                      variant === "landing" ? "text-slate-600" : "text-[var(--member-text-secondary)]",
                    )}
                  >
                    {uiCopy.waitingDescription}
                    {pendingLanguageLabel ? ` ${currentLanguage.startsWith("en") ? "to" : "ke"} ${pendingLanguageLabel}.` : "."}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700">
                    <Check className="h-3.5 w-3.5" />
                    {uiCopy.waitLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {trigger}
      {desktopPanel}
      {mobileSheet}
      {loadingOverlay}
    </>
  );
}
