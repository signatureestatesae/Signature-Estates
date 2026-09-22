import type { Metadata } from "next";
import { getOffPlanProjects } from "@/data/offplan";
import OffPlanExplorer from "@/components/OffPlanExplorer";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Off-Plan Projects",
  description:
    "Explore Signature Estates' curated off-plan and under-construction developments across Palm Jumeirah, Downtown Dubai and Dubai Marina.",
  alternates: { canonical: `${SITE_URL}/off-plan` },
};

// Safety net only — admin saves push fresh data instantly via /api/revalidate.
export const revalidate = 3600;

export default async function OffPlanPage() {
  const offPlanProjects = await getOffPlanProjects();
  return <OffPlanExplorer projects={offPlanProjects} />;
}
