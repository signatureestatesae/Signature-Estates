"use client";

import { useEffect } from "react";

// Chrome restores a tab's previous scroll offset on reload by default (even
// a hard reload — it re-navigates the same history entry, which the browser
// scroll-restores unless told not to). That makes every page look like it
// "opens scrolled halfway down" once you've scrolled and reloaded once.
// Opting out here doesn't affect Next's own client-side route transitions
// (App Router restores scroll per-route itself), only raw browser reloads.
export default function ScrollRestoration() {
  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return;
    window.history.scrollRestoration = "manual";

    const [nav] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (nav?.type === "reload") window.scrollTo(0, 0);
  }, []);

  return null;
}
