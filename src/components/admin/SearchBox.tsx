"use client";

import { Search } from "lucide-react";

export default function SearchBox({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 sm:max-w-xs">
      <Search className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={1.8} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-ink-900 placeholder:text-gray-400 focus:outline-none"
      />
    </div>
  );
}
