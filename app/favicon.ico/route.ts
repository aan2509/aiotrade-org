import { NextResponse } from "next/server";
import { getSiteSeoSettings } from "@/lib/site-seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function withCacheHeaders(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  return response;
}

export async function GET(request: Request) {
  const seo = await getSiteSeoSettings();
  const fallbackUrl = new URL("/favicon-default.ico", request.url);
  const targetUrl = seo.faviconUrl ?? fallbackUrl.toString();

  return withCacheHeaders(NextResponse.redirect(targetUrl, { status: 307 }));
}

export async function HEAD(request: Request) {
  return GET(request);
}
