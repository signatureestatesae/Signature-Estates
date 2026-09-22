import "server-only";
import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import type { JobPosting } from "./types";

// Admin saves invalidate this tag instantly via /api/revalidate, so this
// time-based window is only a safety net (matches the page-level
// `revalidate = 3600` safety net on routes that read careers data).
const DATA_CACHE_REVALIDATE = 3600;

interface JobPostingRow {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  summary: string;
  description: string;
  published: boolean;
}

function mapJobPosting(row: JobPostingRow): JobPosting {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    department: row.department,
    location: row.location,
    employmentType: row.employment_type,
    summary: row.summary,
    description: row.description,
    published: row.published,
  };
}

async function fetchPublishedJobPostings(): Promise<JobPosting[]> {
  const { data, error } = await supabasePublic
    .from("job_postings")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapJobPosting);
}
export const getPublishedJobPostings = unstable_cache(fetchPublishedJobPostings, ["careers:published"], {
  revalidate: DATA_CACHE_REVALIDATE,
  tags: ["careers"],
});

async function fetchPublishedJobPostingBySlug(slug: string): Promise<JobPosting | undefined> {
  const { data, error } = await supabasePublic
    .from("job_postings")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data ? mapJobPosting(data) : undefined;
}
export const getPublishedJobPostingBySlug = unstable_cache(
  fetchPublishedJobPostingBySlug,
  ["careers:bySlug"],
  { revalidate: DATA_CACHE_REVALIDATE, tags: ["careers"] },
);
