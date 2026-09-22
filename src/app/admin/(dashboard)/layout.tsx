import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "./AdminShell";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { count: newLeadsCount } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  const { count: newApplicationsCount } = await supabase
    .from("job_applications")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  return (
    <AdminShell
      newLeadsCount={newLeadsCount ?? 0}
      newApplicationsCount={newApplicationsCount ?? 0}
      userEmail={user.email ?? ""}
    >
      {children}
    </AdminShell>
  );
}
