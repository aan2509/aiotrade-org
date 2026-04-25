import { redirect } from "next/navigation";

export default function DashboardResetPasswordPage() {
  redirect("/dashboard/account/reset-password");
}
