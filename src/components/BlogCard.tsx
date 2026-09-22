import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/data/types";
import { formatDate } from "@/lib/format";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>

      <div className="p-5">
        <p className="text-xs text-gray-400">
          {post.publishedAt ? formatDate(post.publishedAt) : ""}
          {post.author ? ` · ${post.author}` : ""}
        </p>
        <h3 className="mt-1.5 font-display text-lg font-bold text-ink-900">{post.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
