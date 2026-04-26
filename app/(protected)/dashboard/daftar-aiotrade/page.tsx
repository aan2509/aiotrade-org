import { cookies } from "next/headers";
import { CheckCircle2, Megaphone } from "lucide-react";
import { MemberJoinAiotradeBanner } from "@/components/dashboard/member-join-aiotrade-banner";
import {
  memberGlassPanelClass,
  memberGlassRowClass,
  memberIconSurfaceClass,
  MemberPageHeader,
  memberTextPrimaryClass,
  memberTextSecondaryClass,
} from "@/components/dashboard/member-ui";
import { getHomepageContent } from "@/lib/homepage-content";
import { translateHomepageContent } from "@/lib/public-translations";
import { requireCurrentProfile } from "@/lib/auth";
import { translateSimpleMemberCopy } from "@/lib/member-translations";
import { parseSiteLanguage, SITE_LANGUAGE_COOKIE } from "@/lib/site-language";

export default async function DashboardJoinAiotradePage() {
  const cookieStore = await cookies();
  const currentLanguage = parseSiteLanguage(cookieStore.get(SITE_LANGUAGE_COOKIE)?.value);

  await requireCurrentProfile();

  const [content, copy] = await Promise.all([
    getHomepageContent(),
    translateSimpleMemberCopy(
      {
        badge: "Daftar AIOTrade",
        checklistOne: "Buka halaman join resmi yang sudah diarahkan admin.",
        checklistThree: "Lanjutkan proses registrasi atau penawaran yang sedang aktif.",
        checklistTwo: "Gunakan tombol untuk menuju halaman pendaftaran",
        note: "",
        pageDescription: "Masuk ke halaman ajakan bergabung AIOTrade yang sudah disiapkan admin untuk kebutuhan registrasi atau kampanye terbaru.",
        pageTitle: "Daftar AIOTrade",
        sectionTitle: "Langkah cepat untuk bergabung",
      },
      currentLanguage,
    ),
  ]);

  const translatedContent = await translateHomepageContent(content, currentLanguage);
  const memberCta = translatedContent.overview.memberCta;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-5 lg:px-6 lg:py-8">
      <MemberPageHeader
        badge={copy.badge}
        description={copy.pageDescription}
        icon={Megaphone}
        title={copy.pageTitle}
        toneClassName="bg-[linear-gradient(135deg,rgba(14,165,233,0.14)_0%,rgba(255,255,255,0)_40%,rgba(245,158,11,0.11)_100%)]"
      />

      <MemberJoinAiotradeBanner cta={memberCta} />

      <section className={`px-6 py-6 sm:px-7 sm:py-7 ${memberGlassPanelClass}`}>
        <div className="flex items-start gap-3">
          <span className={memberIconSurfaceClass}>
            <Megaphone className="h-5 w-5" />
          </span>
          <div>
            <h2 className={`text-[1.32rem] font-semibold tracking-tight sm:text-[1.48rem] ${memberTextPrimaryClass}`}>
              {copy.sectionTitle}
            </h2>
            <p className={`mt-2 max-w-3xl text-sm leading-7 ${memberTextSecondaryClass}`}>
              {copy.note}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {[copy.checklistOne, copy.checklistTwo, copy.checklistThree].map((item, index) => (
            <article className={`${memberGlassRowClass} rounded-[24px] px-5 py-5 sm:px-6`} key={item}>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <p className={`mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.24em] ${memberTextSecondaryClass}`}>
                Langkah 0{index + 1}
              </p>
              <p className={`mt-3 text-sm leading-7 ${memberTextPrimaryClass}`}>{item}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
