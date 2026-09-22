import Reveal from "./Reveal";

// TODO: these are well-known Dubai developer names used as placeholders —
// do not publish without their explicit sign-off to display as a "partner".
const partnersRowOne = [
  "Emaar Properties",
  "DAMAC Properties",
  "Nakheel",
  "Sobha Realty",
];
const partnersRowTwo = [
  "Binghatti Developers",
  "Meraas",
  "Azizi Developments",
  "Ellington Properties",
];

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

function PartnerCard({ name }: { name: string }) {
  return (
    <div className="group/card relative flex shrink-0 items-center gap-4 border border-stone-200 bg-white/80 px-6 py-3.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/80 hover:bg-white hover:shadow-[0_20px_44px_-20px_rgba(201,162,75,0.6)]">
      {/* Corner ticks — echoes the hero's viewfinder marks, reads as a
          signature plaque rather than a plain chip. */}
      <span className="absolute left-0 top-0 h-2.5 w-px bg-gold-400/0 transition-colors duration-300 group-hover/card:bg-gold-400/70" />
      <span className="absolute left-0 top-0 h-px w-2.5 bg-gold-400/0 transition-colors duration-300 group-hover/card:bg-gold-400/70" />
      <span className="absolute bottom-0 right-0 h-2.5 w-px bg-gold-400/0 transition-colors duration-300 group-hover/card:bg-gold-400/70" />
      <span className="absolute bottom-0 right-0 h-px w-2.5 bg-gold-400/0 transition-colors duration-300 group-hover/card:bg-gold-400/70" />

      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-300/60 bg-gradient-to-br from-gold-50 to-gold-100 font-display text-xs font-semibold tracking-wide text-gold-700 shadow-inner transition-all duration-300 group-hover/card:border-gold-400 group-hover/card:from-gold-100 group-hover/card:to-gold-200 group-hover/card:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]">
        {initials(name)}
      </span>
      <span className="h-6 w-px shrink-0 bg-stone-200 transition-colors duration-300 group-hover/card:bg-gold-300/60" />
      <span className="whitespace-nowrap font-display text-base font-medium text-ink-600 transition-colors duration-300 group-hover/card:text-ink-900 sm:text-lg">
        {name}
      </span>
    </div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="group relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-stone-100 to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-stone-100 to-transparent sm:w-32" />
      <div
        className={`flex w-max items-center gap-5 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        } group-hover:[animation-play-state:paused]`}
      >
        {doubled.map((name, i) => (
          <PartnerCard key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </div>
  );
}

export default function TrustedBy() {
  return (
    <section className="relative overflow-hidden bg-stone-100 py-20 shadow-[0_0_40px_-15px_rgba(201,162,75,0.35)]">
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/80 to-transparent" />
      <span className="absolute inset-x-8 top-1 h-px bg-gradient-to-r from-transparent via-gold-300/40 to-transparent sm:inset-x-24" />
      <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/80 to-transparent" />
      <span className="absolute inset-x-8 bottom-1 h-px bg-gradient-to-r from-transparent via-gold-300/40 to-transparent sm:inset-x-24" />
      {/* Soft ambient glow — gives the marquee a quiet spotlight rather than
          sitting flat on the stone background. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_60%)]" />

      <Reveal className="relative flex flex-col items-center px-5 text-center">
        <span className="h-px w-10 bg-gold-400/70" />
        <p className="mt-4 text-eyebrow font-semibold uppercase tracking-eyebrow text-gold-600">
          Our Network
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Trusted by Leading Developers &amp; Partners
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-500">
          We work closely with the region&apos;s most established developers to give our
          clients priority access, preferred pricing and off-market opportunities.
        </p>
      </Reveal>

      <Reveal delay={120} className="relative mt-12 flex flex-col gap-4">
        <MarqueeRow items={partnersRowOne} />
        <MarqueeRow items={partnersRowTwo} reverse />
      </Reveal>
    </section>
  );
}
