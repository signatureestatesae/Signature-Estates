import Image from "next/image";
import Link from "next/link";
import { getOffPlanProjects } from "@/data/offplan";
import Reveal from "./Reveal";

// Countries/regions the brand covers. `cities` lists every value that can
// appear in off_plan_projects.city for that destination (data entry isn't
// always consistent, e.g. "UAE" vs "Dubai") — matched case-insensitively
// purely to show a live project count per card. `filterCity` is the exact
// value passed to /off-plan?city= for the deep link.
const DESTINATIONS = [
  { label: "UAE", filterCity: "Dubai", cities: ["dubai", "uae", "united arab emirates"], image: "/images/areas/uae.jpg" },
  { label: "Qatar", filterCity: "Qatar", cities: ["qatar", "doha"], image: "/images/areas/qatar.jpg" },
  { label: "Saudi Arabia", filterCity: "Saudi Arabia", cities: ["saudi arabia", "ksa", "saudi"], image: "/images/areas/saudi-arabia.jpg" },
  { label: "Zanzibar Resorts", filterCity: "Tanzania", cities: ["tanzania", "zanzibar"], image: "/images/areas/zanzibar.jpg" },
  { label: "Georgia", filterCity: "Georgia", cities: ["georgia"], image: "/images/areas/georgia.jpg" },
];

export default async function FeaturedDestinations() {
  const projects = await getOffPlanProjects();
  const counts = new Map<string, number>();
  for (const p of projects) {
    const city = p.city.trim().toLowerCase();
    for (const dest of DESTINATIONS) {
      if (dest.cities.includes(city)) {
        counts.set(dest.label, (counts.get(dest.label) ?? 0) + 1);
      }
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
          Where We Focus
        </p>
        <h2 className="gold-underline mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Our Destinations
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {DESTINATIONS.map((dest, i) => {
          const count = counts.get(dest.label) ?? 0;
          return (
            <Reveal key={dest.label} delay={i * 80}>
              <Link
                href={`/off-plan?city=${encodeURIComponent(dest.filterCity)}`}
                className="group relative flex h-44 flex-col justify-end overflow-hidden rounded-sm p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <Image
                  src={dest.image}
                  alt={dest.label}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
                <div className="pointer-events-none absolute inset-4 rounded-sm border border-white/15 transition group-hover:border-gold-300/40" />
                <p className="relative font-display text-lg font-semibold text-white">{dest.label}</p>
                <p className="relative mt-1 text-xs uppercase tracking-[0.15em] text-gold-300/90">
                  {count > 0 ? `${count} project${count === 1 ? "" : "s"}` : "Coming soon"}
                </p>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
