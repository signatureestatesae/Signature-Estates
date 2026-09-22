import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CareerForm from "@/components/admin/CareerForm";
import { BackLink, PageHeader } from "@/components/admin/ui";

export default async function EditCareerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: job } = await supabase.from("job_postings").select("*").eq("id", id).maybeSingle();

  if (!job) notFound();

  return (
    <div>
      <BackLink href="/admin/careers" label="Back to careers" />
      <PageHeader title="Edit Job Posting" description={job.title} />
      <div className="mt-6">
        <CareerForm
          initial={{
            id: job.id,
            slug: job.slug,
            title: job.title,
            department: job.department,
            location: job.location,
            employment_type: job.employment_type,
            summary: job.summary,
            description: job.description,
            published: job.published,
          }}
        />
      </div>
    </div>
  );
}
