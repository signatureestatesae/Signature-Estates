import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import TrustedBy from "@/components/TrustedBy";
import OffPlanTeaser from "@/components/OffPlanTeaser";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import BlogTeaser from "@/components/BlogTeaser";
import CtaSection from "@/components/CtaSection";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  description:
    "Signature Estates connects discerning buyers and investors with Dubai's finest luxury resorts and branded residences across Palm Jumeirah, Downtown Dubai and Dubai Marina.",
  alternates: { canonical: SITE_URL },
};

// Content changes are pushed instantly by /api/revalidate when an admin
// saves (off-plan/agents/blog via revalidateTag, hero settings via
// revalidatePath("/")) — this is just a safety net, not the primary
// freshness mechanism, so it can stay long without anything looking stale.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <OffPlanTeaser />
      <TrustedBy />
      <FeaturedDestinations />
      <WhyChooseUs />
      <Testimonials />
      <BlogTeaser />
      <CtaSection />
    </>
  );
}
