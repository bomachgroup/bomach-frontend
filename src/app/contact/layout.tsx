import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Bomach Group. Reach our team for property inquiries, project consultations, and general questions.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Bomach Group",
    description: "Get in touch with our team.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
