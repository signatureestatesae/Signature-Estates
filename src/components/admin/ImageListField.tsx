"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { uploadFile } from "@/lib/supabase/storage";

export default function ImageListField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    setUploading(fileList.length);
    setError(null);
    try {
      // Uploaded one at a time (not Promise.all) so a slow connection
      // doesn't fire dozens of concurrent uploads at once.
      const uploaded: string[] = [];
      for (const file of fileList) {
        uploaded.push(await uploadFile("images", file));
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(0);
    }
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function makeCover(index: number) {
    if (index === 0) return;
    const next = [...value];
    const [picked] = next.splice(index, 1);
    next.unshift(picked);
    onChange(next);
  }

  return (
    <div>
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <p className="mt-0.5 text-xs text-gray-400">
        Upload as many photos as you like. The cover photo (marked below) is what shows first in
        listings — use the star to make any photo the cover, or the arrows to reorder.
      </p>
      <div className="mt-2 grid grid-cols-4 gap-3 sm:grid-cols-6">
        {value.map((url, i) => (
          <div
            key={url}
            className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
          >
            <Image src={url} alt="" fill sizes="120px" className="object-cover" />

            {i === 0 && (
              <span className="pointer-events-none absolute left-1 top-1 rounded-md bg-gold-500 px-1.5 py-0.5 text-[10px] font-semibold text-ink-950">
                Cover
              </span>
            )}

            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove image"
              className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              &times;
            </button>

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-1 pb-1 pt-4 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Move earlier"
                className="flex h-6 w-6 items-center justify-center rounded-full text-white disabled:opacity-30"
              >
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={() => makeCover(i)}
                disabled={i === 0}
                aria-label="Make cover photo"
                className="flex h-6 w-6 items-center justify-center rounded-full text-white disabled:opacity-30"
              >
                <Star className="h-3.5 w-3.5" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === value.length - 1}
                aria-label="Move later"
                className="flex h-6 w-6 items-center justify-center rounded-full text-white disabled:opacity-30"
              >
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.2} />
              </button>
            </div>
          </div>
        ))}
        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 text-center text-xs text-gray-400 hover:border-gold-500 hover:text-gold-600">
          {uploading > 0 ? `Uploading ${uploading}…` : "+ Add"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading > 0}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
