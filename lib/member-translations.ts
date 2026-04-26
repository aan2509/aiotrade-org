import "server-only";

import type { MemberGuidePost } from "@/lib/member-guide-types";
import { defaultMemberShellLabels } from "@/lib/member-shell-labels";
import type { SiteLanguage } from "@/lib/site-language";
import { translateRecordStrings, translateStructuredStrings } from "@/lib/translatex";

type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer U)[]
    ? DeepPartial<U>[]
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

function mergeDeep<T>(base: T, patch: DeepPartial<T>): T {
  if (Array.isArray(base) || Array.isArray(patch)) {
    return (patch as T) ?? base;
  }

  if (
    base &&
    typeof base === "object" &&
    patch &&
    typeof patch === "object"
  ) {
    const clone = { ...(base as Record<string, unknown>) };

    Object.entries(patch as Record<string, unknown>).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }

      const current = clone[key];

      if (
        current &&
        typeof current === "object" &&
        !Array.isArray(current) &&
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        clone[key] = mergeDeep(current, value as Record<string, unknown>);
        return;
      }

      clone[key] = value;
    });

    return clone as T;
  }

  return (patch as T) ?? base;
}

const englishMemberShellLabels = {
  accountGroup: "Account",
  accountItems: {
    profile: "Profile",
    resetPassword: "Reset Password",
  },
  adminPanel: "Admin Panel",
  closeMenu: "Close menu",
  dashboardTitle: "Member Dashboard",
  guideGroup: "Learning Center",
  guideItems: {
    files: "How to Profit",
    setupBot: "eCourse",
    start: "Getting Started",
    strategy: "AIOTrade",
  },
  loginAs: "Logged in as",
  logout: "Log out",
  memberArea: "Member Area",
  mobileTitles: {
    accountProfile: "Account: Profile",
    accountResetPassword: "Account: Reset Password",
    dashboard: "Dashboard",
    fallback: "Member Dashboard",
    guideFiles: "Learning Center: How to Profit",
    guideSetupBot: "Learning Center: eCourse",
    guideStart: "Learning Center: Getting Started",
    guideStrategy: "Learning Center: AIOTrade",
    joinAiotrade: "Join AIOTrade",
    subscription: "Subscription",
  },
  openMenu: "Open menu",
  primaryItems: {
    dashboard: "Dashboard",
    joinAiotrade: "Join AIOTrade",
    subscription: "Subscription",
  },
  sidebarDescription: "Access your account information and guides.",
  sidebarTitle: "Member Dashboard",
} satisfies Partial<typeof defaultMemberShellLabels>;

const englishMemberCopyByKey: Record<string, string> = {
  active: "Active",
  activeUntil: "Valid until",
  badge: "Dashboard",
  confirmPassword: "Confirm New Password",
  currentPassword: "Current Password",
  currentPlaceholder: "Enter your current password",
  dashboardDescription: "This is the statistics center of your member area.",
  description: "Opening material to understand the key steps before moving on to bot setup or advanced materials.",
  detailSubscription: "View subscription details",
  editDescription: "Update your WhatsApp number here.",
  editNote: "Make sure your WhatsApp number stays active so our team can contact you when needed.",
  editTitle: "Edit account info",
  duration: "Plan duration",
  email: "Email",
  emptyBody:
    "Your account does not have a recorded subscription yet. Membership data will appear automatically after signup is completed with the selected plan.",
  emptyMembershipBody:
    "Your account does not have a recorded membership yet. Package data will appear here automatically after registration and payment are completed.",
  emptyMembershipTitle: "No membership data yet",
  emptyMessage: "There are no published guide videos in this category yet.",
  emptyTitle: "No subscription data yet",
  fallbackOpenSubscription: "Open the subscription menu",
  greeting: "Hello",
  inactive: "Inactive",
  lifetime: "Lifetime",
  listDescription: "All materials in this category will appear here.",
  listTitle: "Video list",
  membershipTitle: "Active Subscription",
  months: "months",
  newPassword: "New Password",
  newPlaceholder: "Minimum 8 characters",
  noteBody: "After the password is changed, your next login will use the new password.",
  noteTitle: "Note",
  nowPlaying: "Now playing",
  openEntryLink: "Open entry link",
  openMenu: "Open menu",
  openPdf: "Open PDF",
  pageBadge: "Member Account",
  pageDescription: "Your main account information.",
  pageTitle: "Account Profile",
  paymentReference: "Payment reference",
  planId: "Plan ID",
  quickAccess: "Quick access",
  quickAccountDescription: "Manage your account profile and contact details.",
  quickAccountLabel: "Open account menu",
  quickAccountTitle: "Account",
  quickGuideDescription: "Akses Pusat Belajar berisi video dan PDF untuk Mulai, eCourse, AIOTrade, dan Cara Cuan.",
  quickGuideLabel: "View guides",
  quickGuideTitle: "Learning Center",
  quickSubscriptionDescription: "Check the active period of your subscription.",
  quickSubscriptionLabel: "Check subscription",
  quickSubscriptionTitle: "Subscription",
  saveProfileChanges: "Save changes",
  saveProfilePending: "Saving changes...",
  saveButton: "Save New Password",
  savePending: "Saving password...",
  sectionDescription: "Choose a material to preview the main video and start learning faster.",
  sectionTitle: "Account info",
  startedAt: "Started on",
  statsBody: "Summary of guides and account access available to you right now.",
  statsTitle: "Member statistics",
  statusAccess: "Access status",
  statusBodyLimited:
    "Your account is using a time-limited package. Make sure the validity date still matches your access needs.",
  statusBodyLifetime:
    "Your account uses a lifetime package, so your member access has no end date.",
  statusLabel: "Status",
  statusTitle: "Subscription status",
  subscription: "Subscription",
  title: "Getting Started",
  totalGuides: "Total Guides",
  videoPdf: "Video / PDF",
  videoTitle: "Guide videos",
  whatsapp: "WhatsApp",
  whatsappPlaceholder: "Enter WhatsApp number",
  yesLifetime: "Lifetime",
  yourMembership: "Active Subscription",
  yourPackage: "Your plan",
  username: "Username",
};

export async function getTranslatedMemberShellLabels(targetLanguage: SiteLanguage) {
  if (targetLanguage === "id") {
    return defaultMemberShellLabels;
  }

  if (targetLanguage === "en") {
    return mergeDeep(defaultMemberShellLabels, englishMemberShellLabels);
  }

  return translateStructuredStrings({
    shouldTranslate: (_path, value) => Boolean(value.trim()),
    targetLanguage,
    value: defaultMemberShellLabels,
  });
}

export async function translateMemberGuidePosts(posts: MemberGuidePost[], targetLanguage: SiteLanguage) {
  return translateStructuredStrings({
    shouldTranslate: (path) => {
      const last = String(path[path.length - 1] ?? "");

      return ["title", "description"].includes(last);
    },
    targetLanguage,
    value: posts,
  });
}

export async function translateSimpleMemberCopy<T extends Record<string, string>>(
  record: T,
  targetLanguage: SiteLanguage,
) {
  if (targetLanguage === "id") {
    return record;
  }

  if (targetLanguage === "en") {
    const englishPatch = Object.fromEntries(
      Object.keys(record).map((key) => [key, englishMemberCopyByKey[key] ?? record[key]]),
    ) as Partial<T>;

    return {
      ...record,
      ...englishPatch,
    };
  }

  return translateRecordStrings({ record, targetLanguage });
}
