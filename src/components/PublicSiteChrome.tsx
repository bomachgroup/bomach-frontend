"use client";

import ConditionalHeader from "@/components/ConditionalHeader";
import Footer from "@/components/Footer";
import BackToTop from "@/components/ui/BackToTop";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CampaignPromotionChrome from "@/components/campaigns/CampaignPromotionChrome";
import type { CampaignContentSource } from "@/lib/campaignPage";

export default function PublicSiteChrome({ children, source }: {
  children: React.ReactNode;
  source: CampaignContentSource;
}) {
  return (
    <>
      <ConditionalHeader />
      <CampaignPromotionChrome source={source} />
      <main>{children}</main>
      <Footer />
      <BackToTop />
      <ScrollProgress />
    </>
  );
}
