import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-ink-900"
    >
      <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
      {label}
    </Link>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gold-500 hover:text-ink-950"
    >
      {children}
    </Link>
  );
}

const BADGE_TONES = {
  gold: "bg-gold-100 text-gold-700",
  green: "bg-emerald-100 text-emerald-700",
  blue: "bg-blue-100 text-blue-700",
  gray: "bg-gray-100 text-gray-600",
  red: "bg-red-100 text-red-700",
} as const;

export type BadgeTone = keyof typeof BADGE_TONES;

export function Badge({ tone = "gray", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE_TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-6">
      <h2 className="font-display text-base font-semibold text-ink-900">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-20 text-center">
      {icon && <div className="text-gray-300">{icon}</div>}
      <p className="font-display text-lg font-semibold text-ink-800">{title}</p>
      {description && <p className="max-w-xs text-sm text-gray-400">{description}</p>}
    </div>
  );
}

export function leadStatusTone(status: string): BadgeTone {
  switch (status) {
    case "new":
      return "gold";
    case "contacted":
      return "blue";
    case "qualified":
      return "green";
    case "closed":
      return "gray";
    default:
      return "gray";
  }
}

export function leadSourceLabel(source: string) {
  if (source === "off-plan") return "Off-Plan Enquiry";
  if (source.startsWith("contact")) return "Contact Form";
  return "General";
}

export function applicationStatusTone(status: string): BadgeTone {
  switch (status) {
    case "new":
      return "gold";
    case "reviewed":
      return "blue";
    case "shortlisted":
      return "green";
    case "rejected":
      return "red";
    default:
      return "gray";
  }
}

export function timeAgo(dateString: string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  const ranges: [number, string][] = [
    [60, "s"],
    [60, "m"],
    [24, "h"],
    [7, "d"],
    [4.345, "w"],
    [12, "mo"],
    [Infinity, "y"],
  ];
  let value = seconds;
  for (const [range, unit] of ranges) {
    if (value < range) return `${Math.max(1, Math.floor(value))}${unit} ago`;
    value = value / range;
  }
  return "";
}
