import { requireCurrentProfile } from "@/lib/auth";
import { refreshMemberGuidePaymentStatus } from "@/lib/member-guide-payments";

export async function GET(request: Request) {
  const profile = await requireCurrentProfile();
  const { searchParams } = new URL(request.url);
  const referenceId = String(searchParams.get("referenceId") ?? "").trim();

  if (!referenceId) {
    return Response.json(
      {
        message: "Reference pembayaran belum dikirim.",
      },
      { status: 400 },
    );
  }

  try {
    const payment = await refreshMemberGuidePaymentStatus({
      profileId: profile.id,
      referenceId,
    });

    if (!payment) {
      return Response.json(
        {
          message: "Pembayaran tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    return Response.json({
      payment,
    });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Belum bisa memeriksa status pembayaran.",
      },
      { status: 500 },
    );
  }
}
