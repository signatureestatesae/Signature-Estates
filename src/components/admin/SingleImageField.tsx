"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadFile } from "@/lib/supabase/storage";

export default function SingleImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      onChange(await uploadFile("images", file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div className="mt-2 flex items-center gap-4">
        {value ? (
          <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <Image src={value} alt="" fill sizes="80px" className="object-cover" />
          </div>
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-400">
            No image
          </div>
        )}
        <label className="cursor-pointer rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-ink-900 hover:border-gold-500">
          {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFile(e.target.files)}
          />
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
