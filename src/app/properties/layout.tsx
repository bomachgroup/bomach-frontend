import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties for Sale & Rent in Nigeria",
  description:
    "Browse premium properties from Bomach Group — land, estates, and homes for sale and rent across Nigeria. Verified listings, transparent pricing, and expert support.",
  alternates: { canonical: "/properties" },
  openGraph: {
    title: "Properties for Sale & Rent | Bomach Group",
    description:
      "Browse premium properties from Bomach Group across Nigeria.",
    url: "/properties",
    type: "website",
  },
};

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
