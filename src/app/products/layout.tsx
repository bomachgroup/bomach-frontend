import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore the range of products and services offered by Bomach Group across construction, real estate, engineering, and more.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Products | Bomach Group",
    description: "Explore our products and services.",
    url: "/products",
    type: "website",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
