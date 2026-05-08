/**
 * JSON-LD structured data components.
 * These render <script type="application/ld+json"> tags that search engines
 * (Google, Bing) parse to enrich search results with logos, knowledge panels,
 * site links, and breadcrumbs.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bomachgroup.com";

type JsonLdValue = string | number | boolean | null | JsonLdObject | JsonLdValue[];
type JsonLdObject = { [key: string]: JsonLdValue };

function JsonLdScript({ data }: { data: JsonLdObject }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization schema — appears in Google's Knowledge Panel. */
export function OrganizationJsonLd() {
  const data: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Bomach Group",
    alternateName: "Bomach Group of Companies",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo/bomach-logo-hd.png`,
    description:
      "Bomach Group is a leading construction, engineering, and real estate company delivering quality projects across Nigeria.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "3a Isiuzo Street, Independence Layout",
      addressLocality: "Enugu",
      addressRegion: "Enugu",
      addressCountry: "NG",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+234-080-3665-6173",
      contactType: "customer service",
      email: "bomachgroupmanagement@gmail.com",
      areaServed: "NG",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://www.facebook.com/bomachgroup",
      "https://twitter.com/bomachgroup",
      "https://www.linkedin.com/company/bomachgroup",
      "https://www.instagram.com/bomachgroup",
    ],
  };

  return <JsonLdScript data={data} />;
}

/** WebSite schema — enables Google's sitelinks search box. */
export function WebSiteJsonLd() {
  const data: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Bomach Group",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/properties?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLdScript data={data} />;
}

/** Article schema for blog posts. */
export function ArticleJsonLd(props: {
  title: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  url: string;
}) {
  const data: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: props.title,
    description: props.description ?? "",
    image: props.image ? [props.image] : [],
    datePublished: props.datePublished ?? "",
    dateModified: props.dateModified ?? props.datePublished ?? "",
    author: {
      "@type": "Person",
      name: props.author ?? "Bomach Group",
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": props.url },
  };

  return <JsonLdScript data={data} />;
}

/** Real-estate listing schema for property pages. */
export function PropertyJsonLd(props: {
  name: string;
  description?: string;
  image?: string;
  url: string;
  address?: { street?: string; city?: string; state?: string; country?: string };
  category?: string;
}) {
  const data: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: props.name,
    description: props.description ?? "",
    image: props.image ?? "",
    url: props.url,
    category: props.category ?? "Real Estate",
    brand: { "@type": "Brand", name: "Bomach Group" },
    ...(props.address && {
      additionalProperty: {
        "@type": "PostalAddress",
        streetAddress: props.address.street ?? "",
        addressLocality: props.address.city ?? "",
        addressRegion: props.address.state ?? "",
        addressCountry: props.address.country ?? "NG",
      },
    }),
  };

  return <JsonLdScript data={data} />;
}

/** BreadcrumbList schema — drives breadcrumb display in search results. */
export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const data: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLdScript data={data} />;
}
