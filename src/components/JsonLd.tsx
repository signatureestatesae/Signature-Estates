/** Renders a schema.org JSON-LD block. Escapes "<" so listing text containing
 *  "</script>" can never break out of the script tag. */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Powers the FAQ rich-result snippet in Google search — surfaces individual
// Q&As directly on the results page, which is extra SERP real estate for
// long-tail question queries that page copy alone won't rank for.
export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

// BlogPosting structured data — the piece that lets a blog post qualify for
// Google's Article rich results (headline/image/date/author in the SERP)
// instead of showing as a plain blue link.
export function articleJsonLd(post: {
  title: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  publishedAt?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: post.url,
    mainEntityOfPage: { "@type": "WebPage", "@id": post.url },
    image: post.image ? [post.image] : undefined,
    datePublished: post.publishedAt ?? undefined,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", name: "Signature Estates" },
    publisher: {
      "@type": "Organization",
      name: "Signature Estates",
    },
  };
}
