import { cookies, headers } from "next/headers";
import { requireCurrentProfile } from "@/lib/auth";
import { MemberShell } from "@/components/dashboard/member-shell";
import { getTranslatedMemberShellLabels } from "@/lib/member-translations";
import { parseMemberTheme } from "@/lib/member-theme";
import { parseSiteLanguage, SITE_LANGUAGE_COOKIE } from "@/lib/site-language";
import { getSupportedSiteLanguages } from "@/lib/translatex";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireCurrentProfile();
  const [headerStore, cookieStore] = await Promise.all([headers(), cookies()]);
  const pathname = headerStore.get("x-current-pathname") ?? "/dashboard";
  const initialTheme = parseMemberTheme(cookieStore.get("member-theme")?.value);
  const currentLanguage = parseSiteLanguage(cookieStore.get(SITE_LANGUAGE_COOKIE)?.value);
  const [labels, languageOptions] = await Promise.all([
    getTranslatedMemberShellLabels(currentLanguage),
    getSupportedSiteLanguages(),
  ]);

  return (
    <MemberShell
      currentLanguage={currentLanguage}
      initialTheme={initialTheme}
      isAdmin={profile.isAdmin}
      labels={labels}
      languageOptions={languageOptions}
      pathname={pathname}
      username={profile.username}
    >
      {children}
    </MemberShell>
  );
}
