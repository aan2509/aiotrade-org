import { z } from "zod";
import { requireCurrentProfile } from "@/lib/auth";
import { createMemberGuidePayment, isMemberGuideUnlocked } from "@/lib/member-guide-payments";

const createMemberGuidePaymentSchema = z.object({
  channelCode: z.string().trim().min(1, "Pilih metode pembayaran."),
  guideId: z.string().trim().uuid("Materi tidak valid."),
});

export async function POST(request: Request) {
  const profile = await requireCurrentProfile();
  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const parsed = createMemberGuidePaymentSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json(
      {
        fieldErrors: parsed.error.flatten().fieldErrors,
        message: "Pilih materi dan metode pembayaran terlebih dahulu.",
      },
      { status: 400 },
    );
  }

  if (await isMemberGuideUnlocked(profile.id, parsed.data.guideId)) {
    return Response.json(
      {
        message: "Materi ini sudah terbuka di akun Anda.",
        unlocked: true,
      },
      { status: 409 },
    );
  }

  try {
    const payment = await createMemberGuidePayment({
      channelCode: parsed.data.channelCode,
      guideId: parsed.data.guideId,
      profile,
    });

    return Response.json({
      payment,
    });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Belum bisa membuat pembayaran sekarang.",
      },
      { status: 500 },
    );
  }
}
