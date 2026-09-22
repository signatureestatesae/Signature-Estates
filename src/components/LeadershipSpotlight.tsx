import Link from "next/link";
import { Mail, MessageCircle, Star } from "lucide-react";
import type { Agent } from "@/data/types";
import AgentAvatar from "./AgentAvatar";

/** Bios are stored with light markdown (**bold**, blank-line paragraphs) — pull a clean opening line for a compact card. */
function bioExcerpt(bio: string): string {
  const clean = bio.replace(/\*\*/g, "").trim();
  const [first] = clean.split(/\n\s*\n/);
  return first.trim();
}

export default function LeadershipSpotlight({ agent }: { agent: Agent }) {
  const firstName = agent.name.split(" ")[0];

  return (
    <section className="mt-6 overflow-hidden rounded-sm border border-gold-200/70 bg-white shadow-[0_8px_40px_-12px_rgba(184,146,63,0.25)] lg:flex">
      <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:h-auto lg:w-[300px] lg:shrink-0">
        <AgentAvatar
          photo={agent.photo}
          name={agent.name}
          priority
          sizes="(min-width: 1024px) 300px, 100vw"
          className="object-cover object-top"
        />
      </div>

      <div className="flex flex-1 flex-col justify-center p-7 sm:p-9">
        <span className="w-fit bg-gold-50 px-3 py-1 text-eyebrow font-semibold uppercase tracking-eyebrow text-gold-700">
          Leadership
        </span>

        <h2 className="mt-3 font-display text-h2 font-bold text-ink-900">
          {agent.name}
        </h2>
        <p className="mt-1 text-base font-medium text-gold-600">{agent.title}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-500">
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-gold-400 text-gold-400" strokeWidth={0} />
            <span className="font-semibold text-ink-900">{agent.rating.toFixed(1)}</span>
            <span>({agent.reviews} reviews)</span>
          </span>
          {typeof agent.listingsCount === "number" && agent.listingsCount > 0 && (
            <span>{agent.listingsCount} active projects</span>
          )}
          {agent.location && <span>{agent.location}</span>}
        </div>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-600">
          {bioExcerpt(agent.bio)}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={`https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(
              `Hi ${firstName}, I'd like to get in touch about a property.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center gap-2 rounded-sm bg-gold-500 px-5 text-sm font-semibold text-ink-950 transition hover:bg-gold-400"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2} />
            Get in Touch
          </a>
          <a
            href={`mailto:${agent.email}`}
            className="flex h-11 items-center justify-center gap-2 rounded-sm border border-ink-900/15 px-5 text-sm font-semibold text-ink-900 transition hover:border-gold-500 hover:text-gold-600"
          >
            <Mail className="h-4 w-4" strokeWidth={1.8} />
            Email Me
          </a>
          <Link
            href={`/agents/${agent.slug}`}
            className="text-sm font-medium text-ink-500 underline decoration-gold-400 decoration-2 underline-offset-4 transition hover:text-gold-600"
          >
            View Full Profile &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
