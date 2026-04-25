"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { ensureEnvAdmin, ensureEnvAdminBootstrap } from "@/lib/admin-bootstrap";
import { createUserSession, hashPassword } from "@/lib/auth";
import { upsertMemberSubscription } from "@/lib/member-subscription";
import { prisma } from "@/lib/prisma";
import { getPaymentGatewaySettings } from "@/lib/payment-gateway-settings";
import { markSignupPaymentConsumed, verifyPaidSignupPayment } from "@/lib/signup-payment";
import { isReservedUsername, normalizeUsername } from "@/lib/username-rules";

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters.")
  .max(24, "Username must be at most 24 characters.")
  .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores.")
  .transform((value) => normalizeUsername(value))
  .refine((value) => !isReservedUsername(value), "This username is reserved.");

const whatsappSchema = z
  .string()
  .trim()
  .min(9, "Enter a valid WhatsApp number.")
  .max(24, "WhatsApp number is too long.")
  .regex(/^\+?[0-9()\-\s]+$/, "WhatsApp number can only contain digits, spaces, parentheses, dashes, or +.")
  .transform((value) => value.replace(/[()\-\s]/g, ""))
  .refine((value) => /^\+?[0-9]{9,16}$/.test(value), "Enter a valid WhatsApp number.");

const signUpSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters."),
  passwordConfirmation: z.string().min(1, "Repeat your password."),
  whatsapp: whatsappSchema,
  username: usernameSchema,
}).refine((value) => value.password === value.passwordConfirmation, {
  path: ["passwordConfirmation"],
  message: "Passwords do not match.",
});

export type SignupActionState = {
  status: "idle" | "error" | "success";
  message: string | null;
  fieldErrors: {
    email?: string;
    password?: string;
    passwordConfirmation?: string;
    whatsapp?: string;
    username?: string;
  };
  formValues?: {
    email?: string;
    username?: string;
    whatsapp?: string;
  };
};

function isUniqueConstraintError(error: unknown): error is { code: string } {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

function isUnknownWhatsappArgumentError(error: unknown) {
  if (error instanceof Error) {
    return error.message.includes("Unknown argument `whatsapp`");
  }

  return typeof error === "string" && error.includes("Unknown argument `whatsapp`");
}

async function createProfileRecord(input: {
  email: string;
  password: string;
  username: string;
  whatsapp: string;
}) {
  const passwordHash = hashPassword(input.password);

  try {
    return await prisma.profile.create({
      data: {
        email: input.email,
        passwordHash,
        whatsapp: input.whatsapp,
        username: input.username,
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    if (!isUnknownWhatsappArgumentError(error)) {
      throw error;
    }

    const insertedProfiles = await prisma.$queryRaw<Array<{ id: string }>>`
      INSERT INTO "public"."profiles" (
        "email",
        "whatsapp",
        "username",
        "password_hash"
      )
      VALUES (
        ${input.email},
        ${input.whatsapp},
        ${input.username},
        ${passwordHash}
      )
      RETURNING "id"
    `;

    const [profile] = insertedProfiles;

    if (!profile) {
      throw error;
    }

    return profile;
  }
}

export async function signUpAction(
  _prevState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  void _prevState;

  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
    whatsapp: formData.get("whatsapp"),
    username: formData.get("username"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const email = formData.get("email");
    const username = formData.get("username");
    const whatsapp = formData.get("whatsapp");

    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        passwordConfirmation: fieldErrors.passwordConfirmation?.[0],
        whatsapp: fieldErrors.whatsapp?.[0],
        username: fieldErrors.username?.[0],
      },
      formValues: {
        email: typeof email === "string" ? email : "",
        username: typeof username === "string" ? username : "",
        whatsapp: typeof whatsapp === "string" ? whatsapp : "",
      },
    };
  }

  const { email, password, username, whatsapp } = parsed.data;
  await ensureEnvAdminBootstrap();
  const paymentSettings = await getPaymentGatewaySettings();
  const paymentReferenceId = String(formData.get("paymentReferenceId") ?? "").trim();
  const selectedPlanId = String(formData.get("selectedPlanId") ?? "").trim();
  let selectedPlan =
    paymentSettings.subscriptionPlans.find((plan) => plan.id === selectedPlanId) ??
    paymentSettings.subscriptionPlans.find((plan) => plan.id === paymentSettings.defaultPlanId) ??
    paymentSettings.subscriptionPlans[0];
  let verifiedPayment: Awaited<ReturnType<typeof verifyPaidSignupPayment>> | null = null;
  let redirectPath = "/dashboard";

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
      status: "error",
      message: "That username is already taken.",
      fieldErrors: {
        username: "Choose a different username.",
      },
      formValues: {
        email,
        username,
        whatsapp,
      },
    };
  }

  if (existingProfile?.email === email) {
    return {
      status: "error",
      message: "That email is already registered.",
      fieldErrors: {
        email: "Use a different email or sign in.",
      },
      formValues: {
        email,
        username,
        whatsapp,
      },
    };
  }

  if (paymentSettings.isEnabled) {
    if (!paymentReferenceId) {
      return {
        status: "error",
        message: "Selesaikan pembayaran pendaftaran terlebih dahulu.",
        fieldErrors: {},
        formValues: {
          email,
          username,
          whatsapp,
        },
      };
    }

    verifiedPayment = await verifyPaidSignupPayment(paymentReferenceId);

    if (!verifiedPayment) {
      return {
        status: "error",
        message: "Pembayaran belum terverifikasi. Selesaikan pembayaran lalu cek statusnya lagi.",
        fieldErrors: {},
        formValues: {
          email,
          username,
          whatsapp,
        },
      };
    }

    if (
      !selectedPlan ||
      verifiedPayment.amount !== selectedPlan.price ||
      verifiedPayment.customerEmail.toLowerCase() !== email.toLowerCase() ||
      verifiedPayment.customerName !== username
    ) {
      return {
        status: "error",
        message: "Data pembayaran tidak cocok dengan form pendaftaran yang sedang Anda kirim.",
        fieldErrors: {},
        formValues: {
          email,
          username,
          whatsapp,
        },
      };
    }

    selectedPlan =
      paymentSettings.subscriptionPlans.find((plan) => plan.id === verifiedPayment?.planId) ??
      selectedPlan;
  }

  try {
    const profile = await createProfileRecord({
      email,
      password,
      username,
      whatsapp,
    });

    if (selectedPlan) {
      await upsertMemberSubscription({
        paymentReferenceId: verifiedPayment?.referenceId ?? paymentReferenceId ?? null,
        plan: selectedPlan,
        profileId: profile.id,
      });
    }

    const authenticatedProfile = await ensureEnvAdmin({
      email,
      id: profile.id,
      isAdmin: false,
      username,
    });

    redirectPath = authenticatedProfile.isAdmin ? "/admin" : "/dashboard";

    if (paymentSettings.isEnabled && paymentReferenceId) {
      await markSignupPaymentConsumed(paymentReferenceId);
    }

    await createUserSession(profile.id);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      const conflictingProfile = await prisma.profile.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
        select: {
          email: true,
          username: true,
        },
      });

      return {
        status: "error",
        message: "This account could not be created because one of the fields is already in use.",
        fieldErrors: {
          email: conflictingProfile?.email === email ? "Use a different email." : undefined,
          username: conflictingProfile?.username === username ? "Choose a different username." : undefined,
        },
        formValues: {
          email,
          username,
          whatsapp,
        },
      };
    }

    return {
      status: "error",
      message: "Unable to create the account right now.",
      fieldErrors: {},
      formValues: {
        email,
        username,
        whatsapp,
      },
    };
  }

  redirect(redirectPath);
}
