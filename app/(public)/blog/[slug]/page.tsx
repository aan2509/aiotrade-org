import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { sanitizeArticleHtml } from "@/lib/article-sanitizer";
import { estimateReadingTime, formatBlogDate } from "@/lib/blog-helpers";
import {
  buildBlogPostMetadata,
  getPublishedBlogPostBySlug,
  getPublishedBlogPosts,
} from "@/lib/blog-posts";
import { landingImages } from "@/components/landing/data";
import { PrefetchedLink } from "@/components/shared/prefetched-link";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Artikel tidak ditemukan",
    };
  }

  return buildBlogPostMetadata(post);
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = (await getPublishedBlogPosts(4)).filter((item) => item.slug !== post.slug).slice(0, 3);
  const articleHtml = sanitizeArticleHtml(post.content);

  return (
    <main className="min-h-screen bg-[#f5f2eb] text-stone-950">
      <section className="relative overflow-hidden bg-[#0c1526] px-6 pb-14 pt-12 text-white sm:px-8 lg:px-10 lg:pb-18">
        <Image
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-22"
          fill
          sizes="100vw"
          src={post.thumbnailUrl ?? landingImages.heroImage}
          unoptimized={Boolean(post.thumbnailUrl)}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,16,0.72)_0%,rgba(4,8,16,0.92)_100%)]" />
        <div className="relative mx-auto max-w-5xl">
          <PrefetchedLink
            className="inline-flex items-center gap-2 text-sm font-medium text-white/72 transition hover:text-white"
            href="/blog"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke blog
          </PrefetchedLink>
          <span className="mt-8 inline-flex rounded-full bg-[#f6be4f]/18 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#ffd67d]">
            {post.category}
          </span>
          <h1 className="mt-5 text-[2.8rem] font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-[4.9rem]">
            {post.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/74 sm:text-lg">{post.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/68">
            <span>{formatBlogDate(post.publishedAt)}</span>
            <span>{estimateReadingTime(post.content)} menit baca</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_320px] lg:px-10">
        <article className="min-w-0">
          <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
            <div className="relative aspect-[16/8] bg-[#0f1728]">
              <Image
                alt={post.title}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                src={post.thumbnailUrl ?? landingImages.chartImage}
                unoptimized={Boolean(post.thumbnailUrl)}
              />
            </div>
            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <div
                className="article-content max-w-none"
                dangerouslySetInnerHTML={{ __html: articleHtml }}
              />
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Artikel ini</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-stone-950">{post.title}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">{post.excerpt}</p>
          </div>

          <div className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-stone-950">Berita lain</h2>
              <PrefetchedLink className="text-sm font-semibold text-[#1b74df]" href="/blog">
                Semua post
              </PrefetchedLink>
            </div>
            <div className="mt-5 space-y-4">
              {relatedPosts.map((item) => (
                <PrefetchedLink
                  className="block rounded-2xl border border-stone-200 px-4 py-4 touch-manipulation transition hover:border-stone-300 hover:bg-stone-50"
                  href={`/blog/${item.slug}`}
                  key={item.id}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1b74df]">{item.category}</p>
                  <h3 className="mt-2 text-lg font-semibold leading-tight tracking-[-0.02em] text-stone-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.excerpt}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-stone-500">
                    Baca
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </PrefetchedLink>
              ))}
              {!relatedPosts.length ? (
                <p className="text-sm text-stone-500">Belum ada artikel lain yang dipublish.</p>
              ) : null}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
