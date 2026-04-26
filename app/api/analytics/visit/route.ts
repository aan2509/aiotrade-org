import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VISITOR_COOKIE_NAME = "aiotrade_visitor_id";
const RECENT_VISIT_COOKIE_NAME = "aiotrade_recent_visit";
const RECENT_VISIT_WINDOW_SECONDS = 60 * 60 * 6;
const VISITOR_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function normalizePath(value: unknown) {
  const path = String(value ?? "/").trim();

  if (!path.startsWith("/")) {
    return "/";
  }

  return path.slice(0, 240);
}

function normalizeOptionalText(value: unknown, maxLength: number) {
  const text = String(value ?? "").trim();
  return text ? text.slice(0, maxLength) : null;
}

async function tableExists() {
  const rows = await prisma.$queryRaw<Array<{ tableName: string | null }>>`
    SELECT to_regclass('public.site_visit_events')::text AS "tableName"
  `;

  return Boolean(rows[0]?.tableName);
}

function hasSiteVisitEventDelegate() {
  return (
    "siteVisitEvent" in prisma &&
    typeof prisma.siteVisitEvent?.create === "function"
  );
}

async function recordVisit(input: {
  path: string;
  referrer: string | null;
  userAgent: string | null;
  visitorId: string;
}) {
  if (!(await tableExists())) {
    return false;
  }

  if (hasSiteVisitEventDelegate()) {
    await prisma.siteVisitEvent.create({
      data: {
        path: input.path,
        referrer: input.referrer,
        userAgent: input.userAgent,
        visitorId: input.visitorId,
      },
    });

    return true;
  }

  await prisma.$executeRaw`
    INSERT INTO "public"."site_visit_events" (
      "visitor_id",
      "path",
      "referrer",
      "user_agent"
    )
    VALUES (
      ${input.visitorId},
      ${input.path},
      ${input.referrer},
      ${input.userAgent}
    )
  `;

  return true;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const body = (await request.json().catch(() => ({}))) as {
    path?: unknown;
    referrer?: unknown;
  };

  const visitorId =
    cookieStore.get(VISITOR_COOKIE_NAME)?.value?.trim() || crypto.randomUUID();
  const recentVisitAt = Number.parseInt(
    cookieStore.get(RECENT_VISIT_COOKIE_NAME)?.value ?? "",
    10,
  );
  const now = Date.now();
  const hasRecentVisit =
    Number.isFinite(recentVisitAt) &&
    now - recentVisitAt < RECENT_VISIT_WINDOW_SECONDS * 1000;

  const tracked = hasRecentVisit
    ? false
    : await recordVisit({
        path: normalizePath(body.path),
        referrer: normalizeOptionalText(body.referrer, 500),
        userAgent: normalizeOptionalText(headerStore.get("user-agent"), 500),
        visitorId,
      });

  const response = NextResponse.json({ tracked });

  response.cookies.set(VISITOR_COOKIE_NAME, visitorId, {
    httpOnly: true,
    maxAge: VISITOR_COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  if (hasRecentVisit) {
    return response;
  }

  response.cookies.set(RECENT_VISIT_COOKIE_NAME, String(now), {
    httpOnly: true,
    maxAge: RECENT_VISIT_WINDOW_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
