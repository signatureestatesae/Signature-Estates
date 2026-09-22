import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Clock, MapPin } from "lucide-react";
import { getPublishedJobPostingBySlug } from "@/data/careers";
import CareerApplicationForm from "@/components/CareerApplicationForm";
import { truncateForMeta } from "@/lib/format";
import { SITE_URL } from "@/lib/site";

// Safety net only — admin saves push fresh data instantly via /api/revalidate.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getPublishedJobPostingBySlug(slug);
  if (!job) return {};
  const description = truncateForMeta(job.summary || job.description || `${job.title} at Signature Estates.`);
  const url = `${SITE_URL}/careers/${job.slug}`;
  return {
    title: job.title,
    description,
    alternates: { canonical: url },
    openGraph: { title: job.title, description, url },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getPublishedJobPostingBySlug(slug);
  if (!job) notFound();

  return (
    <div className="mx-auto max-w-[100rem] px-5 py-10 lg:px-8">
      <nav className="text-sm text-[#6b7280]">
        <Link href="/" className="hover:text-gold-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/careers" className="hover:text-gold-600">
          Careers
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-600">{job.title}</span>
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div>
          {job.department && (
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
              {job.department}
            </p>
          )}
          <h1 className="mt-3 font-display text-h1 font-semibold text-ink-900">{job.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-gray-500">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" strokeWidth={1.8} />
                {job.location}
              </span>
            )}
            {job.employmentType && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" strokeWidth={1.8} />
                {job.employmentType}
              </span>
            )}
          </div>

          {job.summary && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#6b7280]">{job.summary}</p>}

          <div className="prose prose-sm prose-neutral mt-8 max-w-none prose-headings:font-display prose-headings:text-ink-900 prose-a:text-gold-600 prose-p:leading-relaxed prose-p:text-gray-600">
            <ReactMarkdown>{job.description}</ReactMarkdown>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <CareerApplicationForm job={{ id: job.id, title: job.title }} />
        </aside>
      </div>
    </div>
  );
}
