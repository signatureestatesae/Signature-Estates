import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "The terms that govern your use of the Signature Estates website.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
      <nav className="text-sm text-[#6b7280]">
        <Link href="/" className="hover:text-gold-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-600">Terms and Conditions</span>
      </nav>

      <h1 className="mt-4 font-display text-h1 font-semibold text-ink-900">Terms and Conditions</h1>
      <p className="mt-2 text-sm text-gray-400">Last updated 17 August 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#4b5563]">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900">Using this site</h2>
          <p className="mt-2">
            By browsing signatureestates.ae you agree to these terms. If you don&apos;t agree with
            them, please don&apos;t use the site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900">Listings information</h2>
          <p className="mt-2">
            Property details, pricing, availability and imagery are provided for general
            information and may change without notice — a listing being on the site is not an
            offer or guarantee of availability. Please confirm current price, availability and
            specification with your advisor before making any decision.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900">Enquiries</h2>
          <p className="mt-2">
            Submitting an enquiry form does not create a binding agreement between you and Luxury
            Estates. Any transaction is subject to separate agreement, due diligence and
            documentation between the parties involved.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900">Intellectual property</h2>
          <p className="mt-2">
            The Signature Estates name, logo, photography and site content belong to SIGNATURE ESTATES
            or its licensors. You may view and share pages for personal, non-commercial
            use, but may not reproduce or redistribute site content without our permission.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900">Liability</h2>
          <p className="mt-2">
            We take reasonable care to keep listings accurate and the site running, but we don&apos;t
            guarantee the site or its content will be uninterrupted or error-free, and we&apos;re
            not liable for decisions made solely on the basis of information published here.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900">Governing law</h2>
          <p className="mt-2">These terms are governed by the laws of the Emirate of Dubai and the United Arab Emirates.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900">Contact</h2>
          <p className="mt-2">
            Questions about these terms can be sent to{" "}
            <a href="mailto:info@signatureestates.ae" className="text-gold-600 hover:underline">
              info@signatureestates.ae
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
