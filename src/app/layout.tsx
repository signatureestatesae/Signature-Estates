import type { Metadata } from "next";
import { Space_Grotesk, Inter, Public_Sans, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import JsonLd from "@/components/JsonLd";
import ScrollRestoration from "@/components/ScrollRestoration";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Placeholder IDs — these MUST be replaced with Signature Estates' own GA4/Google
// Ads tags before launch. The old client's IDs must never be reused here: it would
// send this site's traffic into their analytics account instead of a new one.
const GA4_MEASUREMENT_ID = "G-XXXXXXXXXX";
const GOOGLE_ADS_TAG_ID = "G-XXXXXXXXXX";

// Contact details, address and license below are placeholders — replace with
// Signature Estates' real registered details before launch.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Signature Estates",
  legalName: "SIGNATURE ESTATES",
  url: SITE_URL,
  telephone: "+971521600372",
  email: "info@signatureestates.ae",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Office 2301, Business Bay",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  areaServed: "Dubai, UAE",
  // Confirmed real profiles only — LinkedIn/TikTok in lib/socials.tsx are
  // still placeholders and shouldn't be asserted here until they're real.
  sameAs: [
    "https://www.facebook.com/profile.php?id=61592086554338",
    "https://www.instagram.com/signature_estates_worldwide/",
    "https://www.youtube.com/@SignatureEstatess",
  ],
};

// Tells Google this site has real internal search, which is what the
// "sitelinks search box" feature is keyed off. There's no schema or
// submission that makes Google choose specific sitelinks (Projects, Agents,
// etc.) directly — those are decided by its own algorithm as a site
// earns enough branded search volume — but this is the one piece of
// markup Google explicitly documents as feeding into that surface.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Signature Estates",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/off-plan?area={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// A secondary, weaker hint some crawlers use to identify a site's main
// sections — reinforces the same nav Header.tsx renders, kept in sync
// with it manually since this is server-only metadata.
const siteNavigationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SiteNavigationElement", name: "Projects", url: `${SITE_URL}/off-plan` },
    { "@type": "SiteNavigationElement", name: "Agents", url: `${SITE_URL}/agents` },
    { "@type": "SiteNavigationElement", name: "About", url: `${SITE_URL}/about` },
    { "@type": "SiteNavigationElement", name: "Blog", url: `${SITE_URL}/blog` },
    { "@type": "SiteNavigationElement", name: "Contact", url: `${SITE_URL}/contact` },
  ],
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk-raw",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

// A neutral, corporate-grade grotesque sans (the USWDS/gov.uk family of
// typefaces) — used for the property title + price.
const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-public-sans",
  display: "swap",
});

// A high-contrast, resort-editorial serif — reserved for the homepage hero's
// accent line, where it reads as "Aman/One&Only" rather than proptech SaaS.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant-raw",
  display: "swap",
});

const description =
  "Signature Estates connects discerning buyers and investors with Dubai's finest luxury resorts and branded residences.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Signature Estates | Luxury Resorts & Residences in Dubai",
    template: "%s | Signature Estates",
  },
  description,
  openGraph: {
    title: "Signature Estates | Luxury Resorts & Residences in Dubai",
    description,
    siteName: "Signature Estates",
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Signature Estates | Luxury Resorts & Residences in Dubai",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${spaceGrotesk.variable} ${inter.variable} ${publicSans.variable} ${cormorant.variable}`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-ink-900">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={siteNavigationJsonLd} />
        <ScrollRestoration />
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_MEASUREMENT_ID}');
            gtag('config', '${GOOGLE_ADS_TAG_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
