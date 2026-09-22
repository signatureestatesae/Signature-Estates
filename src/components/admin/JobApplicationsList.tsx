"use client";

import Link from "next/link";
import { FileUser } from "lucide-react";
import SearchBox from "./SearchBox";
import { useAdminSearch } from "./useAdminSearch";
import { applicationStatusTone, Badge, Card, EmptyState, timeAgo } from "./ui";

interface ApplicationRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  job_title: string;
  status: string;
  created_at: string;
}

export default function JobApplicationsList({ rows }: { rows: ApplicationRow[] }) {
  const { query, setQuery, filtered } = useAdminSearch(rows, (a, q) =>
    [a.name, a.email, a.phone, a.job_title].some((v) => (v ?? "").toLowerCase().includes(q)),
  );

  return (
    <div>
      <SearchBox value={query} onChange={setQuery} placeholder="Search applications…" />

      <Card className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileUser className="h-10 w-10" strokeWidth={1.3} />}
            title="No applications found"
            description="Try a different search or status filter."
          />
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/applications/${a.id}`}
                  className="flex flex-wrap items-center gap-4 px-5 py-4 transition hover:bg-stone-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink-900 text-xs font-semibold text-white">
                    {a.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-ink-900">{a.name}</p>
                      <Badge tone={applicationStatusTone(a.status)}>{a.status}</Badge>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {a.email} {a.phone && `· ${a.phone}`}
                    </p>
                  </div>
                  <Badge tone="gray">{a.job_title || "General"}</Badge>
                  <p className="shrink-0 text-xs text-gray-400">{timeAgo(a.created_at)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
