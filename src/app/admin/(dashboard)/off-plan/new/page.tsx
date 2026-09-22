import { createClient } from "@/lib/supabase/server";
import OffPlanForm from "@/components/admin/OffPlanForm";
import { BackLink, PageHeader } from "@/components/admin/ui";

export default async function NewOffPlanPage() {
  const supabase = await createClient();
  const { data: agents } = await supabase.from("agents").select("id,name").order("name");

  return (
    <div>
      <BackLink href="/admin/off-plan" label="Back to off-plan projects" />
      <PageHeader title="New Off-Plan Project" />
      <div className="mt-6">
        <OffPlanForm agents={agents ?? []} />
      </div>
    </div>
  );
}
