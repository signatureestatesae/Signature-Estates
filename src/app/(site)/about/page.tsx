import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gem, Handshake, ShieldCheck } from "lucide-react";
import { getAgents } from "@/data/agents";
import AgentAvatar from "@/components/AgentAvatar";
import CtaSection from "@/components/CtaSection";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Signature Estates, Dubai's boutique luxury real estate brokerage.",
  alternates: { canonical: `${SITE_URL}/about` },
};

// Safety net only — admin saves push fresh data instantly via /api/revalidate.
export const revalidate = 3600;

// TODO: every figure below is a placeholder — confirm real numbers before launch.
const stats = [
  { value: "12+", label: "Years Experience" },
  { value: "AED 500M+", label: "in Sales" },
  { value: "450+", label: "Clients Served" },
  { value: "98%", label: "Client Satisfaction" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "High-value transactions demand confidentiality. We protect our clients' privacy at every stage of the process.",
  },
  {
    icon: Gem,
    title: "Market Expertise",
    description:
      "Deep, ground-level knowledge of Dubai, Downtown Dubai and Palm Jumeirah means every valuation is grounded in real transaction data.",
  },
  {
    icon: Handshake,
    title: "Exclusive Access",
    description:
      "Our relationships with developers and private sellers surface off-market opportunities before they reach the wider market.",
  },
];

export default async function AboutPage() {
  const agents = await getAgents();
  const team = [...agents].sort((a, b) => (b.photo ? 1 : 0) - (a.photo ? 1 : 0)).slice(0, 4);

  return (
    <div>
      <section className="mx-auto max-w-[100rem] px-5 pb-16 pt-8 lg:px-8 lg:pb-24">
        <nav className="text-sm text-[#6b7280]">
          <Link href="/" className="hover:text-gold-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink-600">About</span>
        </nav>

        <div className="mt-8 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500">
              About Signature Estates
            </p>
            <h1 className="gold-underline mt-4 font-display text-h1 font-semibold text-ink-900">
              Redefining Luxury Real Estate in Dubai.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-[#6b7280]">
              A boutique brokerage representing Dubai&apos;s finest apartments,
              villas and commercial addresses — trusted by discerning buyers,
              tenants and investors since day one.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/agents"
                className="inline-flex items-center gap-2 rounded-sm bg-ink-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950"
              >
                Meet the Team
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              <Link
                href="/off-plan"
                className="inline-flex items-center rounded-sm border border-ink-900/15 px-7 py-3 text-sm font-medium text-ink-900 transition hover:border-gold-500 hover:text-gold-700"
              >
                Browse Projects
              </Link>
            </div>
            <Link
              href="/about/ceo"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-700 underline decoration-gold-400 decoration-2 underline-offset-4 hover:text-gold-600"
            >
              Read a message from our CEO
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-gold-400/25 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.25)]">
              <Image src="/images/about/office.jpg" alt="Signature Estates office" fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" priority />
            </div>
            <div className="absolute -bottom-8 -left-6 h-40 w-56 overflow-hidden rounded-sm border-4 border-stone-50 shadow-xl sm:-left-10 sm:h-48 sm:w-64">
              <Image src="/images/about/handover.jpg" alt="Handing over the keys to a new home" fill sizes="256px" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-16">
        <div className="mx-auto grid max-w-[100rem] grid-cols-2 divide-y divide-ink-900/10 px-5 sm:grid-cols-4 sm:divide-y-0 sm:divide-x lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="px-2 py-4 text-center sm:py-0">
              <p className="font-display text-3xl font-semibold text-ink-900 sm:text-5xl">{s.value}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.1em] text-[#6b7280]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[100rem] px-5 py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <h2 className="gold-underline h-fit font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
            Our Philosophy
          </h2>
          <div className="space-y-5 text-base leading-relaxed text-ink-700">
            <p className="first-letter:mr-3 first-letter:mt-1 first-letter:float-left first-letter:font-display first-letter:text-6xl first-letter:font-semibold first-letter:text-gold-400">
              Signature Estates was founded in Dubai with a simple premise: the
              region&apos;s most significant property transactions deserve more
              attention than a listings portal can offer. Every buyer, tenant
              and investor receives the depth of service a significant
              decision warrants.
            </p>
            <p>
              We built our brokerage around a deliberately small portfolio of
              clients and properties — spanning Palm Jumeirah, Downtown Dubai, Business Bay
              and Dubai&apos;s emerging waterfront districts. That focus lets our
              advisors know each listing, each building and each
              neighborhood in genuine depth, rather than spreading attention
              across an unmanageable book of business.
            </p>
            <p>
              Today, our advisors work alongside legal and mortgage partners
              to guide clients from first viewing through to title transfer,
              with the same discretion and precision that earned our first
              client&apos;s trust — and the trust of every client since.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-20">
        <div className="mx-auto max-w-[100rem] px-5 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
            What Drives Us
          </p>
          <h2 className="gold-underline mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
            Our Values
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-sm border border-transparent bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-gold-400/30 hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.15)]"
              >
                <v.icon className="h-8 w-8 text-gold-500" strokeWidth={1.6} />
                <h3 className="mt-5 font-display text-xl font-semibold text-ink-900">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="mx-auto max-w-[100rem] px-5 py-20 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
                The People Behind It
              </p>
              <h2 className="gold-underline mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
                Meet the Team
              </h2>
            </div>
            <Link
              href="/agents"
              className="text-sm font-medium text-ink-700 underline decoration-gold-400 decoration-2 underline-offset-4 hover:text-gold-600"
            >
              View all advisors &rarr;
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {team.map((agent) => (
              <Link
                key={agent.id}
                href={`/agents/${agent.slug}`}
                className="group block overflow-hidden rounded-sm border border-gray-100 bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                  <AgentAvatar
                    photo={agent.photo}
                    name={agent.name}
                    sizes="(min-width: 640px) 25vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-gold-600">
                    {agent.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-gray-400">{agent.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CtaSection />
    </div>
  );
}
