"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Mail, Phone, Plus } from "lucide-react";

// TODO: placeholder email — replace with the real address before launch.
const COMPANY_PHONE = "+971521600372";
const COMPANY_EMAIL = "info@signatureestates.ae";

export default function WhatsAppButton() {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // Off-plan project pages have their own mobile sticky CTA bar along the
  // bottom edge — lift this above it there so the two don't overlap.
  const hasStickyBarBelow = /^\/off-plan\/[^/]+/.test(pathname ?? "");

  useEffect(() => {
    if (!expanded) return;
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [expanded]);

  return (
    <div
      ref={containerRef}
      className={`fixed right-6 z-50 flex flex-col items-end gap-3 transition-[bottom] ${
        hasStickyBarBelow ? "bottom-24 lg:bottom-6" : "bottom-6"
      }`}
    >
      {expanded && (
        <div className="flex flex-col items-end gap-2.5">
          <a
            href={`mailto:${COMPANY_EMAIL}`}
            aria-label="Email us"
            className="flex items-center gap-2.5 rounded-full bg-white py-2 pl-4 pr-2.5 text-sm font-medium text-ink-900 shadow-lg shadow-black/15 transition hover:-translate-y-0.5"
          >
            Email us
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-white">
              <Mail className="h-4 w-4" strokeWidth={2} />
            </span>
          </a>
          <a
            href={`tel:${COMPANY_PHONE}`}
            aria-label="Call us"
            className="flex items-center gap-2.5 rounded-full bg-white py-2 pl-4 pr-2.5 text-sm font-medium text-ink-900 shadow-lg shadow-black/15 transition hover:-translate-y-0.5"
          >
            Call us
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-white">
              <Phone className="h-4 w-4" strokeWidth={2} />
            </span>
          </a>
        </div>
      )}

      <div className="relative">
        <a
          href="https://wa.me/971521600372"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition hover:scale-105 hover:bg-[#20BD5A]"
        >
          <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white">
            <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.31.65 4.47 1.78 6.31L4 29l7.86-1.74A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.6c-1.98 0-3.83-.55-5.4-1.5l-.39-.23-4.66 1.03 1.05-4.54-.25-.4A9.55 9.55 0 0 1 6.4 15c0-5.3 4.31-9.6 9.6-9.6 5.3 0 9.6 4.3 9.6 9.6 0 5.3-4.3 9.6-9.6 9.6Zm5.3-7.19c-.29-.15-1.7-.84-1.96-.94-.26-.1-.46-.15-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.23-.56-.47-.48-.65-.49-.17-.01-.36-.01-.55-.01-.19 0-.51.07-.78.36-.26.29-1.02 1-1.02 2.44 0 1.44 1.05 2.83 1.19 3.03.15.19 2.07 3.16 5.02 4.43.7.3 1.25.48 1.68.61.7.22 1.34.19 1.84.11.56-.08 1.7-.7 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34Z" />
          </svg>
        </a>

        <button
          type="button"
          aria-label={expanded ? "Fewer contact options" : "More contact options"}
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink-700 shadow-md transition hover:scale-110"
        >
          <Plus className={`h-4 w-4 transition-transform ${expanded ? "rotate-45" : ""}`} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
