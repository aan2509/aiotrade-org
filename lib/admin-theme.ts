export type AdminTheme = "light" | "dark";

export const ADMIN_THEME_COOKIE = "admin-theme";

export function parseAdminTheme(value: string | null | undefined): AdminTheme {
  return value === "dark" ? "dark" : "light";
}
