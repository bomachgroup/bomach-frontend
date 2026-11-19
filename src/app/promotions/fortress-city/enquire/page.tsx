import type { Metadata } from "next";
import FortressCityEnquiryExperience from "../FortressCityEnquiryExperience";
import { loadCampaignLandingData } from "@/lib/campaignPage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Fortress City enquiry",
  robots: { index: false, follow: true },
};

export default async function FortressCityEnquiryPage() {
  const view = await loadCampaignLandingData();

  return (
    <FortressCityEnquiryExperience
      view={view}
      initialOpen
      closeToPromotion
    />
  );
}
