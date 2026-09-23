"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Keying on pathname forces a remount on every route change, which restarts
// the CSS animation below — a simple, dependency-free stand-in for the View
// Transitions API that fades/lifts each page in instead of hard-cutting.
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-page-in">
      {children}
    </div>
  );
}
