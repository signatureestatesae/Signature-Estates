import Link from "next/link";
import {
  Landmark,
  Users,
  Newspaper,
  Inbox,
  Plus,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge, Card, EmptyState, leadSourceLabel, leadStatusTone, timeAgo } from "@/components/admin/ui";

const STAT_CARDS = [
  { href: "/admin/leads", label: "New Leads", table: "leads" as const, icon: Inbox, filterNew: true },
  { href: "/admin/off-plan", label: "Off-Plan Projects", table: "off_plan_projects" as const, icon: Landmark },
  { href: "/admin/agents", label: "Agents", table: "agents" as const, icon: Users },
  { href: "/admin/blog", label: "Blog Posts", table: "blog_posts" as const, icon: Newspaper },
];

const QUICK_ACTIONS = [
  { href: "/admin/off-plan/new", label: "New Off-Plan Project" },
  { href: "/admin/agents/new", label: "New Agent" },
  { href: "/admin/blog/new", label: "New Blog Post" },
];

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [counts, { data: recentLeads }] = await Promise.all([
    Promise.all(
      STAT_CARDS.map(async (card) => {
        let query = supabase.from(card.table).select("id", { count: "exact", head: true });
        if (card.filterNew) query = query.eq("status", "new");
        const { count } = await query;
        return count ?? 0;
      }),
    ),
    supabase
      .from("leads")
      .select("id,name,message,source,status,created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Manage everything on the Signature Estates site.</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50 text-gold-600">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-gold-500" />
              </div>
              <p className="mt-4 font-display text-3xl font-semibold text-ink-900">{counts[i]}</p>
              <p className="mt-1 text-sm text-gray-500">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-ink-800 transition hover:border-gold-400 hover:text-gold-700"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            {action.label}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-900">Recent Leads</h2>
          <Link href="/admin/leads" className="text-sm font-medium text-gold-600 hover:underline">
            View all &rarr;
          </Link>
        </div>

        <Card className="mt-4">
          {(recentLeads ?? []).length === 0 ? (
            <EmptyState
              icon={<Inbox className="h-10 w-10" strokeWidth={1.3} />}
              title="No leads yet"
              description="Enquiries from the off-plan and contact forms will show up here."
            />
          ) : (
            <ul className="divide-y divide-gray-100">
              {(recentLeads ?? []).map((lead) => (
                <li key={lead.id}>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition hover:bg-stone-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white">
                      {lead.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-ink-900">{lead.name}</p>
                        <Badge tone={leadStatusTone(lead.status)}>{lead.status}</Badge>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {leadSourceLabel(lead.source)} &middot; {lead.message}
                      </p>
                    </div>
                    <p className="shrink-0 text-xs text-gray-400">{timeAgo(lead.created_at)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
