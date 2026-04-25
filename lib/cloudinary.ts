import "server-only";

import { createHash } from "node:crypto";

const DEFAULT_CLOUDINARY_FOLDER = "aiotrade/homepage";
const DEFAULT_MEMBER_GUIDE_FOLDER = "aiotrade/member-guides";
const DEFAULT_PUBLIC_GUIDE_FOLDER = "aiotrade/public-guides";

export function getCloudinaryConfig() {
  return {
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    folder: process.env.CLOUDINARY_HOMEPAGE_FOLDER ?? DEFAULT_CLOUDINARY_FOLDER,
    memberGuideFolder:
      process.env.CLOUDINARY_MEMBER_GUIDE_FOLDER ?? DEFAULT_MEMBER_GUIDE_FOLDER,
    publicGuideFolder:
      process.env.CLOUDINARY_PUBLIC_GUIDE_FOLDER ?? DEFAULT_PUBLIC_GUIDE_FOLDER,
  };
}

export function isCloudinaryConfigured() {
  const config = getCloudinaryConfig();

  return Boolean(config.apiKey && config.apiSecret && config.cloudName);
}

export function createCloudinarySignature(params: Record<string, string | number>) {
  const { apiSecret } = getCloudinaryConfig();

  if (!apiSecret) {
    throw new Error("Cloudinary API secret is not configured.");
  }

  const serialized = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${serialized}${apiSecret}`)
    .digest("hex");
}
