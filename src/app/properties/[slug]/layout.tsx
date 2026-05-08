import type { Metadata } from "next";
import { getPropertyById, sanitizeImageUrl } from "@/lib/api";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bomachgroup.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const property = await getPropertyById(slug);
    const description = property.description
      ? property.description.replace(/<[^>]*>/g, "").slice(0, 160)
      : `${property.name} — a property listed by Bomach Group in ${property.city}, ${property.state}.`;
    const image = property.property_images?.[0]
      ? sanitizeImageUrl(property.property_images[0])
      : undefined;
    const url = `${SITE_URL}/properties/${slug}`;

    return {
      title: property.name,
      description,
      alternates: { canonical: `/properties/${slug}` },
      openGraph: {
        type: "article",
        title: property.name,
        description,
        url,
        siteName: "Bomach Group",
        images: image ? [{ url: image, alt: property.name }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: property.name,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: "Property" };
  }
}

export default function PropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
