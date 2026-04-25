import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentProfile } from "@/lib/auth";
import { parseSiteLanguage, SITE_LANGUAGE_COOKIE } from "@/lib/site-language";
import { getSupportedSiteLanguages, translateRecordStrings } from "@/lib/translatex";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const currentLanguage = parseSiteLanguage(cookieStore.get(SITE_LANGUAGE_COOKIE)?.value);
  const [profile, languageOptions] = await Promise.all([
    getCurrentProfile(),
    getSupportedSiteLanguages(),
  ]);

  if (profile) {
    redirect(profile.isAdmin ? "/admin" : "/dashboard");
  }

  const [shellCopy, formCopy] = await Promise.all([
    translateRecordStrings({
      record: {
        backLabel: "Kembali ke halaman utama",
        badge: "Masuk dengan aman",
        description:
          "Masuk ke akun Anda untuk melanjutkan aktivitas dan membuka halaman pribadi Anda seperti biasa.",
        sideBadge: "Selamat datang kembali",
        sideTitle: "Masuk lagi dan lanjutkan langkah Anda.",
        title: "Masuk ke akun Anda",
      },
      targetLanguage: currentLanguage,
    }),
    translateRecordStrings({
      record: {
        email: "Email",
        emailPlaceholder: "you@example.com",
        helperBody: "Pakai email yang sama seperti saat daftar agar Anda bisa masuk tanpa repot.",
        helperTitle: "Siap lanjut",
        loginButton: "Masuk",
        loginPending: "Sedang masuk...",
        noAccount: "Belum punya akun?",
        password: "Password",
        passwordPlaceholder: "Masukkan password Anda",
        signupLink: "Daftar di sini",
      },
      targetLanguage: currentLanguage,
    }),
  ]);

  return (
    <AuthPageShell
      badge={
        <>
          <ShieldCheck className="h-4 w-4" />
          {shellCopy.badge}
        </>
      }
      backLabel={shellCopy.backLabel}
      currentLanguage={currentLanguage}
      description={shellCopy.description}
      languageOptions={languageOptions}
      sideBadge={shellCopy.sideBadge}
      sideTitle={shellCopy.sideTitle}
      title={shellCopy.title}
    >
      <LoginForm labels={formCopy} />
    </AuthPageShell>
  );
}
