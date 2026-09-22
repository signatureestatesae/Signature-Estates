import { createClient } from "@/lib/supabase/server";
import CareersList from "@/components/admin/CareersList";
import { PageHeader, PrimaryButton } from "@/components/admin/ui";

export default async function AdminCareersPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from("job_postings")
    .select("id,title,department,location,employment_type,published,created_at")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Careers"
        description="Job postings shown on /careers."
        actions={<PrimaryButton href="/admin/careers/new">+ New Posting</PrimaryButton>}
      />

      <div className="mt-6">
        <CareersList rows={jobs ?? []} />
      </div>
    </div>
  );
}
