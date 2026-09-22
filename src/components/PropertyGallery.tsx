"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, ImageOff, X } from "lucide-react";
import { shimmerBlurDataURL } from "@/lib/image";

export default function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  function goTo(index: number) {
    const next = (index + images.length) % images.length;
    setActive(next);
    const strip = stripRef.current;
    const thumb = strip?.children[next] as HTMLElement | undefined;
    if (strip && thumb) {
      const targetLeft = thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2;
      strip.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  }

  const SWIPE_THRESHOLD = 40;

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (deltaX > SWIPE_THRESHOLD) goTo(active - 1);
    else if (deltaX < -SWIPE_THRESHOLD) goTo(active + 1);
  }

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goTo(active - 1);
      if (e.key === "ArrowRight") goTo(active + 1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, active]);

  return (
    <div>
      <div
        className="group relative aspect-[16/10] w-full touch-pan-y select-none overflow-hidden rounded-sm bg-ink-100"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.length > 0 ? (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="View full-screen gallery"
            className="absolute inset-0 h-full w-full cursor-zoom-in"
          >
            <Image
              src={images[active]}
              alt={`${title} - photo ${active + 1}`}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL={shimmerBlurDataURL(800, 500)}
            />
          </button>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <ImageOff className="h-10 w-10" strokeWidth={1.5} />
          </div>
        )}

        {images.length > 0 && (
          <span className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-sm bg-black/45 px-2.5 py-1 text-xs font-medium text-white opacity-100 backdrop-blur-sm transition-opacity duration-200 lg:opacity-0 lg:group-hover:opacity-100">
            <Expand className="h-3.5 w-3.5" strokeWidth={2} />
            View gallery
          </span>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-100 backdrop-blur-sm transition-opacity duration-200 hover:bg-black/65 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-100 backdrop-blur-sm transition-opacity duration-200 hover:bg-black/65 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </button>
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-sm bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          ref={stripRef}
          className="mt-3 flex touch-pan-x snap-x snap-proximity gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(i)}
              className={`relative aspect-[4/3] w-[calc(25%-0.5625rem)] shrink-0 snap-start overflow-hidden rounded-sm ring-2 transition ${
                active === i ? "ring-gold-500" : "ring-transparent"
              }`}
            >
              <Image
                src={src}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="200px"
                className="object-cover"
                placeholder="blur"
                blurDataURL={shimmerBlurDataURL(200, 150)}
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <span className="text-sm font-medium text-white/70">
              {active + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close gallery"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-6 w-6" strokeWidth={1.8} />
            </button>
          </div>

          <div className="relative flex-1 select-none">
            <Image
              src={images[active]}
              alt={`${title} - photo ${active + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(active - 1)}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(active + 1)}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4"
                >
                  <ChevronRight className="h-6 w-6" strokeWidth={2} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-sm ring-2 transition ${
                    active === i ? "ring-gold-400" : "ring-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt={`${title} thumbnail ${i + 1}`} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
