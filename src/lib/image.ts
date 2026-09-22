const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f0efe9" offset="20%" />
      <stop stop-color="#e6e4db" offset="50%" />
      <stop stop-color="#f0efe9" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f0efe9" />
  <rect width="${w}" height="${h}" fill="url(#g)" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);

/** Tiny inline SVG shown while a card/gallery image is still loading, so scrolling never reveals a blank tile. */
export function shimmerBlurDataURL(w: number, h: number) {
  return `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
}
