import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Award, Building2, CalendarClock, CheckCircle2, Home, MapPin, Ruler, ShieldCheck } from "lucide-react";
import { getOffPlanProjectBySlug, getOffPlanProjects } from "@/data/offplan";
import { formatLocation, formatNumber, formatPrice, truncateForMeta } from "@/lib/format";
import PropertyGallery from "@/components/PropertyGallery";
import InquiryForm from "@/components/InquiryForm";
import OffPlanCard from "@/components/OffPlanCard";
import TrustBadges from "@/components/TrustBadges";
import ProjectLocationMap from "@/components/ProjectLocationMap";
import OffPlanStickyHeader from "@/components/OffPlanStickyHeader";
import FAQAccordion, { type FAQItem } from "@/components/FAQAccordion";
import Testimonials from "@/components/Testimonials";
import JsonLd, { breadcrumbJsonLd, faqJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import type { OffPlanProject } from "@/data/types";

const COMPANY_PHONE = "+971521600372";
const COMPANY_WHATSAPP = "971521600372";

function offPlanJsonLd(project: OffPlanProject) {
  const url = `${SITE_URL}/off-plan/${project.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: project.name,
    description: project.description,
    url,
    image: project.images,
    brand: { "@type": "Organization", name: project.developer || "Signature Estates" },
    offers:
      project.startingPrice > 0
        ? {
            "@type": "Offer",
            price: project.startingPrice,
            priceCurrency: "AED",
            availability: "https://schema.org/PreOrder",
            url,
          }
        : undefined,
  };
}

function projectFaqs(project: OffPlanProject): FAQItem[] {
  const location = formatLocation(project.area, project.city);
  return [
    {
      question: `How does the payment plan work for ${project.name}?`,
      answer: project.paymentPlan
        ? project.paymentPlan
        : `${project.developer || "The developer"} hasn't published a fixed payment schedule yet — your advisor will confirm exact instalment percentages and dates before you reserve.`,
    },
    {
      question: "Can international buyers purchase this property?",
      answer: `Yes. ${location} is open to international buyers, and our advisors handle the eligibility check, reservation paperwork and ongoing coordination with ${project.developer || "the developer"} on your behalf.`,
    },
    {
      question: "What happens at handover?",
      answer: `Expected handover is ${project.handover || "to be confirmed by the developer"}. We coordinate the final inspection, snagging and title/ownership transfer, and can arrange furnishing or rental management afterward if you don't plan to occupy it yourself.`,
    },
    {
      question: "Is this a good buy-to-let or resale investment?",
      answer: "It depends on your goals — unit mix, entry price and payment plan all affect projected yield and resale timing. Ask your advisor for a straight comparison against other projects we track before committing.",
    },
  ];
}

// Safety net only — admin saves push fresh data instantly via /api/revalidate.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getOffPlanProjectBySlug(slug);
  if (!project) return {};
  const title = `${project.name} — Off-Plan in ${formatLocation(project.area, project.city)}`;
  const description = truncateForMeta(
    project.description || `${project.name} by ${project.developer}, an off-plan development in ${formatLocation(project.area, project.city)}, Dubai.`,
  );
  const url = `${SITE_URL}/off-plan/${project.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: project.images[0] ? [{ url: project.images[0] }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function OffPlanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getOffPlanProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getOffPlanProjects();
  const related = allProjects
    .filter((p) => p.id !== project.id && p.area === project.area)
    .slice(0, 3);
  const relatedFallback = related.length
    ? related
    : allProjects.filter((p) => p.id !== project.id).slice(0, 3);
  const moreByDeveloper = project.developer
    ? allProjects.filter((p) => p.id !== project.id && p.developer === project.developer).length
    : 0;

  const waText = `Hi, I'm interested in ${project.name} (Ref ${project.reference}). Please send me the payment plan.`;
  const waUrl = `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(waText)}`;
  const priceLabel =
    project.startingPrice > 0 ? `From ${formatPrice(project.startingPrice, "total")}` : "Price on Request";
  const faqs = projectFaqs(project);

  return (
    <div className="pb-24 lg:pb-12">
      <JsonLd data={offPlanJsonLd(project)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Off-Plan Projects", url: `${SITE_URL}/off-plan` },
          { name: project.name, url: `${SITE_URL}/off-plan/${project.slug}` },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs.map((f) => ({ q: f.question, a: f.answer })))} />
      {project.images[0] && <link rel="image_src" href={project.images[0]} />}

      <OffPlanStickyHeader name={project.name} priceLabel={priceLabel} waUrl={waUrl} />

      {/* Full-bleed hero — the page's first impression for ad traffic landing directly here. */}
      <section className="relative flex min-h-[440px] items-end overflow-hidden bg-ink-950 sm:min-h-[520px]">
        {project.images[0] && (
          <Image
            src={project.images[0]}
            alt={project.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-8 pt-24 lg:px-8">
          <span className="inline-flex items-center border border-gold-400/50 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300 backdrop-blur-sm">
            {project.status}
          </span>
          <h1 className="mt-4 max-w-2xl font-display text-h1 font-semibold leading-[1.05] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)]">
            {project.name}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium uppercase tracking-[0.15em] text-white/80">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-300" strokeWidth={2} />
            {formatLocation(project.area, project.city)} &middot; by {project.developer}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <p className="font-display text-2xl font-semibold text-white">{priceLabel}</p>
            <a
              href="#enquire"
              className="bg-gold-500 px-6 py-3 text-sm font-semibold text-ink-950 transition hover:bg-white"
            >
              Get Payment Plan & Brochure
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Ask on WhatsApp
            </a>
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-white/70">
            <ShieldCheck className="h-3.5 w-3.5 text-gold-300" strokeWidth={2} />
            RERA-compliant off-plan sale &middot; Escrow-protected payment plan
          </p>
        </div>
      </section>

      {/* Quick-facts strip — scannable at-a-glance summary for visitors who won't read the full page. */}
      <div className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-6 sm:grid-cols-4 lg:px-8">
          <QuickFact icon={CalendarClock} label="Handover" value={project.handover || "TBA"} />
          <QuickFact
            icon={Ruler}
            label="Unit Sizes"
            value={
              project.minSize > 0 || project.maxSize > 0
                ? `${formatNumber(project.minSize)}–${formatNumber(project.maxSize)} sqm`
                : "On request"
            }
          />
          <QuickFact icon={Home} label="Unit Types" value={project.unitTypes[0] ?? "Multiple"} />
          <QuickFact icon={Award} label="Developer" value={project.developer} />
        </div>
      </div>

      {/* Highlights ribbon — top selling points at a glance, right below the fold. */}
      {project.amenities.length > 0 && (
        <div className="border-b border-gray-100 bg-stone-50">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-x-6 gap-y-2 px-5 py-4 lg:px-8">
            {project.amenities.slice(0, 4).map((a) => (
              <span key={a} className="flex items-center gap-1.5 text-sm text-ink-700">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-500" strokeWidth={1.8} />
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 pt-12 lg:px-8">
        <nav className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-gold-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/off-plan" className="hover:text-gold-600">
            Off-Plan Projects
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink-600">{project.name}</span>
        </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <PropertyGallery images={project.images} title={project.name} />

          <div className="mt-8">
            <h2 className="font-display text-xl font-semibold text-ink-900">About this project</h2>
            <div className="prose prose-sm prose-neutral mt-3 max-w-none prose-headings:font-display prose-headings:text-ink-900 prose-a:text-gold-600 prose-p:leading-relaxed prose-p:text-gray-600 prose-img:my-6 prose-img:rounded-sm prose-img:shadow-sm">
              <ReactMarkdown>{project.description}</ReactMarkdown>
            </div>
          </div>

          {(project.unitTypes.length > 0 || project.paymentPlan) && (
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {project.unitTypes.length > 0 && (
                <div>
                  <h2 className="font-display text-lg font-semibold text-ink-900">Unit Types</h2>
                  <ul className="mt-3 space-y-2">
                    {project.unitTypes.map((u) => (
                      <li key={u} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {project.paymentPlan && (
                <div>
                  <h2 className="font-display text-lg font-semibold text-ink-900">Payment Plan</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                    {project.paymentPlan}
                  </p>
                </div>
              )}
            </div>
          )}

          {project.amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold text-ink-900">Amenities</h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                {project.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mid-page conversion banner — a second, lower-friction chance to enquire for readers who've made it this far without using the sidebar form. */}
          <div className="mt-12 flex flex-col items-start gap-4 rounded-sm bg-ink-950 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg font-semibold text-white">
                Have questions about {project.name}?
              </p>
              <p className="mt-1 text-sm text-white/60">
                Speak with an advisor for pricing, availability and payment plan details.
              </p>
            </div>
            <a
              href="#enquire"
              className="shrink-0 bg-gold-500 px-6 py-3 text-sm font-semibold text-ink-950 transition hover:bg-gold-400"
            >
              Enquire Now
            </a>
          </div>

          <div className="mt-16">
            <h2 className="font-display text-xl font-semibold text-ink-900">Frequently Asked Questions</h2>
            <div className="mt-4">
              <FAQAccordion items={faqs} />
            </div>
          </div>
        </div>

        <aside id="enquire" className="scroll-mt-24 space-y-6">
          <ProjectLocationMap
            name={project.name}
            area={project.area}
            city={project.city}
            lat={project.lat}
            lng={project.lng}
          />

          {project.brochureUrl ? (
            <a
              href={project.brochureUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-sm border border-gray-100 bg-white px-4 py-3.5 text-center text-sm font-medium text-ink-900 shadow-sm transition hover:border-gold-500 hover:text-gold-700"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M12 3a1 1 0 0 1 1 1v9.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42l2.3 2.3V4a1 1 0 0 1 1-1ZM5 19a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z" />
              </svg>
              Download Brochure
            </a>
          ) : (
            <div className="rounded-sm border border-dashed border-gray-200 bg-stone-50 px-4 py-3.5 text-center text-sm text-gray-400">
              Brochure available soon
            </div>
          )}

          <InquiryForm
            heading="Request the brochure & payment plan"
            presetMessage={`I'm interested in ${project.name} (Ref ${project.reference}). Please send the brochure and full payment plan.`}
            source="off-plan"
            sourceReference={project.slug}
          />

          {project.developer && (
            <div className="rounded-sm border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-stone-100 text-gold-600">
                  <Building2 className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Developer</p>
                  <p className="truncate font-display text-sm font-semibold text-ink-900">{project.developer}</p>
                </div>
              </div>
              {moreByDeveloper > 0 && (
                <Link
                  href={`/off-plan?developer=${encodeURIComponent(project.developer)}`}
                  className="mt-3 inline-block text-xs font-medium text-gold-600 underline decoration-gold-400 decoration-2 underline-offset-4 hover:text-gold-700"
                >
                  View {moreByDeveloper} more project{moreByDeveloper === 1 ? "" : "s"} by this developer &rarr;
                </Link>
              )}
            </div>
          )}

          <TrustBadges
            items={[
              { icon: "shield", label: "Verified Developer Partnership" },
              { icon: "lock", label: "Escrow-Protected Payment Plan" },
              { icon: "check", label: "RERA-Compliant Off-Plan Sale" },
            ]}
          />
        </aside>
      </div>

      {relatedFallback.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-2xl font-semibold text-ink-900">
            More off-plan projects
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedFallback.map((p) => (
              <OffPlanCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}
      </div>

      <div className="mt-8">
        <Testimonials />
      </div>

      {/* Sticky mobile CTA — ad traffic is mostly mobile, so a conversion path stays on-screen at all times. */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-2 border-t border-gray-100 bg-white/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:hidden">
        <a
          href={`tel:${COMPANY_PHONE}`}
          aria-label="Call us"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 text-ink-900"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M6.6 10.8c1.2 2.4 3.2 4.4 5.6 5.6l1.9-1.9c.3-.3.7-.4 1-.2 1 .3 2.1.5 3.2.5.6 0 1 .4 1 1V19c0 .6-.4 1-1 1-9 0-16-7-16-16 0-.6.4-1 1-1h3.2c.6 0 1 .4 1 1 0 1.1.2 2.2.5 3.2.1.3 0 .7-.2 1L6.6 10.8Z" />
          </svg>
        </a>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp us"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 text-ink-900"
        >
          <svg viewBox="0 0 32 32" className="h-4 w-4 fill-current">
            <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.31.65 4.47 1.78 6.31L4 29l7.86-1.74A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.6c-1.98 0-3.83-.55-5.4-1.5l-.39-.23-4.66 1.03 1.05-4.54-.25-.4A9.55 9.55 0 0 1 6.4 15c0-5.3 4.31-9.6 9.6-9.6 5.3 0 9.6 4.3 9.6 9.6 0 5.3-4.3 9.6-9.6 9.6Zm5.3-7.19c-.29-.15-1.7-.84-1.96-.94-.26-.1-.46-.15-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.23-.56-.47-.48-.65-.49-.17-.01-.36-.01-.55-.01-.19 0-.51.07-.78.36-.26.29-1.02 1-1.02 2.44 0 1.44 1.05 2.83 1.19 3.03.15.19 2.07 3.16 5.02 4.43.7.3 1.25.48 1.68.61.7.22 1.34.19 1.84.11.56-.08 1.7-.7 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34Z" />
          </svg>
        </a>
        <a
          href="#enquire"
          className="flex flex-1 items-center justify-center bg-gold-500 text-sm font-semibold text-ink-950"
        >
          Get Payment Plan
        </a>
      </div>
    </div>
  );
}

function QuickFact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarClock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-stone-100 text-gold-600">
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
        <p className="truncate font-display text-sm font-semibold text-ink-900">{value}</p>
      </div>
    </div>
  );
}
