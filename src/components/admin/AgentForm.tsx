"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SingleImageField from "./SingleImageField";
import { Card, FormSection } from "./ui";

export interface AgentFormValues {
  id?: string;
  slug: string;
  name: string;
  title: string;
  location: string;
  nationality: string;
  rating: number;
  reviews: number;
  photo: string;
  phone: string;
  whatsapp: string;
  email: string;
  bio: string;
  languages: string[];
  specialties: string[];
  featured: boolean;
}

const EMPTY: AgentFormValues = {
  slug: "",
  name: "",
  title: "",
  location: "",
  nationality: "",
  rating: 5,
  reviews: 0,
  photo: "",
  phone: "",
  whatsapp: "",
  email: "",
  bio: "",
  languages: [],
  specialties: [],
  featured: false,
};

export default function AgentForm({ initial }: { initial?: AgentFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<AgentFormValues>(initial ?? EMPTY);
  const [languagesText, setLanguagesText] = useState((initial?.languages ?? []).join(", "));
  const [specialtiesText, setSpecialtiesText] = useState((initial?.specialties ?? []).join(", "));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initial?.id);

  function set<K extends keyof AgentFormValues>(key: K, value: AgentFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...values,
      languages: languagesText.split(",").map((s) => s.trim()).filter(Boolean),
      specialties: specialtiesText.split(",").map((s) => s.trim()).filter(Boolean),
    };
    delete (payload as { id?: string }).id;

    const supabase = createClient();
    const { error: dbError } = isEditing
      ? await supabase.from("agents").update(payload).eq("id", initial!.id)
      : await supabase.from("agents").insert(payload);

    setSaving(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    await revalidateAgents();
    router.push("/admin/agents");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm(`Delete "${values.name}"? Their projects will be kept but unassigned.`)) return;
    setDeleting(true);
    const supabase = createClient();
    const { error: dbError } = await supabase.from("agents").delete().eq("id", initial.id);
    setDeleting(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    await revalidateAgents();
    router.push("/admin/agents");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <FormSection title="Basic Information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input required value={values.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Slug (URL)">
              <input required value={values.slug} onChange={(e) => set("slug", e.target.value)} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Title">
              <input required value={values.title} onChange={(e) => set("title", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Location">
              <input required value={values.location} onChange={(e) => set("location", e.target.value)} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Nationality">
              <input required value={values.nationality} onChange={(e) => set("nationality", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Rating (0-5)">
              <input type="number" step="0.1" min="0" max="5" value={values.rating} onChange={(e) => set("rating", Number(e.target.value))} className={inputClass} />
            </Field>
            <Field label="Review Count">
              <input type="number" value={values.reviews} onChange={(e) => set("reviews", Number(e.target.value))} className={inputClass} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Contact">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Phone">
              <input required value={values.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+971 4 444 1201" className={inputClass} />
            </Field>
            <Field label="WhatsApp (digits only)">
              <input required value={values.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="97444441201" className={inputClass} />
            </Field>
            <Field label="Email">
              <input type="email" required value={values.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Profile">
          <Field label="Bio">
            <textarea rows={4} value={values.bio} onChange={(e) => set("bio", e.target.value)} className={inputClass} />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Languages (comma separated)">
              <input value={languagesText} onChange={(e) => setLanguagesText(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Specialties (comma separated)">
              <input value={specialtiesText} onChange={(e) => setSpecialtiesText(e.target.value)} className={inputClass} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Photo">
          <SingleImageField label="" value={values.photo} onChange={(v) => set("photo", v)} />
        </FormSection>
      </div>

      <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
        <Card className="p-5">
          <label className="flex items-center gap-2 text-sm text-ink-900">
            <input type="checkbox" checked={values.featured} onChange={(e) => set("featured", e.target.checked)} />
            Featured founder card on /agents
          </label>
        </Card>

        {error && (
          <Card className="border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </Card>
        )}

        <Card className="p-5">
          <button type="submit" disabled={saving} className="w-full rounded-full bg-ink-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950 disabled:opacity-50">
            {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Agent"}
          </button>
          {isEditing && (
            <button type="button" onClick={handleDelete} disabled={deleting} className="mt-2 w-full rounded-full border border-red-200 px-6 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50">
              {deleting ? "Deleting…" : "Delete Agent"}
            </button>
          )}
        </Card>
      </div>
    </form>
  );
}

async function revalidateAgents() {
  await fetch("/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tag: "agents" }),
  }).catch(() => {});
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
