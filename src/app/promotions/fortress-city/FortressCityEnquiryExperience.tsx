import Link from "next/link";
import type { CampaignLandingData } from "@/lib/campaignPage";
import FortressCityLeadForm from "./FortressCityLeadForm";

type Props = {
  view: CampaignLandingData;
  initialOpen?: boolean;
  closeToPromotion?: boolean;
};

function price(value: string | number) {
  return `₦${Number(value).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

function whatsappUrl(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function FortressCityEnquiryExperience({
  view,
  initialOpen = false,
  closeToPromotion = false,
}: Props) {
  const content = view.content;

  if (!content) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-[#f4f5f7] px-5 py-10 text-slate-950">
        <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10" aria-live="polite">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Bomach Group</p>
          <h1 className="mt-3 font-display text-2xl font-bold sm:text-3xl">Fortress City enquiries are unavailable</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">This campaign is not currently accepting enquiries. Please return to the promotion page for the latest information.</p>
          <Link href="/promotions/fortress-city" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-red-700 px-5 font-semibold text-white transition hover:bg-red-800">View promotion</Link>
        </section>
      </main>
    );
  }

  const contactMessage = `Hello, I would like more information about ${content.headline} at Fortress City Estate, Emene.`;

  return (
    <FortressCityLeadForm
      form={view.leadForm}
      location={content.location}
      promotionPrice={price(content.promotion_price)}
      standardPrice={price(content.standard_price)}
      promotionLimit={content.promotion_limit}
      plotSize={Number(content.plot_size_sqm).toLocaleString()}
      bonusText={content.bonus_text}
      contactPhone={content.contact_phone}
      contactWhatsapp={whatsappUrl(content.contact_whatsapp, contactMessage)}
      initialOpen={initialOpen}
      closeToPromotion={closeToPromotion}
    />
  );
}
