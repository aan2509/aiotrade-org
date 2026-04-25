import "server-only";

import type { HomepageAsset } from "@/components/landing/types";
import { prisma } from "@/lib/prisma";

type HomepageAssetRecord = {
  bytes: number | null;
  createdAt: Date;
  format: string | null;
  height: number | null;
  id: string;
  label: string;
  publicId: string;
  secureUrl: string;
  width: number | null;
};

type CreateHomepageAssetInput = {
  bytes?: number | null;
  format?: string | null;
  height?: number | null;
  label: string;
  publicId: string;
  secureUrl: string;
  width?: number | null;
};

function hasHomepageAssetDelegate() {
  return (
    "homepageAsset" in prisma &&
    typeof prisma.homepageAsset?.findMany === "function" &&
    typeof prisma.homepageAsset?.upsert === "function"
  );
}

function toHomepageAsset(asset: HomepageAssetRecord): HomepageAsset {
  return {
    bytes: asset.bytes,
    createdAt: asset.createdAt.toISOString(),
    format: asset.format,
    height: asset.height,
    id: asset.id,
    label: asset.label,
    publicId: asset.publicId,
    secureUrl: asset.secureUrl,
    width: asset.width,
  };
}

export async function getHomepageAssets() {
  const tables = await prisma.$queryRaw<Array<{ tableName: string | null }>>`
    SELECT to_regclass('public.homepage_assets')::text AS "tableName"
  `;

  if (!tables[0]?.tableName) {
    return [] as HomepageAsset[];
  }

  const records = hasHomepageAssetDelegate()
    ? await prisma.homepageAsset.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          bytes: true,
          createdAt: true,
          format: true,
          height: true,
          id: true,
          label: true,
          publicId: true,
          secureUrl: true,
          width: true,
        },
      })
    : await prisma.$queryRaw<HomepageAssetRecord[]>`
        SELECT
          "id",
          "label",
          "public_id" AS "publicId",
          "secure_url" AS "secureUrl",
          "width",
          "height",
          "bytes",
          "format",
          "created_at" AS "createdAt"
        FROM "public"."homepage_assets"
        ORDER BY "created_at" DESC
      `;

  return records.map(toHomepageAsset);
}

export async function saveHomepageAsset(input: CreateHomepageAssetInput) {
  if (hasHomepageAssetDelegate()) {
    const asset = await prisma.homepageAsset.upsert({
      where: {
        publicId: input.publicId,
      },
      create: {
        bytes: input.bytes ?? null,
        format: input.format ?? null,
        height: input.height ?? null,
        label: input.label,
        publicId: input.publicId,
        secureUrl: input.secureUrl,
        width: input.width ?? null,
      },
      update: {
        bytes: input.bytes ?? null,
        format: input.format ?? null,
        height: input.height ?? null,
        label: input.label,
        secureUrl: input.secureUrl,
        width: input.width ?? null,
      },
      select: {
        bytes: true,
        createdAt: true,
        format: true,
        height: true,
        id: true,
        label: true,
        publicId: true,
        secureUrl: true,
        width: true,
      },
    });

    return toHomepageAsset(asset);
  }

  const rows = await prisma.$queryRaw<HomepageAssetRecord[]>`
    INSERT INTO "public"."homepage_assets" (
      "label",
      "public_id",
      "secure_url",
      "width",
      "height",
      "bytes",
      "format"
    )
    VALUES (
      ${input.label},
      ${input.publicId},
      ${input.secureUrl},
      ${input.width ?? null},
      ${input.height ?? null},
      ${input.bytes ?? null},
      ${input.format ?? null}
    )
    ON CONFLICT ("public_id")
    DO UPDATE SET
      "label" = EXCLUDED."label",
      "secure_url" = EXCLUDED."secure_url",
      "width" = EXCLUDED."width",
      "height" = EXCLUDED."height",
      "bytes" = EXCLUDED."bytes",
      "format" = EXCLUDED."format",
      "updated_at" = CURRENT_TIMESTAMP
    RETURNING
      "id",
      "label",
      "public_id" AS "publicId",
      "secure_url" AS "secureUrl",
      "width",
      "height",
      "bytes",
      "format",
      "created_at" AS "createdAt"
  `;

  return toHomepageAsset(rows[0]);
}

