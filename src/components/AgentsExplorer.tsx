"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Agent } from "@/data/types";
import AgentCard from "./AgentCard";
import Reveal from "./Reveal";

type SortOption = "default" | "top-rated" | "name";

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

export default function AgentsExplorer({
  agents,
  spotlightId,
}: {
  agents: Agent[];
  /** Agent already shown in the leadership spotlight above — excluded here to avoid a duplicate card. */
  spotlightId?: string;
}) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [sort, setSort] = useState<SortOption>("default");

  const locations = useMemo(
    () => Array.from(new Set(agents.map((a) => a.location))).sort(),
    [agents],
  );
  const languages = useMemo(
    () => Array.from(new Set(agents.flatMap((a) => a.languages))).sort(),
    [agents],
  );
  const specialties = useMemo(
    () => Array.from(new Set(agents.flatMap((a) => a.specialties))).sort(),
    [agents],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = agents.filter((a) => {
      if (a.id === spotlightId) return false;
      if (q && !a.name.toLowerCase().includes(q)) return false;
      if (location && a.location !== location) return false;
      if (language && !a.languages.includes(language)) return false;
      if (specialty && !a.specialties.includes(specialty)) return false;
      return true;
    });

    // "default" preserves the admin-configured sequence (agents already
    // arrive sorted by sort_order from the server; filter() keeps order).
    if (sort === "top-rated") result.sort((a, b) => b.rating - a.rating);
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [agents, spotlightId, query, location, language, specialty, sort]);

  return (
    <div>
      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-sm border border-[#e8e8e8] bg-white p-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-sm bg-[#f3f3f3] px-3 py-2.5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by agent name…"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink-900 placeholder:text-gray-400 focus:outline-none"
          />
          <Search className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={1.8} />
        </div>

        <div className="relative">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-40 appearance-none rounded-sm border border-[#e8e8e8] bg-white px-4 py-2.5 pr-9 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
          >
            <option value="">Any Location</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <Chevron />
        </div>

        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-36 appearance-none rounded-sm border border-[#e8e8e8] bg-white px-4 py-2.5 pr-9 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
          >
            <option value="">Language</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <Chevron />
        </div>

        <div className="relative">
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-44 appearance-none rounded-sm border border-[#e8e8e8] bg-white px-4 py-2.5 pr-9 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
          >
            <option value="">Specialty</option>
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Chevron />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm">
          <span className="font-semibold text-[#111]">{filtered.length}</span>{" "}
          <span className="text-[#6b7280]">agents</span>
        </p>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="appearance-none border-b border-[#e8e8e8] bg-transparent pb-1 pr-6 text-sm text-ink-900 focus:outline-none"
          >
            <option value="default">Featured order</option>
            <option value="top-rated">Top rated</option>
            <option value="name">Name (A-Z)</option>
          </select>
          <svg
            viewBox="0 0 20 20"
            className="pointer-events-none absolute right-0 top-0 h-4 w-4 fill-none stroke-current text-gray-400"
            strokeWidth={1.8}
          >
            <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-sm border border-dashed border-gray-200 py-24 text-center">
          <p className="font-display text-xl font-medium text-ink-700">No agents match your search.</p>
          <p className="mt-2 text-sm text-gray-400">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filtered.map((agent, i) => (
            <Reveal key={agent.id} delay={(i % 8) * 50}>
              <AgentCard agent={agent} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
