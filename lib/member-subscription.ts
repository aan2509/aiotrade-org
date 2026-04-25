import "server-only";

import { prisma } from "@/lib/prisma";
import type { PaymentSubscriptionPlan } from "@/lib/payment-gateway-types";

export type MemberSubscriptionSnapshot = {
  durationMonths: number;
  expiresAt: Date | null;
  isLifetime: boolean;
  paymentReferenceId: string | null;
  planId: string;
  planLabel: string;
  profileId: string;
  startedAt: Date;
  status: string;
};

function hasMemberSubscriptionDelegate() {
  return (
    "memberSubscription" in prisma &&
    typeof prisma.memberSubscription?.findUnique === "function" &&
    typeof prisma.memberSubscription?.upsert === "function"
  );
}

function addMonths(baseDate: Date, months: number) {
  const next = new Date(baseDate);
  next.setMonth(next.getMonth() + months);
  return next;
}

function normalizePlanWindow(plan: PaymentSubscriptionPlan) {
  const startedAt = new Date();
  const isLifetime = Boolean(plan.isLifetime);

  return {
    durationMonths: isLifetime ? 0 : Math.max(1, plan.durationMonths),
    expiresAt: isLifetime ? null : addMonths(startedAt, Math.max(1, plan.durationMonths)),
    isLifetime,
    startedAt,
  };
}

export async function upsertMemberSubscription(input: {
  paymentReferenceId?: string | null;
  plan: PaymentSubscriptionPlan;
  profileId: string;
}) {
  const window = normalizePlanWindow(input.plan);

  if (hasMemberSubscriptionDelegate()) {
    return prisma.memberSubscription.upsert({
      where: {
        profileId: input.profileId,
      },
      create: {
        durationMonths: window.durationMonths,
        expiresAt: window.expiresAt,
        isLifetime: window.isLifetime,
        paymentReferenceId: input.paymentReferenceId ?? null,
        planId: input.plan.id,
        planLabel: input.plan.label,
        profileId: input.profileId,
        startedAt: window.startedAt,
        status: "active",
      },
      update: {
        durationMonths: window.durationMonths,
        expiresAt: window.expiresAt,
        isLifetime: window.isLifetime,
        paymentReferenceId: input.paymentReferenceId ?? null,
        planId: input.plan.id,
        planLabel: input.plan.label,
        startedAt: window.startedAt,
        status: "active",
      },
      select: {
        durationMonths: true,
        expiresAt: true,
        isLifetime: true,
        paymentReferenceId: true,
        planId: true,
        planLabel: true,
        profileId: true,
        startedAt: true,
        status: true,
      },
    });
  }

  const rows = await prisma.$queryRaw<MemberSubscriptionSnapshot[]>`
    INSERT INTO "public"."member_subscriptions" (
      "profile_id",
      "plan_id",
      "plan_label",
      "is_lifetime",
      "duration_months",
      "started_at",
      "expires_at",
      "status",
      "payment_reference_id"
    )
    VALUES (
      ${input.profileId},
      ${input.plan.id},
      ${input.plan.label},
      ${window.isLifetime},
      ${window.durationMonths},
      ${window.startedAt},
      ${window.expiresAt},
      'active',
      ${input.paymentReferenceId ?? null}
    )
    ON CONFLICT ("profile_id") DO UPDATE SET
      "plan_id" = EXCLUDED."plan_id",
      "plan_label" = EXCLUDED."plan_label",
      "is_lifetime" = EXCLUDED."is_lifetime",
      "duration_months" = EXCLUDED."duration_months",
      "started_at" = EXCLUDED."started_at",
      "expires_at" = EXCLUDED."expires_at",
      "status" = EXCLUDED."status",
      "payment_reference_id" = EXCLUDED."payment_reference_id",
      "updated_at" = CURRENT_TIMESTAMP
    RETURNING
      "duration_months" AS "durationMonths",
      "expires_at" AS "expiresAt",
      "is_lifetime" AS "isLifetime",
      "payment_reference_id" AS "paymentReferenceId",
      "plan_id" AS "planId",
      "plan_label" AS "planLabel",
      "profile_id" AS "profileId",
      "started_at" AS "startedAt",
      "status"
  `;

  return rows[0] ?? null;
}

export async function getMemberSubscription(profileId: string) {
  if (hasMemberSubscriptionDelegate()) {
    return prisma.memberSubscription.findUnique({
      where: {
        profileId,
      },
      select: {
        durationMonths: true,
        expiresAt: true,
        isLifetime: true,
        paymentReferenceId: true,
        planId: true,
        planLabel: true,
        profileId: true,
        startedAt: true,
        status: true,
      },
    });
  }

  const rows = await prisma.$queryRaw<MemberSubscriptionSnapshot[]>`
    SELECT
      "duration_months" AS "durationMonths",
      "expires_at" AS "expiresAt",
      "is_lifetime" AS "isLifetime",
      "payment_reference_id" AS "paymentReferenceId",
      "plan_id" AS "planId",
      "plan_label" AS "planLabel",
      "profile_id" AS "profileId",
      "started_at" AS "startedAt",
      "status"
    FROM "public"."member_subscriptions"
    WHERE "profile_id" = ${profileId}
    LIMIT 1
  `;

  return rows[0] ?? null;
}
