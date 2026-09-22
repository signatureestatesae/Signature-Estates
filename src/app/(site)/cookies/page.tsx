import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What cookies Signature Estates uses, and why.",
  alternates: { canonical: `${SITE_URL}/cookies` },
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
      <nav className="text-sm text-[#6b7280]">
        <Link href="/" className="hover:text-gold-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-600">Cookie Policy</span>
      </nav>

      <h1 className="mt-4 font-display text-h1 font-semibold text-ink-900">Cookie Policy</h1>
      <p className="mt-2 text-sm text-gray-400">Last updated 17 August 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#4b5563]">
        <section>
          <p>
            We keep this deliberately short, because we keep our cookie use deliberately small. We
            don&apos;t run analytics or advertising cookies on signatureestates.ae.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900">Essential cookies</h2>
          <p className="mt-2">
            Our admin dashboard uses a session cookie to keep our staff signed in while they manage
            listings and enquiries. This cookie is only set for authenticated team members using
            the admin area — it is not set for visitors browsing the public site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900">Third-party cookies</h2>
          <p className="mt-2">
            Property location maps are powered by Google Maps, which may set its own cookies once
            the map loads on a property page, under Google&apos;s own policies. If you continue an
            enquiry on WhatsApp, that conversation is subject to WhatsApp&apos;s own cookie and
            privacy practices.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900">Questions</h2>
          <p className="mt-2">
            If this changes — for example if we add analytics in future — we&apos;ll update this
            page and, where required, ask for your consent first. Reach us at{" "}
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
