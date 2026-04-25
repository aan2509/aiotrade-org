import { cookies } from "next/headers";
import { requireCurrentProfile } from "@/lib/auth";
import { MemberAccountOverview } from "@/components/dashboard/member-account-overview";
import { parseSiteLanguage, SITE_LANGUAGE_COOKIE } from "@/lib/site-language";
import { translateSimpleMemberCopy } from "@/lib/member-translations";

export default async function DashboardAccountProfilePage() {
  const [profile, cookieStore] = await Promise.all([requireCurrentProfile(), cookies()]);
  const currentLanguage = parseSiteLanguage(cookieStore.get(SITE_LANGUAGE_COOKIE)?.value);
  const labels = await translateSimpleMemberCopy(
    {
      editDescription: "Perbarui nomor WhatsApp akun Anda dari sini.",
      editNote: "Pastikan nomor WhatsApp Anda aktif agar tim kami mudah menghubungi Anda bila diperlukan.",
      editTitle: "Edit info akun",
      email: "Email",
      pageBadge: "Akun Member",
      pageDescription: "Informasi utama akun Anda.",
      pageTitle: "Profil akun",
      saveProfileChanges: "Simpan perubahan",
      saveProfilePending: "Menyimpan perubahan...",
      sectionDescription: "Detail profil dan kontak utama yang tersimpan pada akun member Anda.",
      sectionTitle: "Info akun",
      username: "Username",
      whatsapp: "WhatsApp",
      whatsappPlaceholder: "Masukkan nomor WhatsApp",
    },
    currentLanguage,
  );

  return <MemberAccountOverview currentLanguage={currentLanguage} labels={labels} profile={profile} />;
}
