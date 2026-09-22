type IconProps = { className?: string };

// TODO: LinkedIn and TikTok below point to Instagram as a stand-in until
// Signature Estates has real profiles on those platforms — swap the hrefs
// once available.
export const socials: { label: string; href: string; icon: (props: IconProps) => React.JSX.Element }[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61592086554338",
    icon: (props) => (
      <svg viewBox="0 0 24 24" className={props.className} fill="currentColor">
        <path d="M13.5 21.5v-8.2h2.75l.41-3.2h-3.16V8.06c0-.93.26-1.56 1.59-1.56h1.7V3.64c-.29-.04-1.3-.13-2.47-.13-2.44 0-4.11 1.49-4.11 4.22v2.36H7.46v3.2h2.75v8.2Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/signature_estates_worldwide/",
    icon: (props) => (
      <svg viewBox="0 0 24 24" className={props.className} fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.instagram.com/signature_estates_worldwide/",
    icon: (props) => (
      <svg viewBox="0 0 24 24" className={props.className} fill="currentColor">
        <path d="M6.94 8.5H3.56V20.4h3.38Zm-1.69-5.4a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 20.4v-6.53c0-3.5-1.87-5.13-4.36-5.13-2.01 0-2.91 1.1-3.41 1.88V8.5H9.29c.04 1 0 11.9 0 11.9h3.38v-6.65c0-.36.03-.71.13-.97.3-.71.98-1.44 2.11-1.44 1.48 0 2.15 1.08 2.15 2.68v6.38Z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.instagram.com/signature_estates_worldwide/",
    icon: (props) => (
      <svg viewBox="0 0 24 24" className={props.className} fill="currentColor">
        <path d="M16.6 5.82c-.94-.83-1.53-2.02-1.6-3.32h-3.1v13.4c0 1.5-1.22 2.72-2.72 2.72a2.72 2.72 0 0 1-2.72-2.72 2.72 2.72 0 0 1 2.72-2.72c.28 0 .55.04.8.12v-3.17a5.9 5.9 0 0 0-.8-.06 5.86 5.86 0 0 0-5.86 5.86A5.86 5.86 0 0 0 9.18 21.8a5.86 5.86 0 0 0 5.86-5.86V9.01a8.28 8.28 0 0 0 4.84 1.55V7.46a4.85 4.85 0 0 1-3.28-1.64Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@SignatureEstatess",
    icon: (props) => (
      <svg viewBox="0 0 24 24" className={props.className} fill="currentColor">
        <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.2 28.3 28.3 0 0 0 2 12a28.3 28.3 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28.3 28.3 0 0 0 22 12a28.3 28.3 0 0 0-.4-4.8ZM10 15V9l5.2 3Z" />
      </svg>
    ),
  },
];
