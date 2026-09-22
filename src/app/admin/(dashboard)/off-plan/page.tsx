import { createClient } from "@/lib/supabase/server";
import OffPlanList from "@/components/admin/OffPlanList";
import { PageHeader, PrimaryButton } from "@/components/admin/ui";

export default async function AdminOffPlanPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("off_plan_projects")
    .select("id,name,status,area,city,starting_price,featured,images")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Off-Plan Projects"
        description="Pre-launch and under-construction developments."
        actions={<PrimaryButton href="/admin/off-plan/new">+ New Project</PrimaryButton>}
      />

      <div className="mt-6">
        <OffPlanList rows={projects ?? []} />
      </div>
    </div>
  );
}
