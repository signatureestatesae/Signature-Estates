import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedBlogPosts } from "@/data/blog";
import BlogCard from "@/components/BlogCard";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: "Market insight, area guides and news from Signature Estates.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

// Safety net only — admin saves push fresh data instantly via /api/revalidate.
export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <nav className="mb-4 text-xs text-gray-400">
        <Link href="/" className="hover:text-gold-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-600">Blog</span>
      </nav>

      <div className="mb-10">
        <h1 className="font-display text-h1 font-semibold text-ink-900">
          Blog
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500">
          Market insight, area guides and news from the Signature Estates team.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-sm border border-dashed border-gray-200 py-24 text-center">
          <p className="font-display text-xl font-medium text-ink-700">No articles published yet.</p>
          <p className="mt-2 text-sm text-gray-400">Check back soon.</p>
        </div>
      )}
    </div>
  );
}
