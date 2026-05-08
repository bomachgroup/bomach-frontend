import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import ConditionalLayout from "@/components/ConditionalLayout";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bomachgroup.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bomach Group - Construction, Engineering & Real Estate",
    template: "%s | Bomach Group",
  },
  description:
    "Bomach Group is a leading construction, engineering, and real estate company delivering quality projects across Nigeria. Premium properties, expert engineering, and innovative digital solutions.",
  keywords: [
    "Bomach Group",
    "Bomach",
    "real estate Nigeria",
    "construction Nigeria",
    "engineering Nigeria",
    "Enugu real estate",
    "property Nigeria",
    "land for sale Nigeria",
    "estate Enugu",
    "construction company",
    "property investment Nigeria",
  ],
  authors: [{ name: "Bomach Group", url: SITE_URL }],
  creator: "Bomach Group",
  publisher: "Bomach Group",
  applicationName: "Bomach Group",
  category: "Real Estate & Construction",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/images/logo/bomach-logo-hd.png",
    shortcut: "/images/logo/bomach-logo-hd.png",
    apple: "/images/logo/bomach-logo-hd.png",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: "Bomach Group",
    title: "Bomach Group - Construction, Engineering & Real Estate",
    description:
      "Bomach Group is a leading construction, engineering, and real estate company delivering quality projects across Nigeria.",
    images: [
      {
        url: "/images/logo/bomach-logo-hd.png",
        width: 1024,
        height: 1024,
        alt: "Bomach Group Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bomach Group - Construction, Engineering & Real Estate",
    description:
      "Premium real estate, expert engineering, and innovative digital solutions across Nigeria.",
    images: ["/images/logo/bomach-logo-hd.png"],
    creator: "@bomachgroup",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "qXOT8KPoodAKReDpYcbyK2RLlhlqZS2wSdqWOaYpbWc",
  },
};

export const viewport: Viewport = {
  themeColor: "#dc2626",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import { AuthProvider } from "@/contexts/AuthContext";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`${inter.variable} ${outfit.variable} scroll-smooth`}
      data-scroll-behavior='smooth'>
      <body className='font-sans'>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
