"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { formatDate } from "@/lib/format";
import SearchBox from "./SearchBox";
import { useAdminSearch } from "./useAdminSearch";
import { Badge, Card, EmptyState } from "./ui";

interface CareerRow {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  published: boolean;
  created_at: string;
}

export default function CareersList({ rows }: { rows: CareerRow[] }) {
  const { query, setQuery, filtered } = useAdminSearch(rows, (j, q) =>
    [j.title, j.department, j.location].some((v) => (v ?? "").toLowerCase().includes(q)),
  );

  return (
    <div>
      <SearchBox value={query} onChange={setQuery} placeholder="Search postings…" />

      <Card className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-10 w-10" strokeWidth={1.3} />}
            title="No postings found"
            description="Try a different search, or post your first role."
          />
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((j) => (
              <li key={j.id}>
                <Link
                  href={`/admin/careers/${j.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-stone-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">{j.title}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {[j.department, j.location, j.employment_type].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  <Badge tone={j.published ? "green" : "gray"}>
                    {j.published ? "Published" : "Draft"}
                  </Badge>
                  <p className="w-28 shrink-0 text-right text-xs text-gray-400">
                    {formatDate(j.created_at)}
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
