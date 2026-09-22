import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { getPublishedJobPostings } from "@/data/careers";
import CareerApplicationForm from "@/components/CareerApplicationForm";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Signature Estates advisory team representing Dubai's finest properties.",
  alternates: { canonical: `${SITE_URL}/careers` },
};

// Safety net only — admin saves push fresh data instantly via /api/revalidate.
export const revalidate = 3600;

export default async function CareersPage() {
  const jobs = await getPublishedJobPostings();

  return (
    <div>
      <div className="mx-auto max-w-[100rem] px-5 py-10 lg:px-8">
        <nav className="text-sm text-[#6b7280]">
          <Link href="/" className="hover:text-gold-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/agents" className="hover:text-gold-600">
            Agents
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink-600">Careers</span>
        </nav>

        <div className="mt-4 flex items-center gap-6 border-b border-[#e8e8e8] pb-3">
          <Link
            href="/agents"
            className="pb-3 text-sm font-medium text-[#6b7280] transition hover:text-[#111]"
          >
            Find an Agent
          </Link>
          <span className="border-b-2 border-[#111] pb-3 -mb-3 text-sm font-medium text-[#111]">
            Join Our Team
          </span>
        </div>

        <h1 className="mt-6 max-w-2xl font-display text-h1 font-semibold text-ink-900">
          Build your career in Dubai&apos;s luxury property market.
        </h1>
        <p className="mt-3 max-w-xl text-lg text-[#6b7280]">
          We back our advisors with a curated portfolio, a trusted brand and a
          deliberately small client roster — so every deal gets the attention
          it deserves.
        </p>

        {jobs.length > 0 ? (
          <div className="mt-10 divide-y divide-gray-100 border-y border-gray-100">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/careers/${job.slug}`}
                className="group flex flex-col gap-2 py-6 transition hover:bg-stone-50 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div>
                  <p className="font-display text-lg font-semibold text-ink-900 group-hover:text-gold-600">
                    {job.title}
                  </p>
                  {job.summary && <p className="mt-1 max-w-xl text-sm text-[#6b7280]">{job.summary}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                    {job.department && <span>{job.department}</span>}
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                        {job.location}
                      </span>
                    )}
                    {job.employmentType && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" strokeWidth={1.8} />
                        {job.employmentType}
                      </span>
                    )}
                  </div>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-ink-700 group-hover:text-gold-600">
                  View role
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-10 max-w-xl border border-dashed border-gray-200 bg-stone-50 px-5 py-4 text-sm text-gray-500">
            We don&apos;t have any open roles posted right now — but we&apos;re always glad to hear from strong
            advisors. Send us your details below.
          </p>
        )}

        <div className="mt-14 max-w-xl">
          <CareerApplicationForm heading="Don't see a role that fits? Apply anyway" />
        </div>
      </div>
    </div>
  );
}
