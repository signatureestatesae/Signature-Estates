"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="mt-2 flex items-center gap-1.5 text-xs text-white/50 hover:text-gold-300"
    >
      <LogOut className="h-3.5 w-3.5" strokeWidth={1.8} />
      Sign out
    </button>
  );
}
