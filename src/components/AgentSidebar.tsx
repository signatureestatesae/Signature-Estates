import Link from "next/link";
import { BadgeCheck, Mail, MapPin, MessageCircle, Star } from "lucide-react";
import type { Agent } from "@/data/types";
import AgentAvatar from "./AgentAvatar";

export default function AgentSidebar({ agent }: { agent: Agent }) {
  const firstName = agent.name.split(" ")[0];

  return (
    <aside className="w-full shrink-0 rounded-sm border border-[#e8e8e8] bg-white p-5 lg:sticky lg:top-24 lg:w-[300px] xl:w-[320px]">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-gray-100">
        <AgentAvatar photo={agent.photo} name={agent.name} sizes="320px" />
      </div>

      <h1 className="mt-4 font-display text-h1 font-semibold text-[#111]">{agent.name}</h1>
      <p className="mt-0.5 text-sm text-[#6b7280]">{agent.title}</p>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-[#6b7280]">
        <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
        {agent.location}
      </p>

      <div className="my-4 border-t border-[#f0f0f0]" />

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-gold-400 text-gold-400" strokeWidth={0} />
          <span className="font-semibold text-[#111]">{agent.rating.toFixed(1)}</span>
          <span className="text-gray-400">/5</span>
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-gold-500">
          <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
          {agent.reviews} Verified Reviews
        </span>
      </div>

      <div className="my-4 border-t border-[#f0f0f0]" />

      <h2 className="text-sm font-semibold text-[#111]">Connect with {agent.name}</h2>
      <div className="mt-3 flex flex-col gap-2">
        <a
          href={`mailto:${agent.email}`}
          className="flex h-10 items-center justify-center gap-2 rounded-sm border border-[#e8e8e8] text-sm font-medium text-ink-700 transition hover:border-gold-500 hover:text-gold-600"
        >
          <Mail className="h-4 w-4" strokeWidth={1.8} />
          Write an email
        </a>
        <a
          href={`https://wa.me/${agent.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 items-center justify-center gap-2 rounded-sm border border-[#e8e8e8] text-sm font-medium text-ink-700 transition hover:border-gold-500 hover:text-gold-600"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
          Send a message
        </a>
      </div>

      <div className="my-4 border-t border-[#f0f0f0]" />

      <h2 className="text-sm font-semibold text-[#111]">Professional Information</h2>
      <dl className="mt-3 flex flex-col gap-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-[#6b7280]">Phone</dt>
          <dd>
            <a href={`tel:${agent.phone.replace(/\s+/g, "")}`} className="text-[#111] hover:text-gold-600">
              {agent.phone}
            </a>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-[#6b7280]">Email</dt>
          <dd className="truncate">
            <a href={`mailto:${agent.email}`} className="text-[#111] hover:text-gold-600">
              {agent.email}
            </a>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-[#6b7280]">Nationality</dt>
          <dd className="text-[#111]">{agent.nationality}</dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="shrink-0 text-[#6b7280]">Spoken Languages</dt>
          <dd className="text-right text-[#111]">{agent.languages.join(", ")}</dd>
        </div>
      </dl>

      <Link
        href={`https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(`Hi ${firstName}, I'd like to start working with you.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex h-11 w-full items-center justify-center rounded-sm bg-ink-900 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950"
      >
        Start working with {firstName}
      </Link>
      <Link
        href={`/contact?intent=review&agent=${agent.slug}`}
        className="mt-2 flex h-10 w-full items-center justify-center rounded-sm border border-[#e8e8e8] text-sm font-medium text-ink-700 transition hover:border-gold-500 hover:text-gold-600"
      >
        Rate this Agent
      </Link>
    </aside>
  );
}
