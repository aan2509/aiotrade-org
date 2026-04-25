import { cookies } from "next/headers";
import { ChangePasswordView } from "@/components/account/change-password-view";
import { parseSiteLanguage, SITE_LANGUAGE_COOKIE } from "@/lib/site-language";
import { translateSimpleMemberCopy } from "@/lib/member-translations";

export default async function DashboardAccountResetPasswordPage() {
  const cookieStore = await cookies();
  const currentLanguage = parseSiteLanguage(cookieStore.get(SITE_LANGUAGE_COOKIE)?.value);
  const copy = await translateSimpleMemberCopy(
    {
      confirmPassword: "Konfirmasi Password Baru",
      currentPassword: "Password Saat Ini",
      currentPlaceholder: "Masukkan password saat ini",
      description: "Masukkan password lama Anda, lalu simpan password baru yang ingin dipakai saat login.",
      newPassword: "Password Baru",
      newPlaceholder: "Minimal 8 karakter",
      noteBody: "Setelah password diganti, login berikutnya akan memakai password baru ini.",
      noteTitle: "Catatan",
      pageDescription:
        "Kelola keamanan akun member Anda dari halaman ini. Password baru akan langsung dipakai untuk login berikutnya.",
      pageTitle: "Reset Password",
      saveButton: "Simpan Password Baru",
      savePending: "Menyimpan password...",
      title: "Reset Password",
    },
    currentLanguage,
  );

  return (
    <ChangePasswordView
      copy={copy}
      description={copy.pageDescription}
      title={copy.pageTitle}
    />
  );
}
