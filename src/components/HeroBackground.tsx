"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";

export default function HeroBackground({
  mediaType,
  imageUrl,
  videoUrl,
}: {
  mediaType: "image" | "video";
  imageUrl: string;
  videoUrl: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  if (mediaType === "video" && videoUrl) {
    return (
      <>
        {/* Poster frame underneath — the video fades in over it once it can
            play, so there's never a flash of black while it buffers. */}
        {imageUrl && (
          <Image src={imageUrl} alt="" fill priority className="object-cover" />
        )}
        <video
          ref={videoRef}
          key={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={imageUrl || undefined}
          onCanPlay={() => setVideoReady(true)}
          className={`animate-hero-drift absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={videoUrl} />
        </video>
        <button
          type="button"
          onClick={() => {
            const el = videoRef.current;
            if (!el) return;
            el.muted = !el.muted;
            setMuted(el.muted);
          }}
          aria-label={muted ? "Unmute background video" : "Mute background video"}
          className="absolute bottom-8 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-sm transition hover:border-gold-300/60 hover:bg-black/50 hover:text-gold-300 lg:right-8"
        >
          {muted ? (
            <VolumeX className="h-4 w-4" strokeWidth={1.8} />
          ) : (
            <Volume2 className="h-4 w-4" strokeWidth={1.8} />
          )}
        </button>
      </>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt="Luxury waterfront villa at dusk"
      fill
      priority
      className="animate-hero-zoom object-cover"
    />
  );
}
