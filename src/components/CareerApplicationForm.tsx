"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Mail, UploadCloud } from "lucide-react";

// TODO: placeholder — replace with the real inbox that should receive
// applications emailed directly (matches CAREERS_NOTIFICATION_EMAIL's
// fallback in /api/careers/apply, so both paths land in the same place).
const CAREERS_EMAIL = "info@signatureestates.ae";

function mailtoHref(jobTitle?: string) {
  const subject = jobTitle ? `Application: ${jobTitle}` : "Job Application";
  const body = "Hi Signature Estates team,\n\nPlease find my CV attached.\n\n";
  return `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function CareerApplicationForm({
  job,
  heading = "Apply Now",
}: {
  /** Omit for a general application not tied to a specific posting. */
  job?: { id: string; title: string };
  heading?: string;
}) {
  const id = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    if (job) {
      form.set("jobPostingId", job.id);
      form.set("jobTitle", job.title);
    }

    try {
      const res = await fetch("/api/careers/apply", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-gold-400/40 bg-gold-50 p-8 text-center">
        <p className="font-display text-lg font-semibold text-ink-900">
          Thank you — we&apos;ve received your application.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          {job ? `Our team will review your application for ${job.title} and be in touch.` : "Our team will review your application and be in touch."}
        </p>
      </div>
    );
  }

  const mailto = mailtoHref(job?.title);

  return (
    <form onSubmit={handleSubmit} className="border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <h3 className="font-display text-lg font-semibold text-ink-900">{heading}</h3>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="mb-1 block text-xs font-medium text-gray-500">
            Full Name
          </label>
          <input
            required
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            className="w-full rounded-sm border border-gray-200 px-3 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className="mb-1 block text-xs font-medium text-gray-500">
            Phone
          </label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            className="w-full rounded-sm border border-gray-200 px-3 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor={`${id}-email`} className="mb-1 block text-xs font-medium text-gray-500">
          Email
        </label>
        <input
          required
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-sm border border-gray-200 px-3 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
        />
      </div>

      <div className="mt-4">
        <label htmlFor={`${id}-message`} className="mb-1 block text-xs font-medium text-gray-500">
          Message (optional)
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={4}
          className="w-full rounded-sm border border-gray-200 px-3 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium text-gray-500">CV / Resume</label>
        <label
          htmlFor={`${id}-cv`}
          className="flex cursor-pointer items-center gap-3 border border-dashed border-gray-300 px-4 py-3.5 text-sm text-gray-500 transition hover:border-gold-500 hover:text-gold-700"
        >
          <UploadCloud className="h-4 w-4 shrink-0" strokeWidth={1.8} />
          {fileName ?? "Upload PDF or Word document (max 8MB)"}
        </label>
        <input
          ref={fileInputRef}
          required
          id={`${id}-cv`}
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-sm bg-ink-900 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950 disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit Application"}
      </button>

      <a
        href={mailto}
        className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500 transition hover:text-gold-600"
      >
        <Mail className="h-3.5 w-3.5" strokeWidth={1.8} />
        Prefer email? Send your CV to {CAREERS_EMAIL}
      </a>
    </form>
  );
}
