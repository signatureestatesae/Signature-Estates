"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Menu, X } from "lucide-react";
import AdminSidebarNav from "./AdminSidebarNav";
import AdminLogoutButton from "./AdminLogoutButton";

export default function AdminShell({
  newLeadsCount,
  newApplicationsCount,
  userEmail,
  children,
}: {
  newLeadsCount: number;
  newApplicationsCount: number;
  userEmail: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-stone-100">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col bg-ink-950 transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <Link href="/admin" className="flex items-center gap-2">
              <Image
                src="/images/brand/logo.png"
                alt="Signature Estates"
                width={512}
                height={512}
                className="h-7 w-7 object-contain"
              />
              <span className="font-display text-lg font-semibold text-white">Signature Estates</span>
            </Link>
            <p className="text-xs text-white/40">Admin Panel</p>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="text-white/60 transition hover:text-white lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>

        <AdminSidebarNav
          newLeadsCount={newLeadsCount}
          newApplicationsCount={newApplicationsCount}
          onNavigate={() => setOpen(false)}
        />

        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-2.5 rounded-lg bg-white/5 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-400 text-xs font-bold text-ink-950">
              {userEmail[0]?.toUpperCase()}
            </div>
            <p className="truncate text-xs text-white/70">{userEmail}</p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="mt-3 flex items-center gap-1.5 text-xs text-white/50 hover:text-gold-300"
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
            View live site
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            aria-label="Open menu"
            className="text-ink-700"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" strokeWidth={1.8} />
          </button>
          <span className="font-display text-base font-semibold text-ink-900">
            Signature Estates Admin
          </span>
        </div>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
