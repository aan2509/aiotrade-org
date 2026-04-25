export type MemberGuidePaymentStatus = "pending" | "paid" | "failed";

export type MemberGuidePaymentPublicState = {
  amount: number;
  channelCode: string;
  customerEmail: string;
  customerName: string;
  expiresAt: string | null;
  guideId: string;
  guideTitle: string;
  message: string | null;
  paymentName: string | null;
  paymentNumber: string | null;
  paymentUrl: string | null;
  providerTransactionId: string | null;
  qrImageUrl: string | null;
  qrString: string | null;
  referenceId: string;
  status: MemberGuidePaymentStatus;
  unlocked: boolean;
};
