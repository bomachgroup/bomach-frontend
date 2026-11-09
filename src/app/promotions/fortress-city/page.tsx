import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  Sparkles,
} from "lucide-react";
import FortressCityLeadForm from "./FortressCityLeadForm";
import FortressCityAbout from "@/components/campaigns/FortressCityAbout";
import { loadCampaignLandingData } from "@/lib/campaignPage";

export const dynamic = "force-dynamic";

const PAGE_PATH = "/promotions/fortress-city";

export async function generateMetadata(): Promise<Metadata> {
  const view = await loadCampaignLandingData();
  const content = view.content;
  if (!content) {
    return {
      title: "Promotion unavailable | Bomach Group",
      description: "The Fortress City Estate promotion is temporarily unavailable.",
      robots: { index: false, follow: false },
    };
  }

  const title = content.social_title || content.headline;
  const description = content.social_description || content.subheadline;
  const image = content.social_image_url || content.hero_image_url;
  return {
    title,
    description,
    alternates: { canonical: PAGE_PATH },
    openGraph: {
      type: "website",
      url: PAGE_PATH,
      title,
      description,
      siteName: "Bomach Group",
      locale: "en_NG",
      images: image ? [{ url: image, width: 1200, height: 1500, alt: "Fortress City Estate, Emene" }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

function price(value: string | number) {
  return `₦${Number(value).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

function whatsappUrl(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default async function FortressCityPromotionPage() {
  const view = await loadCampaignLandingData();
  if (!view.content) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-5 py-16 sm:px-8" aria-live="polite">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Bomach Group</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-slate-950 sm:text-4xl">Promotion currently unavailable</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600">We could not load the current Fortress City Estate campaign details. Please check back later.</p>
          <Link href="/" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-slate-950 px-5 font-semibold text-white transition hover:bg-slate-800">Return to Bomach Group <ArrowRight size={17} /></Link>
        </div>
      </section>
    );
  }

  const content = view.content;
  const contactMessage = `Hello, I would like more information about ${content.headline} at Fortress City Estate, Emene.`;
  const phoneHref = `tel:${content.contact_phone.replace(/[^+\d]/g, "")}`;
  const whatsappHref = whatsappUrl(content.contact_whatsapp, contactMessage);
  const imageSrc = content.hero_image_url || "/images/campaigns/fortress-city-promo.jpg";
  const localImage = imageSrc.startsWith("/");

  return (
    <div className="min-w-0 overflow-hidden bg-[#f7f7f4] text-slate-950">
      <section className="relative isolate overflow-hidden bg-[#0c1832] text-white">
        <div className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-red-700/20 blur-[100px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-sky-500/10 blur-[100px]" />
        <div className="container-custom relative grid min-w-0 items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-24">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white/80"><Sparkles size={14} className="text-amber-300" />{content.eyebrow}</p>
            <h1 className="mt-6 max-w-3xl break-words font-display text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">{content.headline}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">{content.subheadline}</p>

            <div className="mt-8 max-w-xl rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Promotional price</p>
                  <p className="mt-1 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">{price(content.promotion_price)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-white/55">Actual price</p>
                  <p className="mt-1 text-lg font-semibold text-white/65 line-through decoration-red-400 decoration-2">{price(content.standard_price)}</p>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-3 border-t border-white/10 pt-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-300 text-[#0c1832]"><Check size={15} strokeWidth={3} /></span>
                <p className="text-sm leading-relaxed text-white/85">Promotional price applies to the <strong>first {content.promotion_limit} plots</strong>.</p>
              </div>
              <div className="mt-4 flex items-start gap-3 rounded-xl bg-red-700/20 px-3.5 py-3">
                <Sparkles size={17} className="mt-0.5 shrink-0 text-amber-300" />
                <p className="text-sm font-semibold leading-relaxed text-white">{content.bonus_text}</p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#enquire" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-700 px-5 text-sm font-bold text-white shadow-lg shadow-red-950/20 transition hover:bg-red-600">Start your enquiry <ArrowRight size={17} /></a>
              <a href={phoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/10"><Phone size={16} /> Call {content.contact_phone}</a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2"><Ruler size={16} className="text-amber-300" />{Number(content.plot_size_sqm).toLocaleString()} sqm plot</span>
              <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-amber-300" />{content.location}</span>
            </div>
          </div>

          <div className="relative mx-auto w-full min-w-0 max-w-[32rem]">
            <div className="absolute -inset-3 rounded-[2rem] border border-white/10" />
            <div className="relative overflow-hidden rounded-[1.65rem] border border-white/15 bg-white/5 p-2 shadow-2xl shadow-black/30">
              {localImage ? (
                <Image src={imageSrc} alt="Fortress City Estate promotional offer in Emene, Enugu" width={862} height={1080} priority className="h-auto max-h-[70vh] w-full rounded-[1.25rem] object-contain" sizes="(max-width: 1024px) 90vw, 42vw" />
              ) : (
                <img src={imageSrc} alt="Fortress City Estate promotional offer in Emene, Enugu" className="h-auto max-h-[70vh] w-full rounded-[1.25rem] object-contain" />
              )}
            </div>
            <div className="absolute -bottom-4 left-3 right-3 rounded-2xl border border-slate-200 bg-white p-4 text-slate-950 shadow-xl sm:left-auto sm:right-5 sm:w-[19rem]">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-700">Fortress City Estate</p>
              <p className="mt-1 font-display text-lg font-bold">Buy. Build. Live.</p>
              <p className="mt-1 text-xs text-slate-600">{content.location} · {Number(content.plot_size_sqm).toLocaleString()} sqm</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-custom grid gap-10 py-20 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 lg:py-24">
        <div className="min-w-0">
          <FortressCityAbout description={content.description} />
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-emerald-600 hover:text-emerald-800"><MessageCircle size={17} /> Ask us on WhatsApp</a>
        </div>

        {(content.proximity.length > 0 || content.features.length > 0) && (
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            {content.proximity.length > 0 && <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700"><MapPin size={20} /></div>
              <h3 className="mt-4 font-display text-lg font-bold">Nearby landmarks</h3>
              <ul className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
                {content.proximity.map((item) => <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-700" />{item}</li>)}
              </ul>
            </article>}
            {content.features.length > 0 && <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Check size={20} /></div>
              <h3 className="mt-4 font-display text-lg font-bold">Estate features</h3>
              <ul className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
                {content.features.map((item) => <li key={item} className="flex gap-2"><span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800"><Check size={11} strokeWidth={3} /></span>{item}</li>)}
              </ul>
            </article>}
          </div>
        )}
      </section>

      <section id="enquire" className="scroll-mt-8 bg-[#ecece8] py-16 sm:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-9 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:p-11">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Private property enquiry</p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">Tell us what you are looking for.</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">Share a few details and our team will help with the offer, payment options, and a site or virtual inspection.</p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-slate-600">
                <a href={phoneHref} className="inline-flex min-h-10 items-center gap-2 hover:text-red-700"><Phone size={16} />{content.contact_phone}</a>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 hover:text-emerald-700"><MessageCircle size={16} />WhatsApp</a>
              </div>
            </div>
            <a href="#enquire" className="mt-6 inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-xl bg-red-700 px-6 text-base font-bold text-white shadow-lg shadow-red-950/15 transition hover:bg-red-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-700/25 lg:mt-0">Open enquiry form <ArrowRight size={19} /></a>
          </div>
        </div>
      </section>

      <FortressCityLeadForm
        form={view.leadForm}
        location={content.location}
        promotionPrice={price(content.promotion_price)}
        standardPrice={price(content.standard_price)}
        promotionLimit={content.promotion_limit}
        plotSize={Number(content.plot_size_sqm).toLocaleString()}
        bonusText={content.bonus_text}
        contactPhone={content.contact_phone}
        contactWhatsapp={whatsappHref}
      />

      <div className="container-custom flex flex-col gap-3 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Fortress City Estate · {content.location}</p>
        <Link href="/" className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-red-700">Bomach Group <ArrowRight size={14} /></Link>
      </div>
    </div>
  );
}
