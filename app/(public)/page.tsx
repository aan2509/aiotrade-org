import { cookies } from "next/headers";
import type { Metadata } from "next";
import LandingPageUI from "@/components/LandingPageUI";
import { navItems } from "@/components/landing/data";
import { getCurrentProfile } from "@/lib/auth";
import { getPublishedBlogPosts } from "@/lib/blog-posts";
import { getHomepageContent } from "@/lib/homepage-content";
import { LANDING_THEME_COOKIE, parseLandingTheme } from "@/lib/landing-theme";
import { translateBlogPreviewItems, translateHomepageContent, translateLandingNavItems } from "@/lib/public-translations";
import { parseSiteLanguage, SITE_LANGUAGE_COOKIE } from "@/lib/site-language";
import { buildHomePageMetadata, getSiteSeoSettings } from "@/lib/site-seo";
import { getSupportedSiteLanguages } from "@/lib/translatex";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSiteSeoSettings();

  return buildHomePageMetadata(seo);
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const currentLanguage = parseSiteLanguage(cookieStore.get(SITE_LANGUAGE_COOKIE)?.value);
  const [content, blogPosts, languageOptions, profile, translatedNavItems] = await Promise.all([
    getHomepageContent(),
    getPublishedBlogPosts(3),
    getSupportedSiteLanguages(),
    getCurrentProfile(),
    translateLandingNavItems(navItems, currentLanguage),
  ]);
  const translatedContent = await translateHomepageContent(content, currentLanguage);
  const translatedBlogPosts = await translateBlogPreviewItems(
    blogPosts.map((post) => ({
      category: post.category,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      slug: post.slug,
      thumbnailUrl: post.thumbnailUrl,
      title: post.title,
    })),
    currentLanguage,
  );

  return (
    <LandingPageUI
      accountHref={profile ? (profile.isAdmin ? "/admin" : "/dashboard") : "/signup"}
      blogPosts={translatedBlogPosts}
      content={translatedContent}
      currentLanguage={currentLanguage}
      ctaExternal={false}
      ctaHref="/signup"
      initialTheme={parseLandingTheme(cookieStore.get(LANDING_THEME_COOKIE)?.value)}
      isAuthenticated={Boolean(profile)}
      languageOptions={languageOptions}
      navItems={translatedNavItems}
    />
  );
}
