import AgentForm from "@/components/admin/AgentForm";
import { BackLink, PageHeader } from "@/components/admin/ui";

export default function NewAgentPage() {
  return (
    <div>
      <BackLink href="/admin/agents" label="Back to agents" />
      <PageHeader title="New Agent" />
      <div className="mt-6">
        <AgentForm />
      </div>
    </div>
  );
}
