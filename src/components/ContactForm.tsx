"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ContactForm() {
  const id = useId();
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waUrl, setWaUrl] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Open the tab now, on the click itself — doing it after the `await`
    // below gets silently blocked by most browsers' popup blockers. Note:
    // passing "noopener" here would make window.open() always return null
    // (that's the point of noopener), which would silently break this
    // whole approach — strip the opener manually instead, after we already
    // have the reference we need.
    const waTab = window.open("", "_blank");
    if (waTab) waTab.opener = null;

    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const interest = String(data.get("interest") ?? "");
    const agent = searchParams.get("agent");
    const intent = searchParams.get("intent");

    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("leads").insert({
        name,
        phone,
        email,
        message,
        interest,
        source: intent ? `contact-${intent}` : "contact",
        source_reference: agent,
        page_url: window.location.href,
      });
      if (dbError) throw dbError;

      setSubmitted(true);
      const waText = `Enquiry from ${name} (${phone}, ${email}) — interested in ${interest}:\n\n${message}`;
      const url = `https://wa.me/971521600372?text=${encodeURIComponent(waText)}`;
      setWaUrl(url);
      if (waTab) waTab.location.href = url;
      else window.open(url, "_blank");
    } catch {
      waTab?.close();
      setError("Something went wrong. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-sm border border-gold-400/40 bg-gold-50 p-8 text-center">
        <p className="font-display text-lg font-semibold text-ink-900">
          Thank you — we&apos;ve received your message.
        </p>
        <p className="mt-2 text-sm text-[#6b7280]">
          We&apos;ve tried to open WhatsApp with your message ready to send. If it didn&apos;t
          open automatically (your browser may have blocked the popup), tap below to continue.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center rounded-sm bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-500 hover:text-ink-950"
        >
          Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex-1">
      <h2 className="font-display text-2xl font-semibold text-ink-900">Send a Message</h2>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${id}-name`}
            className="mb-1.5 block text-sm font-medium text-[#6b7280]"
          >
            Full Name
          </label>
          <input
            required
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            className="w-full rounded-sm border border-[#e8e8e8] px-4 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor={`${id}-phone`}
            className="mb-1.5 block text-sm font-medium text-[#6b7280]"
          >
            Phone
          </label>
          <input
            required
            id={`${id}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            className="w-full rounded-sm border border-[#e8e8e8] px-4 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-medium text-[#6b7280]">
          Email
        </label>
        <input
          required
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-sm border border-[#e8e8e8] px-4 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor={`${id}-interest`}
          className="mb-1.5 block text-sm font-medium text-[#6b7280]"
        >
          I am interested in&hellip;
        </label>
        <div className="relative">
          <select
            required
            id={`${id}-interest`}
            name="interest"
            defaultValue=""
            className="w-full appearance-none rounded-sm border border-[#e8e8e8] bg-white px-4 py-2.5 pr-9 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="buying">Buying</option>
            <option value="off-plan">Off-Plan Project</option>
            <option value="investing">Investing</option>
            <option value="selling">Selling</option>
          </select>
          <svg
            viewBox="0 0 20 20"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-current text-gray-400"
            strokeWidth={1.8}
          >
            <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor={`${id}-message`} className="mb-1.5 block text-sm font-medium text-[#6b7280]">
          Message
        </label>
        <textarea
          required
          id={`${id}-message`}
          name="message"
          rows={6}
          className="w-full rounded-sm border border-[#e8e8e8] px-4 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
        />
      </div>

      <label htmlFor={`${id}-agree`} className="mt-5 flex items-start gap-2.5 text-sm text-[#6b7280]">
        <input
          required
          id={`${id}-agree`}
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-[#e8e8e8] text-ink-900 focus:ring-gold-500"
        />
        I agree to the{" "}
        <Link href="/privacy" className="text-gold-600 hover:underline">
          privacy policy
        </Link>
        .
      </label>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-sm bg-ink-900 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950 disabled:opacity-50"
      >
        {submitting ? "Sending…" : "Send Message"}
      </button>
      <p className="mt-2 text-center text-xs text-gray-400">
        This opens WhatsApp with your message pre-filled to send.
      </p>
    </form>
  );
}
