"use client";

import { useState } from "react";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { BannerAdsSection } from "@/components/landing/banner-ads-section";
import { BlogSection } from "@/components/landing/blog-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FooterSection } from "@/components/landing/footer-section";
import { FloatingWhatsAppButton } from "@/components/landing/floating-whatsapp-button";
import { GuideSection } from "@/components/landing/guide-section";
import { LandingHeader } from "@/components/landing/landing-header";
import { OverviewSection } from "@/components/landing/overview-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialSection } from "@/components/landing/testimonial-section";
import { VideoSection } from "@/components/landing/video-section";
import type { LandingPageUIProps } from "@/components/landing/types";
import { LANDING_THEME_COOKIE, type LandingTheme } from "@/lib/landing-theme";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function LandingPageUI({
  accountHref = "/signup",
  blogPosts = [],
  content,
  currentLanguage = "id",
  ctaHref,
  initialTheme = "light",
  isAuthenticated = false,
  languageOptions = [],
  navItems,
  previewMode = false,
}: LandingPageUIProps) {
  const [theme, setTheme] = useState<LandingTheme>(initialTheme);
  const floatingWhatsAppHref = content.bannerAds.whatsappNumber
    ? buildWhatsAppUrl(content.bannerAds.whatsappNumber, {
        message: "Halo admin, saya ingin bertanya tentang AIOTrade.",
      })
    : null;

  function handleThemeChange(nextTheme: LandingTheme) {
    setTheme(nextTheme);
    document.cookie = `${LANDING_THEME_COOKIE}=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <main className="landing-theme-scope landing-page-surface flex-1" data-theme={theme} id="top">
      <div className="relative">
        <LandingHeader
          accountHref={accountHref}
          currentLanguage={currentLanguage}
          isAuthenticated={isAuthenticated}
          languages={languageOptions}
          navItems={navItems}
          onThemeChange={handleThemeChange}
          previewMode={previewMode}
          theme={theme}
        />
        <OverviewSection
          content={content.overview}
          ctaExternal={false}
          ctaHref={ctaHref}
          previewMode={previewMode}
        />
        <BenefitsSection content={content.benefits} />
        <PricingSection content={content.pricing} ctaExternal={false} ctaHref={ctaHref} />
        <VideoSection content={content.video} />
        <FaqSection content={content.faq} />
        <GuideSection content={content.guide} />
        <TestimonialSection content={content.testimonial} />
        <BlogSection content={content.blog} posts={blogPosts} />
        <BannerAdsSection content={content.bannerAds} />
        <FooterSection
          content={content.footer}
          currentLanguage={currentLanguage}
          ctaExternal={false}
          ctaHref={ctaHref}
          navItems={navItems}
          previewMode={previewMode}
        />
        {floatingWhatsAppHref ? <FloatingWhatsAppButton href={floatingWhatsAppHref} /> : null}
      </div>
    </main>
  );
}
