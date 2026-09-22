import Link from "next/link";
import Reveal from "./Reveal";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-20">
      <div className="pointer-events-none absolute inset-8 hidden border border-white/10 sm:block" />

      <Reveal className="relative mx-auto flex max-w-4xl flex-col items-center px-5 text-center lg:px-8">
        <span className="h-px w-10 bg-gold-400/70" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
          Get in Touch
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-stone-50 sm:text-4xl">
          Considering a luxury resort or residence?
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-100/70">
          Speak with a Signature Estates advisor for a confidential, no-obligation
          consultation on your investment goals in Dubai.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="rounded-sm bg-gold-500 px-8 py-3 text-sm font-medium text-ink-950 shadow-lg shadow-gold-500/20 transition hover:-translate-y-0.5 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/30"
          >
            Book a Consultation
          </Link>
          <Link
            href="/off-plan"
            className="rounded-sm border border-stone-50/30 px-8 py-3 text-sm font-medium text-stone-50 transition hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-300"
          >
            Browse Projects
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
