import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getHeroSettings } from "@/data/hero";
import HeroBackground from "./HeroBackground";

export default async function Hero() {
  const hero = await getHeroSettings();

  return (
    <section className="relative -mt-[71px] flex min-h-[680px] items-center overflow-hidden bg-ink-950 py-32 sm:min-h-[760px] lg:min-h-[86vh]">
      <HeroBackground mediaType={hero.mediaType} imageUrl={hero.imageUrl} videoUrl={hero.videoUrl} />

      {/* Uniform tint — baseline contrast for the now vertically-centered
          copy block, wherever it lands over a bright/busy photo or video. */}
      <div className="absolute inset-0 bg-black/40" />
      {/* Bottom scrim — extra anchoring for the copy block. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/20 to-transparent" />
      {/* Top scrim, independent of the bottom one — keeps the transparent
          header's logo/nav readable regardless of how bright the footage is
          up there (sky, sand, sun). */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950/60 to-transparent" />
      {/* Soft edge vignette for cinematic depth. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.4)_100%)]" />

      {/* Corner brackets — a drafting/viewfinder reference mark, not a
          decorative picture frame. */}
      <div className="pointer-events-none absolute inset-5 hidden sm:inset-8 lg:block">
        <span className="absolute left-0 top-0 h-6 w-px bg-white/30" />
        <span className="absolute left-0 top-0 h-px w-6 bg-white/30" />
        <span className="absolute right-0 top-0 h-6 w-px bg-white/30" />
        <span className="absolute right-0 top-0 h-px w-6 bg-white/30" />
        <span className="absolute bottom-0 left-0 h-6 w-px bg-white/30" />
        <span className="absolute bottom-0 left-0 h-px w-6 bg-white/30" />
        <span className="absolute bottom-0 right-0 h-6 w-px bg-white/30" />
        <span className="absolute bottom-0 right-0 h-px w-6 bg-white/30" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 text-center lg:px-8">
        <div className="animate-fade-up inline-flex items-center gap-1.5 border border-white/15 bg-black/35 px-3 py-1.5 backdrop-blur-sm">
          <span className="h-1 w-1 shrink-0 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-gold-300">
            UAE &middot; Qatar &middot; Saudi Arabia &middot; Zanzibar &middot; Georgia
          </p>
        </div>

        <h1
          className="animate-fade-up mx-auto mt-4 max-w-2xl text-balance font-display font-semibold leading-[1.08] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
          style={{ fontSize: "clamp(26px, 4.4vw, 48px)", animationDelay: "70ms" }}
        >
          Find Your
          <br />
          <span className="text-gradient-gold">Perfect Address.</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-3 max-w-md text-sm font-normal leading-relaxed text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-base"
          style={{ animationDelay: "120ms" }}
        >
          Explore luxury residences and exceptional investment opportunities across the UAE,
          Qatar, Saudi Arabia, Zanzibar and Georgia.
        </p>

        <div
          className="animate-fade-up mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3"
          style={{ animationDelay: "170ms" }}
        >
          <Link
            href="/off-plan"
            className="group flex w-full items-center justify-center gap-2 bg-gold-400 px-6 py-2.5 text-xs font-semibold text-ink-950 shadow-[0_16px_40px_-12px_rgba(212,175,55,0.55)] transition hover:-translate-y-0.5 hover:bg-gold-300 sm:w-auto sm:text-sm"
          >
            Explore Projects
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
          </Link>
          <Link
            href="/contact"
            className="flex w-full items-center justify-center border border-white/30 bg-black/20 px-6 py-2.5 text-xs font-semibold text-white backdrop-blur-[2px] transition hover:-translate-y-0.5 hover:border-white sm:w-auto sm:text-sm"
          >
            Talk to an Advisor
          </Link>
        </div>
      </div>

      {/* Scroll cue — a quiet, architectural nudge rather than a bouncing
          chevron; reads as considered rather than a stock template touch. */}
      <div className="absolute inset-x-0 bottom-6 z-10 hidden flex-col items-center gap-2 sm:flex">
        <span className="animate-scroll-cue h-8 w-px bg-white/60" />
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/60 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
          Scroll
        </p>
      </div>
    </section>
  );
}
