import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, Mail, MessageCircle, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { supabaseServiceRole } from "@/lib/supabase/serviceRole";
import { applicationStatusTone, Badge, Card } from "@/components/admin/ui";
import { formatDate } from "@/lib/format";
import JobApplicationActions from "@/components/admin/JobApplicationActions";

// Resumes live in a private bucket with no read policies at all (see the
// careers migration), so even an authenticated admin session can't read
// them directly — only the service role key can, which is what mints this
// short-lived signed URL.
const SIGNED_URL_TTL_SECONDS = 60 * 10;

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: application } = await supabase.from("job_applications").select("*").eq("id", id).maybeSingle();

  if (!application) notFound();

  const { data: signedUrlData } = await supabaseServiceRole.storage
    .from("resumes")
    .createSignedUrl(application.cv_path, SIGNED_URL_TTL_SECONDS, {
      download: application.cv_filename || true,
    });

  return (
    <div className="max-w-2xl">
      <Link href="/admin/applications" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
        Back to applications
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-ink-900">{application.name}</h1>
            <Badge tone={applicationStatusTone(application.status)}>{application.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {application.job_title || "General Application"} &middot; {formatDate(application.created_at)}
          </p>
        </div>
        <JobApplicationActions id={application.id} status={application.status} />
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">CV / Resume</h2>
        {signedUrlData?.signedUrl ? (
          <a
            href={signedUrlData.signedUrl}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-ink-900 transition hover:border-gold-500 hover:text-gold-700"
          >
            <Download className="h-4 w-4" strokeWidth={1.8} />
            {application.cv_filename || "Download CV"}
          </a>
        ) : (
          <p className="mt-2 text-sm text-gray-400">Could not generate a download link. Try refreshing.</p>
        )}
      </Card>

      {application.message && (
        <Card className="mt-4 p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Message</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-800">{application.message}</p>
        </Card>
      )}

      <Card className="mt-4 p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Contact</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {application.phone && (
            <a
              href={`tel:${application.phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-ink-900 transition hover:border-gold-500 hover:text-gold-700"
            >
              <Phone className="h-4 w-4" strokeWidth={1.8} />
              {application.phone}
            </a>
          )}
          {application.email && (
            <a
              href={`mailto:${application.email}`}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-ink-900 transition hover:border-gold-500 hover:text-gold-700"
            >
              <Mail className="h-4 w-4" strokeWidth={1.8} />
              {application.email}
            </a>
          )}
          {application.phone && (
            <a
              href={`https://wa.me/${application.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
              WhatsApp
            </a>
          )}
        </div>
      </Card>

      {application.job_posting_id && (
        <Card className="mt-4 p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Applied For</h2>
          <Link
            href={`/admin/careers/${application.job_posting_id}`}
            className="mt-2 flex items-center gap-1 text-sm text-gold-600 hover:underline"
          >
            {application.job_title}
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
          </Link>
        </Card>
      )}
    </div>
  );
}
