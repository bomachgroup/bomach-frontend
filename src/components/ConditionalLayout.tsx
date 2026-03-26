"use client";

import { usePathname } from "next/navigation";
import ConditionalHeader from "@/components/ConditionalHeader";
import Footer from "@/components/Footer";
import BackToTop from "@/components/ui/BackToTop";
import ScrollProgress from "@/components/ui/ScrollProgress";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isManagement = pathname.startsWith("/management");

  if (isManagement) {
    // Management pages have their own layout — no site header/footer
    return <>{children}</>;
  }

  return (
    <>
      <ConditionalHeader />
      <main>{children}</main>
      <Footer />
      <BackToTop />
      <ScrollProgress />
    </>
  );
}
