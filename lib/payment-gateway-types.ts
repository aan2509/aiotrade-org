export type PaymentSubscriptionPlan = {
  description: string;
  durationMonths: number;
  id: string;
  isLifetime: boolean;
  label: string;
  price: number;
};

export type PublicSignupPaymentSettings = {
  activeChannels: Array<{
    code: string;
    name: string;
    type: "va" | "qris" | "ewallet";
  }>;
  checkoutNote: string;
  defaultChannelCode: string | null;
  defaultPlanId: string;
  isEnabled: boolean;
  plans: PaymentSubscriptionPlan[];
  priceLabel: string;
  provider: string;
  registrationPrice: number;
};
