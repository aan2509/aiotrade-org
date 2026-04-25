import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import heroImage from "../../bahan foto/hero.png";
import { SiteLanguageSelector } from "@/components/shared/site-language-selector";
import type { SiteLanguage, SiteLanguageOption } from "@/lib/site-language";

type AuthPageShellProps = {
  badge: ReactNode;
  children: ReactNode;
  currentLanguage?: SiteLanguage;
  description: string;
  languageOptions?: SiteLanguageOption[];
  sideBadge: string;
  sideTitle: string;
  title: string;
  backLabel?: string;
};

export function AuthPageShell({
  badge,
  backLabel = "Kembali ke halaman utama",
  children,
  currentLanguage = "id",
  description,
  languageOptions = [],
  sideBadge,
  sideTitle,
  title,
}: AuthPageShellProps) {
  return (
    <main className="flex flex-1 bg-[#08111f]">
      <div className="grid min-h-screen w-full lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <Image
            alt="Komunitas AIOTrade di acara edukasi."
            className="absolute inset-0 h-full w-full object-cover"
            fill
            priority
            sizes="50vw"
            src={heroImage}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,18,0.45)_0%,rgba(5,10,18,0.72)_48%,rgba(5,10,18,0.9)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(3,7,18,0.84)_0%,rgba(8,17,31,0.54)_46%,rgba(3,7,18,0.8)_100%)]" />

          <div className="relative flex h-full flex-col justify-between px-10 py-10 text-white xl:px-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/90 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 animate-pulse text-[#6dd3ff]" />
                {sideBadge}
              </div>
              <h1 className="mt-8 max-w-xl text-[3.25rem] font-semibold leading-[1.08] tracking-[-0.03em] xl:text-[3.8rem]">
                {sideTitle}
              </h1>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-8 lg:px-10">
          <div className="w-full max-w-xl">
            <div className="mb-6 flex items-center justify-between gap-3">
              <Link
                className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
                href="/"
              >
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Link>

              <SiteLanguageSelector
                currentLanguage={currentLanguage}
                languages={languageOptions}
                variant="landing"
              />
            </div>

            <div className="rounded-lg border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_100%)] p-6 shadow-[0_24px_60px_rgba(2,8,23,0.38)] sm:p-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-sky-700">
                  {badge}
                </div>
                <h2 className="text-[2.2rem] font-semibold leading-[1.12] tracking-[-0.025em] text-slate-950 sm:text-[2.5rem]">
                  {title}
                </h2>
                <p className="max-w-md text-[0.98rem] leading-7 text-slate-600">{description}</p>
              </div>

              <div className="mt-8">{children}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
