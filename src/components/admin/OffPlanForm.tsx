"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageListField from "./ImageListField";
import FileField from "./FileField";
import MapLinkField from "./MapLinkField";
import MarkdownField from "./MarkdownField";
import { Card, FormSection } from "./ui";

const STATUSES = ["Pre-Launch", "Off-Plan", "Under Construction", "Nearing Completion"];
const COUNTRIES = ["United Arab Emirates", "Qatar", "Saudi Arabia", "Bahrain", "Oman"];

export interface OffPlanFormValues {
  id?: string;
  slug: string;
  name: string;
  developer: string;
  status: string;
  area: string;
  city: string;
  country: string;
  handover: string;
  starting_price: number;
  unit_types: string[];
  min_size: number;
  max_size: number;
  payment_plan: string;
  description: string;
  amenities: string[];
  images: string[];
  featured: boolean;
  reference: string;
  agent_id: string | null;
  lat: number | null;
  lng: number | null;
  brochure_url: string | null;
}

const EMPTY: OffPlanFormValues = {
  slug: "",
  name: "",
  developer: "",
  status: "Pre-Launch",
  area: "",
  city: "",
  country: COUNTRIES[0],
  handover: "",
  starting_price: 0,
  unit_types: [],
  min_size: 0,
  max_size: 0,
  payment_plan: "",
  description: "",
  amenities: [],
  images: [],
  featured: false,
  reference: "",
  agent_id: null,
  lat: null,
  lng: null,
  brochure_url: null,
};

export default function OffPlanForm({
  initial,
  agents,
}: {
  initial?: OffPlanFormValues;
  agents: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<OffPlanFormValues>(initial ?? EMPTY);
  const [amenitiesText, setAmenitiesText] = useState((initial?.amenities ?? []).join("\n"));
  const [unitTypesText, setUnitTypesText] = useState((initial?.unit_types ?? []).join("\n"));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initial?.id);

  function set<K extends keyof OffPlanFormValues>(key: K, value: OffPlanFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...values,
      amenities: amenitiesText.split("\n").map((s) => s.trim()).filter(Boolean),
      unit_types: unitTypesText.split("\n").map((s) => s.trim()).filter(Boolean),
      agent_id: values.agent_id || null,
      brochure_url: values.brochure_url || null,
    };
    delete (payload as { id?: string }).id;

    const supabase = createClient();
    const { error: dbError } = isEditing
      ? await supabase.from("off_plan_projects").update(payload).eq("id", initial!.id)
      : await supabase.from("off_plan_projects").insert(payload);

    setSaving(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    await revalidateOffPlan();
    router.push("/admin/off-plan");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm(`Delete "${values.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    const supabase = createClient();
    const { error: dbError } = await supabase.from("off_plan_projects").delete().eq("id", initial.id);
    setDeleting(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    await revalidateOffPlan();
    router.push("/admin/off-plan");
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
            <Field label="Developer">
              <input required value={values.developer} onChange={(e) => set("developer", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Reference">
              <input required value={values.reference} onChange={(e) => set("reference", e.target.value)} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Status">
              <select value={values.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Handover">
              <input required value={values.handover} onChange={(e) => set("handover", e.target.value)} className={inputClass} placeholder="e.g. Q2 2027" />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Area">
              <input required value={values.area} onChange={(e) => set("area", e.target.value)} className={inputClass} />
            </Field>
            <Field label="City">
              <input required value={values.city} onChange={(e) => set("city", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Country">
              <select value={values.country} onChange={(e) => set("country", e.target.value)} className={inputClass}>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                {!COUNTRIES.includes(values.country) && values.country && (
                  <option value={values.country}>{values.country}</option>
                )}
              </select>
            </Field>
          </div>
        </FormSection>

        <FormSection title="Pricing & Specifications">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Starting Price (AED)">
              <input type="number" required value={values.starting_price} onChange={(e) => set("starting_price", Number(e.target.value))} className={inputClass} />
            </Field>
            <Field label="Min Size (sqm)">
              <input type="number" value={values.min_size} onChange={(e) => set("min_size", Number(e.target.value))} className={inputClass} />
            </Field>
            <Field label="Max Size (sqm)">
              <input type="number" value={values.max_size} onChange={(e) => set("max_size", Number(e.target.value))} className={inputClass} />
            </Field>
          </div>
          <Field label="Payment Plan">
            <input required value={values.payment_plan} onChange={(e) => set("payment_plan", e.target.value)} className={inputClass} />
          </Field>
        </FormSection>

        <FormSection title="Location" description="Used to place the pin on the map.">
          <MapLinkField
            onResolved={(lat, lng) => {
              set("lat", lat);
              set("lng", lng);
            }}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Latitude">
              <input type="number" step="any" value={values.lat ?? ""} onChange={(e) => set("lat", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
            </Field>
            <Field label="Longitude">
              <input type="number" step="any" value={values.lng ?? ""} onChange={(e) => set("lng", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Description & Details">
          <MarkdownField label="Description" value={values.description} onChange={(v) => set("description", v)} rows={6} />
          <Field label="Unit Types (one per line)">
            <textarea rows={4} value={unitTypesText} onChange={(e) => setUnitTypesText(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Amenities (one per line)">
            <textarea rows={5} value={amenitiesText} onChange={(e) => setAmenitiesText(e.target.value)} className={inputClass} />
          </Field>
        </FormSection>

        <FormSection title="Images & Brochure">
          <ImageListField label="Images" value={values.images} onChange={(v) => set("images", v)} />
          <FileField label="Brochure PDF" value={values.brochure_url ?? ""} onChange={(v) => set("brochure_url", v)} />
        </FormSection>
      </div>

      <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
        <Card className="p-5">
          <Field label="Agent">
            <select value={values.agent_id ?? ""} onChange={(e) => set("agent_id", e.target.value || null)} className={inputClass}>
              <option value="">— None —</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </Field>
          <label className="mt-4 flex items-center gap-2 text-sm text-ink-900">
            <input type="checkbox" checked={values.featured} onChange={(e) => set("featured", e.target.checked)} />
            Featured on homepage
          </label>
        </Card>

        {error && (
          <Card className="border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </Card>
        )}

        <Card className="p-5">
          <button type="submit" disabled={saving} className="w-full rounded-full bg-ink-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950 disabled:opacity-50">
            {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Project"}
          </button>
          {isEditing && (
            <button type="button" onClick={handleDelete} disabled={deleting} className="mt-2 w-full rounded-full border border-red-200 px-6 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50">
              {deleting ? "Deleting…" : "Delete Project"}
            </button>
          )}
        </Card>
      </div>
    </form>
  );
}

async function revalidateOffPlan() {
  await fetch("/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tag: "off-plan" }),
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
