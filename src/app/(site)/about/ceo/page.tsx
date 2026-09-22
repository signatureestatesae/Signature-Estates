import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Quote, Target, TrendingUp } from "lucide-react";
import AgentAvatar from "@/components/AgentAvatar";
import CtaSection from "@/components/CtaSection";
import JsonLd, { breadcrumbJsonLd } from "@/components/JsonLd";
import { getAgentBySlug } from "@/data/agents";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fiza Shah — Chief Executive Officer",
  description:
    "A message from Fiza Shah, Chief Executive Officer of Signature Estates, on her vision for luxury real estate and investment across the GCC and worldwide.",
  alternates: { canonical: `${SITE_URL}/about/ceo` },
};

// The CEO's name, title and photo come from her agents row (slug "fiza-shah")
// so uploading a headshot in admin > Agents updates this page too, instead of
// requiring a code change. The quote/vision copy below is page-specific
// editorial content that doesn't fit the agent schema's short bio field, so
// it stays hardcoded here.
const CEO_SLUG = "fiza-shah";
const FALLBACK_CEO = { name: "Fiza Shah", title: "Chief Executive Officer", photo: "" };
const ceoQuote =
  "My vision is to build a truly international real estate platform — connecting clients with carefully selected luxury and investment opportunities across the GCC and worldwide.";

// Safety net only — admin saves push fresh data instantly via /api/revalidate.
export const revalidate = 3600;

const milestones = [
  {
    icon: TrendingUp,
    value: "10+",
    label: "Years in Real Estate",
  },
  {
    icon: Award,
    value: "GCC+",
    label: "International Market Reach",
  },
  {
    icon: Target,
    value: "HNW",
    label: "High-Net-Worth Clientele",
  },
];

function ceoJsonLd(ceo: { name: string; title: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: ceo.name,
    jobTitle: ceo.title,
    worksFor: {
      "@type": "Organization",
      name: "Signature Estates",
      url: SITE_URL,
    },
    url: `${SITE_URL}/about/ceo`,
  };
}

export default async function CeoPage() {
  const agent = await getAgentBySlug(CEO_SLUG);
  const ceo = {
    name: agent?.name ?? FALLBACK_CEO.name,
    title: agent?.title ?? FALLBACK_CEO.title,
    photo: agent?.photo ?? FALLBACK_CEO.photo,
    quote: ceoQuote,
  };

  return (
    <div>
      <JsonLd data={ceoJsonLd(ceo)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
          { name: "CEO", url: `${SITE_URL}/about/ceo` },
        ])}
      />

      <section className="mx-auto max-w-[100rem] px-5 pb-16 pt-8 lg:px-8 lg:pb-24">
        <nav className="text-sm text-[#6b7280]">
          <Link href="/" className="hover:text-gold-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/about" className="hover:text-gold-600">
            About
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink-600">CEO</span>
        </nav>

        <div className="mt-8 grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-sm border border-gold-400/25 bg-gray-100 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.25)]">
            <AgentAvatar photo={ceo.photo} name={ceo.name} sizes="(min-width: 1024px) 25vw, 90vw" priority />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500">
              Leadership
            </p>
            <h1 className="gold-underline mt-4 font-display text-h1 font-semibold text-ink-900">
              A Message from Our CEO.
            </h1>
            <p className="mt-2 text-lg font-medium text-ink-700">{ceo.name}</p>
            <p className="text-sm text-[#6b7280]">{ceo.title}</p>

            <blockquote className="relative mt-7 max-w-xl border-l-2 border-gold-400 pl-6">
              <Quote className="absolute -left-1 -top-2 h-6 w-6 -translate-x-1/2 fill-stone-50 text-gold-400" strokeWidth={1.5} />
              <p className="text-lg italic leading-relaxed text-ink-700">
                &ldquo;{ceo.quote}&rdquo;
              </p>
            </blockquote>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-sm bg-ink-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950"
              >
                Get in Touch
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              <Link
                href="/agents"
                className="inline-flex items-center rounded-sm border border-ink-900/15 px-7 py-3 text-sm font-medium text-ink-900 transition hover:border-gold-500 hover:text-gold-700"
              >
                Meet the Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-16">
        <div className="mx-auto grid max-w-[100rem] grid-cols-1 divide-y divide-ink-900/10 px-5 sm:grid-cols-3 sm:divide-y-0 sm:divide-x lg:px-8">
          {milestones.map((m) => (
            <div key={m.label} className="flex flex-col items-center px-2 py-6 text-center sm:py-0">
              <m.icon className="h-6 w-6 text-gold-500" strokeWidth={1.6} />
              <p className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">{m.value}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.1em] text-[#6b7280]">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[100rem] px-5 py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <h2 className="gold-underline h-fit font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
            Our Vision
          </h2>
          <div className="space-y-5 text-base leading-relaxed text-ink-700">
            <p className="first-letter:mr-3 first-letter:mt-1 first-letter:float-left first-letter:font-display first-letter:text-6xl first-letter:font-semibold first-letter:text-gold-400">
              With over a decade of experience in the real estate industry,
              I&apos;ve built my career across the GCC and international
              property markets, with a strong focus on luxury real estate,
              investment opportunities and high-value property portfolios.
              Along the way, I&apos;ve worked closely with high-net-worth
              individuals, private investors, international buyers and
              discerning clients seeking both lifestyle and
              investment-driven opportunities.
            </p>
            <p>
              My expertise spans luxury residential properties, premium
              developments, investment assets, portfolio management,
              international sales and strategic property advisory. Exposure
              across the GCC and key international markets has given me a
              global perspective, while staying close to the market dynamics
              and investor requirements specific to this region.
            </p>
            <p>
              I&apos;ve built Signature Estates&apos; client relationships
              the same way I built my own career — through trust, discretion,
              professionalism and personalized advisory. Understanding each
              client&apos;s objectives, and identifying opportunities aligned
              with their investment strategy, is what turns a single
              transaction into a long-term relationship across markets.
            </p>
            <p>
              As Chief Executive Officer, my vision is to build a truly
              international real estate platform — connecting clients with
              carefully selected luxury and investment opportunities across
              the GCC and worldwide. Under this leadership, Signature Estates
              is committed to an elevated standard of service defined by
              market expertise, transparency, integrity and an exceptional
              client experience, so we remain a trusted partner for investors
              and property owners locally, regionally and internationally.
            </p>
          </div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
