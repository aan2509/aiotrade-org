export type NormalizedSignupPaymentStatus = "pending" | "paid" | "failed";

export type SignupPaymentPublicState = {
  amount: number;
  channelCode: string;
  customerEmail: string;
  customerName: string;
  expiresAt: string | null;
  message: string | null;
  planId: string | null;
  planLabel: string | null;
  paymentName: string | null;
  paymentNumber: string | null;
  paymentUrl: string | null;
  providerTransactionId: string | null;
  qrImageUrl: string | null;
  qrString: string | null;
  referenceId: string;
  status: NormalizedSignupPaymentStatus;
};
