import type { MemberGuideSection, MemberGuideType } from "@/lib/member-guide-types";

function normalizeUrl(value: string | null | undefined) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  try {
    return new URL(trimmedValue);
  } catch {
    return null;
  }
}

export function normalizeMemberGuideVideoUrl(value: string | null | undefined) {
  const url = normalizeUrl(value);

  if (!url) {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  if (host === "youtube.com" || host === "m.youtube.com") {
    const videoId = url.searchParams.get("v");
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    const pathSegments = url.pathname.split("/").filter(Boolean);
    if (pathSegments[0] === "embed" && pathSegments[1]) {
      return `https://www.youtube.com/embed/${pathSegments[1]}`;
    }

    if (pathSegments[0] === "shorts" && pathSegments[1]) {
      return `https://www.youtube.com/embed/${pathSegments[1]}`;
    }
  }

  if (host === "youtu.be") {
    const videoId = url.pathname.split("/").filter(Boolean)[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  if (host === "vimeo.com") {
    const videoId = url.pathname.split("/").filter(Boolean)[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
  }

  if (host === "player.vimeo.com") {
    const pathSegments = url.pathname.split("/").filter(Boolean);
    return pathSegments[0] === "video" && pathSegments[1]
      ? `https://player.vimeo.com/video/${pathSegments[1]}`
      : null;
  }

  if (host === "youtube-nocookie.com") {
    const pathSegments = url.pathname.split("/").filter(Boolean);
    return pathSegments[0] === "embed" && pathSegments[1]
      ? `https://www.youtube.com/embed/${pathSegments[1]}`
      : null;
  }

  return null;
}

export function buildAutoplayEmbedUrl(value: string | null | undefined, autoplay: boolean) {
  const normalized = normalizeMemberGuideVideoUrl(value);

  if (!normalized) {
    return null;
  }

  try {
    const url = new URL(normalized);
    url.searchParams.set("playsinline", "1");

    if (url.hostname.includes("youtube")) {
      url.searchParams.set("rel", "0");
      url.searchParams.set("modestbranding", "1");
      url.searchParams.set("enablejsapi", "1");
      if (autoplay) {
        url.searchParams.set("autoplay", "1");
        url.searchParams.set("mute", "1");
      } else {
        url.searchParams.delete("autoplay");
        url.searchParams.delete("mute");
      }
    }

    if (url.hostname.includes("vimeo")) {
      if (autoplay) {
        url.searchParams.set("autoplay", "1");
        url.searchParams.set("muted", "1");
      } else {
        url.searchParams.delete("autoplay");
        url.searchParams.delete("muted");
      }
    }

    return url.toString();
  } catch {
    return normalized;
  }
}

export function normalizeMemberGuideFileUrl(value: string | null | undefined) {
  const url = normalizeUrl(value);

  if (!url) {
    return null;
  }

  return url.toString();
}

export function validateMemberGuideInput(input: {
  embedUrl?: string | null;
  fileAssetId?: string | null;
  fileUrl?: string | null;
  section: MemberGuideSection;
  type: MemberGuideType;
}) {
  if (input.type === "video") {
    return {
      embedUrl: normalizeMemberGuideVideoUrl(input.embedUrl),
      fileAssetId: null,
      fileUrl: null,
    };
  }

  const fileAssetId = input.fileAssetId?.trim() || null;

  return {
    embedUrl: null,
    fileAssetId,
    fileUrl: normalizeMemberGuideFileUrl(input.fileUrl),
  };
}
