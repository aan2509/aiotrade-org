import "server-only";

import { prisma } from "@/lib/prisma";
import { HIDDEN_ADMIN_TABLE_USERNAMES } from "@/lib/username-rules";

export type AdminUserRow = {
  email: string | null;
  id: string;
  isAdmin: boolean;
  username: string;
  whatsapp: string | null;
};

export async function getAdminUsers() {
  const rows = await prisma.$queryRaw<
    Array<{
      email: string | null;
      id: string;
      isAdmin: boolean;
      username: string;
      whatsapp: string | null;
    }>
  >`
    SELECT
      p."id",
      p."email",
      p."username",
      p."whatsapp",
      p."is_admin" AS "isAdmin"
    FROM "public"."profiles" p
    ORDER BY p."username" ASC
  `;

  return rows
    .filter((row) => !HIDDEN_ADMIN_TABLE_USERNAMES.has(row.username))
    .map((row) => ({
      email: row.email,
      id: row.id,
      isAdmin: row.isAdmin,
      username: row.username,
      whatsapp: row.whatsapp,
    })) satisfies AdminUserRow[];
}
