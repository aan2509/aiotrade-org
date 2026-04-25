import { cookies } from "next/headers";
import { CalendarRange, CheckCircle2, CreditCard, Infinity, Sparkles } from "lucide-react";
import {
  memberGlassPanelClass,
  memberGlassRowClass,
  memberIconSurfaceClass,
  MemberPageHeader,
  memberTextPrimaryClass,
  memberTextSecondaryClass,
} from "@/components/dashboard/member-ui";
import { requireCurrentProfile } from "@/lib/auth";
import { translateSimpleMemberCopy } from "@/lib/member-translations";
import { getMemberSubscription } from "@/lib/member-subscription";
import { parseSiteLanguage, SITE_LANGUAGE_COOKIE } from "@/lib/site-language";
import { getPublicSignupPaymentSettings } from "@/lib/payment-gateway-settings";

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

export default async function DashboardSubscriptionPage() {
  const [profile, cookieStore] = await Promise.all([requireCurrentProfile(), cookies()]);
  const currentLanguage = parseSiteLanguage(cookieStore.get(SITE_LANGUAGE_COOKIE)?.value);
  const [paymentSettings, membership, copy] = await Promise.all([
    getPublicSignupPaymentSettings(),
    getMemberSubscription(profile.id),
    translateSimpleMemberCopy(
      {
        active: "Aktif",
        activeUntil: "Berlaku sampai",
        badge: "Subscription",
        duration: "Durasi",
        emptyBody:
          "Saat ini akun Anda belum memiliki data langganan yang tersimpan. Membership baru akan tercatat otomatis setelah signup berhasil dengan paket yang dipilih.",
        emptyTitle: "Belum ada langganan tercatat",
        lifetime: "Lifetime",
        months: "bulan",
        pageDescription: "Lihat status subscription anda.",
        pageTitle: "Member Subscription",
        paymentReference: "Referensi payment",
        planId: "ID paket",
        startedAt: "Mulai aktif",
        statusAccess: "Status akses",
        statusBodyLimited:
          "Akun Anda memakai paket dengan masa aktif terbatas. Pastikan tanggal berlaku tetap sesuai kebutuhan akses Anda.",
        statusBodyLifetime:
          "Akun Anda memakai paket lifetime, jadi akses member tidak memiliki batas akhir.",
        statusTitle: "Status langganan",
        yourPackage: "Paket akun Anda",
      },
      currentLanguage,
    ),
  ]);

  const activePlan =
    membership
      ? paymentSettings.plans.find((plan) => plan.id === membership.planId) ??
        ({
          description: "Paket aktif yang tercatat pada akun Anda.",
          durationMonths: membership.durationMonths,
          id: membership.planId,
          isLifetime: membership.isLifetime,
          label: membership.planLabel,
          price: 0,
        } as const)
      : null;
  const translatedPlanCopy =
    membership && activePlan
      ? await translateSimpleMemberCopy(
          {
            description: activePlan.description,
            planLabel: membership.planLabel,
          },
          currentLanguage,
        )
      : null;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-5 lg:px-6 lg:py-8">
      <MemberPageHeader
        badge={copy.badge}
        description={copy.pageDescription}
        icon={CreditCard}
        title={copy.pageTitle}
        toneClassName="bg-[linear-gradient(135deg,rgba(245,158,11,0.12)_0%,rgba(255,255,255,0)_44%,rgba(168,85,247,0.09)_100%)]"
      />

      <section className={`px-6 py-6 sm:px-7 sm:py-7 ${memberGlassPanelClass}`}>
        <div className="flex items-start gap-3">
          <span className={memberIconSurfaceClass}>
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h2 className={`text-[1.32rem] font-semibold tracking-tight sm:text-[1.48rem] ${memberTextPrimaryClass}`}>{copy.yourPackage}</h2>
            
          </div>
        </div>

        {membership && activePlan ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
            <article className={`${memberGlassRowClass} rounded-[24px] px-5 py-5 sm:px-6`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className={`text-[1rem] font-semibold sm:text-lg ${memberTextPrimaryClass}`}>{translatedPlanCopy?.planLabel ?? membership.planLabel}</p>
                  <p className={`mt-2 text-sm leading-7 ${memberTextSecondaryClass}`}>{translatedPlanCopy?.description ?? activePlan.description}</p>
                </div>
                <span className="rounded-full bg-[rgba(227,244,253,0.96)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-800">
                  {copy.active}
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/55 p-4">
                  <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.24em] ${memberTextSecondaryClass}`}>{copy.duration}</p>
                  <div className={`mt-3 inline-flex items-center gap-2 text-[1rem] font-semibold sm:text-lg ${memberTextPrimaryClass}`}>
                    {membership.isLifetime ? <Infinity className="h-4 w-4" /> : <CalendarRange className="h-4 w-4" />}
                    {formatPlanDuration(membership.durationMonths, membership.isLifetime, copy)}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/55 p-4">
                  <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.24em] ${memberTextSecondaryClass}`}>{copy.startedAt}</p>
                  <p className={`mt-3 text-[1rem] font-semibold sm:text-lg ${memberTextPrimaryClass}`}>{formatMembershipDate(membership.startedAt, currentLanguage)}</p>
                </div>
                <div className="rounded-2xl bg-white/55 p-4">
                  <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.24em] ${memberTextSecondaryClass}`}>
                    {membership.isLifetime ? copy.statusAccess : copy.activeUntil}
                  </p>
                  <p className={`mt-3 text-[1rem] font-semibold sm:text-lg ${memberTextPrimaryClass}`}>
                    {membership.isLifetime ? copy.lifetime : formatMembershipDate(membership.expiresAt, currentLanguage)}
                  </p>
                </div>
              </div>
            </article>

            <article className={`${memberGlassRowClass} rounded-[24px] px-5 py-5 sm:px-6`}>
              <div className="flex items-start gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div>
                  <p className={`text-[1rem] font-semibold sm:text-lg ${memberTextPrimaryClass}`}>{copy.statusTitle}</p>
                  <p className={`mt-2 text-sm leading-7 ${memberTextSecondaryClass}`}>
                    {membership.isLifetime
                      ? copy.statusBodyLifetime
                      : copy.statusBodyLimited}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl bg-white/55 p-4">
                  <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.24em] ${memberTextSecondaryClass}`}>{copy.planId}</p>
                  <p className={`mt-3 font-mono text-[1rem] font-semibold sm:text-lg ${memberTextPrimaryClass}`}>{membership.planId}</p>
                </div>
                <div className="rounded-2xl bg-white/55 p-4">
                  <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.24em] ${memberTextSecondaryClass}`}>{copy.paymentReference}</p>
                  <p className={`mt-3 break-all font-mono text-sm font-semibold ${memberTextPrimaryClass}`}>
                    {membership.paymentReferenceId ?? "-"}
                  </p>
                </div>
              </div>
            </article>
          </div>
        ) : (
          <div className={`mt-6 ${memberGlassRowClass}`}>
            <p className={`text-[1rem] font-semibold sm:text-lg ${memberTextPrimaryClass}`}>{copy.emptyTitle}</p>
            <p className={`mt-2 text-sm leading-7 ${memberTextSecondaryClass}`}>
              {copy.emptyBody}
            </p>
          </div>
        )}

        
      </section>
    </div>
  );
}
