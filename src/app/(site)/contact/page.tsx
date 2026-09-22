import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import FAQAccordion from "@/components/FAQAccordion";
import OfficeMap from "@/components/OfficeMap";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Signature Estates for a confidential property consultation.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div>
      <section className="mx-auto max-w-[100rem] px-5 pt-8 lg:px-8">
        <nav className="text-sm text-[#6b7280]">
          <Link href="/" className="hover:text-gold-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink-600">Contact</span>
        </nav>

        <div className="mt-8 flex flex-col items-center text-center">
          <span className="h-px w-10 bg-gold-400/70" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold-500">
            We&apos;d Love to Hear From You
          </p>
          <h1 className="mt-3 font-display text-h1 font-semibold text-ink-900">
            Get in Touch
          </h1>
          <p className="mx-auto mt-7 max-w-lg text-lg leading-relaxed text-[#6b7280]">
            Whether you are buying, selling, or investing, our advisors are
            ready to assist you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[100rem] px-5 py-16 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row">
          <div className="flex-1 rounded-sm border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] sm:p-8">
            <Suspense fallback={<div className="max-w-2xl flex-1" />}>
              <ContactForm />
            </Suspense>
          </div>

          <div className="lg:w-[400px] lg:shrink-0">
            <h3 className="font-display text-xl font-semibold text-ink-900">
              Contact Information
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
              Our team is available to answer your questions and help you
              find the perfect property.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex gap-3 rounded-sm border border-gray-100 p-4 transition hover:border-gold-400/40 hover:bg-gold-50/30">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" strokeWidth={1.8} />
                <div>
                  <p className="font-semibold text-ink-900">Call Us</p>
                  <p className="text-sm text-[#6b7280]">Mon–Fri 9am–6pm, Sat 10am–2pm</p>
                  <a href="tel:+971521600372" className="mt-1 block text-sm text-ink-900 hover:text-gold-600">
                    +971 52 160 0372
                  </a>
                </div>
              </div>

              <div className="flex gap-3 rounded-sm border border-gray-100 p-4 transition hover:border-gold-400/40 hover:bg-gold-50/30">
                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" strokeWidth={1.8} />
                <div>
                  <p className="font-semibold text-ink-900">WhatsApp</p>
                  <p className="text-sm text-[#6b7280]">Quick response, available 24/7</p>
                  <a
                    href="https://wa.me/971521600372"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm text-ink-900 hover:text-gold-600"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex gap-3 rounded-sm border border-gray-100 p-4 transition hover:border-gold-400/40 hover:bg-gold-50/30">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" strokeWidth={1.8} />
                <div>
                  <p className="font-semibold text-ink-900">Email Us</p>
                  <p className="text-sm text-[#6b7280]">We reply within 24 hours</p>
                  <a
                    href="mailto:info@signatureestates.ae"
                    className="mt-1 block text-sm text-ink-900 hover:text-gold-600"
                  >
                    info@signatureestates.ae
                  </a>
                </div>
              </div>

              <div className="flex gap-3 rounded-sm border border-gray-100 p-4 transition hover:border-gold-400/40 hover:bg-gold-50/30">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" strokeWidth={1.8} />
                <div>
                  <p className="font-semibold text-ink-900">Visit Us</p>
                  <p className="text-sm text-[#6b7280]">
                    Office 2301, Business Bay, Dubai, UAE
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <OfficeMap />
            </div>

            <p className="mt-6 text-xs leading-relaxed text-[#6b7280]">
              SIGNATURE ESTATES &middot; RERA / DED License No: TBD
            </p>
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-20">
        <div className="px-5 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <span className="h-px w-10 bg-gold-400/70" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
              Common Questions
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mt-12">
            <FAQAccordion />
          </div>
        </div>
      </section>
    </div>
  );
}
