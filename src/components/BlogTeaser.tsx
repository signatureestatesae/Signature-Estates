import Link from "next/link";
import { getPublishedBlogPosts } from "@/data/blog";
import BlogCard from "./BlogCard";
import Reveal from "./Reveal";

export default async function BlogTeaser() {
  const posts = (await getPublishedBlogPosts()).slice(0, 4);
  if (posts.length === 0) return null;

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
              Market Insights
            </p>
            <h2 className="gold-underline mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              From the Journal
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-sm font-medium text-ink-700 underline decoration-gold-400 decoration-2 underline-offset-4 hover:text-gold-600"
          >
            View all articles &rarr;
          </Link>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 80}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
