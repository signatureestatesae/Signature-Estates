import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileCheck2, KeyRound, TrendingUp, UserCheck } from "lucide-react";
import { getAgents } from "@/data/agents";
import { getOffPlanProjects } from "@/data/offplan";
import Reveal from "./Reveal";

const points = [
  {
    icon: UserCheck,
    title: "One Advisor, Start to Finish",
    description:
      "No call centers, no rotating desk. The advisor who takes your first call is the one who sees the deal through to signature.",
  },
  {
    icon: KeyRound,
    title: "Off-Market Access",
    description:
      "A meaningful share of what we show clients never reaches the public portals — sourced through direct developer relationships.",
  },
  {
    icon: FileCheck2,
    title: "Handled End-to-End",
    description:
      "Legal review, mortgage introductions and handover coordination, managed in-house so nothing falls between agencies.",
  },
  {
    icon: TrendingUp,
    title: "Real Local Intelligence",
    description:
      "Advisors who track pricing movement and inventory across Palm Jumeirah, Downtown Dubai and Dubai Marina daily — not just when a project launches.",
  },
];

export default async function WhyChooseUs() {
  const [agents, projects] = await Promise.all([getAgents(), getOffPlanProjects()]);
  const avgRating = agents.length
    ? agents.reduce((sum, a) => sum + a.rating, 0) / agents.length
    : 0;

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.2fr]">
        <Reveal className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
            Why Signature Estates
          </p>
          <h2 className="mt-3 font-display text-h2 font-semibold text-ink-900">
            Real estate advisory, without the noise.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-500">
            We take on fewer clients than most agencies, by choice. It means
            every search, negotiation and closing gets the full attention of
            one advisor — not a shared pipeline.
          </p>

          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-2 self-start text-sm font-medium text-ink-700 underline decoration-gold-400 decoration-2 underline-offset-4 transition hover:text-gold-600"
          >
            More about our approach
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>

          <div className="relative mt-10 min-h-[280px] flex-1 overflow-hidden rounded-sm">
            <Image
              src="/images/why-choose-us/advisor-meeting.jpg"
              alt="A Signature Estates advisor meeting with a client"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-4 rounded-sm border border-white/40" />
          </div>

          {agents.length > 0 && (
            <div className="relative z-10 -mt-8 ml-6 flex w-fit items-center gap-5 rounded-sm bg-white p-4 shadow-lg">
              <div>
                <p className="font-display text-2xl font-semibold text-ink-900">{agents.length}</p>
                <p className="text-xs text-ink-500">Advisors on the ground</p>
              </div>
              <div className="h-8 w-px bg-ink-900/10" />
              <div>
                <p className="font-display text-2xl font-semibold text-ink-900">
                  {avgRating.toFixed(1)}&#9733;
                </p>
                <p className="text-xs text-ink-500">Average client rating</p>
              </div>
              {projects.length > 0 && (
                <>
                  <div className="hidden h-8 w-px bg-ink-900/10 sm:block" />
                  <div className="hidden sm:block">
                    <p className="font-display text-2xl font-semibold text-ink-900">
                      {projects.length}+
                    </p>
                    <p className="text-xs text-ink-500">Active projects</p>
                  </div>
                </>
              )}
            </div>
          )}
        </Reveal>

        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {points.map((point, i) => (
            <Reveal
              key={point.title}
              delay={i * 80}
              className="group rounded-sm border border-ink-900/8 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-[0_20px_40px_-20px_rgba(184,146,63,0.35)]"
            >
              <span className="flex h-10 w-10 items-center justify-center bg-gold-50 text-gold-600 transition-colors duration-300 group-hover:bg-gold-400 group-hover:text-white">
                <point.icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <dt className="mt-4 font-display text-lg font-semibold text-ink-900">
                {point.title}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-500">
                {point.description}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
