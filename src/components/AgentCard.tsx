import Link from "next/link";
import { Briefcase, Globe, MapPin, Phone, Star } from "lucide-react";
import type { Agent } from "@/data/types";
import AgentAvatar from "./AgentAvatar";

const SENIOR_TITLES = ["Lead", "Director", "Head", "CEO", "Founder"];

export default function AgentCard({ agent }: { agent: Agent }) {
  const firstName = agent.name.split(" ")[0];
  const listingsCount = agent.listingsCount ?? 0;
  const badge = SENIOR_TITLES.some((t) => agent.title.includes(t)) ? agent.title : null;

  return (
    <div className="group overflow-hidden rounded-sm border border-[#e8e8e8] bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/agents/${agent.slug}`} className="relative block aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <AgentAvatar
          photo={agent.photo}
          name={agent.name}
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-sm bg-[#f6eedc] px-3 py-1 text-xs font-semibold text-[#1a1a1a] shadow-sm">
            {badge}
          </span>
        )}
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/agents/${agent.slug}`} className="text-lg font-semibold text-[#111] hover:text-gold-600">
            {agent.name}
          </Link>
          <span className="flex shrink-0 items-center gap-1 text-sm">
            <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" strokeWidth={0} />
            <span className="font-semibold text-[#111]">{agent.rating.toFixed(1)}</span>
            <span className="text-gray-400">/5</span>
          </span>
        </div>
        <p className="mt-1 text-sm text-[#6b7280]">{agent.title}</p>

        <div className="my-3 border-t border-[#f0f0f0]" />

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-[#6b7280]">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
            {agent.location}
          </span>
          <span className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" strokeWidth={1.8} />
            {agent.languages.slice(0, 2).join(" · ")}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" strokeWidth={1.8} />
            {listingsCount} project{listingsCount === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/agents/${agent.slug}`}
            className="flex h-11 flex-1 items-center justify-center rounded-sm bg-ink-900 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950"
          >
            Work with {firstName}
          </Link>
          <a
            href={`https://wa.me/${agent.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${firstName}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-[#e8e8e8] text-ink-700 transition hover:border-gold-500 hover:text-gold-600"
          >
            <Phone className="h-4 w-4" strokeWidth={1.8} />
          </a>
        </div>
      </div>
    </div>
  );
}
