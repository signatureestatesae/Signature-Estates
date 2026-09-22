import { createClient } from "@/lib/supabase/server";
import HeroSettingsForm from "@/components/admin/HeroSettingsForm";
import { PageHeader } from "@/components/admin/ui";

export default async function AdminHomepagePage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("hero_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  return (
    <div>
      <PageHeader
        title="Homepage"
        description="Control what visitors see first on the homepage."
      />
      <div className="mt-6 max-w-2xl">
        <HeroSettingsForm
          initial={{
            media_type: settings?.media_type === "video" ? "video" : "image",
            image_url: settings?.image_url ?? "",
            video_url: settings?.video_url ?? "",
          }}
        />
      </div>
    </div>
  );
}
