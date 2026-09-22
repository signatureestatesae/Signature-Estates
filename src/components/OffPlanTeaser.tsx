import Link from "next/link";
import { getFeaturedOffPlanProjects, getOffPlanProjects } from "@/data/offplan";
import OffPlanCard from "./OffPlanCard";
import Reveal from "./Reveal";

const TARGET_COUNT = 8;

export default async function OffPlanTeaser() {
  const featuredOnly = await getFeaturedOffPlanProjects();
  let projects = featuredOnly.slice(0, TARGET_COUNT);

  if (projects.length < TARGET_COUNT) {
    const featuredIds = new Set(projects.map((p) => p.id));
    const all = await getOffPlanProjects();
    const fillers = all.filter((p) => !featuredIds.has(p.id));
    projects = [...projects, ...fillers.slice(0, TARGET_COUNT - projects.length)];
  }

  if (projects.length === 0) return null;

  return (
    <section className="bg-stone-100 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
              Reserve Tomorrow&apos;s Address
            </p>
            <h2 className="gold-underline mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              Off-Plan Projects
            </h2>
          </div>
          <Link
            href="/off-plan"
            className="text-sm font-medium text-ink-700 underline decoration-gold-400 decoration-2 underline-offset-4 hover:text-gold-600"
          >
            View all projects &rarr;
          </Link>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 80}>
              <OffPlanCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
