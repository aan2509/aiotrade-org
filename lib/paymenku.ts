import "server-only";

import type { NormalizedSignupPaymentStatus } from "@/lib/signup-payment-types";

const PAYMENKU_BASE_URL = "https://paymenku.com/api/v1";

export type PaymenkuPaymentSnapshot = {
  expiresAt: string | null;
  message: string | null;
  paymentName: string | null;
  paymentNumber: string | null;
  paymentUrl: string | null;
  providerTransactionId: string | null;
  qrImageUrl: string | null;
  qrString: string | null;
  raw: unknown;
  status: NormalizedSignupPaymentStatus;
};

type PaymenkuCreateTransactionInput = {
  amount: number;
  channelCode: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string | null;
  referenceId: string;
  returnUrl: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readPath(value: unknown, path: string[]) {
  let current: unknown = value;

  for (const key of path) {
    if (!isPlainObject(current) || !(key in current)) {
      return null;
    }

    current = current[key];
  }

  return current;
}

function pickString(value: unknown, paths: string[][]) {
  for (const path of paths) {
    const candidate = readPath(value, path);

    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
}

function normalizePaymentStatus(value: unknown): NormalizedSignupPaymentStatus {
  const rawStatus = String(value ?? "").trim().toLowerCase();

  if (
    rawStatus.includes("paid") ||
    rawStatus.includes("success") ||
    rawStatus.includes("settlement") ||
    rawStatus.includes("complete") ||
    rawStatus.includes("berhasil") ||
    rawStatus.includes("sukses")
  ) {
    return "paid";
  }

  if (
    rawStatus.includes("fail") ||
    rawStatus.includes("expired") ||
    rawStatus.includes("cancel") ||
    rawStatus.includes("deny") ||
    rawStatus.includes("error")
  ) {
    return "failed";
  }

  return "pending";
}

function parsePaymenkuSnapshot(raw: unknown): PaymenkuPaymentSnapshot {
  const providerTransactionId = pickString(raw, [
    ["data", "trx_id"],
    ["data", "payment_info", "transaction_id"],
    ["data", "transaction_id"],
    ["data", "id"],
    ["data", "order_id"],
    ["trx_id"],
    ["transaction_id"],
    ["id"],
    ["order_id"],
  ]);
  const paymentUrl = pickString(raw, [
    ["data", "pay_url"],
    ["data", "payment_url"],
    ["data", "checkout_url"],
    ["data", "redirect_url"],
    ["pay_url"],
    ["payment_url"],
    ["checkout_url"],
    ["redirect_url"],
  ]);
  const paymentNumber = pickString(raw, [
    ["data", "payment_info", "va_number"],
    ["data", "payment_info", "account_number"],
    ["data", "payment_info", "payment_number"],
    ["data", "va_number"],
    ["data", "account_number"],
    ["data", "payment_number"],
    ["va_number"],
    ["account_number"],
    ["payment_number"],
  ]);
  const paymentName = pickString(raw, [
    ["data", "payment_info", "payment_name"],
    ["data", "payment_info", "channel_name"],
    ["data", "payment_name"],
    ["data", "channel_name"],
    ["payment_name"],
    ["channel_name"],
  ]);
  const qrString = pickString(raw, [
    ["data", "payment_info", "qr_string"],
    ["data", "payment_info", "qr_content"],
    ["data", "qr_string"],
    ["data", "qr_content"],
    ["qr_string"],
    ["qr_content"],
  ]);
  const qrImageUrl = pickString(raw, [
    ["data", "payment_info", "qr_url"],
    ["data", "payment_info", "qr_image_url"],
    ["data", "qr_image_url"],
    ["data", "qr_url"],
    ["qr_image_url"],
    ["qr_url"],
  ]);
  const expiresAt = pickString(raw, [
    ["data", "payment_info", "expiration_date"],
    ["data", "expired_at"],
    ["data", "expires_at"],
    ["expired_at"],
    ["expires_at"],
  ]);
  const message = pickString(raw, [
    ["message"],
    ["data", "message"],
    ["error"],
  ]);
  const rawStatus = pickString(raw, [
    ["data", "payment_info", "transaction_status"],
    ["data", "status"],
    ["status"],
    ["data", "payment_status"],
    ["payment_status"],
  ]);

  return {
    expiresAt,
    message,
    paymentName,
    paymentNumber,
    paymentUrl,
    providerTransactionId,
    qrImageUrl,
    qrString,
    raw,
    status: normalizePaymentStatus(rawStatus),
  };
}

async function paymenkuRequest<TResponse>(apiKey: string, path: string, init?: RequestInit) {
  const response = await fetch(`${PAYMENKU_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as TResponse | null;

  if (!response.ok) {
    const message =
      pickString(payload, [["message"], ["error"], ["data", "message"]]) ??
      "Paymenku request failed.";
    throw new Error(message);
  }

  return payload;
}

export async function createPaymenkuTransaction(
  apiKey: string,
  input: PaymenkuCreateTransactionInput,
) {
  const payload = await paymenkuRequest<unknown>(apiKey, "/transaction/create", {
    method: "POST",
    body: JSON.stringify({
      amount: input.amount,
      channel_code: input.channelCode,
      customer_email: input.customerEmail,
      customer_name: input.customerName,
      customer_phone: input.customerPhone || undefined,
      reference_id: input.referenceId,
      return_url: input.returnUrl,
    }),
  });

  return parsePaymenkuSnapshot(payload);
}

export async function checkPaymenkuTransactionStatus(apiKey: string, orderId: string) {
  const payload = await paymenkuRequest<unknown>(
    apiKey,
    `/check-status/${encodeURIComponent(orderId)}`,
    {
      method: "GET",
    },
  );

  return parsePaymenkuSnapshot(payload);
}
