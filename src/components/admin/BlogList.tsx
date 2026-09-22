"use client";

import Image from "next/image";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { formatDate } from "@/lib/format";
import SearchBox from "./SearchBox";
import { useAdminSearch } from "./useAdminSearch";
import { Badge, Card, EmptyState } from "./ui";

interface BlogRow {
  id: string;
  title: string;
  author: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  cover_image: string | null;
}

export default function BlogList({ rows }: { rows: BlogRow[] }) {
  const { query, setQuery, filtered } = useAdminSearch(rows, (p, q) =>
    [p.title, p.author].some((v) => (v ?? "").toLowerCase().includes(q)),
  );

  return (
    <div>
      <SearchBox value={query} onChange={setQuery} placeholder="Search posts…" />

      <Card className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Newspaper className="h-10 w-10" strokeWidth={1.3} />}
            title="No posts found"
            description="Try a different search, or write your first post."
          />
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/blog/${p.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-stone-50"
                >
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {p.cover_image && (
                      <Image src={p.cover_image} alt="" fill sizes="64px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">{p.title}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {p.author || "Unknown author"}
                    </p>
                  </div>
                  <Badge tone={p.published ? "green" : "gray"}>
                    {p.published ? "Published" : "Draft"}
                  </Badge>
                  <p className="w-28 shrink-0 text-right text-xs text-gray-400">
                    {formatDate(p.published_at ?? p.created_at)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
