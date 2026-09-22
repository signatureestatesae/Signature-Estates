"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { OffPlanProject } from "@/data/types";
import OffPlanCard from "./OffPlanCard";

const PAGE_SIZE = 9;

export default function AgentListingsGrid({ projects }: { projects: OffPlanProject[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = projects.slice(start, start + PAGE_SIZE);

  function goTo(p: number) {
    setPage(Math.min(Math.max(p, 1), totalPages));
  }

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.06em] text-[#111]">
        Projects ({projects.length})
      </h2>

      {projects.length === 0 ? (
        <div className="mt-6 rounded-sm border border-dashed border-gray-200 py-16 text-center">
          <p className="text-sm text-gray-400">This agent has no active projects right now.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((project) => (
              <OffPlanCard key={project.id} project={project} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e8e8e8] text-ink-700 transition hover:border-gold-500 hover:text-gold-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => goTo(p)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
                    page === p
                      ? "bg-ink-900 text-white"
                      : "text-gray-500 hover:bg-[#f1f1ee] hover:text-ink-900"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goTo(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e8e8e8] text-ink-700 transition hover:border-gold-500 hover:text-gold-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
