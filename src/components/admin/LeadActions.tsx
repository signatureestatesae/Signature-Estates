"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const STATUSES = ["new", "contacted", "qualified", "closed"];

export default function LeadActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleStatusChange(next: string) {
    setCurrent(next);
    setSaving(true);
    const supabase = createClient();
    await supabase.from("leads").update({ status: next }).eq("id", id);
    setSaving(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("leads").delete().eq("id", id);
    router.push("/admin/leads");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={current}
        disabled={saving}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-ink-900 focus:border-gold-500 focus:outline-none disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s[0].toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
