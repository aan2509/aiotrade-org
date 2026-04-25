import { NextResponse } from "next/server";
import { z } from "zod";
import { createCloudinarySignature, getCloudinaryConfig, isCloudinaryConfigured } from "@/lib/cloudinary";
import { getCurrentProfile } from "@/lib/auth";

export const runtime = "nodejs";

const requestSchema = z.object({
  filename: z.string().trim().min(1).max(200),
});

export async function POST(request: Request) {
  const profile = await getCurrentProfile();

  if (!profile?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary belum dikonfigurasi di environment." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Nama file tidak valid." }, { status: 400 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const { apiKey, cloudName, folder } = getCloudinaryConfig();
  const signature = createCloudinarySignature({
    folder,
    timestamp,
  });

  return NextResponse.json({
    apiKey,
    cloudName,
    folder,
    signature,
    timestamp,
  });
}

