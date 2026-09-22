"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { socials } from "@/lib/socials";

const navLinks: { href: string; label: string; children?: { href: string; label: string }[] }[] = [
  { href: "/off-plan", label: "Projects" },
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about", label: "About Us" },
      { href: "/about/ceo", label: "Our CEO" },
    ],
  },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

// Runs during HTML parsing, before hydration, so a hard load of "/" doesn't
// flash the opaque header. usePathname() can't be trusted for the header's
// server-rendered className: this app's ISR regeneration re-renders the
// shared (site) layout without a real per-route pathname, so the header
// keeps getting baked back into its non-home look even on "/". Reading the
// real location here sidesteps that entirely — see [data-mode] rules in
// globals.css for the styling this attribute drives.
const FIX_HOME_HEADER_SCRIPT = `(function(){try{var h=document.getElementById("site-header");if(h&&location.pathname==="/"&&window.scrollY<=40)h.setAttribute("data-mode","transparent")}catch(e){}})()`;

function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !open;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header
      id="site-header"
      data-mode={transparent ? "transparent" : "solid"}
      suppressHydrationWarning
      className="sticky top-0 z-50 border-b transition-colors duration-300"
    >
      <InlineScript html={FIX_HOME_HEADER_SCRIPT} />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link href="/" className="flex items-center justify-self-start gap-2.5" onClick={() => setOpen(false)}>
          <Image
            src="/images/brand/logo.png"
            alt="Signature Estates"
            width={512}
            height={512}
            priority
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span className="hdr-tint font-display text-xl font-semibold tracking-tight">
            Signature <span className="hdr-accent">Estates</span>
          </span>
        </Link>

        <nav className="hidden items-center justify-self-center gap-7 lg:flex">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="group relative py-2">
                <Link
                  href={link.href}
                  className={`hdr-link flex items-center gap-1 text-sm font-semibold uppercase tracking-[0.08em] transition ${
                    link.children.some((c) => pathname === c.href) ? "hdr-link-active" : ""
                  }`}
                >
                  {link.label}
                  <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" strokeWidth={2} />
                </Link>
                <div className="invisible absolute left-1/2 top-full z-10 min-w-[10rem] -translate-x-1/2 translate-y-1 border border-stone-200 bg-white py-2 opacity-0 shadow-[0_16px_40px_-20px_rgba(11,12,13,0.35)] transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block whitespace-nowrap px-4 py-2 text-sm font-medium text-ink-700 transition hover:bg-stone-100 hover:text-gold-600 ${
                        pathname === child.href ? "text-gold-600" : ""
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={`hdr-link text-sm font-semibold uppercase tracking-[0.08em] transition ${
                  pathname === link.href ? "hdr-link-active" : ""
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center justify-self-end gap-4">
          <div className="hidden items-center gap-3 lg:flex">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="hdr-icon transition"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            className="hdr-icon lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-stone-200 bg-white px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold uppercase tracking-wide text-ink-800 hover:text-gold-600"
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="mt-3 flex flex-col gap-3 border-l border-stone-200 pl-4">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="text-sm font-medium text-ink-600 hover:text-gold-600"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
