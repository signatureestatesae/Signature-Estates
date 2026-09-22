export function formatPrice(price: number, unit: "total" | "month") {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(price);

  return unit === "month" ? `${formatted}/mo` : formatted;
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatLocation(area: string, city: string) {
  return [area, city].filter(Boolean).join(", ");
}

/** Trims a long synced description down to a clean meta-description length — cuts at a word boundary instead of mid-word, since Google truncates around ~155-160 chars anyway. */
export function truncateForMeta(text: string, max = 155) {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

/** Strips everything but digits so `https://wa.me/{n}` links never break on a stray "+" or space. */
export function sanitizeWhatsapp(raw: string | null | undefined): string {
  return (raw ?? "").replace(/\D/g, "");
}
