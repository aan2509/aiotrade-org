import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSignupPayment } from "@/lib/signup-payment";
import { getUsernameValidationMessage, normalizeUsername } from "@/lib/username-rules";

const createSignupPaymentSchema = z.object({
  channelCode: z.string().trim().min(1, "Pilih metode pembayaran."),
  email: z.string().trim().email("Masukkan email yang valid.").transform((value) => value.toLowerCase()),
  planId: z.string().trim().min(1, "Pilih paket langganan."),
  username: z
    .string()
    .trim()
    .min(3, "Username minimal 3 karakter.")
    .max(24, "Username maksimal 24 karakter.")
    .regex(/^[a-z0-9_]+$/, "Username hanya boleh huruf kecil, angka, atau underscore.")
    .transform((value) => normalizeUsername(value)),
  whatsapp: z
    .string()
    .trim()
    .min(9, "Masukkan nomor WhatsApp yang valid.")
    .max(24, "Nomor WhatsApp terlalu panjang.")
    .regex(/^\+?[0-9()\-\s]+$/, "Format nomor WhatsApp belum valid.")
    .transform((value) => value.replace(/[()\-\s]/g, "")),
});

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const usernameIssue = getUsernameValidationMessage(
    typeof payload?.username === "string" ? payload.username : "",
  );

  if (usernameIssue) {
    return Response.json(
      {
        message: usernameIssue,
      },
      { status: 400 },
    );
  }

  const parsed = createSignupPaymentSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json(
      {
        fieldErrors: parsed.error.flatten().fieldErrors,
        message: "Lengkapi data form sebelum membuat pembayaran.",
      },
      { status: 400 },
    );
  }

  const existingProfile = await prisma.profile.findFirst({
    where: {
      OR: [{ email: parsed.data.email }, { username: parsed.data.username }],
    },
    select: {
      email: true,
      username: true,
    },
  });

  if (existingProfile?.username === parsed.data.username) {
    return Response.json(
      {
        message: "Username ini sudah dipakai. Pilih username lain sebelum membuat pembayaran.",
      },
      { status: 409 },
    );
  }

  if (existingProfile?.email === parsed.data.email) {
    return Response.json(
      {
        message: "Email ini sudah terdaftar. Gunakan email lain atau login.",
      },
      { status: 409 },
    );
  }

  try {
    const payment = await createSignupPayment({
      channelCode: parsed.data.channelCode,
      customerEmail: parsed.data.email,
      customerName: parsed.data.username,
      customerPhone: parsed.data.whatsapp,
      planId: parsed.data.planId,
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
