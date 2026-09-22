import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TAGS = new Set(["agents", "properties", "off-plan", "blog", "careers"]);
// Pages whose data comes from a plain Supabase query rather than a tagged
// `fetch()`, so `revalidateTag` can't reach them — only the homepage's hero
// settings need this today.
const ALLOWED_PATHS = new Set(["/"]);

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tag, path } = await request.json().catch(() => ({ tag: null, path: null }));

  if (typeof path === "string" && ALLOWED_PATHS.has(path)) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true });
  }

  if (typeof tag !== "string" || !ALLOWED_TAGS.has(tag)) {
    return NextResponse.json({ error: "Invalid tag or path" }, { status: 400 });
  }

  // { expire: 0 } forces immediate expiration (not stale-while-revalidate)
  // since the admin UI expects to see its own write on the next page load.
  revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: true });
}
