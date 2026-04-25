import "server-only";

import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

type AdminCandidate = {
  email: string | null;
  id: string;
  isAdmin: boolean;
  username: string;
};

type EnvAdminConfig = {
  email: string;
  password: string;
  username: string;
};

function getEnvAdminEmail() {
  return process.env.DEFAULT_ADMIN_EMAIL?.trim().toLowerCase() || null;
}

function getEnvAdminUsername() {
  return process.env.DEFAULT_ADMIN_USERNAME?.trim().toLowerCase() || null;
}

function getEnvAdminPassword() {
  return process.env.DEFAULT_ADMIN_PASSWORD?.trim() || null;
}

function getEnvAdminConfig(): EnvAdminConfig | null {
  const email = getEnvAdminEmail();
  const username = getEnvAdminUsername();
  const password = getEnvAdminPassword();

  if (!email || !username || !password) {
    return null;
  }

  if (!/^[a-z0-9_]{3,24}$/.test(username)) {
    return null;
  }

  return {
    email,
    password,
    username,
  };
}

function isUnknownIsAdminFieldError(error: unknown) {
  return (
    error instanceof Error &&
    (error.message.includes("Unknown field `isAdmin`") ||
      error.message.includes("Unknown argument `isAdmin`"))
  );
}

type BootstrapAdminProfile = {
  email: string | null;
  id: string;
  isAdmin: boolean;
  username: string;
};

async function hasAnyAdminAccount() {
  try {
    return (await prisma.profile.count({
      where: {
        isAdmin: true,
      },
    })) > 0;
  } catch (error) {
    if (!isUnknownIsAdminFieldError(error)) {
      throw error;
    }

    const rows = await prisma.$queryRaw<Array<{ total: bigint | number }>>`
      SELECT COUNT(*)::bigint AS "total"
      FROM "public"."profiles"
      WHERE "is_admin" = true
    `;

    const total = rows[0]?.total ?? 0;

    return Number(total) > 0;
  }
}

async function findEnvAdminCandidates(config: EnvAdminConfig) {
  try {
    return await prisma.profile.findMany({
      where: {
        OR: [{ email: config.email }, { username: config.username }],
      },
      select: {
        email: true,
        id: true,
        isAdmin: true,
        username: true,
      },
    });
  } catch (error) {
    if (!isUnknownIsAdminFieldError(error)) {
      throw error;
    }

    return prisma.$queryRaw<BootstrapAdminProfile[]>`
      SELECT
        "email",
        "id",
        "is_admin" AS "isAdmin",
        "username"
      FROM "public"."profiles"
      WHERE "email" = ${config.email} OR "username" = ${config.username}
    `;
  }
}

function pickEnvAdminCandidate(
  config: EnvAdminConfig,
  candidates: BootstrapAdminProfile[],
) {
  if (candidates.length === 0) {
    return null;
  }

  const exactMatch = candidates.find(
    (candidate) =>
      candidate.email === config.email && candidate.username === config.username,
  );

  if (exactMatch) {
    return exactMatch;
  }

  const uniqueIds = new Set(candidates.map((candidate) => candidate.id));

  if (uniqueIds.size === 1) {
    return candidates[0];
  }

  return null;
}

async function createEnvAdminAccount(config: EnvAdminConfig) {
  const passwordHash = hashPassword(config.password);

  try {
    await prisma.profile.create({
      data: {
        email: config.email,
        isAdmin: true,
        passwordHash,
        username: config.username,
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    if (!isUnknownIsAdminFieldError(error)) {
      throw error;
    }

    await prisma.$executeRaw`
      INSERT INTO "public"."profiles" (
        "email",
        "is_admin",
        "password_hash",
        "username"
      )
      VALUES (
        ${config.email},
        true,
        ${passwordHash},
        ${config.username}
      )
    `;
  }
}

async function updateEnvAdminAccount(profileId: string, config: EnvAdminConfig) {
  const passwordHash = hashPassword(config.password);

  try {
    await prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        email: config.email,
        isAdmin: true,
        passwordHash,
        username: config.username,
      },
    });
  } catch (error) {
    if (!isUnknownIsAdminFieldError(error)) {
      throw error;
    }

    await prisma.$executeRaw`
      UPDATE "public"."profiles"
      SET
        "email" = ${config.email},
        "is_admin" = true,
        "password_hash" = ${passwordHash},
        "username" = ${config.username}
      WHERE "id" = ${profileId}
    `;
  }
}

export async function ensureEnvAdminBootstrap() {
  const config = getEnvAdminConfig();

  if (!config) {
    return;
  }

  try {
    if (await hasAnyAdminAccount()) {
      return;
    }

    const candidates = await findEnvAdminCandidates(config);
    const bootstrapTarget = pickEnvAdminCandidate(config, candidates);

    if (bootstrapTarget) {
      await updateEnvAdminAccount(bootstrapTarget.id, config);
      return;
    }

    if (candidates.length === 0) {
      await createEnvAdminAccount(config);
      return;
    }

    console.error(
      "Skipped env admin bootstrap because the configured email and username belong to different profiles.",
    );
  } catch (error) {
    console.error("Failed to bootstrap admin account from env.", error);
  }
}

export function matchesEnvAdmin(candidate: Pick<AdminCandidate, "email" | "username">) {
  const adminEmail = getEnvAdminEmail();
  const adminUsername = getEnvAdminUsername();

  if (!adminEmail && !adminUsername) {
    return false;
  }

  return candidate.email === adminEmail || candidate.username === adminUsername;
}

export async function ensureEnvAdmin<T extends AdminCandidate>(candidate: T): Promise<T> {
  if (candidate.isAdmin || !matchesEnvAdmin(candidate)) {
    return candidate;
  }

  try {
    await prisma.profile.update({
      where: {
        id: candidate.id,
      },
      data: {
        isAdmin: true,
      },
    });
  } catch (error) {
    const isStaleIsAdminUpdate =
      error instanceof Error && error.message.includes("Unknown argument `isAdmin`");

    if (!isStaleIsAdminUpdate) {
      throw error;
    }

    await prisma.$executeRaw`
      UPDATE "public"."profiles"
      SET "is_admin" = true
      WHERE "id" = ${candidate.id}
    `;
  }

  return {
    ...candidate,
    isAdmin: true,
  } as T;
}
