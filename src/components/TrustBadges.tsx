const ICONS = {
  shield: (
    <path d="M10 1 3 4v5.5C3 14.4 6 18 10 19c4-1 7-4.6 7-9.5V4l-7-3Zm-1 12.5-3-3 1.4-1.4L9 10.7l3.6-3.6L14 8.5l-5 5Z" />
  ),
  check: (
    <path d="M10 1 3 4v5.5C3 14.4 6 18 10 19c4-1 7-4.6 7-9.5V4l-7-3Z" />
  ),
  lock: (
    <path d="M5 9V6.5a5 5 0 0 1 10 0V9h.5A1.5 1.5 0 0 1 17 10.5v6A1.5 1.5 0 0 1 15.5 18h-11A1.5 1.5 0 0 1 3 16.5v-6A1.5 1.5 0 0 1 4.5 9H5Zm2 0h6V6.5a3 3 0 0 0-6 0V9Z" />
  ),
};

export default function TrustBadges({
  items,
}: {
  items: { icon: keyof typeof ICONS; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-sm border border-gray-100 bg-gray-50 p-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2.5 text-xs text-gray-600">
          <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 fill-gold-600">
            {ICONS[item.icon]}
          </svg>
          {item.label}
        </div>
      ))}
    </div>
  );
}
