"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";
import SearchBox from "./SearchBox";
import { useAdminSearch } from "./useAdminSearch";
import { Badge, Card, EmptyState, leadSourceLabel, leadStatusTone, timeAgo } from "./ui";

interface LeadRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  source: string;
  status: string;
  created_at: string;
}

export default function LeadsList({ rows }: { rows: LeadRow[] }) {
  const { query, setQuery, filtered } = useAdminSearch(rows, (lead, q) =>
    [lead.name, lead.email, lead.phone, lead.message].some((v) => (v ?? "").toLowerCase().includes(q)),
  );

  return (
    <div>
      <SearchBox value={query} onChange={setQuery} placeholder="Search leads…" />

      <Card className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-10 w-10" strokeWidth={1.3} />}
            title="No leads found"
            description="Try a different search or status filter."
          />
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="flex flex-wrap items-center gap-4 px-5 py-4 transition hover:bg-stone-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white">
                    {lead.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-ink-900">{lead.name}</p>
                      <Badge tone={leadStatusTone(lead.status)}>{lead.status}</Badge>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {lead.email} {lead.phone && `· ${lead.phone}`}
                    </p>
                  </div>
                  <p className="hidden max-w-xs shrink truncate text-xs text-gray-400 sm:block">
                    {lead.message}
                  </p>
                  <Badge tone="gray">{leadSourceLabel(lead.source)}</Badge>
                  <p className="shrink-0 text-xs text-gray-400">{timeAgo(lead.created_at)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
