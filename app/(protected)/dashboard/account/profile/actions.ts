"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const whatsappSchema = z
  .string()
  .trim()
  .min(9, "Masukkan nomor WhatsApp yang valid.")
  .max(24, "Nomor WhatsApp terlalu panjang.")
  .regex(/^\+?[0-9()\-\s]+$/, "Nomor WhatsApp hanya boleh berisi angka, spasi, tanda kurung, strip, atau +.")
  .transform((value) => value.replace(/[()\-\s]/g, ""))
  .refine((value) => /^\+?[0-9]{9,16}$/.test(value), "Masukkan nomor WhatsApp yang valid.");

const updateMemberProfileSchema = z.object({
  language: z.string().optional(),
  whatsapp: whatsappSchema,
});

type UpdateMemberProfileCopy = {
  fixFields: string;
  saveFailed: string;
  saveSuccess: string;
  signInRequired: string;
};

function getActionCopy(language: string | null | undefined): UpdateMemberProfileCopy {
  const normalized = String(language ?? "").trim().toLowerCase();

  if (normalized.startsWith("en")) {
    return {
      fixFields: "Please fix the highlighted fields.",
      saveFailed: "Your profile could not be updated right now.",
      saveSuccess: "Your account information has been updated.",
      signInRequired: "You need to sign in first.",
    };
  }

  return {
    fixFields: "Periksa lagi field yang masih bermasalah.",
    saveFailed: "Profil Anda belum bisa diperbarui sekarang.",
    saveSuccess: "Informasi akun berhasil diperbarui.",
    signInRequired: "Anda harus login terlebih dahulu.",
  };
}

export type UpdateMemberProfileState = {
  fieldErrors: {
    whatsapp?: string;
  };
  formValues: {
    whatsapp: string;
  };
  message: string | null;
  status: "idle" | "error" | "success";
};

function isUnknownWhatsappArgumentError(error: unknown) {
  if (error instanceof Error) {
    return error.message.includes("Unknown argument `whatsapp`");
  }

  return typeof error === "string" && error.includes("Unknown argument `whatsapp`");
}

async function updateProfileContact(input: {
  id: string;
  whatsapp: string;
}) {
  try {
    await prisma.profile.update({
      where: {
        id: input.id,
      },
      data: {
        whatsapp: input.whatsapp,
      },
    });
  } catch (error) {
    if (!isUnknownWhatsappArgumentError(error)) {
      throw error;
    }

    await prisma.$executeRaw`
      UPDATE "public"."profiles"
      SET
        "whatsapp" = ${input.whatsapp}
      WHERE "id" = ${input.id}
    `;
  }
}

export async function updateMemberProfileAction(
  _prevState: UpdateMemberProfileState,
  formData: FormData,
): Promise<UpdateMemberProfileState> {
  void _prevState;

  const copy = getActionCopy(formData.get("language") as string | null | undefined);
  let profile;

  try {
    profile = await requireCurrentProfile();
  } catch {
    return {
      fieldErrors: {},
      formValues: {
        whatsapp: String(formData.get("whatsapp") ?? "").trim(),
      },
      message: copy.signInRequired,
      status: "error",
    };
  }

  const parsed = updateMemberProfileSchema.safeParse({
    language: formData.get("language"),
    whatsapp: formData.get("whatsapp"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    return {
      fieldErrors: {
        whatsapp: fieldErrors.whatsapp?.[0],
      },
      formValues: {
        whatsapp: String(formData.get("whatsapp") ?? "").trim(),
      },
      message: copy.fixFields,
      status: "error",
    };
  }

  const whatsapp = parsed.data.whatsapp;

  try {
    await updateProfileContact({
      id: profile.id,
      whatsapp,
    });
  } catch (error) {
    console.error("Failed to update member profile", error);

    return {
      fieldErrors: {},
      formValues: {
        whatsapp,
      },
      message: copy.saveFailed,
      status: "error",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/account/profile");

  return {
    fieldErrors: {},
    formValues: {
      whatsapp,
    },
    message: copy.saveSuccess,
    status: "success",
  };
}
