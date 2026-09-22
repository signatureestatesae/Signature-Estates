"use client";

import Image from "next/image";
import Link from "next/link";
import { Landmark } from "lucide-react";
import { formatPrice } from "@/lib/format";
import SearchBox from "./SearchBox";
import { useAdminSearch } from "./useAdminSearch";
import { Badge, Card, EmptyState } from "./ui";

interface OffPlanRow {
  id: string;
  name: string;
  status: string;
  area: string;
  city: string;
  starting_price: number;
  featured: boolean;
  images: string[] | null;
}

export default function OffPlanList({ rows }: { rows: OffPlanRow[] }) {
  const { query, setQuery, filtered } = useAdminSearch(rows, (p, q) =>
    [p.name, p.area, p.city].some((v) => v.toLowerCase().includes(q)),
  );

  return (
    <div>
      <SearchBox value={query} onChange={setQuery} placeholder="Search projects…" />

      <Card className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Landmark className="h-10 w-10" strokeWidth={1.3} />}
            title="No projects found"
            description="Try a different search, or add your first off-plan project."
          />
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/off-plan/${p.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-stone-50"
                >
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {p.images?.[0] && (
                      <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-ink-900">{p.name}</p>
                      {p.featured && <Badge tone="gold">Featured</Badge>}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {p.area}, {p.city}
                    </p>
                  </div>
                  <Badge tone="blue">{p.status}</Badge>
                  <p className="w-32 shrink-0 text-right text-sm font-medium text-ink-900">
                    {formatPrice(p.starting_price, "total")}
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
