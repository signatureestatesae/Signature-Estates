"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import MarkdownField from "./MarkdownField";
import { Badge, Card, FormSection } from "./ui";

export interface CareerFormValues {
  id?: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  summary: string;
  description: string;
  published: boolean;
}

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const EMPTY: CareerFormValues = {
  slug: "",
  title: "",
  department: "",
  location: "Dubai, UAE",
  employment_type: "Full-time",
  summary: "",
  description: "",
  published: false,
};

export default function CareerForm({ initial }: { initial?: CareerFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<CareerFormValues>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initial?.id);

  function set<K extends keyof CareerFormValues>(key: K, value: CareerFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = { ...values };
    delete (payload as { id?: string }).id;

    const supabase = createClient();
    const { error: dbError } = isEditing
      ? await supabase.from("job_postings").update(payload).eq("id", initial!.id)
      : await supabase.from("job_postings").insert(payload);

    setSaving(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    await revalidateCareers();
    router.push("/admin/careers");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm(`Delete "${values.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    const supabase = createClient();
    const { error: dbError } = await supabase.from("job_postings").delete().eq("id", initial.id);
    setDeleting(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    await revalidateCareers();
    router.push("/admin/careers");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <FormSection title="Basic Information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Title">
              <input required value={values.title} onChange={(e) => set("title", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Slug (URL)">
              <input required value={values.slug} onChange={(e) => set("slug", e.target.value)} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Department">
              <input value={values.department} onChange={(e) => set("department", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Location">
              <input value={values.location} onChange={(e) => set("location", e.target.value)} className={inputClass} />
            </Field>
          </div>
          <Field label="Employment Type">
            <select
              value={values.employment_type}
              onChange={(e) => set("employment_type", e.target.value)}
              className={inputClass}
            >
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </FormSection>

        <FormSection title="Content">
          <Field label="Summary (shown on the careers list)">
            <textarea rows={2} value={values.summary} onChange={(e) => set("summary", e.target.value)} className={inputClass} />
          </Field>
          <MarkdownField label="Full Description" value={values.description} onChange={(v) => set("description", v)} rows={14} />
        </FormSection>
      </div>

      <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink-900">Status</p>
            <Badge tone={values.published ? "green" : "gray"}>
              {values.published ? "Published" : "Draft"}
            </Badge>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-ink-900">
            <input type="checkbox" checked={values.published} onChange={(e) => set("published", e.target.checked)} />
            Visible on /careers
          </label>
        </Card>

        {error && (
          <Card className="border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </Card>
        )}

        <Card className="p-5">
          <button type="submit" disabled={saving} className="w-full rounded-sm bg-ink-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950 disabled:opacity-50">
            {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Posting"}
          </button>
          {isEditing && (
            <button type="button" onClick={handleDelete} disabled={deleting} className="mt-2 w-full rounded-sm border border-red-200 px-6 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50">
              {deleting ? "Deleting…" : "Delete Posting"}
            </button>
          )}
        </Card>
      </div>
    </form>
  );
}

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      {children}
    </div>
  );
}

async function revalidateCareers() {
  await fetch("/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tag: "careers" }),
  }).catch(() => {});
}
