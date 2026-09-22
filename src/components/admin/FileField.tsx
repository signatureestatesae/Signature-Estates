"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/supabase/storage";

export default function FileField({
  label,
  value,
  onChange,
  accept = ".pdf",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      onChange(await uploadFile("brochures", file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-gold-600 underline"
          >
            View current file
          </a>
        ) : (
          <span className="text-xs text-gray-400">No file uploaded</span>
        )}
        <label className="cursor-pointer rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-ink-900 hover:border-gold-500">
          {uploading ? "Uploading…" : value ? "Replace file" : "Upload file"}
          <input
            type="file"
            accept={accept}
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
