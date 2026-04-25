"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { clearUserSession, hashPassword, requireCurrentProfile, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const changePasswordSchema = z
  .object({
    confirmPassword: z.string().min(1, "Ulangi password baru Anda."),
    currentPassword: z.string().min(1, "Masukkan password saat ini."),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter."),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Konfirmasi password baru tidak sama.",
    path: ["confirmPassword"],
  })
  .refine((value) => value.currentPassword !== value.newPassword, {
    message: "Password baru harus berbeda dari password saat ini.",
    path: ["newPassword"],
  });

export type ChangePasswordActionState = {
  fieldErrors: {
    confirmPassword?: string;
    currentPassword?: string;
    newPassword?: string;
  };
  message: string | null;
  status: "idle" | "error" | "success";
};

type PasswordProfile = {
  id: string;
  passwordHash: string;
};

async function getPasswordProfile(userId: string) {
  try {
    return await prisma.profile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        passwordHash: true,
      },
    });
  } catch (error) {
    const isStalePasswordHashSelect =
      error instanceof Error &&
      error.message.includes("Unknown field `passwordHash` for select statement on model `Profile`");

    if (!isStalePasswordHashSelect) {
      throw error;
    }

    const rows = await prisma.$queryRaw<PasswordProfile[]>`
      SELECT
        "id",
        "password_hash" AS "passwordHash"
      FROM "public"."profiles"
      WHERE "id" = ${userId}
      LIMIT 1
    `;

    return rows[0] ?? null;
  }
}

export async function changePasswordAction(
  _prevState: ChangePasswordActionState,
  formData: FormData,
): Promise<ChangePasswordActionState> {
  void _prevState;

  const profile = await requireCurrentProfile();
  const parsed = changePasswordSchema.safeParse({
    confirmPassword: formData.get("confirmPassword"),
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    return {
      fieldErrors: {
        confirmPassword: fieldErrors.confirmPassword?.[0],
        currentPassword: fieldErrors.currentPassword?.[0],
        newPassword: fieldErrors.newPassword?.[0],
      },
      message: "Periksa lagi field yang masih bermasalah.",
      status: "error",
    };
  }

  const passwordProfile = await getPasswordProfile(profile.id);

  if (!passwordProfile || !verifyPassword(parsed.data.currentPassword, passwordProfile.passwordHash)) {
    return {
      fieldErrors: {
        currentPassword: "Password saat ini tidak sesuai.",
      },
      message: "Password saat ini tidak sesuai.",
      status: "error",
    };
  }

  try {
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        passwordHash: hashPassword(parsed.data.newPassword),
      },
    });
  } catch (error) {
    console.error("Failed to update password", error);

    return {
      fieldErrors: {},
      message: "Password belum bisa diperbarui sekarang.",
      status: "error",
    };
  }

  return {
    fieldErrors: {},
    message: "Password berhasil diperbarui.",
    status: "success",
  };
}

export async function logoutAction() {
  await clearUserSession();
  redirect("/login");
}
