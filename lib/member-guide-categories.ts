import type { MemberGuidePost } from "@/lib/member-guide-types";

export function getStartGuides(guides: MemberGuidePost[]) {
  return guides.filter((guide) => guide.section === "start");
}

export function getActivationGuides(guides: MemberGuidePost[]) {
  return guides.filter((guide) => guide.section === "activation");
}

export function getBotSettingsGuides(guides: MemberGuidePost[]) {
  return guides.filter((guide) => guide.section === "bot_settings");
}

export function getPdfGuides(guides: MemberGuidePost[]) {
  return guides.filter((guide) => guide.section === "files");
}
