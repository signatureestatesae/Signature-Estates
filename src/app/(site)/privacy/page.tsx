import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Signature Estates collects, uses and protects your personal data.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
      <nav className="text-sm text-[#6b7280]">
        <Link href="/" className="hover:text-gold-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-600">Privacy Policy</span>
      </nav>

      <h1 className="mt-4 font-display text-h1 font-semibold text-ink-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-400">Last updated 17 August 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#4b5563]">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900">Who we are</h2>
          <p className="mt-2">
            SIGNATURE ESTATES, Office 2301, Business Bay, Dubai,
            UAE. You can reach us at{" "}
            <a href="mailto:info@signatureestates.ae" className="text-gold-600 hover:underline">
              info@signatureestates.ae
            </a>{" "}
            or{" "}
            <a href="tel:+971521600372" className="text-gold-600 hover:underline">
              +971 52 160 0372
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900">What we collect</h2>
          <p className="mt-2">
            We only collect what you give us directly, when you submit an enquiry form on a
            property, off-plan project, agent, or contact page: your name, phone number, email
            address, your message, which page the enquiry came from, and (on the contact page)
            what you&apos;re interested in — buying, selling, renting or investing.
          </p>
          <p className="mt-2">
            We don&apos;t use tracking pixels or analytics cookies, and we don&apos;t collect any
            data from visitors who are just browsing listings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900">How we use it</h2>
          <p className="mt-2">
            We use your enquiry details to respond to you and connect you with the right advisor.
            Submitting a form also pre-fills a WhatsApp message to the relevant advisor — that
            message is only sent to WhatsApp if you choose to hit send yourself; we don&apos;t
            send anything on your behalf without that action.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900">Who can see it</h2>
          <p className="mt-2">
            Enquiries are stored in our database and are only accessible to authenticated Luxury
            Estates staff. We don&apos;t sell or share your details with third parties for
            marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900">Third-party services</h2>
          <p className="mt-2">
            Property locations are displayed using Google Maps, and enquiries can be continued on
            WhatsApp — both are governed by their own privacy policies once you interact with
            them. See our{" "}
            <Link href="/cookies" className="text-gold-600 hover:underline">
              Cookie Policy
            </Link>{" "}
            for details on what these services set in your browser.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900">Your rights</h2>
          <p className="mt-2">
            You can ask us to access, correct or delete the information we hold about you at any
            time by emailing{" "}
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
