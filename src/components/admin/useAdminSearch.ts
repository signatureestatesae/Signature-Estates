"use client";

import { useMemo, useState } from "react";

export function useAdminSearch<T>(rows: T[], searchFn: (row: T, query: string) => boolean) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => searchFn(row, q));
  }, [rows, query, searchFn]);

  return { query, setQuery, filtered };
}
