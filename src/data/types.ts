export interface Agent {
  id: string;
  slug: string;
  name: string;
  title: string;
  location: string;
  nationality: string;
  rating: number;
  reviews: number;
  photo: string;
  phone: string;
  whatsapp: string;
  email: string;
  bio: string;
  languages: string[];
  specialties: string[];
  featured?: boolean;
  /** Populated by the /agents list page; not stored on the agent row. */
  listingsCount?: number;
}

export interface AgentSummary {
  id: string;
  slug: string;
  name: string;
  title: string;
  photo: string;
  phone: string;
  whatsapp: string;
  email: string;
}

export type OffPlanStatus = "Pre-Launch" | "Off-Plan" | "Under Construction" | "Nearing Completion";

export interface OffPlanProject {
  id: string;
  slug: string;
  name: string;
  developer: string;
  status: OffPlanStatus;
  area: string;
  city: string;
  country: string;
  handover: string;
  startingPrice: number;
  unitTypes: string[];
  minSize: number;
  maxSize: number;
  paymentPlan: string;
  description: string;
  amenities: string[];
  images: string[];
  featured: boolean;
  reference: string;
  agentId: string;
  lat: number;
  lng: number;
  brochureUrl?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  published: boolean;
  publishedAt: string | null;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export interface JobPosting {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  summary: string;
  description: string;
  published: boolean;
}

