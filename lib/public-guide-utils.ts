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

export function normalizePublicGuideFileUrl(value: string | null | undefined) {
  const url = normalizeUrl(value);

  if (!url) {
    return null;
  }

  return url.toString();
}
