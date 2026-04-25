import { PaymentSettingsView } from "@/components/admin/payment-settings-view";
import { getPaymentGatewaySettings } from "@/lib/payment-gateway-settings";

type AdminPaymentsPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function AdminPaymentsPage({ searchParams }: AdminPaymentsPageProps) {
  const [settings, query] = await Promise.all([getPaymentGatewaySettings(), searchParams]);

  return <PaymentSettingsView settings={settings} status={query.status} />;
}
