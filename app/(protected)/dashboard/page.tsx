import { cookies } from "next/headers";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  CreditCard,
  FileText,
  Infinity,
  PlayCircle,
  Settings2,
  Sparkles,
  UserRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { requireCurrentProfile } from "@/lib/auth";
import { getMemberDashboardStats } from "@/lib/member-dashboard-stats";
import { translateSimpleMemberCopy } from "@/lib/member-translations";
import { getMemberSubscription } from "@/lib/member-subscription";
import { parseSiteLanguage, SITE_LANGUAGE_COOKIE } from "@/lib/site-language";
import {
  memberGlassPanelClass,
  memberIconSurfaceClass,
  MemberPageHeader,
  memberSolidButtonClass,
  memberTextMutedClass,
  memberTextPrimaryClass,
  memberTextSecondaryClass,
} from "@/components/dashboard/member-ui";

type MemberStatCard = {
  accentClassName: string;
  icon: LucideIcon;
  label: string;
  value: string;
  valueIcon?: LucideIcon;
};

function formatMembershipDate(value: Date | null, language: string) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat(language, {
    dateStyle: "long",
  }).format(value);
}

function formatPlanDuration(durationMonths: number, isLifetime: boolean, labels: { lifetime: string; months: string }) {
  if (isLifetime) {
    return labels.lifetime;
  }

  return `${durationMonths} ${labels.months}`;
}

export default async function DashboardPage() {
  const [profile, cookieStore] = await Promise.all([requireCurrentProfile(), cookies()]);
  const currentLanguage = parseSiteLanguage(cookieStore.get(SITE_LANGUAGE_COOKIE)?.value);
  const [stats, membership, copy] = await Promise.all([
    getMemberDashboardStats(),
    getMemberSubscription(profile.id),
    translateSimpleMemberCopy(
      {
        active: "Aktif",
        activeUntil: "Berlaku sampai",
        badge: "Dashboard",
        dashboardDescription: "Ini pusat statistik member Anda.",
        detailSubscription: "Detail langganan",
        duration: "Durasi paket",
        emptyMembershipBody:
          "Saat ini akun Anda belum memiliki membership yang tercatat. Data paket akan muncul otomatis di sini setelah pendaftaran dan pembayaran selesai.",
        emptyMembershipTitle: "Belum ada data langganan",
        fallbackOpenSubscription: "Buka menu langganan",
        greeting: "Halo",
        inactive: "Inactive",
        lifetime: "Lifetime",
        months: "bulan",
        membershipTitle: "Langganan aktif",
        quickAccess: "Akses cepat",
        quickAccountDescription: "Kelola profil akun dan informasi kontak Anda.",
        quickAccountLabel: "Buka menu akun",
        quickAccountTitle: "Akun",
        quickGuideDescription: "Akses Pusat Belajar untuk Mulai, eCourse, AIOTrade, dan Cara Cuan dalam format video atau PDF.",
        quickGuideLabel: "Buka pusat belajar",
        quickGuideTitle: "Pusat Belajar",
        quickSubscriptionDescription: "Lihat masa aktif langganan anda.",
        quickSubscriptionLabel: "Cek langganan",
        quickSubscriptionTitle: "Langganan",
        startedAt: "Mulai aktif",
        statsBody: "Ringkasan panduan dan status akun yang bisa Anda akses saat ini.",
        statsTitle: "Statistik member",
        subscriptionStatus: "Status langganan",
        totalGuides: "Total Panduan",
        videoPdf: "Video / PDF",
        yesLifetime: "Lifetime",
        yourMembership: "Langganan aktif",
      },
      currentLanguage,
    ),
  ]);
  const translatedMembershipCopy =
    membership
      ? await translateSimpleMemberCopy(
          {
            description: membership.isLifetime
              ? "Akses tanpa batas waktu."
              : `Akses aktif selama ${formatPlanDuration(membership.durationMonths, membership.isLifetime, copy)}.`,
            planLabel: membership.planLabel,
          },
          currentLanguage,
        )
      : null;
  const quickLinks = [
    {
      description: copy.quickAccountDescription,
      href: "/dashboard/account/profile",
      icon: UserRound,
      label: copy.quickAccountLabel,
      title: copy.quickAccountTitle,
    },
    {
      description: copy.quickGuideDescription,
      href: "/dashboard/guides/start",
      icon: BookOpen,
      label: copy.quickGuideLabel,
      title: copy.quickGuideTitle,
    },
    {
      description: copy.quickSubscriptionDescription,
      href: "/dashboard/subscription",
      icon: CreditCard,
      label: copy.quickSubscriptionLabel,
      title: copy.quickSubscriptionTitle,
    },
  ] as const;

  const statCards: MemberStatCard[] = [
    {
      accentClassName: membership ? "bg-emerald-500/12 text-emerald-700" : "bg-slate-400/14 text-slate-700",
      icon: WalletCards,
      label: copy.subscriptionStatus,
      value: membership ? copy.active : copy.inactive,
    },
    {
      accentClassName: "bg-amber-500/12 text-amber-700",
      icon: BookOpen,
      label: copy.totalGuides,
      value: String(stats.publishedGuideCount),
    },
    {
      accentClassName: "bg-violet-500/12 text-violet-700",
      icon: PlayCircle,
      label: copy.videoPdf,
      value: `${stats.publishedVideoCount} / ${stats.publishedPdfCount}`,
      valueIcon: FileText,
    },
  ];

  const subscriptionToneClassName = membership?.isLifetime
    ? "bg-[linear-gradient(135deg,rgba(56,189,248,0.14)_0%,rgba(255,255,255,0)_42%,rgba(139,92,246,0.12)_100%)]"
    : "bg-[linear-gradient(135deg,rgba(16,185,129,0.12)_0%,rgba(255,255,255,0)_42%,rgba(245,158,11,0.12)_100%)]";

  return (
    <main className="flex-1 px-4 py-6 sm:px-5 lg:px-6 lg:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <MemberPageHeader
          badge={copy.badge}
          description={copy.dashboardDescription}
          icon={Sparkles}
          title={`${copy.greeting}, ${profile.username}`}
        />

        <section className={`px-6 py-6 sm:px-7 sm:py-7 ${memberGlassPanelClass}`}>
          <div className="flex items-start gap-3">
            <span className={memberIconSurfaceClass}>
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className={`text-[1.32rem] font-semibold tracking-tight sm:text-[1.45rem] ${memberTextPrimaryClass}`}>{copy.statsTitle}</h2>
              <p className={`mt-1 text-sm leading-7 ${memberTextSecondaryClass}`}>
                {copy.statsBody}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {statCards.map((item) => {
              const Icon = item.icon;
              const ValueIcon = item.valueIcon;

              return (
                <div
                  className="member-row-surface rounded-[24px] px-5 py-5"
                  key={item.label}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.24em] ${memberTextMutedClass}`}>
                        {item.label}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <p className={`text-[1.5rem] font-semibold tracking-tight sm:text-[1.65rem] ${memberTextPrimaryClass}`}>{item.value}</p>
                        {ValueIcon ? <ValueIcon className="h-4 w-4 text-[var(--member-text-muted)]" /> : null}
                      </div>
                    </div>
                    <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] ${item.accentClassName}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className={`relative overflow-hidden px-6 py-6 sm:px-7 sm:py-7 ${memberGlassPanelClass}`}>
          <div className={`pointer-events-none absolute inset-0 ${subscriptionToneClassName}`} />
          <div className="relative">
            <div className="flex items-start gap-3">
              <span className={memberIconSurfaceClass}>
                <CreditCard className="h-5 w-5" />
              </span>
              <div>
                <h2 className={`text-[1.32rem] font-semibold tracking-tight sm:text-[1.45rem] ${memberTextPrimaryClass}`}>{copy.membershipTitle}</h2>
                
              </div>
            </div>

            {membership ? (
              <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
                <article className="member-row-surface overflow-hidden rounded-[26px] px-5 py-5 sm:px-6 sm:py-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {copy.active}
                        </span>
                        {membership.isLifetime ? (
                          <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                            <Infinity className="h-3.5 w-3.5" />
                            {copy.yesLifetime}
                          </span>
                        ) : null}
                      </div>
                      <h3 className={`mt-4 text-[1.45rem] font-semibold tracking-tight sm:text-[1.62rem] ${memberTextPrimaryClass}`}>
                        {translatedMembershipCopy?.planLabel ?? membership.planLabel}
                      </h3>
                      <p className={`mt-2 text-sm leading-7 ${memberTextSecondaryClass}`}>
                        {translatedMembershipCopy?.description}
                      </p>
                    </div>

                    <Link
                      className={`${memberSolidButtonClass} h-11 px-4`}
                      href="/dashboard/subscription"
                    >
                      {copy.detailSubscription}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[22px] bg-white/55 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
                      <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.24em] ${memberTextMutedClass}`}>
                        {copy.duration}
                      </p>
                      <div className={`mt-3 inline-flex items-center gap-2 text-[1rem] font-semibold sm:text-lg ${memberTextPrimaryClass}`}>
                        {membership.isLifetime ? <Infinity className="h-4 w-4" /> : <CalendarRange className="h-4 w-4" />}
                        {formatPlanDuration(membership.durationMonths, membership.isLifetime, copy)}
                      </div>
                    </div>
                    <div className="rounded-[22px] bg-white/55 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
                      <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.24em] ${memberTextMutedClass}`}>
                        {copy.startedAt}
                      </p>
                      <p className={`mt-3 text-[1rem] font-semibold sm:text-lg ${memberTextPrimaryClass}`}>
                        {formatMembershipDate(membership.startedAt, currentLanguage)}
                      </p>
                    </div>
                    <div className="rounded-[22px] bg-white/55 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
                      <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.24em] ${memberTextMutedClass}`}>
                        {membership.isLifetime ? copy.lifetime : copy.activeUntil}
                      </p>
                      <p className={`mt-3 text-[1rem] font-semibold sm:text-lg ${memberTextPrimaryClass}`}>
                        {membership.isLifetime ? copy.lifetime : formatMembershipDate(membership.expiresAt, currentLanguage)}
                      </p>
                    </div>
                  </div>
                </article>

                
              </div>
            ) : (
              <div className="member-row-surface mt-6 rounded-[26px] px-5 py-5 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className={`text-[1.22rem] font-semibold tracking-tight sm:text-[1.3rem] ${memberTextPrimaryClass}`}>
                      {copy.emptyMembershipTitle}
                    </h3>
                    <p className={`mt-2 max-w-2xl text-sm leading-7 ${memberTextSecondaryClass}`}>
                      {copy.emptyMembershipBody}
                    </p>
                  </div>
                  <Link className={`${memberSolidButtonClass} h-11 px-4`} href="/dashboard/subscription">
                    {copy.fallbackOpenSubscription}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className={`px-6 py-6 sm:px-7 sm:py-7 ${memberGlassPanelClass}`}>
          <div className="flex items-start gap-3">
            <span className={memberIconSurfaceClass}>
              <Settings2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className={`text-[1.5rem] font-semibold tracking-tight ${memberTextPrimaryClass}`}>{copy.quickAccess}</h2>
              
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  className="member-row-surface member-row-surface-hover group rounded-[24px] px-5 py-5 transition duration-300 hover:-translate-y-0.5"
                  href={item.href}
                  key={item.href}
                >
                  <span className="member-icon-surface inline-flex h-11 w-11 items-center justify-center rounded-2xl transition group-hover:text-[var(--member-sidebar-active-text)]" style={{ background: "var(--member-icon-surface)" }}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className={`mt-4 text-[1.2rem] font-semibold tracking-tight ${memberTextPrimaryClass}`}>{item.title}</h3>
                  <p className={`mt-2 text-sm leading-7 ${memberTextSecondaryClass}`}>{item.description}</p>
                  <span className={`mt-5 inline-flex items-center text-sm font-semibold ${memberTextPrimaryClass}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
