import { cookies } from "next/headers";
import { MemberLearningGuideSection } from "@/components/dashboard/member-guide-sections";
import { requireCurrentProfile } from "@/lib/auth";
import { getBotSettingsGuides } from "@/lib/member-guide-categories";
import { attachMemberGuideAccess, getPublishedMemberGuidePosts } from "@/lib/member-guides";
import { getPublicSignupPaymentSettings } from "@/lib/payment-gateway-settings";
import { translateMemberGuidePosts, translateSimpleMemberCopy } from "@/lib/member-translations";
import { parseSiteLanguage, SITE_LANGUAGE_COOKIE } from "@/lib/site-language";

export default async function DashboardGuideBotSettingsPage() {
  const cookieStore = await cookies();
  const currentLanguage = parseSiteLanguage(cookieStore.get(SITE_LANGUAGE_COOKIE)?.value);
  const profile = await requireCurrentProfile();
  const [paymentSettings, publishedGuides] = await Promise.all([
    getPublicSignupPaymentSettings(),
    getPublishedMemberGuidePosts(),
  ]);
  const guides = await translateMemberGuidePosts(
    await attachMemberGuideAccess(getBotSettingsGuides(publishedGuides), profile.id),
    currentLanguage,
  );
  const copy = await translateSimpleMemberCopy(
    {
      badge: "Pusat Belajar",
      description:
        "Materi khusus AIOTrade yang fokus ke penggunaan fitur, workflow, strategi, dan pemahaman produk yang lebih dalam.",
      emptyMessage: "Belum ada materi AIOTrade yang dipublish.",
      listDescription: "Semua materi yang masuk kategori ini akan muncul di sini.",
      listTitle: "Daftar video",
      nowPlaying: "Sedang diputar",
      openPdf: "Buka PDF",
      pdfDescription: "Dokumen PDF AIOTrade akan muncul di sini jika admin menambahkan materi tertulis.",
      pdfTitle: "Materi PDF",
      sectionDescription: "Pilih materi di samping untuk melihat preview utama dan mulai belajar lebih cepat.",
      title: "AIOTrade",
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
