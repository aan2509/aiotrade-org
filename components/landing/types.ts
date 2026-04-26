import type { StaticImageData } from "next/image";
import type { LucideIcon } from "lucide-react";
import type { LandingTheme } from "@/lib/landing-theme";
import type { SiteLanguage, SiteLanguageOption } from "@/lib/site-language";

export type LandingPageUIProps = {
  accountHref?: string;
  banner?: string;
  blogPosts?: BlogPreviewItem[];
  content: HomepageContent;
  ctaHref: string;
  ctaExternal?: boolean;
  ctaLabel?: string;
  currentLanguage?: SiteLanguage;
  initialTheme?: LandingTheme;
  isAuthenticated?: boolean;
  languageOptions?: SiteLanguageOption[];
  navItems?: NavItem[];
  previewMode?: boolean;
};

export type BackgroundPaletteKey =
  | "dark-navy"
  | "warm-ivory"
  | "gold-accent"
  | "sky-blue-accent"
  | "dark-slate-cinematic";

export type PaletteBackgroundConfig = {
  customHex?: string;
  preset: BackgroundPaletteKey;
};

export type ImageBackgroundConfig = {
  assetId?: string;
  imageUrl?: string;
  overlayColor?: string;
  overlayOpacity?: number;
};

export type SectionBackgroundConfig = {
  image: ImageBackgroundConfig;
  mode: "palette" | "image";
  palette: PaletteBackgroundConfig;
};

export type NavItem = {
  accent: string;
  label: string;
  href: string;
};

export type StatItem = {
  label: string;
  value: string;
};

export type TickerItem = {
  symbol: string;
  price: string;
  change: string;
  positive?: boolean;
  logoUrl?: string;
  name?: string;
  rank?: number;
};

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type Plan = {
  name: string;
  price: string;
  description: string;
  highlight?: string;
  emphasis?: boolean;
};

export type FaqEntry = {
  question: string;
  answer: string;
};

export type Step = {
  number: string;
  title: string;
  description: string;
};

export type Article = {
  title: string;
  description: string;
  image: StaticImageData;
  label: string;
};

export type PartnerLogo = {
  src: StaticImageData;
  alt: string;
};

export type HeroContent = {
  background: SectionBackgroundConfig;
  eyebrow: string;
  titleBlue: string;
  titleWhite: string;
  subtitle: string;
  ctaLabel: string;
};

export type LogoSizeConfig = {
  mobileWidth: number;
  desktopWidth: number;
};

export type ButtonPaletteKey =
  | "glass-default"
  | "brand-blue"
  | "sky"
  | "emerald"
  | "gold"
  | "midnight";

export type OverviewContent = {
  background: SectionBackgroundConfig;
  titleBlue: string;
  titleWhite: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  memberCta: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    backgroundImageAssetId?: string;
    backgroundImageUrl?: string;
    overlayColor?: string;
    overlayOpacity?: number;
  };
  buttonPalette: ButtonPaletteKey;
  logoSize: LogoSizeConfig;
};

export type BenefitItemContent = {
  title: string;
  description: string;
};

export type BenefitsContent = {
  background: SectionBackgroundConfig;
  heading: string;
  description: string;
  items: BenefitItemContent[];
};

export type PricingPlanContent = {
  name: string;
  price: string;
  description: string;
  highlight?: string;
  emphasis?: boolean;
};

export type PricingContent = {
  background: SectionBackgroundConfig;
  eyebrow: string;
  title: string;
  buttonLabel: string;
  ctaHref: string;
  buttonPalette: ButtonPaletteKey;
  plans: PricingPlanContent[];
};

export type VideoSectionContent = {
  background: SectionBackgroundConfig;
  description: string;
  embedUrl: string;
  eyebrow: string;
  isVisible: boolean;
  title: string;
};

export type FaqContent = {
  background: SectionBackgroundConfig;
  title: string;
  subtitle: string;
  items: FaqEntry[];
};

export type GuideStepContent = {
  number: string;
  title: string;
  description: string;
};

export type GuideContent = {
  background: SectionBackgroundConfig;
  eyebrow: string;
  title: string;
  buttonLabel: string;
  buttonPalette: ButtonPaletteKey;
  steps: GuideStepContent[];
};

export type BlogArticleContent = {
  title: string;
  description: string;
  label: string;
};

export type BlogPreviewItem = {
  category: string;
  excerpt: string;
  publishedAt: string;
  slug: string;
  thumbnailUrl: string | null;
  title: string;
};

export type BlogContent = {
  background: SectionBackgroundConfig;
  title: string;
  items: BlogArticleContent[];
};

export type BannerAdsContent = {
  background: SectionBackgroundConfig;
  buttonLabel: string;
  description: string;
  imageAssetId?: string;
  imageAlt?: string;
  imageUrl?: string;
  isVisible: boolean;
  title: string;
  whatsappNumber?: string;
};

export type TestimonialItemContent = {
  imageAssetId?: string;
  imageAlt?: string;
  imageUrl?: string;
  name: string;
  quote: string;
  role: string;
};

export type TestimonialContent = {
  background: SectionBackgroundConfig;
  eyebrow: string;
  subtitle: string;
  title: string;
  items: TestimonialItemContent[];
};

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterContent = {
  background: SectionBackgroundConfig;
  description: string;
  copyright: string;
  guideLinks: FooterLink[];
  logoSize: LogoSizeConfig;
};

export type HomepageAsset = {
  bytes: number | null;
  createdAt: string;
  format: string | null;
  height: number | null;
  id: string;
  label: string;
  publicId: string;
  secureUrl: string;
  width: number | null;
};

export type HomepageContent = {
  hero: HeroContent;
  overview: OverviewContent;
  benefits: BenefitsContent;
  pricing: PricingContent;
  video: VideoSectionContent;
  faq: FaqContent;
  guide: GuideContent;
  testimonial: TestimonialContent;
  blog: BlogContent;
  bannerAds: BannerAdsContent;
  footer: FooterContent;
};
