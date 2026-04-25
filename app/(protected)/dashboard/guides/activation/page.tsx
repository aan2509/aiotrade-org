import { cookies } from "next/headers";
import { MemberLearningGuideSection } from "@/components/dashboard/member-guide-sections";
import { requireCurrentProfile } from "@/lib/auth";
import { getActivationGuides } from "@/lib/member-guide-categories";
import { attachMemberGuideAccess, getPublishedMemberGuidePosts } from "@/lib/member-guides";
import { getPublicSignupPaymentSettings } from "@/lib/payment-gateway-settings";
import { translateMemberGuidePosts, translateSimpleMemberCopy } from "@/lib/member-translations";
import { parseSiteLanguage, SITE_LANGUAGE_COOKIE } from "@/lib/site-language";

export default async function DashboardGuideActivationPage() {
  const cookieStore = await cookies();
  const currentLanguage = parseSiteLanguage(cookieStore.get(SITE_LANGUAGE_COOKIE)?.value);
  const profile = await requireCurrentProfile();
  const [paymentSettings, publishedGuides] = await Promise.all([
    getPublicSignupPaymentSettings(),
    getPublishedMemberGuidePosts(),
  ]);
  const guides = await translateMemberGuidePosts(
    await attachMemberGuideAccess(getActivationGuides(publishedGuides), profile.id),
    currentLanguage,
  );
  const copy = await translateSimpleMemberCopy(
    {
      badge: "Pusat Belajar",
      description: "Materi eCourse untuk alur belajar yang lebih terstruktur, baik dalam bentuk video maupun PDF pendukung.",
      emptyMessage: "Belum ada materi eCourse yang dipublish.",
      listDescription: "Semua materi yang masuk kategori ini akan muncul di sini.",
      listTitle: "Daftar video",
      nowPlaying: "Sedang diputar",
      openPdf: "Buka PDF",
      pdfDescription: "Dokumen PDF eCourse akan muncul di sini jika admin menambahkan materi tertulis.",
      pdfTitle: "Materi PDF",
      sectionDescription: "Pilih materi di samping untuk melihat preview utama dan mulai belajar lebih cepat.",
      title: "eCourse",
      videoTitle: "Video pembelajaran",
    },
    currentLanguage,
  );

  return (
    <MemberLearningGuideSection
      badge={copy.badge}
      description={copy.description}
      emptyMessage={copy.emptyMessage}
      guides={guides}
      labels={copy}
      paymentSettings={paymentSettings}
      title={copy.title}
    />
  );
}
