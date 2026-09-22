function isValidLatLng(lat: number, lng: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}

/**
 * Pulls a {lat, lng} out of pasted text: a bare "lat, lng" pair, or a
 * (already-expanded) Google Maps URL. Prefers the precise marker position
 * (`!3d{lat}!4d{lng}`, present when a specific pin was dropped/searched)
 * over the viewport center (`@lat,lng,zoom`, which just reflects wherever
 * the map happened to be panned/zoomed to when the link was copied).
 */
export function parseCoordsFromText(input: string): { lat: number; lng: number } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const bare = trimmed.match(/^(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/);
  if (bare) {
    const lat = Number(bare[1]);
    const lng = Number(bare[2]);
    if (isValidLatLng(lat, lng)) return { lat, lng };
  }

  const precise = trimmed.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (precise) {
    const lat = Number(precise[1]);
    const lng = Number(precise[2]);
    if (isValidLatLng(lat, lng)) return { lat, lng };
  }

  const viewport = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (viewport) {
    const lat = Number(viewport[1]);
    const lng = Number(viewport[2]);
    if (isValidLatLng(lat, lng)) return { lat, lng };
  }

  try {
    const url = new URL(trimmed);
    const q = url.searchParams.get("q") ?? url.searchParams.get("query");
    if (q) {
      const m = q.match(/^(-?\d+\.\d+),(-?\d+\.\d+)$/);
      if (m) {
        const lat = Number(m[1]);
        const lng = Number(m[2]);
        if (isValidLatLng(lat, lng)) return { lat, lng };
      }
    }
  } catch {
    // not a URL — nothing more to try
  }

  return null;
}

const SHORT_LINK_HOSTS = new Set(["goo.gl", "maps.app.goo.gl", "g.co"]);

/** True for share-shortened links (maps.app.goo.gl/…) that need a server round-trip to resolve to real coordinates. */
export function isShortGoogleMapsLink(input: string): boolean {
  try {
    const url = new URL(input.trim());
    return SHORT_LINK_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

const RESOLVABLE_HOSTS = new Set([
  "goo.gl",
  "maps.app.goo.gl",
  "g.co",
  "google.com",
  "www.google.com",
  "maps.google.com",
]);

/** Domain allowlist for the server-side redirect-follow endpoint, so it can't be used as an open URL fetcher. */
export function isResolvableGoogleMapsUrl(input: string): boolean {
  try {
    const url = new URL(input.trim());
    return RESOLVABLE_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}
