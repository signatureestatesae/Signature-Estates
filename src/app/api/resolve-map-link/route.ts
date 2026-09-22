import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isResolvableGoogleMapsUrl, parseCoordsFromText } from "@/lib/googleMapsLink";

// Shortened Google Maps links (maps.app.goo.gl/…) don't carry coordinates
// in the URL itself — only the page they redirect to does — and following
// that redirect from the browser hits Google's CORS policy. Doing the
// follow here, server-side, has no such restriction.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await request.json().catch(() => ({ url: null }));
  if (typeof url !== "string" || !url.trim()) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }
  if (!isResolvableGoogleMapsUrl(url)) {
    return NextResponse.json({ error: "Only Google Maps links are supported" }, { status: 400 });
  }

  let resolved: Response;
  try {
    resolved = await fetch(url, { redirect: "follow" });
  } catch {
    return NextResponse.json({ error: "Couldn't open that link" }, { status: 502 });
  }

  const coords = parseCoordsFromText(resolved.url);
  if (!coords) {
    return NextResponse.json(
      { error: "Couldn't find coordinates in that link — try the full map view URL instead" },
      { status: 422 },
    );
  }

  return NextResponse.json(coords);
}
