import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getHeroSettings } from "@/data/hero";
import HeroBackground from "./HeroBackground";

export default async function Hero() {
  const hero = await getHeroSettings();

  return (
    <section className="relative -mt-[71px] flex min-h-[720px] items-center overflow-hidden bg-ink-950 py-32 sm:min-h-[800px] lg:min-h-[92vh]">
      <HeroBackground mediaType={hero.mediaType} imageUrl={hero.imageUrl} videoUrl={hero.videoUrl} />

      {/* Bottom scrim — builds contrast up from the floor of the frame. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/45 to-transparent" />
      {/* Top scrim, independent of the bottom one — keeps the transparent
          header's logo/nav readable regardless of how bright the footage is
          up there (sky, sand, sun). */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950/55 to-transparent" />
      {/* Focused vignette behind the copy block — footage is unpredictable
          (a busy aerial shot can put light sand or pale rooftops directly
          behind the headline), so this guarantees a dark floor for the text
          regardless of what's playing underneath, without flattening the
          whole frame the way a uniform tint would. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,rgba(0,0,0,0.55)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 text-center lg:px-8">
        <div className="animate-fade-up flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-gold-300/50" />
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-gold-200/90">
            UAE &middot; Qatar &middot; Saudi Arabia &middot; Zanzibar &middot; Georgia
          </p>
          <span className="h-px w-8 bg-gold-300/50" />
        </div>

        <h1 className="animate-fade-up mx-auto mt-6 max-w-2xl text-balance leading-[1.05]" style={{ animationDelay: "70ms" }}>
          <span
            className="block font-display font-medium tracking-[0.02em] text-white"
            style={{
              fontSize: "clamp(18px, 2.2vw, 24px)",
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.75)) drop-shadow(0 10px 30px rgba(0,0,0,0.5))",
            }}
          >
            Find Your
          </span>
          {/* A hard, close contact shadow (not just a soft ambient one) — the
              gold gradient fill alone loses to light sand/rooftops in busy
              footage, so this pins a dark edge under the letterforms no
              matter what's behind them. */}
          <span
            className="text-gradient-gold mt-1 block font-serif italic font-medium"
            style={{
              fontSize: "clamp(42px, 7vw, 84px)",
              filter:
                "drop-shadow(0 1px 2px rgba(0,0,0,0.9)) drop-shadow(0 4px 10px rgba(0,0,0,0.7)) drop-shadow(0 16px 40px rgba(0,0,0,0.5))",
            }}
          >
            Perfect Address
          </span>
        </h1>

        <div className="animate-fade-up mx-auto mt-6 h-px w-12 bg-gold-400/60" style={{ animationDelay: "100ms" }} />

        <p
          className="animate-fade-up mx-auto mt-6 max-w-md text-sm font-normal leading-relaxed text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-base"
          style={{ animationDelay: "130ms" }}
        >
          Curated luxury residences and exceptional investment opportunities across the UAE,
          Qatar, Saudi Arabia, Zanzibar and Georgia.
        </p>

        <div
          className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "170ms" }}
        >
          <Link
            href="/off-plan"
            className="group flex w-full items-center justify-center gap-2 bg-gold-400 px-8 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink-950 shadow-[0_16px_40px_-12px_rgba(212,175,55,0.55)] transition-all duration-500 [transition-timing-function:var(--ease-premium)] hover:-translate-y-0.5 hover:bg-gold-300 sm:w-auto"
          >
            Explore Projects
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
          </Link>
          <Link
            href="/contact"
            className="flex w-full items-center justify-center border border-white/30 bg-white/0 px-8 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-[2px] transition-all duration-500 [transition-timing-function:var(--ease-premium)] hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/10 sm:w-auto"
          >
            Talk to an Advisor
          </Link>
        </div>
      </div>

      {/* Scroll cue — a quiet, architectural nudge rather than a bouncing
          chevron; reads as considered rather than a stock template touch. */}
      <div className="absolute inset-x-0 bottom-8 z-10 hidden flex-col items-center gap-2 sm:flex">
        <span className="animate-scroll-cue h-8 w-px bg-white/60" />
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/60 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
          Scroll
        </p>
      </div>
    </section>
  );
}
