"use client";

import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import { formatLocation } from "@/lib/format";
import LazyMount from "./LazyMount";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const mapContainerStyle = { width: "100%", height: "100%" };

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  gestureHandling: "greedy",
  clickableIcons: false,
  // "hybrid"/satellite tiles come back blank (200 OK, ~40-byte empty
  // image) on this account — satellite imagery needs a billing tier this
  // key doesn't have enabled. Roadmap tiles work fine, so match the
  // styling already used on the properties map instead of satellite.
  styles: [
    { elementType: "geometry", stylers: [{ color: "#f5f2ea" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#4a4131" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#fdfcf9" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#8ecae6" }] },
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#f0e9d8" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#d9cfa8" }] },
  ],
};

interface ProjectLocationMapProps {
  name: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
}

function MapSkeleton({ label }: { label: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-sm bg-stone-100">
      <p className="text-sm text-ink-400">{label}</p>
    </div>
  );
}

// The part that actually pulls in the Google Maps JS SDK. Kept separate so
// LazyMount below can defer it — this only mounts (and only then starts the
// SDK download) once the map has scrolled near the viewport, instead of
// eagerly on every off-plan detail page load.
function LoadedProjectMap({ name, area, city, lat, lng }: ProjectLocationMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "signature-estates-google-map",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const position = { lat, lng };

  if (loadError) {
    return (
      <div className="flex h-64 items-center justify-center rounded-sm border border-dashed border-red-300 bg-red-50 p-6 text-center text-sm text-red-700">
        Failed to load the map. Check that the Maps JavaScript API is enabled for your key.
      </div>
    );
  }

  if (!isLoaded) {
    return <MapSkeleton label="Loading map…" />;
  }

  return (
    <div className="overflow-hidden rounded-sm border border-gold-400/25 shadow-sm">
      <div className="h-64 w-full">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={position}
          zoom={14}
          options={mapOptions}
        >
          <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
            <div
              className="-translate-x-1/2 -translate-y-full"
              style={{ position: "relative" }}
              title={name}
            >
              <svg width="32" height="42" viewBox="0 0 32 42" fill="none" className="drop-shadow-md">
                <path
                  d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26c0-8.837-7.163-16-16-16Z"
                  fill="#141414"
                />
                <circle cx="16" cy="16" r="6" fill="#B8923F" />
              </svg>
            </div>
          </OverlayView>
        </GoogleMap>
      </div>
      <div className="bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-gray-400">Location</p>
        <p className="mt-1 font-display text-sm font-semibold text-ink-900">
          {formatLocation(area, city)}
        </p>
      </div>
    </div>
  );
}

export default function ProjectLocationMap({ name, area, city, lat, lng }: ProjectLocationMapProps) {
  // (0, 0) is the "not geocoded" sentinel this data layer defaults to —
  // it's technically real coordinates (open ocean off West Africa), so
  // showing it as a pin would be actively misleading rather than empty.
  const hasLocation = !(lat === 0 && lng === 0);

  if (!hasLocation) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-sm border border-dashed border-ink-900/20 bg-stone-100 p-6 text-center">
        <p className="font-display text-base font-semibold text-ink-800">Location coming soon</p>
        <p className="mt-2 text-xs text-ink-500">{formatLocation(area, city)}</p>
      </div>
    );
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-sm border border-dashed border-ink-900/20 bg-stone-100 p-6 text-center">
        <p className="font-display text-base font-semibold text-ink-800">
          Map view needs a Google Maps API key
        </p>
        <p className="mt-2 text-xs text-ink-500">
          Add <code className="rounded bg-ink-900/10 px-1.5 py-0.5">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
          to <code className="rounded bg-ink-900/10 px-1.5 py-0.5">.env.local</code> to enable it.
        </p>
      </div>
    );
  }

  return (
    <LazyMount placeholder={<MapSkeleton label="Map loads when you scroll here…" />}>
      <LoadedProjectMap name={name} area={area} city={city} lat={lat} lng={lng} />
    </LazyMount>
  );
}
