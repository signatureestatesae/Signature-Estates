import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AgentForm from "@/components/admin/AgentForm";
import { BackLink, PageHeader } from "@/components/admin/ui";

export default async function EditAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: agent } = await supabase.from("agents").select("*").eq("id", id).maybeSingle();

  if (!agent) notFound();

  return (
    <div>
      <BackLink href="/admin/agents" label="Back to agents" />
      <PageHeader title="Edit Agent" description={agent.name} />
      <div className="mt-6">
        <AgentForm
          initial={{
            id: agent.id,
            slug: agent.slug,
            name: agent.name,
            title: agent.title,
            location: agent.location,
            nationality: agent.nationality,
            rating: Number(agent.rating),
            reviews: agent.reviews,
            photo: agent.photo,
            phone: agent.phone,
            whatsapp: agent.whatsapp,
            email: agent.email,
            bio: agent.bio,
            languages: agent.languages ?? [],
            specialties: agent.specialties ?? [],
            featured: agent.featured,
          }}
        />
      </div>
    </div>
  );
}
