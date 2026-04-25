export type LandingTheme = "light" | "dark";

export const LANDING_THEME_COOKIE = "landing-theme";

export function parseLandingTheme(value: string | null | undefined): LandingTheme {
  return value === "dark" ? "dark" : "light";
}
