import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LeadsList from "@/components/admin/LeadsList";
import { PageHeader } from "@/components/admin/ui";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "closed", label: "Closed" },
];

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select("id,name,phone,email,message,source,status,created_at")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data: leads } = await query;

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Enquiries submitted from the property, off-plan and contact forms."
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const active = (status ?? "") === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.value ? `/admin/leads?status=${tab.value}` : "/admin/leads"}
              className={`rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium transition ${
                active ? "bg-ink-900 text-white" : "bg-white text-gray-600 hover:text-ink-900"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-4">
        <LeadsList rows={leads ?? []} />
      </div>
    </div>
  );
}
