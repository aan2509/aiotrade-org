"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { ensureEnvAdmin, ensureEnvAdminBootstrap } from "@/lib/admin-bootstrap";
import { createUserSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Enter your password."),
});

export type LoginActionState = {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: {
    email?: string;
    password?: string;
  };
  formValues?: {
    email?: string;
  };
};

type LoginProfile = {
  email: string | null;
  id: string;
  isAdmin: boolean;
  passwordHash: string;
  username: string;
};

async function getLoginProfileByEmail(email: string) {
  try {
    return await prisma.profile.findFirst({
      where: {
        email,
      },
      select: {
        email: true,
        id: true,
        isAdmin: true,
        passwordHash: true,
        username: true,
      },
    });
  } catch (error) {
    const isStaleIsAdminSelect =
      error instanceof Error &&
      error.message.includes("Unknown field `isAdmin` for select statement on model `Profile`");

    if (!isStaleIsAdminSelect) {
      throw error;
    }

    const profiles = await prisma.$queryRaw<LoginProfile[]>`
      SELECT
        "email",
        "id",
        "is_admin" AS "isAdmin",
        "password_hash" AS "passwordHash",
        "username"
      FROM "public"."profiles"
      WHERE "email" = ${email}
      LIMIT 1
    `;

    return profiles[0] ?? null;
  }
}

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  void _prevState;

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const email = formData.get("email");

    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
      formValues: {
        email: typeof email === "string" ? email : "",
      },
    };
  }

  const { email, password } = parsed.data;
  await ensureEnvAdminBootstrap();

  const profile = await getLoginProfileByEmail(email);

  if (!profile || !verifyPassword(password, profile.passwordHash)) {
    return {
      status: "error",
      message: "Email or password is incorrect.",
      fieldErrors: {},
      formValues: {
        email,
      },
    };
  }

  const authenticatedProfile = await ensureEnvAdmin({
    email: profile.email,
    id: profile.id,
    isAdmin: profile.isAdmin,
    username: profile.username,
  });

  await createUserSession(profile.id);

  redirect(authenticatedProfile.isAdmin ? "/admin" : "/dashboard");
}
