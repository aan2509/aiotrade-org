export type BlogPostSummary = {
  category: string;
  createdAt: string;
  excerpt: string;
  id: string;
  isPublished: boolean;
  openGraphAssetId: string | null;
  openGraphImageUrl: string | null;
  publishedAt: string;
  seoDescription: string | null;
  seoTitle: string | null;
  slug: string;
  thumbnailAssetId: string | null;
  thumbnailUrl: string | null;
  title: string;
  updatedAt: string;
};

export type BlogPostDetail = BlogPostSummary & {
  content: string;
};

export type BlogPostInput = {
  category: string;
  content: string;
  excerpt: string;
  id?: string | null;
  isPublished: boolean;
  openGraphAssetId?: string | null;
  openGraphImageUrl?: string | null;
  publishedAt?: string | null;
  seoDescription?: string | null;
  seoTitle?: string | null;
  slug: string;
  thumbnailAssetId?: string | null;
  thumbnailUrl?: string | null;
  title: string;
};
