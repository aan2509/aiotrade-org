import "server-only";

import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ensureEnvAdmin } from "@/lib/admin-bootstrap";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "aiotrade_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

type SessionPayload = {
  exp: number;
  sub: string;
};

type CurrentProfile = {
  email: string | null;
  id: string;
  isAdmin: boolean;
  username: string;
  whatsapp: string | null;
};

function getAuthSecret() {
  const configuredSecret =
    process.env.AUTH_SECRET?.trim() ||
    process.env.SESSION_SECRET?.trim() ||
    null;

  if (configuredSecret) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET or SESSION_SECRET must be set in production.");
  }

  return (
    process.env.DATABASE_URL ??
    process.env.DIRECT_URL ??
    "local-dev-secret"
  );
}

function signSessionPayload(payload: string) {
  return createHmac("sha256", getAuthSecret())
    .update(payload)
    .digest("base64url");
}

function encodeSession(payload: SessionPayload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signSessionPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

function decodeSession(cookieValue: string): SessionPayload | null {
  const [encodedPayload, signature] = cookieValue.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signSessionPayload(encodedPayload);
  const providedSignature = Buffer.from(signature);
  const actualSignature = Buffer.from(expectedSignature);

  if (
    providedSignature.length !== actualSignature.length ||
    !timingSafeEqual(providedSignature, actualSignature)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as SessionPayload;

    if (typeof payload.sub !== "string" || typeof payload.exp !== "number") {
      return null;
    }

    if (payload.exp <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export { hashPassword, verifyPassword } from "@/lib/password";

export async function createUserSession(userId: string) {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;

  cookieStore.set(SESSION_COOKIE_NAME, encodeSession({ exp: expiresAt, sub: userId }), {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionUserId() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!cookieValue) {
    return null;
  }

  return decodeSession(cookieValue)?.sub ?? null;
}

export async function getCurrentProfile() {
  const userId = await getSessionUserId();

  if (!userId) {
    return null;
  }

  try {
    const profile = await prisma.profile.findFirst({
      where: {
        id: userId,
      },
      select: {
        email: true,
        id: true,
        isAdmin: true,
        whatsapp: true,
        username: true,
      },
    });

    return profile ? ensureEnvAdmin(profile) : null;
  } catch (error) {
    const isStaleWhatsappSelect =
      error instanceof Error &&
      (error.message.includes("Unknown field `whatsapp` for select statement on model `Profile`") ||
        error.message.includes("Unknown field `isAdmin` for select statement on model `Profile`"));

    if (!isStaleWhatsappSelect) {
      throw error;
    }

    const profiles = await prisma.$queryRaw<CurrentProfile[]>`
      SELECT
        "id",
        "email",
        "is_admin" AS "isAdmin",
        "whatsapp",
        "username"
      FROM "public"."profiles"
      WHERE "id" = ${userId}
      LIMIT 1
    `;

    const profile = profiles[0] ?? null;

    return profile ? ensureEnvAdmin(profile) : null;
  }
}

export async function requireCurrentProfile() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}

export async function requireAdminProfile() {
  const profile = await requireCurrentProfile();

  if (!profile.isAdmin) {
    redirect("/dashboard");
  }

  return profile;
}
