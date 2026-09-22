"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { OffPlanProject, OffPlanStatus } from "@/data/types";
import OffPlanCard from "./OffPlanCard";

const STATUSES: OffPlanStatus[] = [
  "Pre-Launch",
  "Off-Plan",
  "Under Construction",
  "Nearing Completion",
];

// The GCC markets Signature Estates operates in — shown regardless of how
// many projects currently exist in each, so the filter reflects the
// business' footprint rather than just today's inventory.
const COUNTRIES = ["United Arab Emirates", "Qatar", "Saudi Arabia", "Bahrain", "Oman"];

interface Filters {
  status: string;
  area: string;
  city: string;
  country: string;
  developer: string;
}

const DEFAULT_FILTERS: Filters = { status: "", area: "", city: "", country: "", developer: "" };

/** Same shape page.tsx used to compute server-side from `searchParams` — reads the URL directly instead, client-side. */
function readFiltersFromLocation(): Filters {
  const params = new URLSearchParams(window.location.search);
  return {
    status: params.get("status") ?? "",
    area: params.get("area") ?? "",
    city: params.get("city") ?? "",
    country: params.get("country") ?? "",
    developer: params.get("developer") ?? "",
  };
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-current text-gray-400"
      strokeWidth={1.8}
    >
      <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OffPlanExplorer({ projects }: { projects: OffPlanProject[] }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const areaNames = useMemo(
    () => Array.from(new Set(projects.map((p) => p.area))).sort(),
    [projects],
  );

  const cityNames = useMemo(
    () => Array.from(new Set(projects.map((p) => p.city))).sort(),
    [projects],
  );

  // The server-rendered shell always starts from DEFAULT_FILTERS (nothing
  // set) so this page never has to read `searchParams` and can ship from a
  // prerendered/cached static shell instead of blocking on a per-request
  // render. Real filters from the URL (?status=…&area=…) apply here, right
  // after mount.
  useEffect(() => {
    setFilters(readFiltersFromLocation());
  }, []);

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        if (filters.status && p.status !== filters.status) return false;
        if (filters.area && p.area !== filters.area) return false;
        if (filters.city && p.city !== filters.city) return false;
        if (filters.country && p.country !== filters.country) return false;
        if (filters.developer && p.developer !== filters.developer) return false;
        return true;
      }),
    [projects, filters],
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <nav className="mb-4 text-sm text-gray-400">
        <Link href="/" className="hover:text-gold-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-600">Off-Plan Projects</span>
      </nav>

      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
          Reserve Tomorrow&apos;s Address
        </p>
        <h1 className="mt-3 font-display text-h1 font-semibold text-ink-900">Off-Plan Projects</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500">
          Reserve tomorrow&apos;s address today. Our off-plan portfolio spans pre-launch releases
          to near-complete developments, each vetted for developer track record, location and
          payment terms.
        </p>
      </div>

      <div className="mb-12 flex flex-wrap items-center gap-3 rounded-sm border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative w-48">
          <select
            value={filters.country}
            onChange={(e) => updateFilter("country", e.target.value)}
            className="w-full appearance-none rounded-sm bg-[#f3f2ef] px-4 py-2.5 pr-9 text-sm text-ink-900 focus:outline-none"
          >
            <option value="">Any Country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Chevron />
        </div>

        <div className="relative w-48">
          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="w-full appearance-none rounded-sm bg-[#f3f2ef] px-4 py-2.5 pr-9 text-sm text-ink-900 focus:outline-none"
          >
            <option value="">Any Stage</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Chevron />
        </div>

        <div className="relative w-48">
          <select
            value={filters.city}
            onChange={(e) => updateFilter("city", e.target.value)}
            className="w-full appearance-none rounded-sm bg-[#f3f2ef] px-4 py-2.5 pr-9 text-sm text-ink-900 focus:outline-none"
          >
            <option value="">Any Destination</option>
            {cityNames.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Chevron />
        </div>

        <div className="relative w-48">
          <select
            value={filters.area}
            onChange={(e) => updateFilter("area", e.target.value)}
            className="w-full appearance-none rounded-sm bg-[#f3f2ef] px-4 py-2.5 pr-9 text-sm text-ink-900 focus:outline-none"
          >
            <option value="">Any Area</option>
            {areaNames.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <Chevron />
        </div>
      </div>

      {filters.developer && (
        <div className="mb-6 flex items-center gap-2 text-sm text-ink-600">
          <span>
            Showing projects by <strong className="text-ink-900">{filters.developer}</strong>
          </span>
          <button
            type="button"
            onClick={() => updateFilter("developer", "")}
            className="text-gold-600 underline decoration-gold-400 decoration-2 underline-offset-4 hover:text-gold-700"
          >
            Clear
          </button>
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <OffPlanCard key={project.id} project={project} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="rounded-sm border border-dashed border-gray-200 py-24 text-center">
          <p className="font-display text-xl font-medium text-ink-700">No projects match your search.</p>
          <p className="mt-2 text-sm text-gray-400">
            Try adjusting your filters or contact us about upcoming launches.
          </p>
        </div>
      )}
    </div>
  );
}
