import { extractPlainTextFromArticleContent } from "@/lib/article-content";

export function createPostSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function estimateReadingTime(content: string) {
  const wordCount = extractPlainTextFromArticleContent(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 180));
}

export function formatBlogDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
