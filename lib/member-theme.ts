export type MemberTheme = "light" | "dark";

export const MEMBER_THEME_COOKIE = "member-theme";

export function parseMemberTheme(value: string | null | undefined): MemberTheme {
  return value === "dark" ? "dark" : "light";
}
