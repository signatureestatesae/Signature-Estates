const items = [
  {
    label: "Licensed Real Estate Brokerage",
    detail: "Dubai, UAE",
  },
  {
    label: "10K+",
    detail: "Social Media Followers",
  },
  {
    label: "AED 500M+",
    detail: "Sales in 2025",
  },
  {
    label: "10+ Years",
    detail: "Combined Advisory Experience",
  },
];

// TODO: every figure above is a placeholder — confirm the real numbers
// (followers, sales volume, combined experience) before launch.
export default function TrustBar() {
  return (
    <section className="border-b border-stone-100/10 bg-ink-950">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 sm:grid-cols-4 lg:px-8">
        {items.map((item) => (
          <div key={item.label} className="text-center sm:text-left">
            <p className="font-display text-lg font-semibold text-gold-300 sm:text-xl">
              {item.label}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-stone-200/60">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
