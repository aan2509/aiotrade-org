import { cookies, headers } from "next/headers";
import { requireAdminProfile } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { parseAdminTheme } from "@/lib/admin-theme";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, cookieStore, headerStore] = await Promise.all([requireAdminProfile(), cookies(), headers()]);
  const pathname = headerStore.get("x-current-pathname") ?? "/admin";
  const initialTheme = parseAdminTheme(cookieStore.get("admin-theme")?.value);

  return (
    <AdminShell initialTheme={initialTheme} pathname={pathname} username={profile.username}>
      {children}
    </AdminShell>
  );
}
