"use client";

import { createClient } from "@/lib/supabase/client";

export async function uploadFile(bucket: "images" | "brochures" | "videos", file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
