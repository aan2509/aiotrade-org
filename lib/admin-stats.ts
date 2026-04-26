import "server-only";

import { prisma } from "@/lib/prisma";

export type AdminStats = {
  dailyTrend: AdminTrendPoint[];
  paidGuideContentCount: number;
  freeGuideContentCount: number;
  paidGuideRevenue: number;
  signupRevenue: number;
  totalUsers: number;
  uniqueVisitors: number;
  weeklyTrend: AdminTrendPoint[];
  websiteVisits: number;
};

export type AdminTrendPoint = {
  guideRevenue: number;
  key: string;
  label: string;
  signupRevenue: number;
  totalRevenue: number;
  visits: number;
};

const TIME_ZONE = "Asia/Jakarta";
const DAILY_POINTS = 7;
const WEEKLY_POINTS = 8;

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function startOfWeek(date: Date) {
  const copy = startOfDay(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy;
}

function buildDailyRange() {
  const today = startOfDay(new Date());
  const labelFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    timeZone: TIME_ZONE,
  });

  return Array.from({ length: DAILY_POINTS }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (DAILY_POINTS - index - 1));

    return {
      key: formatDateKey(date),
      label: labelFormatter.format(date),
    };
  });
}

function buildWeeklyRange() {
  const currentWeekStart = startOfWeek(new Date());
  const labelFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    timeZone: TIME_ZONE,
  });

  return Array.from({ length: WEEKLY_POINTS }, (_, index) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() - (WEEKLY_POINTS - index - 1) * 7);

    return {
      key: formatDateKey(date),
      label: labelFormatter.format(date),
    };
  });
}

async function getVisitDailyMap() {
  if (!(await tableExists("site_visit_events"))) {
    return new Map<string, number>();
  }

  const rows = await prisma.$queryRaw<Array<{ key: string; total: bigint | number }>>`
    SELECT
      DATE(timezone(${TIME_ZONE}, "created_at"))::text AS "key",
      COUNT(*)::bigint AS "total"
    FROM "public"."site_visit_events"
    WHERE "created_at" >= NOW() - INTERVAL '7 days'
    GROUP BY 1
  `;

  return new Map(rows.map((row) => [row.key, Number(row.total ?? 0)]));
}

async function getVisitWeeklyMap() {
  if (!(await tableExists("site_visit_events"))) {
    return new Map<string, number>();
  }

  const rows = await prisma.$queryRaw<Array<{ key: string; total: bigint | number }>>`
    SELECT
      DATE(date_trunc('week', timezone(${TIME_ZONE}, "created_at")))::text AS "key",
      COUNT(*)::bigint AS "total"
    FROM "public"."site_visit_events"
    WHERE "created_at" >= NOW() - INTERVAL '56 days'
    GROUP BY 1
  `;

  return new Map(rows.map((row) => [row.key, Number(row.total ?? 0)]));
}

async function getSignupRevenueDailyMap() {
  if (!(await tableExists("signup_payment_transactions"))) {
    return new Map<string, number>();
  }

  const rows = await prisma.$queryRaw<Array<{ key: string; total: bigint | number }>>`
    SELECT
      DATE(timezone(${TIME_ZONE}, COALESCE("paid_at", "created_at")))::text AS "key",
      COALESCE(SUM("amount"), 0)::bigint AS "total"
    FROM "public"."signup_payment_transactions"
    WHERE "status" = 'paid'
      AND COALESCE("paid_at", "created_at") >= NOW() - INTERVAL '7 days'
    GROUP BY 1
  `;

  return new Map(rows.map((row) => [row.key, Number(row.total ?? 0)]));
}

async function getSignupRevenueWeeklyMap() {
  if (!(await tableExists("signup_payment_transactions"))) {
    return new Map<string, number>();
  }

  const rows = await prisma.$queryRaw<Array<{ key: string; total: bigint | number }>>`
    SELECT
      DATE(date_trunc('week', timezone(${TIME_ZONE}, COALESCE("paid_at", "created_at"))))::text AS "key",
      COALESCE(SUM("amount"), 0)::bigint AS "total"
    FROM "public"."signup_payment_transactions"
    WHERE "status" = 'paid'
      AND COALESCE("paid_at", "created_at") >= NOW() - INTERVAL '56 days'
    GROUP BY 1
  `;

  return new Map(rows.map((row) => [row.key, Number(row.total ?? 0)]));
}

async function getGuideRevenueDailyMap() {
  if (!(await tableExists("member_guide_payment_transactions"))) {
    return new Map<string, number>();
  }

  const rows = await prisma.$queryRaw<Array<{ key: string; total: bigint | number }>>`
    SELECT
      DATE(timezone(${TIME_ZONE}, COALESCE("paid_at", "created_at")))::text AS "key",
      COALESCE(SUM("amount"), 0)::bigint AS "total"
    FROM "public"."member_guide_payment_transactions"
    WHERE "status" = 'paid'
      AND COALESCE("paid_at", "created_at") >= NOW() - INTERVAL '7 days'
    GROUP BY 1
  `;

  return new Map(rows.map((row) => [row.key, Number(row.total ?? 0)]));
}

async function getGuideRevenueWeeklyMap() {
  if (!(await tableExists("member_guide_payment_transactions"))) {
    return new Map<string, number>();
  }

  const rows = await prisma.$queryRaw<Array<{ key: string; total: bigint | number }>>`
    SELECT
      DATE(date_trunc('week', timezone(${TIME_ZONE}, COALESCE("paid_at", "created_at"))))::text AS "key",
      COALESCE(SUM("amount"), 0)::bigint AS "total"
    FROM "public"."member_guide_payment_transactions"
    WHERE "status" = 'paid'
      AND COALESCE("paid_at", "created_at") >= NOW() - INTERVAL '56 days'
    GROUP BY 1
  `;

  return new Map(rows.map((row) => [row.key, Number(row.total ?? 0)]));
}

async function getDailyTrend() {
  const [visitMap, signupMap, guideMap] = await Promise.all([
    getVisitDailyMap(),
    getSignupRevenueDailyMap(),
    getGuideRevenueDailyMap(),
  ]);

  return buildDailyRange().map(({ key, label }) => {
    const visits = visitMap.get(key) ?? 0;
    const signupRevenue = signupMap.get(key) ?? 0;
    const guideRevenue = guideMap.get(key) ?? 0;

    return {
      guideRevenue,
      key,
      label,
      signupRevenue,
      totalRevenue: signupRevenue + guideRevenue,
      visits,
    } satisfies AdminTrendPoint;
  });
}

async function getWeeklyTrend() {
  const [visitMap, signupMap, guideMap] = await Promise.all([
    getVisitWeeklyMap(),
    getSignupRevenueWeeklyMap(),
    getGuideRevenueWeeklyMap(),
  ]);

  return buildWeeklyRange().map(({ key, label }) => {
    const visits = visitMap.get(key) ?? 0;
    const signupRevenue = signupMap.get(key) ?? 0;
    const guideRevenue = guideMap.get(key) ?? 0;

    return {
      guideRevenue,
      key,
      label,
      signupRevenue,
      totalRevenue: signupRevenue + guideRevenue,
      visits,
    } satisfies AdminTrendPoint;
  });
}

async function tableExists(tableName: string) {
  const rows = await prisma.$queryRaw<Array<{ tableName: string | null }>>`
    SELECT to_regclass(${`public.${tableName}`})::text AS "tableName"
  `;

  return Boolean(rows[0]?.tableName);
}

async function getTotalUsers() {
  if (!(await tableExists("profiles"))) {
    return 0;
  }

  const rows = await prisma.$queryRaw<Array<{ total: bigint | number }>>`
    SELECT COUNT(*)::bigint AS "total"
    FROM "public"."profiles"
  `;

  return Number(rows[0]?.total ?? 0);
}

async function getGuideContentStats() {
  if (!(await tableExists("member_guide_posts"))) {
    return {
      freeGuideContentCount: 0,
      paidGuideContentCount: 0,
    };
  }

  const rows = await prisma.$queryRaw<Array<{ total: bigint | number; isPaid: boolean }>>`
    SELECT
      "is_paid" AS "isPaid",
      COUNT(*)::bigint AS "total"
    FROM "public"."member_guide_posts"
    WHERE "is_published" = true
    GROUP BY "is_paid"
  `;

  let paidGuideContentCount = 0;
  let freeGuideContentCount = 0;

  for (const row of rows) {
    const total = Number(row.total ?? 0);

    if (row.isPaid) {
      paidGuideContentCount += total;
    } else {
      freeGuideContentCount += total;
    }
  }

  return {
    freeGuideContentCount,
    paidGuideContentCount,
  };
}

async function getSignupRevenue() {
  if (!(await tableExists("signup_payment_transactions"))) {
    return 0;
  }

  const rows = await prisma.$queryRaw<Array<{ total: bigint | number | null }>>`
    SELECT COALESCE(SUM("amount"), 0)::bigint AS "total"
    FROM "public"."signup_payment_transactions"
    WHERE "status" = 'paid'
  `;

  return Number(rows[0]?.total ?? 0);
}

async function getPaidGuideRevenue() {
  if (!(await tableExists("member_guide_payment_transactions"))) {
    return 0;
  }

  const rows = await prisma.$queryRaw<Array<{ total: bigint | number | null }>>`
    SELECT COALESCE(SUM("amount"), 0)::bigint AS "total"
    FROM "public"."member_guide_payment_transactions"
    WHERE "status" = 'paid'
  `;

  return Number(rows[0]?.total ?? 0);
}

async function getVisitStats() {
  if (!(await tableExists("site_visit_events"))) {
    return {
      uniqueVisitors: 0,
      websiteVisits: 0,
    };
  }

  const rows = await prisma.$queryRaw<Array<{ uniqueVisitors: bigint | number; websiteVisits: bigint | number }>>`
    SELECT
      COUNT(*)::bigint AS "websiteVisits",
      COUNT(DISTINCT "visitor_id")::bigint AS "uniqueVisitors"
    FROM "public"."site_visit_events"
  `;

  return {
    uniqueVisitors: Number(rows[0]?.uniqueVisitors ?? 0),
    websiteVisits: Number(rows[0]?.websiteVisits ?? 0),
  };
}

export async function getAdminStats(): Promise<AdminStats> {
  const [
    totalUsers,
    guideContentStats,
    signupRevenue,
    paidGuideRevenue,
    visitStats,
    dailyTrend,
    weeklyTrend,
  ] = await Promise.all([
    getTotalUsers(),
    getGuideContentStats(),
    getSignupRevenue(),
    getPaidGuideRevenue(),
    getVisitStats(),
    getDailyTrend(),
    getWeeklyTrend(),
  ]);

  return {
    dailyTrend,
    freeGuideContentCount: guideContentStats.freeGuideContentCount,
    paidGuideContentCount: guideContentStats.paidGuideContentCount,
    paidGuideRevenue,
    signupRevenue,
    totalUsers,
    uniqueVisitors: visitStats.uniqueVisitors,
    weeklyTrend,
    websiteVisits: visitStats.websiteVisits,
  };
}
