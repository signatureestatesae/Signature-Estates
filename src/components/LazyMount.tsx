"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Defers mounting `children` until the wrapper scrolls near the viewport.
 * Used to keep heavy client SDKs (Google Maps) out of the initial page
 * load on mobile — the placeholder renders immediately, the real content
 * (and whatever it loads) only mounts once someone actually scrolls there.
 */
export default function LazyMount({
  children,
  placeholder,
  rootMargin = "200px",
}: {
  children: ReactNode;
  placeholder: ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return <div ref={ref}>{visible ? children : placeholder}</div>;
}
