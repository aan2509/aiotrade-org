import { cookies } from "next/headers";
import { MemberLearningGuideSection } from "@/components/dashboard/member-guide-sections";
import { requireCurrentProfile } from "@/lib/auth";
import { getPdfGuides } from "@/lib/member-guide-categories";
import { attachMemberGuideAccess, getPublishedMemberGuidePosts } from "@/lib/member-guides";
import { getPublicSignupPaymentSettings } from "@/lib/payment-gateway-settings";
import { translateMemberGuidePosts, translateSimpleMemberCopy } from "@/lib/member-translations";
import { parseSiteLanguage, SITE_LANGUAGE_COOKIE } from "@/lib/site-language";

export default async function DashboardGuideFilesPage() {
  const cookieStore = await cookies();
  const currentLanguage = parseSiteLanguage(cookieStore.get(SITE_LANGUAGE_COOKIE)?.value);
  const profile = await requireCurrentProfile();
  const [paymentSettings, publishedGuides] = await Promise.all([
    getPublicSignupPaymentSettings(),
    getPublishedMemberGuidePosts(),
  ]);
  const guides = await translateMemberGuidePosts(
    await attachMemberGuideAccess(getPdfGuides(publishedGuides), profile.id),
    currentLanguage,
  );
  const copy = await translateSimpleMemberCopy(
    {
      badge: "Pusat Belajar",
      description:
        "Kategori Cara Cuan berisi materi praktik, studi kasus, dan referensi yang bisa dikemas sebagai video maupun PDF.",
      emptyMessage: "Belum ada materi Cara Cuan yang dipublish.",
      listDescription: "Semua video dalam kategori ini akan muncul di sini.",
      listTitle: "Daftar video",
      nowPlaying: "Sedang diputar",
      openPdf: "Buka PDF",
      pdfDescription: "Dokumen PDF Cara Cuan akan muncul di sini jika admin menambahkan materi tertulis.",
      pdfTitle: "Materi PDF",
      sectionDescription: "Pilih materi video untuk melihat preview utama dan lanjut belajar lebih cepat.",
      title: "Cara Cuan",
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
