"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SingleImageField from "./SingleImageField";
import MarkdownField from "./MarkdownField";
import { Badge, Card, FormSection } from "./ui";

export interface BlogPostFormValues {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  published: boolean;
  published_at: string | null;
}

const EMPTY: BlogPostFormValues = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_image: "",
  author: "",
  published: false,
  published_at: null,
};

export default function BlogPostForm({ initial }: { initial?: BlogPostFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<BlogPostFormValues>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initial?.id);

  function set<K extends keyof BlogPostFormValues>(key: K, value: BlogPostFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...values,
      published_at: values.published ? values.published_at ?? new Date().toISOString() : null,
    };
    delete (payload as { id?: string }).id;

    const supabase = createClient();
    const { error: dbError } = isEditing
      ? await supabase.from("blog_posts").update(payload).eq("id", initial!.id)
      : await supabase.from("blog_posts").insert(payload);

    setSaving(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    await revalidateBlog();
    router.push("/admin/blog");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm(`Delete "${values.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    const supabase = createClient();
    const { error: dbError } = await supabase.from("blog_posts").delete().eq("id", initial.id);
    setDeleting(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    await revalidateBlog();
    router.push("/admin/blog");
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
          <Field label="Author">
            <input value={values.author} onChange={(e) => set("author", e.target.value)} className={inputClass} />
          </Field>
        </FormSection>

        <FormSection title="Content">
          <Field label="Excerpt (shown on the blog list)">
            <textarea rows={2} value={values.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={inputClass} />
          </Field>
          <MarkdownField label="Content" value={values.content} onChange={(v) => set("content", v)} rows={14} />
        </FormSection>

        <FormSection title="Cover Image">
          <SingleImageField label="" value={values.cover_image} onChange={(v) => set("cover_image", v)} />
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
            Visible on the public site
          </label>
        </Card>

        {error && (
          <Card className="border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </Card>
        )}

        <Card className="p-5">
          <button type="submit" disabled={saving} className="w-full rounded-full bg-ink-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950 disabled:opacity-50">
            {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Post"}
          </button>
          {isEditing && (
            <button type="button" onClick={handleDelete} disabled={deleting} className="mt-2 w-full rounded-full border border-red-200 px-6 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50">
              {deleting ? "Deleting…" : "Delete Post"}
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

async function revalidateBlog() {
  await fetch("/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tag: "blog" }),
  }).catch(() => {});
}
