import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Book a free consultation with Bomach Group. Schedule a meeting with our property and project specialists at a time that suits you.",
  alternates: { canonical: "/booking" },
  openGraph: {
    title: "Book a Consultation | Bomach Group",
    description: "Schedule a free consultation with our team.",
    url: "/booking",
    type: "website",
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
