import Link from "next/link";

export default function AgentsCTA() {
  return (
    <section className="bg-[#141414] py-20">
      <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
        <h2 className="font-display text-h2 font-semibold text-white">
          Build your career in Dubai&apos;s luxury property market.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/60">
          We back our advisors with a curated portfolio, a trusted brand and a
          deliberately small client roster — so every deal gets the attention
          it deserves.
        </p>
        <Link
          href="/careers"
          className="mt-8 inline-flex items-center justify-center rounded-sm bg-gold-400 px-8 py-3 text-sm font-medium text-ink-950 transition hover:bg-gold-300"
        >
          Join Our Team
        </Link>
      </div>
    </section>
  );
}
