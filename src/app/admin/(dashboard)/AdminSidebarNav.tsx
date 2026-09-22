"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Landmark,
  Users,
  Newspaper,
  Inbox,
  Image as ImageIcon,
  Briefcase,
  FileUser,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/off-plan", label: "Off-Plan Projects", icon: Landmark },
  { href: "/admin/agents", label: "Agents", icon: Users },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/careers", label: "Careers", icon: Briefcase },
  { href: "/admin/applications", label: "Applications", icon: FileUser },
  { href: "/admin/homepage", label: "Homepage", icon: ImageIcon },
];

export default function AdminSidebarNav({
  newLeadsCount,
  newApplicationsCount,
  onNavigate,
}: {
  newLeadsCount: number;
  newApplicationsCount: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const badgeCounts: Record<string, number> = {
    "/admin/leads": newLeadsCount,
    "/admin/applications": newApplicationsCount,
  };

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {NAV_ITEMS.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        const badgeCount = badgeCounts[item.href] ?? 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-gold-400/15 text-gold-300"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Icon className="h-4 w-4" strokeWidth={1.8} />
              {item.label}
            </span>
            {badgeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1.5 text-xs font-bold text-ink-950">
                {badgeCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
