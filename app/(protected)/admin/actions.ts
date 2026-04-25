"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { sectionBackgroundSchema } from "@/lib/homepage-backgrounds";
import { normalizeMemberGuideVideoUrl } from "@/lib/member-guide-utils";
import { requireAdminProfile } from "@/lib/auth";
import { updateHomepageContentSection } from "@/lib/homepage-content";

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function readCount(formData: FormData, key: string) {
  return Number.parseInt(String(formData.get(key) ?? "0"), 10) || 0;
}

function readNumber(formData: FormData, key: string) {
  const value = Number.parseInt(String(formData.get(key) ?? ""), 10);

  return Number.isNaN(value) ? undefined : value;
}

function readBackground(formData: FormData, prefix = "background") {
  return {
    image: {
      assetId: readString(formData, `${prefix}-image-assetId`) || undefined,
      imageUrl: readString(formData, `${prefix}-image-url`) || undefined,
      overlayColor: readString(formData, `${prefix}-image-overlayColor`) || undefined,
      overlayOpacity: readNumber(formData, `${prefix}-image-overlayOpacity`),
    },
    mode: readString(formData, `${prefix}-mode`) === "image" ? "image" : "palette",
    palette: {
      customHex: readString(formData, `${prefix}-palette-customHex`) || undefined,
      preset: readString(formData, `${prefix}-palette-preset`),
    },
  };
}

function redirectToSection(section: string, status: "saved" | "error"): never {
  redirect(`/admin?section=${encodeURIComponent(section)}&status=${status}`);
}

function readPaletteOnlyBackground(formData: FormData) {
  return {
    ...readBackground(formData),
    image: {
      assetId: undefined,
      imageUrl: undefined,
      overlayColor: undefined,
      overlayOpacity: 58,
    },
    mode: "palette" as const,
  };
}

const heroSchema = z.object({
  background: sectionBackgroundSchema,
  eyebrow: z.string().min(1),
  titleBlue: z.string().min(1),
  titleWhite: z.string().min(1),
  subtitle: z.string().min(1),
  ctaLabel: z.string().min(1),
});

const overviewSchema = z.object({
  background: sectionBackgroundSchema,
  titleBlue: z.string().min(1),
  titleWhite: z.string().min(1),
  description: z.string().min(1),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
  buttonPalette: z.enum(["glass-default", "brand-blue", "sky", "emerald", "gold", "midnight"]),
  logoSize: z.object({
    mobileWidth: z.number().int().min(150).max(320),
    desktopWidth: z.number().int().min(150).max(420),
  }).refine((value) => value.desktopWidth >= value.mobileWidth, {
    message: "Ukuran desktop harus lebih besar atau sama dengan mobile.",
    path: ["desktopWidth"],
  }),
});

const benefitsSchema = z.object({
  background: sectionBackgroundSchema,
  heading: z.string().min(1),
  description: z.string().min(1),
  items: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    }),
  ),
});

const pricingSchema = z.object({
  background: sectionBackgroundSchema,
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  buttonLabel: z.string().min(1),
  ctaHref: z.string().min(1),
  buttonPalette: z.enum(["glass-default", "brand-blue", "sky", "emerald", "gold", "midnight"]),
  plans: z.array(
    z.object({
      name: z.string().min(1),
      price: z.string().min(1),
      description: z.string().min(1),
      highlight: z.string().optional(),
      emphasis: z.boolean().optional(),
    }),
  ),
});

const videoSectionSchema = z.object({
  background: sectionBackgroundSchema,
  description: z.string().min(1),
  embedUrl: z.string().min(1),
  eyebrow: z.string().min(1),
  isVisible: z.boolean(),
  title: z.string().min(1),
}).superRefine((value, ctx) => {
  if (!normalizeMemberGuideVideoUrl(value.embedUrl)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Link video belum valid untuk di-embed.",
      path: ["embedUrl"],
    });
  }
});

const faqSchema = z.object({
  background: sectionBackgroundSchema,
  title: z.string().min(1),
  subtitle: z.string().min(1),
  items: z.array(
    z.object({
      question: z.string().min(1),
      answer: z.string().min(1),
    }),
  ),
});

const guideSchema = z.object({
  background: sectionBackgroundSchema,
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  buttonLabel: z.string().min(1),
  buttonPalette: z.enum(["glass-default", "brand-blue", "sky", "emerald", "gold", "midnight"]),
  steps: z.array(
    z.object({
      number: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
    }),
  ),
});

const testimonialSchema = z.object({
  background: sectionBackgroundSchema,
  eyebrow: z.string().min(1),
  subtitle: z.string().min(1),
  title: z.string().min(1),
  items: z.array(
    z.object({
      imageAssetId: z.string().optional(),
      imageAlt: z.string().optional(),
      imageUrl: z.string().optional(),
      name: z.string().min(1),
      quote: z.string().min(1),
      role: z.string().min(1),
    }),
  ).min(1),
});

const blogSchema = z.object({
  background: sectionBackgroundSchema,
  title: z.string().min(1),
  items: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      label: z.string().min(1),
    }),
  ),
});

const bannerAdsSchema = z.object({
  background: sectionBackgroundSchema,
  buttonLabel: z.string().min(1),
  description: z.string().min(1),
  imageAssetId: z.string().optional(),
  imageAlt: z.string().optional(),
  imageUrl: z.string().optional(),
  isVisible: z.boolean(),
  title: z.string().min(1),
  whatsappNumber: z.string().optional(),
});

const footerSchema = z.object({
  background: sectionBackgroundSchema,
  description: z.string().min(1),
  copyright: z.string().min(1),
  guideLinks: z.array(
    z.object({
      label: z.string().min(1),
      href: z.string().min(1),
    }),
  ),
  logoSize: z.object({
    mobileWidth: z.number().int().min(150).max(260),
    desktopWidth: z.number().int().min(150).max(320),
  }).refine((value) => value.desktopWidth >= value.mobileWidth, {
    message: "Ukuran desktop harus lebih besar atau sama dengan mobile.",
    path: ["desktopWidth"],
  }),
});

export async function updateHeroSectionAction(formData: FormData) {
  await requireAdminProfile();

  const parsed = heroSchema.safeParse({
    background: readBackground(formData),
    eyebrow: readString(formData, "eyebrow"),
    titleBlue: readString(formData, "titleBlue"),
    titleWhite: readString(formData, "titleWhite"),
    subtitle: readString(formData, "subtitle"),
    ctaLabel: readString(formData, "ctaLabel"),
  });

  if (!parsed.success) {
    redirectToSection("hero", "error");
  }

  await updateHomepageContentSection("hero", parsed.data);
  redirectToSection("hero", "saved");
}

export async function updateOverviewSectionAction(formData: FormData) {
  await requireAdminProfile();

  const parsed = overviewSchema.safeParse({
    background: readPaletteOnlyBackground(formData),
    titleBlue: readString(formData, "titleBlue"),
    titleWhite: readString(formData, "titleWhite"),
    description: readString(formData, "description"),
    ctaLabel: readString(formData, "ctaLabel"),
    ctaHref: readString(formData, "ctaHref"),
    buttonPalette: readString(formData, "buttonPalette") || "glass-default",
    logoSize: {
      mobileWidth: readNumber(formData, "logoMobileWidth") ?? 188,
      desktopWidth: readNumber(formData, "logoDesktopWidth") ?? 274,
    },
  });

  if (!parsed.success) {
    redirectToSection("overview", "error");
  }

  await updateHomepageContentSection("overview", parsed.data);
  redirectToSection("overview", "saved");
}

export async function updateBenefitsSectionAction(formData: FormData) {
  await requireAdminProfile();
  const itemCount = readCount(formData, "itemCount");

  const parsed = benefitsSchema.safeParse({
    background: readPaletteOnlyBackground(formData),
    heading: readString(formData, "heading"),
    description: readString(formData, "description"),
    items: Array.from({ length: itemCount }, (_, index) => ({
      title: readString(formData, `item-${index}-title`),
      description: readString(formData, `item-${index}-description`),
    })),
  });

  if (!parsed.success) {
    redirectToSection("benefits", "error");
  }

  await updateHomepageContentSection("benefits", parsed.data);
  redirectToSection("benefits", "saved");
}

export async function updatePricingSectionAction(formData: FormData) {
  await requireAdminProfile();
  const planCount = readCount(formData, "planCount");

  const parsed = pricingSchema.safeParse({
    background: readPaletteOnlyBackground(formData),
    eyebrow: readString(formData, "eyebrow"),
    title: readString(formData, "title"),
    buttonLabel: readString(formData, "buttonLabel"),
    ctaHref: readString(formData, "ctaHref"),
    buttonPalette: readString(formData, "buttonPalette"),
    plans: Array.from({ length: planCount }, (_, index) => ({
      name: readString(formData, `plan-${index}-name`),
      price: readString(formData, `plan-${index}-price`),
      description: readString(formData, `plan-${index}-description`),
      highlight: readString(formData, `plan-${index}-highlight`) || undefined,
      emphasis: readString(formData, `plan-${index}-emphasis`) === "true",
    })),
  });

  if (!parsed.success) {
    redirectToSection("pricing", "error");
  }

  await updateHomepageContentSection("pricing", parsed.data);
  redirectToSection("pricing", "saved");
}

export async function updateVideoSectionAction(formData: FormData) {
  await requireAdminProfile();

  const parsed = videoSectionSchema.safeParse({
    background: readPaletteOnlyBackground(formData),
    description: readString(formData, "description"),
    embedUrl: readString(formData, "embedUrl"),
    eyebrow: readString(formData, "eyebrow"),
    isVisible: readString(formData, "isVisible") === "true",
    title: readString(formData, "title"),
  });

  if (!parsed.success) {
    redirectToSection("video", "error");
  }

  await updateHomepageContentSection("video", {
    ...parsed.data,
    embedUrl: normalizeMemberGuideVideoUrl(parsed.data.embedUrl) ?? parsed.data.embedUrl,
  });
  redirectToSection("video", "saved");
}

export async function updateFaqSectionAction(formData: FormData) {
  await requireAdminProfile();
  const itemCount = readCount(formData, "itemCount");

  const parsed = faqSchema.safeParse({
    background: readPaletteOnlyBackground(formData),
    title: readString(formData, "title"),
    subtitle: readString(formData, "subtitle"),
    items: Array.from({ length: itemCount }, (_, index) => ({
      question: readString(formData, `item-${index}-question`),
      answer: readString(formData, `item-${index}-answer`),
    })),
  });

  if (!parsed.success) {
    redirectToSection("faq", "error");
  }

  await updateHomepageContentSection("faq", parsed.data);
  redirectToSection("faq", "saved");
}

export async function updateGuideSectionAction(formData: FormData) {
  await requireAdminProfile();
  const stepCount = readCount(formData, "stepCount");

  const parsed = guideSchema.safeParse({
    background: readPaletteOnlyBackground(formData),
    eyebrow: readString(formData, "eyebrow"),
    title: readString(formData, "title"),
    buttonLabel: readString(formData, "buttonLabel"),
    buttonPalette: readString(formData, "buttonPalette"),
    steps: Array.from({ length: stepCount }, (_, index) => ({
      number: readString(formData, `step-${index}-number`),
      title: readString(formData, `step-${index}-title`),
      description: readString(formData, `step-${index}-description`),
    })),
  });

  if (!parsed.success) {
    redirectToSection("guide", "error");
  }

  await updateHomepageContentSection("guide", parsed.data);
  redirectToSection("guide", "saved");
}

export async function updateTestimonialSectionAction(formData: FormData) {
  await requireAdminProfile();
  const itemCount = readCount(formData, "itemCount");

  const parsed = testimonialSchema.safeParse({
    background: readPaletteOnlyBackground(formData),
    eyebrow: readString(formData, "eyebrow"),
    subtitle: readString(formData, "subtitle"),
    title: readString(formData, "title"),
    items: Array.from({ length: itemCount }, (_, index) => ({
      imageAssetId: readString(formData, `item-${index}-imageAssetId`) || undefined,
      imageAlt: readString(formData, `item-${index}-imageAlt`) || undefined,
      imageUrl: readString(formData, `item-${index}-imageUrl`) || undefined,
      name: readString(formData, `item-${index}-name`),
      quote: readString(formData, `item-${index}-quote`),
      role: readString(formData, `item-${index}-role`),
    })),
  });

  if (!parsed.success) {
    redirectToSection("testimonial", "error");
  }

  await updateHomepageContentSection("testimonial", parsed.data);
  redirectToSection("testimonial", "saved");
}

export async function updateBlogSectionAction(formData: FormData) {
  await requireAdminProfile();
  const itemCount = readCount(formData, "itemCount");

  const parsed = blogSchema.safeParse({
    background: readPaletteOnlyBackground(formData),
    title: readString(formData, "title"),
    items: Array.from({ length: itemCount }, (_, index) => ({
      title: readString(formData, `item-${index}-title`),
      description: readString(formData, `item-${index}-description`),
      label: readString(formData, `item-${index}-label`),
    })),
  });

  if (!parsed.success) {
    redirectToSection("blog", "error");
  }

  await updateHomepageContentSection("blog", parsed.data);
  redirectToSection("blog", "saved");
}

export async function updateBannerAdsSectionAction(formData: FormData) {
  await requireAdminProfile();

  const parsed = bannerAdsSchema.safeParse({
    background: readPaletteOnlyBackground(formData),
    buttonLabel: readString(formData, "buttonLabel"),
    description: readString(formData, "description"),
    imageAssetId: readString(formData, "imageAssetId") || undefined,
    imageAlt: readString(formData, "imageAlt") || undefined,
    imageUrl: readString(formData, "imageUrl") || undefined,
    isVisible: readString(formData, "isVisible") === "true",
    title: readString(formData, "title"),
    whatsappNumber: readString(formData, "whatsappNumber") || undefined,
  });

  if (!parsed.success) {
    redirectToSection("bannerAds", "error");
  }

  await updateHomepageContentSection("bannerAds", parsed.data);
  redirectToSection("bannerAds", "saved");
}

export async function updateFooterSectionAction(formData: FormData) {
  await requireAdminProfile();
  const linkCount = readCount(formData, "linkCount");

  const parsed = footerSchema.safeParse({
    background: readPaletteOnlyBackground(formData),
    description: readString(formData, "description"),
    copyright: readString(formData, "copyright"),
    guideLinks: Array.from({ length: linkCount }, (_, index) => ({
      label: readString(formData, `link-${index}-label`),
      href: readString(formData, `link-${index}-href`),
    })),
    logoSize: {
      mobileWidth: readNumber(formData, "logoMobileWidth"),
      desktopWidth: readNumber(formData, "logoDesktopWidth"),
    },
  });

  if (!parsed.success) {
    redirectToSection("footer", "error");
  }

  await updateHomepageContentSection("footer", parsed.data);
  redirectToSection("footer", "saved");
}

export async function assertAdminActionAccess() {
  await requireAdminProfile();

  return true;
}
