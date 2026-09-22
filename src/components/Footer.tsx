import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { socials } from "@/lib/socials";

const discoverLinks = [
  { href: "/off-plan", label: "Luxury Projects" },
  { href: "/off-plan?status=Pre-Launch", label: "Pre-Launch Residences" },
  { href: "/off-plan?status=Nearing+Completion", label: "Nearing Completion" },
  { href: "/contact", label: "Off-Market Opportunities" },
  { href: "/blog", label: "Blog" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/agents", label: "Agents" },
  { href: "/careers", label: "Careers" },
  { href: "/contact?intent=list", label: "List Your Property" },
  { href: "/contact", label: "Contact" },
];

const resourceLinks = [
  { href: "/agents", label: "For Agents" },
  { href: "/contact", label: "For Investors" },
  { href: "/contact", label: "For Developers" },
  { href: "/contact", label: "For Sellers" },
  { href: "/contact", label: "For Clients" },
  { href: "/contact", label: "Financing" },
];

const linkColumns = [
  { title: "Discover", links: discoverLinks },
  { title: "Company", links: companyLinks },
  { title: "Resources", links: resourceLinks },
];

export default function Footer() {
  return (
    <footer className="border-t border-gold-400/10 bg-[#111111] text-white">
      <div className="mx-auto max-w-[1400px] px-5 pt-24 lg:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/brand/logo.png"
                alt="Signature Estates"
                width={512}
                height={512}
                className="h-10 w-10 shrink-0 object-contain"
              />
              <span className="font-display text-xl font-semibold uppercase tracking-[0.14em] text-white">
                Signature <span className="text-gradient-gold">Estates</span>
                <sup className="ml-0.5 text-xs align-super">&reg;</sup>
              </span>
            </Link>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/55">
              Signature Estates is a boutique real estate house representing
              Dubai&apos;s finest luxury resorts and branded residences. We
              work with a deliberately small portfolio of clients and
              projects, spanning Palm Jumeirah, Downtown Dubai and Dubai
              Marina, so every transaction receives the depth of attention
              it deserves. Our advisors guide buyers and investors from
              first viewing through to handover.
            </p>

            {/* Rating below is a placeholder carried over from the template —
                do not publish without a verified Google rating. */}
            <div className="mt-10 flex flex-wrap items-center gap-10">
              <div>
                <p className="text-sm text-white/85">Rating on Google</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-base font-semibold text-white">4.8</span>
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" strokeWidth={0} />
                    ))}
                  </span>
                  <span className="text-sm text-white/45">(340)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {linkColumns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400/80">
                  {col.title}
                </h4>
                <ul className="mt-5 space-y-[18px]">
                  {col.links.map((link, i) => (
                    <li key={`${col.title}-${link.label}-${i}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/85 transition hover:text-gold-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center border border-white/20 text-white/85 transition hover:border-gold-400 hover:text-gold-400"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} SIGNATURE ESTATES. All rights reserved.
          </p>
        </div>

        {/* Address and RERA/DED license number are placeholders — replace with the
            real registered office and license before launch. */}
        <div className="mt-6 flex flex-col items-center gap-1.5 text-center text-xs leading-relaxed text-white/40">
          <p>
            SIGNATURE ESTATES &middot; Office 2301, Business Bay, Dubai, UAE
          </p>
          <p>RERA / DED License No: TBD</p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 border-t border-white/10 py-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <p className="text-sm text-white/60">
            A platform by <span className="font-semibold text-white">Signature Estates Group</span>
          </p>
          <div className="flex items-center gap-3 text-sm text-white/85">
            <Link href="/privacy" className="transition hover:text-gold-400">
              Privacy Policy
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/terms" className="transition hover:text-gold-400">
              Terms and Conditions
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/cookies" className="transition hover:text-gold-400">
              Use of Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
