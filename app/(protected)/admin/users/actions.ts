"use server";

import { refresh, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hashPassword, requireAdminProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HIDDEN_ADMIN_TABLE_USERNAMES, isReservedUsername, normalizeUsername } from "@/lib/username-rules";

const createAdminUserSchema = z.object({
  email: z.string().trim().email("Masukkan email yang valid.").transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password minimal 8 karakter."),
  username: z
    .string()
    .trim()
    .min(3, "Username minimal 3 karakter.")
    .max(24, "Username maksimal 24 karakter.")
    .regex(/^[a-z0-9_]+$/, "Username hanya boleh huruf kecil, angka, dan underscore.")
    .transform((value) => normalizeUsername(value))
    .refine(
      (value) => !isReservedUsername(value) && !HIDDEN_ADMIN_TABLE_USERNAMES.has(value),
      "Username ini dipakai sistem. Coba nama lain.",
    ),
});

export type CreateAdminUserState = {
  fieldErrors: {
    email?: string;
    password?: string;
    username?: string;
  };
  formValues: {
    email: string;
    password: string;
    username: string;
  };
  message: string | null;
  status: "idle" | "error" | "success";
};

function isUniqueConstraintError(error: unknown): error is { code: string } {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function createAdminUserAction(
  _prevState: CreateAdminUserState,
  formData: FormData,
): Promise<CreateAdminUserState> {
  void _prevState;
  await requireAdminProfile();

  const parsed = createAdminUserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    username: formData.get("username"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    return {
      fieldErrors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        username: fieldErrors.username?.[0],
      },
      formValues: {
        email: String(formData.get("email") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
        username: String(formData.get("username") ?? "").trim().toLowerCase(),
      },
      message: "Periksa kembali field yang ditandai.",
      status: "error",
    };
  }

  const { email, password, username } = parsed.data;
  const existingProfile = await prisma.profile.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
    select: {
      email: true,
      username: true,
    },
  });

  if (existingProfile?.username === username) {
    return {
      fieldErrors: {
        username: "Username ini sudah dipakai.",
      },
      formValues: {
        email,
        password,
        username,
      },
      message: "Username sudah digunakan oleh user lain.",
      status: "error",
    };
  }

  if (existingProfile?.email === email) {
    return {
      fieldErrors: {
        email: "Email ini sudah terdaftar.",
      },
      formValues: {
        email,
        password,
        username,
      },
      message: "Email sudah digunakan oleh user lain.",
      status: "error",
    };
  }

  try {
    await prisma.profile.create({
      data: {
        email,
        passwordHash: hashPassword(password),
        username,
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        fieldErrors: {},
        formValues: {
          email,
          password,
          username,
        },
        message: "User tidak bisa dibuat karena email atau username sudah dipakai.",
        status: "error",
      };
    }

    return {
      fieldErrors: {},
      formValues: {
        email,
        password,
        username,
      },
      message: "User belum bisa dibuat sekarang. Coba lagi.",
      status: "error",
    };
  }

  revalidatePath("/admin/users");
  refresh();

  return {
    fieldErrors: {},
    formValues: {
      email: "",
      password: "",
      username: "",
    },
    message: `User @${username} berhasil dibuat.`,
    status: "success",
  };
}

export async function deleteUserAction(formData: FormData) {
  const admin = await requireAdminProfile();
  const userId = String(formData.get("userId") ?? "").trim();

  if (!userId) {
    redirect("/admin/users?status=error");
  }

  if (userId === admin.id) {
    redirect("/admin/users?status=self-delete-blocked");
  }

  try {
    await prisma.profile.delete({
      where: {
        id: userId,
      },
    });
  } catch {
    redirect("/admin/users?status=error");
  }

  revalidatePath("/admin/users");
  redirect("/admin/users?status=deleted");
}
