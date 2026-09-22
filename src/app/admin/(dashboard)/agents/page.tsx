import { createClient } from "@/lib/supabase/server";
import AgentsList from "@/components/admin/AgentsList";
import { PageHeader, PrimaryButton } from "@/components/admin/ui";

export default async function AdminAgentsPage() {
  const supabase = await createClient();
  const { data: agents } = await supabase
    .from("agents")
    .select("id,name,title,location,email,rating,featured,photo,sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Agents"
        description="The advisory team shown on /agents."
        actions={<PrimaryButton href="/admin/agents/new">+ New Agent</PrimaryButton>}
      />

      <div className="mt-6">
        <AgentsList rows={agents ?? []} />
      </div>
    </div>
  );
}
