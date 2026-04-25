const USERNAME_PATTERN = /^[a-z0-9_]+$/;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 24;

export const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "auth",
  "dashboard",
  "login",
  "register",
  "signup",
]);

export const SPECIAL_REFERRAL_USERNAMES = new Set(["register"]);
export const HIDDEN_ADMIN_TABLE_USERNAMES = new Set(["admin", "mentor", "register"]);

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function isReservedUsername(value: string) {
  return RESERVED_USERNAMES.has(normalizeUsername(value));
}

export function isValidUsernameFormat(value: string) {
  return (
    value.length >= USERNAME_MIN_LENGTH &&
    value.length <= USERNAME_MAX_LENGTH &&
    USERNAME_PATTERN.test(value)
  );
}

export function getUsernameValidationMessage(value: string) {
  const normalizedValue = normalizeUsername(value);

  if (!isValidUsernameFormat(normalizedValue)) {
    return "Pakai 3-24 huruf kecil, angka, atau underscore.";
  }

  if (isReservedUsername(normalizedValue)) {
    return "Username ini dipakai sistem. Coba nama lain.";
  }

  return null;
}

export function parsePublicUsernameCandidate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const normalizedValue = normalizeUsername(value);

  if (!isValidUsernameFormat(normalizedValue) || isReservedUsername(normalizedValue)) {
    return null;
  }

  return normalizedValue;
}
