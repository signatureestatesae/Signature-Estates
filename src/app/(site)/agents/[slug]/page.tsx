import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgentBySlug } from "@/data/agents";
import { getOffPlanProjectsByAgentId } from "@/data/offplan";
import AgentSidebar from "@/components/AgentSidebar";
import AgentListingsGrid from "@/components/AgentListingsGrid";
import JsonLd, { breadcrumbJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import type { Agent } from "@/data/types";

function agentJsonLd(agent: Agent) {
  const url = `${SITE_URL}/agents/${agent.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: agent.name,
    jobTitle: agent.title,
    description: agent.bio,
    url,
    image: agent.photo || undefined,
    telephone: agent.phone || undefined,
    email: agent.email || undefined,
    // Deliberately no aggregateRating here — Google's structured-data policy
    // requires review/rating markup to reflect genuine, disclosed customer
    // reviews, and this rating field's provenance isn't verified as that.
  };
}

// Safety net only — admin saves push fresh data instantly via /api/revalidate.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgentBySlug(slug);
  if (!agent) return {};
  return {
    title: `${agent.name} — ${agent.title} | Signature Estates`,
    description: agent.bio,
    alternates: { canonical: `${SITE_URL}/agents/${agent.slug}` },
  };
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agent = await getAgentBySlug(slug);
  if (!agent) notFound();

  const projects = await getOffPlanProjectsByAgentId(agent.id);

  return (
    <div className="mx-auto max-w-[100rem] px-5 py-10 lg:px-8">
      <JsonLd data={agentJsonLd(agent)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Agents", url: `${SITE_URL}/agents` },
          { name: agent.name, url: `${SITE_URL}/agents/${agent.slug}` },
        ])}
      />

      <nav className="text-sm text-[#6b7280]">
        <Link href="/" className="hover:text-gold-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/agents" className="hover:text-gold-600">
          Agents
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-600">{agent.name}</span>
      </nav>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start">
        <AgentSidebar agent={agent} />
        <div className="flex-1">
          <AgentListingsGrid projects={projects} />
        </div>
      </div>
    </div>
  );
}
