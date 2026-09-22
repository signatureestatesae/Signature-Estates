import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, MessageCircle, Phone, ExternalLink, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge, Card, leadSourceLabel, leadStatusTone } from "@/components/admin/ui";
import { formatDate } from "@/lib/format";
import LeadActions from "@/components/admin/LeadActions";

function sourceHref(source: string, sourceReference: string | null) {
  if (!sourceReference) return null;
  if (source === "off-plan") return `/off-plan/${sourceReference}`;
  if (source.startsWith("contact")) return `/agents/${sourceReference}`;
  return null;
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();

  if (!lead) notFound();

  const href = sourceHref(lead.source, lead.source_reference);

  return (
    <div className="max-w-2xl">
      <Link href="/admin/leads" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
        Back to leads
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-ink-900">{lead.name}</h1>
            <Badge tone={leadStatusTone(lead.status)}>{lead.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {leadSourceLabel(lead.source)} &middot; {formatDate(lead.created_at)}
          </p>
        </div>
        <LeadActions id={lead.id} status={lead.status} />
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Message</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-800">{lead.message}</p>
      </Card>

      <Card className="mt-4 p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Contact</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {lead.phone && (
            <a
              href={`tel:${lead.phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-ink-900 transition hover:border-gold-500 hover:text-gold-700"
            >
              <Phone className="h-4 w-4" strokeWidth={1.8} />
              {lead.phone}
            </a>
          )}
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-ink-900 transition hover:border-gold-500 hover:text-gold-700"
            >
              <Mail className="h-4 w-4" strokeWidth={1.8} />
              {lead.email}
            </a>
          )}
          {lead.phone && (
            <a
              href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
              WhatsApp
            </a>
          )}
        </div>
      </Card>

      <Card className="mt-4 p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Context</h2>
        <dl className="mt-3 space-y-2 text-sm">
          {lead.interest && (
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500">Interested in</dt>
              <dd className="capitalize text-ink-900">{lead.interest}</dd>
            </div>
          )}
          {href && (
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500">Related to</dt>
              <dd>
                <Link href={href} target="_blank" className="flex items-center gap-1 text-gold-600 hover:underline">
                  {lead.source_reference}
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
                </Link>
              </dd>
            </div>
          )}
          {lead.page_url && (
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500">Submitted from</dt>
              <dd className="max-w-xs truncate text-ink-900">{lead.page_url}</dd>
            </div>
          )}
        </dl>
      </Card>
    </div>
  );
}
