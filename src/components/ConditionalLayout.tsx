"use client";

import { usePathname } from "next/navigation";
import ConditionalHeader from "@/components/ConditionalHeader";
import Footer from "@/components/Footer";
import BackToTop from "@/components/ui/BackToTop";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CampaignPromotionChrome from "@/components/campaigns/CampaignPromotionChrome";
import type { CampaignContentSource } from "@/lib/campaignPage";

export default function ConditionalLayout({ children, campaignContentSource }: {
  children: React.ReactNode
  campaignContentSource: CampaignContentSource
}) {
  const pathname = usePathname();
  const isManagement = pathname.startsWith("/management");

  if (isManagement) {
    // Management pages have their own layout — no site header/footer
    return <>{children}</>;
  }

  return (
    <>
      <ConditionalHeader />
      <CampaignPromotionChrome source={campaignContentSource} />
      <main>{children}</main>
      <Footer />
      <BackToTop />
      <ScrollProgress />
    </>
  );
}
