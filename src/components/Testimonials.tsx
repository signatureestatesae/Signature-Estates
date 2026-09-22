"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/data/content";
import Reveal from "./Reveal";

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 340) + 24;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <section className="bg-stone-100 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
              Client Stories
            </p>
            <h2 className="gold-underline mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              Trusted by buyers, tenants and investors
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous testimonials"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/15 text-ink-700 transition hover:border-gold-500 hover:bg-gold-500 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next testimonials"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/15 text-ink-700 transition hover:border-gold-500 hover:bg-gold-500 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div
            ref={trackRef}
            className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((t) => (
              <figure
                data-card
                key={t.id}
                className="relative flex h-full w-[300px] shrink-0 snap-start flex-col rounded-sm border border-gold-400/25 bg-white p-7 shadow-[0_15px_40px_-20px_rgba(20,20,20,0.25)] sm:w-[340px]"
              >
                <Quote className="h-7 w-7 shrink-0 fill-gold-100 text-gold-400" strokeWidth={1.2} />
                <div className="mt-3 flex gap-1 text-gold-500">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg
                      key={j}
                      viewBox="0 0 20 20"
                      className={`h-4 w-4 fill-current ${j >= t.rating ? "opacity-20" : ""}`}
                    >
                      <path d="M10 1.5l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L10 15.6l-5.6 3 1.4-6.2L1 8l6.4-.6L10 1.5z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-ink-900/10 pt-4">
                  <p className="font-display text-sm font-semibold text-ink-900">{t.name}</p>
                  <p className="text-xs text-ink-400">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
