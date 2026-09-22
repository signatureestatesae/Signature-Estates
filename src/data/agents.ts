import "server-only";
import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { sanitizeWhatsapp } from "@/lib/format";
import type { Agent } from "./types";

// Admin saves invalidate this tag instantly via /api/revalidate, so this
// time-based window is only a safety net (matches the page-level
// `revalidate = 3600` safety net on routes that read agent data) — it was
// previously 300s, causing needless cache rewrites (billed as ISR/Data
// Cache writes) between admin edits.
const DATA_CACHE_REVALIDATE = 3600;

interface AgentRow {
  id: string;
  slug: string;
  name: string;
  title: string;
  location: string;
  nationality: string;
  rating: number | string;
  reviews: number;
  photo: string;
  phone: string;
  whatsapp: string;
  email: string;
  bio: string;
  languages: string[] | null;
  specialties: string[] | null;
  featured: boolean;
}

function mapAgent(row: AgentRow): Agent {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    title: row.title,
    location: row.location,
    nationality: row.nationality,
    rating: Number(row.rating),
    reviews: row.reviews,
    photo: row.photo,
    phone: row.phone,
    whatsapp: sanitizeWhatsapp(row.whatsapp),
    email: row.email,
    bio: row.bio,
    languages: row.languages ?? [],
    specialties: row.specialties ?? [],
    featured: row.featured,
  };
}

async function fetchAgents(): Promise<Agent[]> {
  const { data, error } = await supabasePublic
    .from("agents")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapAgent);
}
export const getAgents = unstable_cache(fetchAgents, ["agents:all"], {
  revalidate: DATA_CACHE_REVALIDATE,
  tags: ["agents"],
});

async function fetchAgentBySlug(slug: string): Promise<Agent | undefined> {
  const { data, error } = await supabasePublic
    .from("agents")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapAgent(data) : undefined;
}
export const getAgentBySlug = unstable_cache(fetchAgentBySlug, ["agents:bySlug"], {
  revalidate: DATA_CACHE_REVALIDATE,
  tags: ["agents"],
});

export async function getAgentById(id: string): Promise<Agent | undefined> {
  const { data, error } = await supabasePublic
    .from("agents")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapAgent(data) : undefined;
}
