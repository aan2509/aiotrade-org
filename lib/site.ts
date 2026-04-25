import { headers } from "next/headers";
export { buildWhatsAppUrl } from "@/lib/whatsapp";

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export async function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL);
  }

  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? null;

  if (!host) {
    return "https://yourdomain.com";
  }

  const protocol =
    headerStore.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}

export function buildProfileUrl(siteUrl: string, username: string) {
  const baseUrl = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
  return new URL(username, baseUrl).toString();
}
