import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import JobApplicationsList from "@/components/admin/JobApplicationsList";
import { PageHeader } from "@/components/admin/ui";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
];

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("job_applications")
    .select("id,name,email,phone,job_title,status,created_at")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data: applications } = await query;

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Candidates who applied via /careers, with their CV emailed to you automatically."
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const active = (status ?? "") === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.value ? `/admin/applications?status=${tab.value}` : "/admin/applications"}
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
        <JobApplicationsList rows={applications ?? []} />
      </div>
    </div>
  );
}
