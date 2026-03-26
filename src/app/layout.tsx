import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://bomachgroup.com",
  ),
  title: "Bomach Group - Construction, Engineering & Real Estate",
  description:
    "Bomach Group is a leading construction, engineering, and real estate company delivering quality projects across Nigeria.",
  icons: {
    icon: "/images/logo/bomach-logo-hd.png",
    shortcut: "/images/logo/bomach-logo-hd.png",
  },
  openGraph: {
    type: "website",
    title: "Bomach Group",
    description: "Bomach Group Website",
    images: [
      {
        url: "/images/logo/bomach-logo-hd.png",
        width: 1024,
        height: 1024,
      },
    ],
  },
};

import { AuthProvider } from "@/contexts/AuthContext";

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
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
