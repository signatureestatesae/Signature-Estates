import CareerForm from "@/components/admin/CareerForm";
import { BackLink, PageHeader } from "@/components/admin/ui";

export default function NewCareerPage() {
  return (
    <div>
      <BackLink href="/admin/careers" label="Back to careers" />
      <PageHeader title="New Job Posting" />
      <div className="mt-6">
        <CareerForm />
      </div>
    </div>
  );
}
