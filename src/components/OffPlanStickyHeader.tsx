"use client";

import { useEffect, useState } from "react";

export default function OffPlanStickyHeader({
  name,
  priceLabel,
  waUrl,
}: {
  name: string;
  priceLabel: string;
  waUrl: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 560);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 hidden border-b border-gray-100 bg-white/95 backdrop-blur-sm transition-transform duration-300 lg:block ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-8 py-3">
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-ink-900">{name}</p>
          <p className="text-xs text-gray-400">{priceLabel}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-200 px-5 py-2 text-sm font-medium text-ink-800 transition hover:border-gold-500 hover:text-gold-700"
          >
            WhatsApp
          </a>
          <a
            href="#enquire"
            className="bg-gold-500 px-5 py-2 text-sm font-semibold text-ink-950 transition hover:bg-gold-400"
          >
            Enquire Now
          </a>
        </div>
      </div>
    </div>
  );
}
