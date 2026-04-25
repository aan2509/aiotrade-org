import "server-only";

import { prisma } from "@/lib/prisma";

export type MemberDashboardStats = {
  publishedGuideCount: number;
  publishedPdfCount: number;
  publishedVideoCount: number;
};

const emptyGuideStats = {
  publishedGuideCount: 0,
  publishedPdfCount: 0,
  publishedVideoCount: 0,
} satisfies Pick<
  MemberDashboardStats,
  "publishedGuideCount" | "publishedPdfCount" | "publishedVideoCount"
>;

async function getPublishedGuideStats() {
  const tables = await prisma.$queryRaw<Array<{ tableName: string | null }>>`
    SELECT to_regclass('public.member_guide_posts')::text AS "tableName"
  `;

  if (!tables[0]?.tableName) {
    return emptyGuideStats;
  }

  const rows = await prisma.$queryRaw<
    Array<{ count: bigint | number | string; type: string }>
  >`
    SELECT
      "type",
      COUNT(*) AS "count"
    FROM "public"."member_guide_posts"
    WHERE "is_published" = true
    GROUP BY "type"
  `;

  let publishedGuideCount = 0;
  let publishedVideoCount = 0;
  let publishedPdfCount = 0;

  rows.forEach((row) => {
    const count = Number(row.count ?? 0);
    publishedGuideCount += count;

    if (row.type === "video") {
      publishedVideoCount = count;
    }

    if (row.type === "pdf") {
      publishedPdfCount = count;
    }
  });

  return {
    publishedGuideCount,
    publishedPdfCount,
    publishedVideoCount,
  } satisfies Pick<
    MemberDashboardStats,
    "publishedGuideCount" | "publishedPdfCount" | "publishedVideoCount"
  >;
}

export async function getMemberDashboardStats(): Promise<MemberDashboardStats> {
  const guideStats = await getPublishedGuideStats();
  return {
    publishedGuideCount: guideStats.publishedGuideCount,
    publishedPdfCount: guideStats.publishedPdfCount,
    publishedVideoCount: guideStats.publishedVideoCount,
  };
}
