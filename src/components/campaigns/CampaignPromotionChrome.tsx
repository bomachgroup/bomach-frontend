"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Gift, PhoneCall, Ruler, X } from "lucide-react";
import {
  fortressCitySiteContent,
  type CampaignContentSource,
  type CampaignPageContent,
} from "@/lib/campaignPage";

const DISMISSED_KEY = "bomach:fortress-city-promo-dismissed-at";
const BANNER_DISMISSED_KEY = "bomach:fortress-city-banner-dismissed-at";
const DISMISS_FOR_MS = 24 * 60 * 60 * 1000;
const SHOW_AFTER_MS = 10 * 1000;
const CAMPAIGN_PATH = "/promotions/fortress-city";
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
let promotionSeenInSession = false;

type LoadState = { status: "loading" | "ready" | "unavailable"; content: CampaignPageContent | null };

function wasDismissedRecently() {
  if (IS_DEVELOPMENT) return false;
  if (promotionSeenInSession) return true;
  try {
    const value = window.localStorage.getItem(DISMISSED_KEY);
    if (!value) return false;
    const timestamp = Number(value);
    const age = Date.now() - timestamp;
    if (Number.isFinite(timestamp) && age >= 0 && age < DISMISS_FOR_MS) {
      promotionSeenInSession = true;
      return true;
    }
    window.localStorage.removeItem(DISMISSED_KEY);
  } catch {
    // The promotion can still be shown when storage is unavailable.
  }
  return false;
}

function recordPromotionSeen() {
  if (IS_DEVELOPMENT) return;
  promotionSeenInSession = true;
  try {
    window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  } catch {
    // The promotion remains limited to the current page session without storage.
  }
}

function formatPrice(value: string | number) {
  return `₦${Number(value).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

function PromotionTicker({ content }: { content: CampaignPageContent }) {
  const details = [
    `${formatPrice(content.promotion_price)} for the first ${content.promotion_limit} plots`,
    `${content.plot_size_sqm} sqm plots in ${content.location}`,
    `${content.bonus_blocks} free building blocks with every purchase`,
    `Standard price ${formatPrice(content.standard_price)}`,
  ];

  return (
    <span className="relative min-w-0 flex-1 overflow-hidden" aria-hidden="true">
      <span className="fortress-promo-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <span key={copy} className="flex shrink-0 items-center">
            {details.map((detail, index) => (
              <span key={`${copy}-${detail}`} className="flex items-center whitespace-nowrap text-[11px] font-semibold text-slate-700 sm:text-xs">
                {index > 0 && <span className="mx-3 text-red-700/55">/</span>}
                {detail}
              </span>
            ))}
            <span className="mx-4 h-1.5 w-1.5 rounded-full bg-amber-500" />
          </span>
        ))}
      </span>
      <span className="fortress-promo-static truncate text-[11px] font-semibold text-slate-700">
        {formatPrice(content.promotion_price)} · {content.plot_size_sqm} sqm · {content.bonus_blocks} free blocks
      </span>
    </span>
  );
}

export default function CampaignPromotionChrome({ source }: { source: CampaignContentSource }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [loadState, setLoadState] = useState<LoadState>(() => source === "site"
    ? { status: "ready", content: fortressCitySiteContent }
    : { status: "loading", content: null });
  const [isOpen, setIsOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const isCampaignPage = pathname === CAMPAIGN_PATH || pathname?.startsWith(`${CAMPAIGN_PATH}/`);

  useEffect(() => {
    if (source !== "backend") return;
    const controller = new AbortController();
    setLoadState({ status: "loading", content: null });
    fetch("/api/v1/public/campaign-pages/fortress-city", {
      cache: "no-store",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Campaign unavailable");
        return response.json() as Promise<CampaignPageContent>;
      })
      .then((content) => setLoadState({ status: "ready", content }))
      .catch(() => {
        if (!controller.signal.aborted) setLoadState({ status: "unavailable", content: null });
      });
    return () => controller.abort();
  }, [source]);

  useEffect(() => {
    if (!loadState.content || loadState.status !== "ready") return;
    if (isCampaignPage) {
      setIsBannerVisible(false);
      return;
    }
    if (IS_DEVELOPMENT) {
      setIsBannerDismissed(false);
      setIsBannerVisible(true);
      return;
    }
    try {
      const dismissedAt = Number(window.localStorage.getItem(BANNER_DISMISSED_KEY));
      const age = Date.now() - dismissedAt;
      if (Number.isFinite(dismissedAt) && dismissedAt > 0 && age >= 0 && age < DISMISS_FOR_MS) {
        setIsBannerDismissed(true);
        setIsBannerVisible(false);
        return;
      }
      window.localStorage.removeItem(BANNER_DISMISSED_KEY);
    } catch {
      // Keep the banner available when browser storage is disabled.
    }
    setIsBannerVisible(true);
  }, [isCampaignPage, loadState]);

  useEffect(() => {
    setIsOpen(false);
    if (!loadState.content || loadState.status !== "ready" || isCampaignPage || isBannerDismissed || (!IS_DEVELOPMENT && wasDismissedRecently())) return;
    if (IS_DEVELOPMENT) {
      setIsOpen(true);
      return;
    }
    const timer = window.setTimeout(() => {
      recordPromotionSeen();
      setIsOpen(true);
    }, SHOW_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [isBannerDismissed, isCampaignPage, loadState]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        recordPromotionSeen();
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function dismiss() {
    recordPromotionSeen();
    setIsOpen(false);
  }

  function dismissBanner() {
    setIsBannerDismissed(true);
    setIsBannerVisible(false);
    setIsOpen(false);
    recordPromotionSeen();
    if (!IS_DEVELOPMENT) {
      try {
        window.localStorage.setItem(BANNER_DISMISSED_KEY, String(Date.now()));
      } catch {
        // The banner stays dismissed for this page session if storage is unavailable.
      }
    }
  }

  const content = loadState.content;
  if (!content || loadState.status !== "ready") return null;

  return (
    <>
      {isBannerVisible && !isCampaignPage && (
        <div className={pathname === "/" ? "absolute left-0 right-0 top-20 z-20 lg:top-24" : "relative z-20"}>
          <div className="overflow-hidden border-y border-red-900/10 bg-gradient-to-r from-[#fff8f1] via-white to-[#fff8f1] text-slate-900 shadow-[0_8px_28px_rgba(25,35,58,0.12)]">
            <div className="container-custom flex min-h-[58px] items-center gap-2 py-2 sm:min-h-[62px] sm:gap-3">
              <Link
                href={CAMPAIGN_PATH}
                className="fortress-promo-link group flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-lg text-left outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-700 sm:gap-3"
                aria-label={`Explore Fortress City Estate in ${content.location}: ${formatPrice(content.promotion_price)} for the first ${content.promotion_limit} plots, ${content.plot_size_sqm} square metres, and ${content.bonus_blocks} free building blocks with every purchase. Standard price ${formatPrice(content.standard_price)}.`}
              >
                <span className="shrink-0 border-r border-red-900/15 pr-2 sm:pr-3">
                  <span className="block text-[8px] font-extrabold uppercase leading-tight tracking-[0.13em] text-red-800 sm:text-[9px]">Fortress City</span>
                  <span className="mt-0.5 block whitespace-nowrap text-[9px] font-semibold leading-tight text-slate-600 sm:text-[10px]">First {content.promotion_limit} plots</span>
                </span>
                <PromotionTicker content={content} />
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-800 px-2.5 py-2 text-[10px] font-bold text-white transition-colors group-hover:bg-red-950 sm:px-3 sm:text-[11px]">
                  <span>Explore</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </span>
              </Link>
              <button
                type="button"
                onClick={dismissBanner}
                aria-label="Dismiss Fortress City promotion for 24 hours"
                title="Dismiss promotion"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-red-50 hover:text-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
              >
                <X size={17} />
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isOpen && !isCampaignPage && (
          <motion.aside
            initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.28, ease: "easeOut" }}
            className="fixed inset-x-2 top-2 bottom-2 z-[60] mx-auto flex max-h-[calc(100dvh-1rem)] w-auto max-w-[42rem] flex-col overflow-hidden rounded-[1.6rem] border border-white/80 bg-white text-slate-950 shadow-[0_24px_80px_rgba(10,18,38,0.38)] min-[640px]:bottom-6 min-[640px]:left-auto min-[640px]:right-6 min-[640px]:top-auto min-[640px]:mx-0 min-[640px]:max-h-[calc(100dvh-3rem)] min-[640px]:w-[min(42rem,calc(100vw-3rem))] min-[640px]:overflow-y-auto"
            aria-label="Fortress City Estate promotion"
          >
            <div className="fortress-promo-accent h-1.5 bg-gradient-to-r from-red-800 via-amber-400 to-blue-900" />
            <div className="flex shrink-0 items-center justify-between gap-3 bg-[#111a35] px-4 py-3 text-white sm:px-5">
              <div className="min-w-0">
                <p className="truncate text-[9px] font-bold uppercase tracking-[0.2em] text-amber-300">Fortress City</p>
                <p className="mt-1 font-display text-base font-bold leading-tight sm:text-lg">A stronger start for your build.</p>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss Fortress City promotion"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <X size={17} />
              </button>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_auto] gap-2 p-3 min-[640px]:flex-none min-[640px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] min-[640px]:grid-rows-1 min-[640px]:gap-4 min-[640px]:p-4 sm:gap-5 sm:p-5">
              <div className="flex min-h-0 min-w-0 justify-center min-[640px]:items-center">
                <img
                  src={content.hero_image_url || fortressCitySiteContent.hero_image_url}
                  alt={`Fortress City Estate campaign flyer for ${content.location}, showing the ${formatPrice(content.promotion_price)} offer`}
                  className="block h-full w-auto max-h-full max-w-full object-contain min-[640px]:h-auto min-[640px]:max-h-[72dvh]"
                />
              </div>

              <div className="flex min-w-0 flex-col justify-center border-t border-slate-100 pt-2 min-[640px]:border-t-0 min-[640px]:pt-0">
                <div className="min-w-0">
                  <span className="mb-1 inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.14em] text-red-800 min-[640px]:mb-0 min-[640px]:text-[9px]">
                    First {content.promotion_limit} plots
                  </span>
                  <div className="rounded-xl border border-red-100 bg-gradient-to-br from-red-50 to-white px-3 py-2 min-[640px]:mt-2 min-[640px]:py-2.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-red-800">Promotional price</p>
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                      <span className="font-display text-xl font-extrabold leading-tight tracking-tight text-[#121a34] min-[640px]:mt-0.5 min-[640px]:text-[28px]">{formatPrice(content.promotion_price)}</span>
                      <span className="text-[9px] font-medium text-slate-500 min-[640px]:mt-0.5 min-[640px]:block min-[640px]:text-[10px]">Standard price <s>{formatPrice(content.standard_price)}</s></span>
                    </div>
                  </div>
                  <div className="mt-2 hidden gap-1.5 min-[640px]:grid">
                    <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-2 py-1.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-800">
                        <Ruler size={13} aria-hidden="true" />
                      </span>
                      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                        <p className="text-[8px] font-bold uppercase tracking-[0.08em] text-blue-800">Plot size</p>
                        <span className="shrink-0 rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold leading-tight text-blue-900">{content.plot_size_sqm} sqm</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-1.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-800">
                        <Gift size={13} aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-[8px] font-bold uppercase tracking-[0.08em] text-emerald-800">Purchase bonus</p>
                          <span className="shrink-0 rounded-full bg-white px-1.5 py-0.5 text-[7px] font-extrabold uppercase tracking-wide leading-tight text-emerald-800 shadow-sm">Included</span>
                        </div>
                        <p className="text-[10px] font-semibold leading-tight text-slate-800">{content.bonus_blocks} free building blocks with every purchase</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  href={CAMPAIGN_PATH}
                  onClick={() => setIsOpen(false)}
                  className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-red-800 px-3 py-2 text-sm font-bold text-white shadow-[0_8px_20px_rgba(153,27,27,0.2)] transition hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 min-[640px]:mt-4 min-[640px]:min-h-11 min-[640px]:py-2.5"
                >
                  Explore the offer <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <a
                  href={`tel:${content.contact_phone.replace(/[^+\d]/g, "")}`}
                  className="mt-1 inline-flex min-h-6 w-fit max-w-full items-center justify-center gap-1 self-center rounded-lg px-2 text-[8px] font-semibold text-slate-500 transition hover:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 min-[640px]:mt-1.5 min-[640px]:min-h-9 min-[640px]:self-start min-[640px]:border min-[640px]:border-emerald-200 min-[640px]:bg-emerald-50 min-[640px]:px-3 min-[640px]:text-[11px] min-[640px]:font-bold min-[640px]:text-emerald-900 min-[640px]:hover:border-emerald-300 min-[640px]:hover:bg-emerald-100"
                >
                  <PhoneCall size={11} className="min-[640px]:h-[13px] min-[640px]:w-[13px]" aria-hidden="true" />
                  Call {content.contact_phone}
                </a>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
