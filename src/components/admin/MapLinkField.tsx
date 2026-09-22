"use client";

import { useState, type KeyboardEvent } from "react";
import { MapPin } from "lucide-react";
import { parseCoordsFromText } from "@/lib/googleMapsLink";

export default function MapLinkField({
  onResolved,
}: {
  onResolved: (lat: number, lng: number) => void;
}) {
  const [link, setLink] = useState("");
  const [status, setStatus] = useState<
    { state: "idle" } | { state: "loading" } | { state: "ok"; lat: number; lng: number } | { state: "error"; message: string }
  >({ state: "idle" });

  // Deliberately not a <form>: this field lives inside the project's outer
  // <form> (Save Changes), and HTML doesn't allow forms to nest — the
  // browser's parser breaks the DOM structure on the server-rendered HTML,
  // causing a hydration error and an unrelated-looking reset of this field.
  async function handleResolve() {
    if (!link.trim()) return;
    setStatus({ state: "loading" });

    const direct = parseCoordsFromText(link);
    if (direct) {
      onResolved(direct.lat, direct.lng);
      setStatus({ state: "ok", ...direct });
      return;
    }

    // Short links (maps.app.goo.gl/…) don't carry coordinates until
    // followed — resolve server-side to dodge the browser's CORS block.
    try {
      const res = await fetch("/api/resolve-map-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't resolve that link");
      onResolved(data.lat, data.lng);
      setStatus({ state: "ok", lat: data.lat, lng: data.lng });
    } catch (err) {
      setStatus({
        state: "error",
        message: err instanceof Error ? err.message : "Couldn't find coordinates in that link",
      });
    }
  }

  return (
    <div>
      <label className="text-xs font-medium text-gray-600">Google Maps link</label>
      <p className="mt-0.5 text-xs text-gray-400">
        Open the project&apos;s location in Google Maps, tap Share, copy the link, and paste it
        here — this sets the exact pin below for you.
      </p>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleResolve();
            }
          }}
          placeholder="https://maps.app.goo.gl/…"
          className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleResolve}
          disabled={status.state === "loading" || !link.trim()}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gold-600 disabled:opacity-50"
        >
          <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
          {status.state === "loading" ? "Finding…" : "Use this location"}
        </button>
      </div>
      {status.state === "ok" && (
        <p className="mt-1.5 text-xs font-medium text-green-700">
          Location set: {status.lat.toFixed(5)}, {status.lng.toFixed(5)}
        </p>
      )}
      {status.state === "error" && <p className="mt-1.5 text-xs text-red-600">{status.message}</p>}
    </div>
  );
}
