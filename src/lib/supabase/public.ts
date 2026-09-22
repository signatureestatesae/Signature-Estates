import "server-only";
import { createClient } from "@supabase/supabase-js";

// Read-only client for public-facing pages: no user session/cookies involved,
// relies on the anon-read RLS policies on each table.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
