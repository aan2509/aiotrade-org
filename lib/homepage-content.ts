import "server-only";

import { z } from "zod";
import { articles, faqEntries, features, landingImages, plans, steps } from "@/components/landing/data";
import type { HomepageContent, SectionBackgroundConfig } from "@/components/landing/types";
import {
  createDefaultSectionBackground,
  normalizeSectionBackground,
  sectionBackgroundSchema,
} from "@/lib/homepage-backgrounds";
import { prisma } from "@/lib/prisma";

const HOMEPAGE_CONTENT_ID = "homepage";

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
  brandAccentColor: z.string().optional(),
  brandAccentLength: z.number().int().min(1).max(24).optional(),
  brandDisplayMode: z.enum(["logo", "text"]).optional(),
  brandRestColor: z.string().optional(),
  brandText: z.string().min(1).optional(),
  brandTextSize: z.object({
    mobileSize: z.number().int().min(32).max(96),
    desktopSize: z.number().int().min(48).max(160),
  }).refine((value) => value.desktopSize >= value.mobileSize, {
    message: "Ukuran desktop harus lebih besar atau sama dengan mobile.",
    path: ["desktopSize"],
  }).optional(),
  titleBlue: z.string().min(1),
  titleWhite: z.string().min(1),
  description: z.string().min(1),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
  memberCta: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    buttonLabel: z.string().min(1),
    buttonHref: z.string().min(1),
    backgroundImageAssetId: z.string().optional(),
    backgroundImageUrl: z.string().optional(),
    overlayColor: z.string().optional(),
    overlayOpacity: z.number().min(0).max(100).optional(),
  }),
  buttonPalette: z.enum(["glass-default", "brand-blue", "sky", "emerald", "gold", "midnight"]),
  logoSize: z.object({
    mobileWidth: z.number().int().min(150).max(320),
    desktopWidth: z.number().int().min(150).max(420),
  }).refine((value) => value.desktopWidth >= value.mobileWidth, {
    message: "Ukuran desktop harus lebih besar atau sama dengan mobile.",
    path: ["desktopWidth"],
  }),
});

const benefitItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const benefitsSchema = z.object({
  background: sectionBackgroundSchema,
  heading: z.string().min(1),
  description: z.string().min(1),
  items: z.array(benefitItemSchema).min(1),
});

const pricingPlanSchema = z.object({
  name: z.string().min(1),
  price: z.string().min(1),
  description: z.string().min(1),
  highlight: z.string().optional(),
  emphasis: z.boolean().optional(),
});

const pricingSchema = z.object({
  background: sectionBackgroundSchema,
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  buttonLabel: z.string().min(1),
  ctaHref: z.string().min(1),
  buttonPalette: z.enum(["glass-default", "brand-blue", "sky", "emerald", "gold", "midnight"]),
  plans: z.array(pricingPlanSchema).min(1),
});

const videoSectionSchema = z.object({
  background: sectionBackgroundSchema,
  description: z.string().min(1),
  embedUrl: z.string().min(1),
  eyebrow: z.string().min(1),
  isVisible: z.boolean(),
  title: z.string().min(1),
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
  buttonHref: z.string().optional(),
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

export const defaultHomepageContent: HomepageContent = {
  hero: {
    background: createDefaultSectionBackground("dark-slate-cinematic", {
      imageUrl: landingImages.heroImage.src,
      overlayColor: "#07101d",
      overlayOpacity: 40,
    }),
    eyebrow: "Selamat Datang Di Komunitas",
    titleBlue: "AIO",
    titleWhite: "TRADE",
    subtitle: "“Edukasi & Trading Otomatis Bersama AIOTrade”",
    ctaLabel: "Gabung Komunitas",
  },
  overview: {
    background: createDefaultSectionBackground("dark-navy"),
    brandAccentColor: "#0ea5ff",
    brandAccentLength: 3,
    brandDisplayMode: "logo",
    brandRestColor: "#f8fafc",
    brandText: "AIOTrade",
    brandTextSize: {
      mobileSize: 48,
      desktopSize: 104,
    },
    titleBlue: "AIO",
    titleWhite: "TRADE",
    description:
      "Alat bantu trading otomatis berbasis Artificial Intelligence (AI) yang dirancang untuk membantu pengguna menjalankan trading aset kripto di pasar spot. AIOTrade terhubung dengan Binance, Tokocrypto, dan Bitget melalui API yang aman, sehingga strategi dapat dijalankan lebih rapi, efisien, dan konsisten.",
    ctaLabel: "Daftar Sekarang",
    ctaHref: "/signup",
    memberCta: {
      title: "Gabung ke ekosistem AIOTrade",
      description:
        "Lanjutkan proses pendaftaran ke AIOTrade melalui halaman tujuan yang sudah disiapkan admin. Tombol di bawah akan membawa Anda ke link join terbaru.",
      buttonLabel: "Daftar AIOTrade",
      buttonHref: "/signup",
      backgroundImageAssetId: undefined,
      backgroundImageUrl: undefined,
      overlayColor: "#07101d",
      overlayOpacity: 52,
    },
    buttonPalette: "glass-default",
    logoSize: {
      mobileWidth: 188,
      desktopWidth: 274,
    },
  },
  benefits: {
    background: createDefaultSectionBackground("dark-slate-cinematic", {
      imageUrl: landingImages.heroImage.src,
      overlayColor: "#070a12",
      overlayOpacity: 74,
    }),
    heading: "Mengapa Trading Crypto Menggunakan Aio Trade?",
    description:
      "Aio Trade cocok digunakan untuk semua kalangan, Trader (Pemula atau Profesional) dan Investor",
    items: features.map((feature) => ({
      title: feature.title,
      description: feature.description,
    })),
  },
  pricing: {
    background: createDefaultSectionBackground("warm-ivory"),
    eyebrow: "Berapa Biaya Registrasi Aio Trade?",
    title: "Harga",
    buttonLabel: "Daftar Sekarang",
    ctaHref: "/signup",
    buttonPalette: "glass-default",
    plans: plans.map((plan) => ({
      name: plan.name,
      price: plan.price,
      description: plan.description,
      emphasis: plan.emphasis,
      highlight: plan.highlight,
    })),
  },
  video: {
    background: createDefaultSectionBackground("dark-slate-cinematic", {
      imageUrl: landingImages.heroImage.src,
      overlayColor: "#08111d",
      overlayOpacity: 68,
    }),
    description:
      "Lihat gambaran alur penggunaan AIOTrade secara lebih cepat lewat video penjelasan singkat yang akan otomatis mulai saat section ini masuk ke layar.",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    eyebrow: "Lihat AIOTrade lebih dekat",
    isVisible: true,
    title: "Video Penjelasan Singkat",
  },
  faq: {
    background: createDefaultSectionBackground("warm-ivory"),
    title: "F.A.Q",
    subtitle: "Pertanyaan yang Sering Diajukan",
    items: faqEntries,
  },
  guide: {
    background: createDefaultSectionBackground("sky-blue-accent"),
    eyebrow: "Bagaimana Aio Trade Bekerja?",
    title: "3 Langkah Mudah",
    buttonLabel: "Selengkapnya",
    buttonPalette: "glass-default",
    steps: steps,
  },
  testimonial: {
    background: createDefaultSectionBackground("warm-ivory"),
    eyebrow: "Apa kata mereka tentang AIOTrade?",
    subtitle: "Pengalaman member yang sudah mencoba alur penggunaan, setup, dan pendampingan.",
    title: "Testimoni",
    items: [
      {
        name: "Member AIOTrade",
        quote:
          "Alur daftar, setup bot, dan materi panduannya terasa jauh lebih rapi. Saya jadi lebih cepat paham langkah yang harus diikuti dari awal.",
        role: "Crypto Trader",
      },
      {
        name: "User Komunitas",
        quote:
          "Yang paling membantu adalah panduan langkah awalnya jelas, lalu materi lanjutan juga enak dibuka ulang saat butuh review konfigurasi.",
        role: "Member Baru",
      },
      {
        name: "Pengguna Aktif",
        quote:
          "Dari sisi onboarding, AIOTrade terasa lebih siap. Saya bisa baca panduan publik dulu sebelum lanjut ke dashboard member.",
        role: "Investor Spot",
      },
    ],
  },
  blog: {
    background: createDefaultSectionBackground("warm-ivory"),
    title: "Blog - Crypto News",
    items: articles.map((article) => ({
      title: article.title,
      description: article.description,
      label: article.label,
    })),
  },
  bannerAds: {
    background: createDefaultSectionBackground("warm-ivory"),
    buttonHref: "",
    buttonLabel: "Pesan Sekarang",
    description: "Tampilkan banner kaos, merchandise, atau materi promo lain yang ingin diarahkan langsung ke WhatsApp admin.",
    imageAlt: "Banner merchandise AIOTrade",
    isVisible: true,
    title: "Banner Promosi",
    whatsappNumber: "",
  },
  footer: {
    background: createDefaultSectionBackground("dark-slate-cinematic"),
    description:
      "Alat bantu (bot trading) berbasis Artificial Intelligence (AI) yang dirancang untuk membantu pengguna melakukan perdagangan aset kripto secara otomatis di pasar spot. AioTrade dapat diintegrasikan dengan exchange global seperti Binance dan Bitget melalui sistem API yang aman, sehingga pengguna dapat menjalankan strategi trading secara efisien dan konsisten.",
    copyright: "© 2026 All Rights Reserved.",
    guideLinks: [
      { label: "Daftar", href: "/signup" },
      { label: "API Binding", href: "#fitur" },
      { label: "Trading Otomatis", href: "#fitur" },
      { label: "Setting Custom", href: "#panduan" },
    ],
    logoSize: {
      mobileWidth: 176,
      desktopWidth: 208,
    },
  },
};

const homepageContentSchema = z.object({
  hero: heroSchema,
  overview: overviewSchema,
  benefits: benefitsSchema,
  pricing: pricingSchema,
  video: videoSectionSchema,
  faq: faqSchema,
  guide: guideSchema,
  testimonial: testimonialSchema,
  blog: blogSchema,
  bannerAds: bannerAdsSchema,
  footer: footerSchema,
});

function parseSectionWithBackground<T extends { background: SectionBackgroundConfig }>(
  schema: z.ZodType<T>,
  value: unknown,
  fallback: T,
  options?: {
    legacyImageUrl?: string;
  },
) {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const merged = {
    ...fallback,
    ...raw,
    background: normalizeSectionBackground(raw.background, fallback.background, options?.legacyImageUrl),
  };

  const parsed = schema.safeParse(merged);

  return parsed.success ? parsed.data : fallback;
}

function toHomepageContent(record: {
  hero: unknown;
  overview: unknown;
  benefits: unknown;
  pricing: unknown;
  video: unknown;
  faq: unknown;
  guide: unknown;
  testimonial: unknown;
  blog: unknown;
  bannerAds: unknown;
  footer: unknown;
} | null): HomepageContent {
  if (!record) {
    return defaultHomepageContent;
  }

  const merged = {
    hero: parseSectionWithBackground(heroSchema, record.hero, defaultHomepageContent.hero, {
      legacyImageUrl:
        record.hero && typeof record.hero === "object"
          ? String((record.hero as { backgroundImageUrl?: unknown }).backgroundImageUrl ?? "").trim() || undefined
          : undefined,
    }),
    overview: parseSectionWithBackground(overviewSchema, record.overview, defaultHomepageContent.overview),
    benefits: parseSectionWithBackground(benefitsSchema, record.benefits, defaultHomepageContent.benefits),
    pricing: parseSectionWithBackground(pricingSchema, record.pricing, defaultHomepageContent.pricing),
    video: parseSectionWithBackground(videoSectionSchema, record.video, defaultHomepageContent.video),
    faq: parseSectionWithBackground(faqSchema, record.faq, defaultHomepageContent.faq),
    guide: parseSectionWithBackground(guideSchema, record.guide, defaultHomepageContent.guide),
    testimonial: parseSectionWithBackground(testimonialSchema, record.testimonial, defaultHomepageContent.testimonial),
    blog: parseSectionWithBackground(blogSchema, record.blog, defaultHomepageContent.blog),
    bannerAds: parseSectionWithBackground(bannerAdsSchema, record.bannerAds, defaultHomepageContent.bannerAds),
    footer: parseSectionWithBackground(footerSchema, record.footer, defaultHomepageContent.footer),
  };

  return homepageContentSchema.parse(merged);
}

function hasHomepageContentDelegate() {
  return (
    "homepageContent" in prisma &&
    typeof prisma.homepageContent?.findUnique === "function" &&
    typeof prisma.homepageContent?.upsert === "function"
  );
}

async function getHomepageContentRaw() {
  const records = await prisma.$queryRaw<
    Array<{
      hero: unknown;
      overview: unknown;
      benefits: unknown;
      pricing: unknown;
      video: unknown;
      faq: unknown;
      guide: unknown;
      testimonial: unknown;
      blog: unknown;
      bannerAds: unknown;
      footer: unknown;
    }>
  >`
    SELECT
      "hero",
      "overview",
      "benefits",
      "pricing",
      "video",
      "faq",
      "guide",
      "testimonial",
      "blog",
      "banner_ads" AS "bannerAds",
      "footer"
    FROM "public"."homepage_content"
    WHERE "id" = ${HOMEPAGE_CONTENT_ID}
    LIMIT 1
  `;

  return records[0] ?? null;
}

export async function getHomepageContent() {
  try {
    const tables = await prisma.$queryRaw<Array<{ tableName: string | null }>>`
      SELECT to_regclass('public.homepage_content')::text AS "tableName"
    `;

    if (!tables[0]?.tableName) {
      return defaultHomepageContent;
    }

    const record = hasHomepageContentDelegate()
      ? await prisma.homepageContent.findUnique({
          where: { id: HOMEPAGE_CONTENT_ID },
          select: {
            hero: true,
            overview: true,
            benefits: true,
            pricing: true,
            video: true,
            faq: true,
            guide: true,
            testimonial: true,
            blog: true,
            bannerAds: true,
            footer: true,
          },
        })
      : await getHomepageContentRaw();

    return toHomepageContent(record);
  } catch (error) {
    console.error("[homepage-content] Failed to load homepage content, using defaults.", error);
    return defaultHomepageContent;
  }
}

export async function updateHomepageContentSection<
  K extends keyof HomepageContent,
>(section: K, value: HomepageContent[K]) {
  const parsedSection = homepageContentSchema.shape[section].parse(value);

  if (hasHomepageContentDelegate()) {
    await prisma.homepageContent.upsert({
      where: { id: HOMEPAGE_CONTENT_ID },
      create: {
        id: HOMEPAGE_CONTENT_ID,
        ...defaultHomepageContent,
        [section]: parsedSection,
      },
      update: {
        [section]: parsedSection,
      },
    });

    return;
  }

  await prisma.$executeRaw`
    INSERT INTO "public"."homepage_content" (
      "id",
      "hero",
      "overview",
      "benefits",
      "pricing",
      "video",
      "faq",
      "guide",
      "testimonial",
      "blog",
      "banner_ads",
      "footer"
    )
    VALUES (
      ${HOMEPAGE_CONTENT_ID},
      CAST(${JSON.stringify(defaultHomepageContent.hero)} AS jsonb),
      CAST(${JSON.stringify(defaultHomepageContent.overview)} AS jsonb),
      CAST(${JSON.stringify(defaultHomepageContent.benefits)} AS jsonb),
      CAST(${JSON.stringify(defaultHomepageContent.pricing)} AS jsonb),
      CAST(${JSON.stringify(defaultHomepageContent.video)} AS jsonb),
      CAST(${JSON.stringify(defaultHomepageContent.faq)} AS jsonb),
      CAST(${JSON.stringify(defaultHomepageContent.guide)} AS jsonb),
      CAST(${JSON.stringify(defaultHomepageContent.testimonial)} AS jsonb),
      CAST(${JSON.stringify(defaultHomepageContent.blog)} AS jsonb),
      CAST(${JSON.stringify(defaultHomepageContent.bannerAds)} AS jsonb),
      CAST(${JSON.stringify(defaultHomepageContent.footer)} AS jsonb)
    )
    ON CONFLICT ("id") DO NOTHING
  `;

  switch (section) {
    case "hero":
      await prisma.$executeRaw`
        UPDATE "public"."homepage_content"
        SET "hero" = CAST(${JSON.stringify(parsedSection)} AS jsonb), "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = ${HOMEPAGE_CONTENT_ID}
      `;
      break;
    case "overview":
      await prisma.$executeRaw`
        UPDATE "public"."homepage_content"
        SET "overview" = CAST(${JSON.stringify(parsedSection)} AS jsonb), "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = ${HOMEPAGE_CONTENT_ID}
      `;
      break;
    case "benefits":
      await prisma.$executeRaw`
        UPDATE "public"."homepage_content"
        SET "benefits" = CAST(${JSON.stringify(parsedSection)} AS jsonb), "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = ${HOMEPAGE_CONTENT_ID}
      `;
      break;
    case "pricing":
      await prisma.$executeRaw`
        UPDATE "public"."homepage_content"
        SET "pricing" = CAST(${JSON.stringify(parsedSection)} AS jsonb), "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = ${HOMEPAGE_CONTENT_ID}
      `;
      break;
    case "video":
      await prisma.$executeRaw`
        UPDATE "public"."homepage_content"
        SET "video" = CAST(${JSON.stringify(parsedSection)} AS jsonb), "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = ${HOMEPAGE_CONTENT_ID}
      `;
      break;
    case "faq":
      await prisma.$executeRaw`
        UPDATE "public"."homepage_content"
        SET "faq" = CAST(${JSON.stringify(parsedSection)} AS jsonb), "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = ${HOMEPAGE_CONTENT_ID}
      `;
      break;
    case "guide":
      await prisma.$executeRaw`
        UPDATE "public"."homepage_content"
        SET "guide" = CAST(${JSON.stringify(parsedSection)} AS jsonb), "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = ${HOMEPAGE_CONTENT_ID}
      `;
      break;
    case "testimonial":
      await prisma.$executeRaw`
        UPDATE "public"."homepage_content"
        SET "testimonial" = CAST(${JSON.stringify(parsedSection)} AS jsonb), "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = ${HOMEPAGE_CONTENT_ID}
      `;
      break;
    case "blog":
      await prisma.$executeRaw`
        UPDATE "public"."homepage_content"
        SET "blog" = CAST(${JSON.stringify(parsedSection)} AS jsonb), "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = ${HOMEPAGE_CONTENT_ID}
      `;
      break;
    case "bannerAds":
      await prisma.$executeRaw`
        UPDATE "public"."homepage_content"
        SET "banner_ads" = CAST(${JSON.stringify(parsedSection)} AS jsonb), "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = ${HOMEPAGE_CONTENT_ID}
      `;
      break;
    case "footer":
      await prisma.$executeRaw`
        UPDATE "public"."homepage_content"
        SET "footer" = CAST(${JSON.stringify(parsedSection)} AS jsonb), "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = ${HOMEPAGE_CONTENT_ID}
      `;
      break;
    default:
      break;
  }
}
