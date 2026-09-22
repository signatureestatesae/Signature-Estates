import "server-only";
import { supabasePublic } from "@/lib/supabase/public";

export interface HeroSettings {
  mediaType: "image" | "video";
  imageUrl: string;
  videoUrl: string;
}

const FALLBACK: HeroSettings = {
  mediaType: "image",
  imageUrl:
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80",
  videoUrl: "",
};

export async function getHeroSettings(): Promise<HeroSettings> {
  const { data } = await supabasePublic
    .from("hero_settings")
    .select("media_type,image_url,video_url")
    .eq("id", "default")
    .maybeSingle();

  if (!data) return FALLBACK;
  return {
    mediaType: data.media_type === "video" ? "video" : "image",
    imageUrl: data.image_url || FALLBACK.imageUrl,
    videoUrl: data.video_url || "",
  };
}
