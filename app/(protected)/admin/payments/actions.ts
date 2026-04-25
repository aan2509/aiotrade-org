"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminProfile } from "@/lib/auth";
import { normalizePlanId, PAYMENKU_CHANNELS } from "@/lib/payment-gateway-config";
import {
  type PaymentGatewaySettings,
  updatePaymentGatewaySettings,
} from "@/lib/payment-gateway-settings";
import type { PaymentSubscriptionPlan } from "@/lib/payment-gateway-types";

const paymenkuChannelCodes = PAYMENKU_CHANNELS.map((channel) => channel.code);
const subscriptionPlanSchema = z.object({
  description: z.string().trim().min(1),
  durationMonths: z.number().int().min(0),
  id: z.string().trim().min(1).transform((value) => normalizePlanId(value)),
  isLifetime: z.boolean().default(false),
  label: z.string().trim().min(1),
  price: z.number().int().min(1000),
}).superRefine((plan, ctx) => {
  if (plan.isLifetime && plan.durationMonths !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Paket lifetime harus memakai durasi 0 bulan.",
      path: ["durationMonths"],
    });
  }

  if (!plan.isLifetime && plan.durationMonths < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Durasi paket minimal 1 bulan.",
      path: ["durationMonths"],
    });
  }
});

const paymentSettingsSchema = z.object({
  activeChannelCodes: z.array(z.enum(paymenkuChannelCodes as [string, ...string[]])).min(1),
  checkoutNote: z.string().trim().min(1),
  defaultChannelCode: z.enum(paymenkuChannelCodes as [string, ...string[]]),
  defaultPlanId: z.string().trim().min(1).transform((value) => normalizePlanId(value)),
  isEnabled: z.boolean(),
  paymenkuApiKey: z.string().trim().min(1, "Masukkan API key Paymenku."),
  priceLabel: z.string().trim().min(1),
  provider: z.literal("paymenku"),
  registrationPrice: z.number().int().min(1000),
  subscriptionPlans: z.array(subscriptionPlanSchema).min(1),
});

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function updatePaymentSettingsAction(formData: FormData) {
  await requireAdminProfile();

  const activeChannelCodes = PAYMENKU_CHANNELS
    .map((channel) => channel.code)
    .filter((code) => formData.getAll("activeChannelCodes").includes(code));
  const rawSubscriptionPlans = readString(formData, "subscriptionPlans");
  const parsedJsonValue = (() => {
    try {
      return JSON.parse(rawSubscriptionPlans || "[]");
    } catch {
      return [];
    }
  })();
  const parsedPlansJson = z.array(z.unknown()).safeParse(parsedJsonValue);
  const normalizedPlans = parsedPlansJson.success
    ? parsedPlansJson.data
        .map((item) => subscriptionPlanSchema.safeParse(item))
        .filter((result): result is { success: true; data: PaymentSubscriptionPlan } => result.success)
        .map((result) => result.data)
    : [];

  const parsed = paymentSettingsSchema.safeParse({
    activeChannelCodes,
    checkoutNote: readString(formData, "checkoutNote"),
    defaultChannelCode: readString(formData, "defaultChannelCode"),
    defaultPlanId: readString(formData, "defaultPlanId"),
    isEnabled: readString(formData, "isEnabled") === "true",
    paymenkuApiKey: readString(formData, "paymenkuApiKey"),
    priceLabel: "placeholder",
    provider: "paymenku",
    registrationPrice: normalizedPlans.find((plan) => plan.id === normalizePlanId(readString(formData, "defaultPlanId")))?.price ?? 0,
    subscriptionPlans: normalizedPlans,
  });

  if (
    !parsed.success ||
    !parsed.data.activeChannelCodes.includes(parsed.data.defaultChannelCode) ||
    !parsed.data.subscriptionPlans.some((plan) => plan.id === parsed.data.defaultPlanId)
  ) {
    redirect("/admin/payments?status=error");
  }

  const defaultPlan =
    parsed.data.subscriptionPlans.find((plan) => plan.id === parsed.data.defaultPlanId) ??
    parsed.data.subscriptionPlans[0];

  const value: PaymentGatewaySettings = {
    ...parsed.data,
    defaultPlanId: defaultPlan.id,
    priceLabel: defaultPlan.label,
    registrationPrice: defaultPlan.price,
  };

  await updatePaymentGatewaySettings(value);
  redirect("/admin/payments?status=saved");
}
