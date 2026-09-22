import type { Metadata } from "next";
import Link from "next/link";
import { getAgents } from "@/data/agents";
import { getOffPlanProjectCountsByAgent } from "@/data/offplan";
import AgentsExplorer from "@/components/AgentsExplorer";
import AgentsCTA from "@/components/AgentsCTA";
import LeadershipSpotlight from "@/components/LeadershipSpotlight";
import Reveal from "@/components/Reveal";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Agents",
  description: "Meet the Signature Estates advisory team representing Dubai's finest properties.",
  alternates: { canonical: `${SITE_URL}/agents` },
};

// Safety net only — admin saves push fresh data instantly via /api/revalidate.
export const revalidate = 3600;

export default async function AgentsPage() {
  const [agentsList, projectsByAgent] = await Promise.all([getAgents(), getOffPlanProjectCountsByAgent()]);
  const agents = agentsList.map((a) => ({
    ...a,
    listingsCount: projectsByAgent[a.id] ?? 0,
  }));
  const leader = agents.find((a) => a.featured);
  const avgRating = agents.length
    ? agents.reduce((sum, a) => sum + a.rating, 0) / agents.length
    : 0;

  return (
    <>
      <div className="mx-auto max-w-[100rem] px-5 py-10 lg:px-8">
        <nav className="text-sm text-[#6b7280]">
          <Link href="/" className="hover:text-gold-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink-600">Agents</span>
        </nav>

        <div className="mt-4 flex items-center gap-6 border-b border-[#e8e8e8] pb-3">
          <span className="border-b-2 border-[#111] pb-3 -mb-3 text-sm font-medium text-[#111]">
            Find an Agent
          </span>
          <Link
            href="/careers"
            className="pb-3 text-sm font-medium text-[#6b7280] transition hover:text-[#111]"
          >
            Join Our Team
          </Link>
        </div>

        <Reveal>
          <h1 className="mt-5 font-display text-h1 font-semibold text-ink-900">
            Work with Dubai&apos;s finest property advisors.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#6b7280]">
            {agents.length} advisors, hand-selected for market depth and a track record of
            closing significant transactions &middot; {avgRating.toFixed(1)}&#9733; average rating
          </p>
        </Reveal>

        {leader && (
          <Reveal delay={80}>
            <LeadershipSpotlight agent={leader} />
          </Reveal>
        )}

        <AgentsExplorer agents={agents} spotlightId={leader?.id} />
      </div>

      <AgentsCTA />
    </>
  );
}
