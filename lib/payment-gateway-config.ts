export const PAYMENKU_CHANNELS = [
  { code: "bri_va", name: "BRI Virtual Account", type: "va" },
  { code: "bni_va", name: "BNI Virtual Account", type: "va" },
  { code: "cimb_va", name: "CIMB Virtual Account", type: "va" },
  { code: "qris", name: "QRIS", type: "qris" },
  { code: "danamon_va", name: "Danamon Virtual Account", type: "va" },
  { code: "dana", name: "DANA", type: "ewallet" },
  { code: "bsi_va", name: "BSI Virtual Account", type: "va" },
  { code: "mandiri_va", name: "Mandiri Virtual Account", type: "va" },
  { code: "linkaja", name: "LinkAja", type: "ewallet" },
  { code: "bjb_va", name: "BJB Virtual Account", type: "va" },
  { code: "permata_va", name: "Permata Virtual Account", type: "va" },
] as const;

export const DEFAULT_SUBSCRIPTION_PLANS = [
  {
    description: "Akses member standard selama 12 bulan.",
    durationMonths: 12,
    id: "1-year",
    isLifetime: false,
    label: "1 Tahun",
    price: 100000,
  },
  {
    description: "Akses member selamanya tanpa batas masa aktif.",
    durationMonths: 0,
    id: "lifetime",
    isLifetime: true,
    label: "Langganan Lifetime",
    price: 500000,
  },
] as const;

export function normalizePlanId(value: string | null | undefined) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatIdrCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}
