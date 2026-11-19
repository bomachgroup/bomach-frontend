"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { CampaignContentSource } from "@/lib/campaignPage";

const PublicSiteChrome = dynamic(() => import("@/components/PublicSiteChrome"));

export default function ConditionalLayout({ children, campaignContentSource }: {
  children: React.ReactNode
  campaignContentSource: CampaignContentSource
}) {
  const pathname = usePathname();
  const isManagement = pathname.startsWith("/management");
  const isFortressEnquiry = pathname === "/promotions/fortress-city/enquire";

  if (isManagement || isFortressEnquiry) {
    // Management and direct campaign-enquiry pages have their own layout.
    return <>{children}</>;
  }

  if (pathname === "/promotions/fortress-city") {
    return (
      <Suspense fallback={<PublicSiteChrome source={campaignContentSource}>{children}</PublicSiteChrome>}>
        <FortressCityRouteShell source={campaignContentSource}>{children}</FortressCityRouteShell>
      </Suspense>
    );
  }

  return <PublicSiteChrome source={campaignContentSource}>{children}</PublicSiteChrome>;
}

function FortressCityRouteShell({ children, source }: {
  children: React.ReactNode;
  source: CampaignContentSource;
}) {
  const searchParams = useSearchParams();
  const isDirectEnquiry = searchParams.get("enquire") === "1" || searchParams.get("lead") === "1";

  if (isDirectEnquiry) return <>{children}</>;

  return (
    <PublicSiteChrome source={source}>{children}</PublicSiteChrome>
  );
}
