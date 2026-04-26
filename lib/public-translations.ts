import "server-only";

import type { BlogPreviewItem, HomepageContent, NavItem } from "@/components/landing/types";
import type { PublicGuidePdfPost } from "@/lib/public-guide-types";
import { type SiteLanguage } from "@/lib/site-language";
import { translateStructuredStrings } from "@/lib/translatex";

type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer U)[]
    ? DeepPartial<U>[]
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

function hasPathSegment(path: Array<number | string>, segment: string) {
  return path.some((part) => String(part) === segment);
}

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

function applyHomepageLanguageOverrides(content: HomepageContent, targetLanguage: SiteLanguage) {
  if (targetLanguage !== "en") {
    return content;
  }

  return mergeDeep(content, {
    benefits: {
      heading: "Why trade crypto with AIOTrade?",
    },
    blog: {
      title: "Blog - Crypto News",
    },
    faq: {
      subtitle: "Frequently Asked Questions",
      title: "F.A.Q",
    },
    footer: {
      description:
        "Artificial Intelligence (AI)-based tools are designed to help users trade crypto assets automatically in the spot market. AIOTrade can be integrated with global exchanges such as Binance and Bitget through a secure API system, so users can carry out trading strategies efficiently and consistently.",
      guideLinks: [
        { href: "/signup", label: "Register" },
        { href: "#fitur", label: "API Binding" },
        { href: "#fitur", label: "Automated Trading" },
        { href: "#panduan", label: "Custom Settings" },
      ],
    },
    guide: {
      buttonLabel: "Read more",
      eyebrow: "How does AIOTrade work?",
      steps: [
        {
          description:
            "Create an AIOTrade account and verify it via email. If you do not have an account on Binance or Bitget yet, create an exchange account first.",
          number: "01",
          title: "Register & Create Account",
        },
        {
          description:
            "Connect the spot API from your exchange account to AIOTrade, then set up the bot according to your trading capital and preferred strategy.",
          number: "02",
          title: "Connect API & Set Up Bot",
        },
        {
          description:
            "Choose Custom or Follow mode, use Grid or Averaging for your trading strategy, and monitor results in real time.",
          number: "03",
          title: "Start Trading",
        },
      ],
      title: "3 Easy Steps",
    },
    overview: {
      ctaLabel: "Register now",
    },
    pricing: {
      buttonLabel: "Register now",
      eyebrow: "How much is the registration fee for AIOTrade?",
      plans: [
        {
          description:
            "Full access to the AIOTrade crypto spot auto bot, complete with grid, averaging, trailing stop, and custom settings.",
          name: "Crypto Bot Access",
          price: "$130",
        },
        {
          description:
            "Get all the features of the crypto bot plus exclusive access to the stock auto bot, including priority support and lifetime updates.",
          emphasis: true,
          highlight: "Best price",
          name: "Combo",
          price: "$190",
        },
        {
          description:
            "Access the AIOTrade stock trading bot with AI-based analysis and strategy features. Still under development.",
          name: "Stock Bot Access",
          price: "$130",
        },
      ],
      title: "Pricing",
    },
    testimonial: {
      title: "Testimonials",
    },
    video: {
      eyebrow: "See AIOTrade up close",
      title: "Short Video Overview",
    },
  });
}

export async function translateLandingNavItems(navItems: NavItem[], targetLanguage: SiteLanguage) {
  const translated = await translateStructuredStrings({
    shouldTranslate: (path) => String(path[path.length - 1]) === "label",
    targetLanguage,
    value: navItems,
  });

  if (targetLanguage !== "en") {
    return translated;
  }

  return translated.map((item) => {
    if (item.href === "#fitur") {
      return { ...item, label: "Features" };
    }

    if (item.href === "#harga") {
      return { ...item, label: "Pricing" };
    }

    if (item.href === "#panduan") {
      return { ...item, label: "Guide" };
    }

    return item;
  });
}

export async function translateHomepageContent(content: HomepageContent, targetLanguage: SiteLanguage) {
  const translated = await translateStructuredStrings({
    shouldTranslate: (path) => {
      const last = String(path[path.length - 1] ?? "");

      if (hasPathSegment(path, "background")) {
        return false;
      }

      if (
        [
          "imageAssetId",
          "imageUrl",
          "embedUrl",
          "ctaHref",
          "href",
          "customHex",
          "overlayColor",
          "backgroundImageAssetId",
          "backgroundImageUrl",
          "overlayOpacity",
          "whatsappNumber",
          "price",
          "number",
          "titleBlue",
          "titleWhite",
        ].includes(last)
      ) {
        return false;
      }

      return true;
    },
    targetLanguage,
    value: content,
  });

  return applyHomepageLanguageOverrides(translated, targetLanguage);
}

export async function translateBlogPreviewItems(items: BlogPreviewItem[], targetLanguage: SiteLanguage) {
  return translateStructuredStrings({
    shouldTranslate: (path) => {
      const last = String(path[path.length - 1] ?? "");

      return ["category", "excerpt", "title"].includes(last);
    },
    targetLanguage,
    value: items,
  });
}

export async function translatePublicGuidePdfPosts(posts: PublicGuidePdfPost[], targetLanguage: SiteLanguage) {
  return translateStructuredStrings({
    shouldTranslate: (path) => {
      const last = String(path[path.length - 1] ?? "");

      return ["title", "description"].includes(last);
    },
    targetLanguage,
    value: posts,
  });
}
