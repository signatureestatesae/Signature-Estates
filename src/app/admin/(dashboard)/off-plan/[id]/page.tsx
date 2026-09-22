import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OffPlanForm from "@/components/admin/OffPlanForm";
import { BackLink, PageHeader } from "@/components/admin/ui";

export default async function EditOffPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: agents }] = await Promise.all([
    supabase.from("off_plan_projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("agents").select("id,name").order("name"),
  ]);

  if (!project) notFound();

  return (
    <div>
      <BackLink href="/admin/off-plan" label="Back to off-plan projects" />
      <PageHeader title="Edit Off-Plan Project" description={project.name} />
      <div className="mt-6">
        <OffPlanForm
          initial={{
            id: project.id,
            slug: project.slug,
            name: project.name,
            developer: project.developer,
            status: project.status,
            area: project.area,
            city: project.city,
            country: project.country,
            handover: project.handover,
            starting_price: Number(project.starting_price),
            unit_types: project.unit_types ?? [],
            min_size: Number(project.min_size),
            max_size: Number(project.max_size),
            payment_plan: project.payment_plan,
            description: project.description,
            amenities: project.amenities ?? [],
            images: project.images ?? [],
            featured: project.featured,
            reference: project.reference,
            agent_id: project.agent_id,
            lat: project.lat != null ? Number(project.lat) : null,
            lng: project.lng != null ? Number(project.lng) : null,
            brochure_url: project.brochure_url,
          }}
          agents={agents ?? []}
        />
      </div>
    </div>
  );
}
