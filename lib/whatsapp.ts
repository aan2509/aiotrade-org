function normalizeWhatsappNumber(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const digits = trimmed.replace(/\D/g, "");

  if (digits.startsWith("00")) {
    return digits.slice(2);
  }

  if (trimmed.startsWith("+")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  return digits;
}

type BuildWhatsAppUrlOptions = {
  message?: string;
  username?: string;
};

export function buildWhatsAppUrl(
  phone: string,
  usernameOrOptions?: string | BuildWhatsAppUrlOptions,
) {
  const normalizedPhone = normalizeWhatsappNumber(phone);

  if (!normalizedPhone) {
    return null;
  }

  const options =
    typeof usernameOrOptions === "string"
      ? { username: usernameOrOptions }
      : (usernameOrOptions ?? {});

  const message =
    options.message ??
    (options.username
      ? `Halo kak ${options.username}, saya tertarik gabung komunitas AIOTrade.`
      : "Halo, saya tertarik gabung komunitas AIOTrade.");

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
