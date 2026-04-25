import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentProfile } from "@/lib/auth";
import { getHomepageAssets, saveHomepageAsset } from "@/lib/homepage-assets";

export const runtime = "nodejs";

const assetSchema = z.object({
  bytes: z.number().int().nonnegative().nullable().optional(),
  format: z.string().trim().min(1).nullable().optional(),
  height: z.number().int().nonnegative().nullable().optional(),
  label: z.string().trim().min(1).max(120),
  publicId: z.string().trim().min(1).max(240),
  secureUrl: z.string().trim().url(),
  width: z.number().int().nonnegative().nullable().optional(),
});

export async function GET() {
  const profile = await getCurrentProfile();

  if (!profile?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const assets = await getHomepageAssets();

  return NextResponse.json({ assets });
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();

  if (!profile?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = assetSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Payload asset tidak valid." }, { status: 400 });
  }

  const asset = await saveHomepageAsset(parsed.data);

  return NextResponse.json({ asset });
}

