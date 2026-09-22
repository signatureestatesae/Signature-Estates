"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/supabase/storage";
import { Card } from "./ui";
import SingleImageField from "./SingleImageField";

export interface HeroSettingsValues {
  media_type: "image" | "video";
  image_url: string;
  video_url: string;
}

export default function HeroSettingsForm({ initial }: { initial: HeroSettingsValues }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof HeroSettingsValues>(key: K, value: HeroSettingsValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function handleVideoUpload(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    setError(null);
    try {
      set("video_url", await uploadFile("videos", file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Video upload failed");
    } finally {
      setUploadingVideo(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("hero_settings")
      .update({
        media_type: values.media_type,
        image_url: values.image_url,
        video_url: values.video_url,
      })
      .eq("id", "default");
    setSaving(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setSaved(true);
    // Push the change to the live homepage now rather than waiting on its
    // route-level revalidate window (kept long as a safety net, not the
    // primary freshness mechanism — see /api/revalidate).
    fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/" }),
    }).catch(() => {});
    router.refresh();
  }

  return (
    <Card className="p-6">
      <h2 className="font-display text-base font-semibold text-ink-900">Hero Background</h2>
      <p className="mt-0.5 text-xs text-gray-500">
        Shown full-bleed behind the headline and search bar at the top of the homepage.
      </p>

      <form onSubmit={handleSave} className="mt-5 space-y-5">
        <div>
          <label className="text-xs font-medium text-gray-600">Background Type</label>
          <div className="mt-2 flex items-center gap-1 rounded-lg bg-gray-100 p-1 text-sm">
            {(["image", "video"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => set("media_type", type)}
                className={`flex-1 rounded-md px-4 py-2 font-medium capitalize transition ${
                  values.media_type === type
                    ? "bg-ink-900 text-white"
                    : "text-gray-500 hover:text-ink-900"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {values.media_type === "image" ? (
          <SingleImageField
            label="Background Image"
            value={values.image_url}
            onChange={(v) => set("image_url", v)}
          />
        ) : (
          <div>
            <label className="text-xs font-medium text-gray-600">Background Video</label>
            <p className="mt-1 text-xs text-gray-400">
              Paste a direct video file URL (.mp4/.webm — not a YouTube/Vimeo page link), or
              upload one below. Keep it short and compressed — it loops silently and autoplays,
              so large files will slow the homepage down.
            </p>
            <input
              type="url"
              value={values.video_url}
              onChange={(e) => set("video_url", e.target.value)}
              placeholder="https://.../hero-loop.mp4"
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
            />
            <div className="mt-3 flex items-center gap-4">
              {values.video_url && (
                <video
                  key={values.video_url}
                  src={values.video_url}
                  muted
                  playsInline
                  className="h-20 w-32 rounded-lg border border-gray-200 bg-gray-50 object-cover"
                />
              )}
              <label className="cursor-pointer rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-ink-900 hover:border-gold-500">
                {uploadingVideo ? "Uploading…" : values.video_url ? "Replace" : "Upload video"}
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  className="hidden"
                  disabled={uploadingVideo}
                  onChange={(e) => handleVideoUpload(e.target.files)}
                />
              </label>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && !error && <p className="text-sm text-emerald-600">Saved.</p>}

        <button
          type="submit"
          disabled={saving || uploadingVideo}
          className="rounded-full bg-ink-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Hero Settings"}
        </button>
      </form>
    </Card>
  );
}
