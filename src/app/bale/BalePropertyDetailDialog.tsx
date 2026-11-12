"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  CircleAlert,
  FileText,
  ImageOff,
  MapPin,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { getBalePropertyDetail } from "@/lib/api";
import type { BaleEstateDetail, BalePropertyDetail } from "@/lib/types";
import { baleMediaUrl } from "./bale-media";

const ApproximateMap = dynamic(() => import("./BaleApproximateMap"), {
  ssr: false,
  loading: () => (
    <div className="h-44 animate-pulse rounded-2xl bg-secondary-100" />
  ),
});

type LoadState = "loading" | "success" | "error";

function formatted(value: number | string | null | undefined): string | null {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number)
    ? new Intl.NumberFormat("en-NG", { maximumFractionDigits: 2 }).format(
        number,
      )
    : null;
}

function money(value: number | string): string {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "Price on request";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function Fact({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="rounded-xl bg-secondary-50 p-3 sm:p-3.5">
      <dt className="text-[10px] font-bold uppercase tracking-[.12em] text-secondary-400">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-semibold text-secondary-900">
        {value}
      </dd>
    </div>
  );
}

export default function BalePropertyDetailDialog({
  estateCode,
  estate,
  propertyId,
  onClose,
}: {
  estateCode: string;
  estate: BaleEstateDetail | null;
  propertyId: number;
  onClose: () => void;
}) {
  const [loadResult, setLoadResult] = useState<{
    key: string;
    property: BalePropertyDetail | null;
  } | null>(null);
  const [retry, setRetry] = useState(0);
  const [activeImageSelection, setActiveImageSelection] = useState({
    propertyId,
    index: 0,
  });
  const [failedImageKey, setFailedImageKey] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const requestKey = `${estateCode}:${propertyId}:${retry}`;
  const isCurrentRequest = loadResult?.key === requestKey;
  const property = isCurrentRequest ? loadResult.property : null;
  const loadState: LoadState = !isCurrentRequest
    ? "loading"
    : property
      ? "success"
      : "error";
  const activeImage =
    activeImageSelection.propertyId === propertyId
      ? activeImageSelection.index
      : 0;

  useEffect(() => {
    const controller = new AbortController();
    getBalePropertyDetail(estateCode, propertyId, { signal: controller.signal })
      .then((result) => {
        setLoadResult({ key: requestKey, property: result });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setLoadResult({ key: requestKey, property: null });
        }
      });
    return () => controller.abort();
  }, [estateCode, propertyId, requestKey]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  const location = [estate?.city_town, estate?.state, estate?.country]
    .filter(Boolean)
    .join(", ");
  const images = property?.images ?? [];
  const currentImage = images[activeImage];
  const currentImageUrl = baleMediaUrl(currentImage?.url ?? null);
  const currentImageKey = `${propertyId}:${activeImage}`;
  const description = property?.description
    .replace(/^\[seed:[^\]]+\]\s*/i, "")
    .trim();
  const typeLabel =
    property?.property_type_display || property?.property_type || "Property";
  const buildingType =
    property?.building_type_residential_display ||
    property?.building_type_commercial_display;
  const area =
    property?.property_type === "commercial"
      ? formatted(property.total_area_commercial)
      : formatted(property?.total_area_residential);
  const areaUnit =
    property?.property_type === "plot" ? property.plot_size_unit : "sqft";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-secondary-950/75 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bale-property-dialog-title"
        tabIndex={-1}
        className="max-h-[94dvh] w-full max-w-5xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl outline-none sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-secondary-100 bg-white/95 px-4 py-3.5 backdrop-blur sm:px-7 sm:py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary-700">
              {estate?.estate_name || "BALE property"}
            </p>
            <h2
              id="bale-property-dialog-title"
              className="mt-1 font-display text-lg font-bold text-secondary-950"
            >
              Property details
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close property details"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-secondary-200 text-secondary-700 transition hover:bg-secondary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loadState === "loading" && (
          <div
            className="grid gap-5 p-4 sm:grid-cols-2 sm:gap-6 sm:p-7"
            aria-live="polite"
          >
            <div className="aspect-[1.4] animate-pulse rounded-2xl bg-secondary-100 sm:aspect-[1.2]" />
            <div className="space-y-4 py-2">
              <div className="h-3 w-24 animate-pulse rounded bg-secondary-100" />
              <div className="h-8 w-3/4 animate-pulse rounded bg-secondary-100" />
              <div className="h-6 w-1/2 animate-pulse rounded bg-secondary-100" />
              <div className="h-32 animate-pulse rounded-2xl bg-secondary-100" />
            </div>
          </div>
        )}

        {loadState === "error" && (
          <div className="px-6 py-16 text-center" role="alert">
            <CircleAlert className="mx-auto h-9 w-9 text-primary-700" />
            <h3 className="mt-4 text-lg font-bold text-secondary-950">
              Property details are unavailable
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-secondary-600">
              This listing may have changed availability. Try again, or close
              this window to continue browsing the estate.
            </p>
            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary-800"
            >
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
          </div>
        )}

        {loadState === "success" && property && (
          <div className="grid gap-5 p-4 sm:gap-7 sm:p-7 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <div className="relative aspect-[1.4] overflow-hidden rounded-2xl bg-secondary-100 sm:aspect-[1.2]">
                {currentImageUrl && failedImageKey !== currentImageKey ? (
                  <Image
                    src={currentImageUrl}
                    alt={currentImage?.caption || property.property_name}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    onError={() => setFailedImageKey(currentImageKey)}
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 bg-secondary-950 px-5 text-center text-white/75">
                    <ImageOff
                      className="h-9 w-9 text-primary-300"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-semibold uppercase tracking-[.12em]">
                      No property photo available
                    </span>
                  </div>
                )}
                <span
                  aria-label="Available property listing"
                  title="This listing is currently marked available in the estate inventory"
                  className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-emerald-800 shadow-sm sm:left-4 sm:top-4"
                >
                  Available
                </span>
              </div>
              {images.length > 1 && (
                <div
                  className="mt-3 flex gap-2 overflow-x-auto pb-1"
                  aria-label="Property images"
                >
                  {images.map((image, index) => {
                    const source = baleMediaUrl(image.url);
                    return (
                      <button
                        key={`${image.url}-${index}`}
                        type="button"
                        onClick={() =>
                          setActiveImageSelection({ propertyId, index })
                        }
                        aria-label={`Show image ${index + 1}`}
                        aria-pressed={activeImage === index}
                        className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${activeImage === index ? "border-primary-600" : "border-transparent"}`}
                      >
                        {source ? (
                          <Image
                            src={source}
                            alt=""
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <span className="block h-full bg-secondary-100" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              {currentImage?.caption && (
                <p className="mt-2 text-xs text-secondary-500">
                  {currentImage.caption}
                </p>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-primary-700">
                  {typeLabel}
                </span>
                {property.plot_use_display && (
                  <span className="rounded-full bg-secondary-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-secondary-600">
                    {property.plot_use_display}
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-display text-2xl font-black leading-tight text-secondary-950 sm:text-3xl">
                {property.property_name}
              </h3>
              <p className="mt-3 text-2xl font-black tracking-tight text-secondary-950">
                {money(property.price)}
              </p>
              <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-secondary-600">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary-600" />
                <span>
                  {location || estate?.estate_name || "Estate location"}
                </span>
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-2.5">
                <Fact
                  label="Plot number"
                  value={
                    property.plot_number ? String(property.plot_number) : null
                  }
                />
                <Fact
                  label={
                    property.property_type === "plot"
                      ? "Plot size"
                      : "Building area"
                  }
                  value={
                    property.property_type === "plot"
                      ? formatted(property.plot_size)
                        ? `${formatted(property.plot_size)} ${property.plot_size_unit || "sqm"}`
                        : null
                      : area
                        ? `${area} ${areaUnit}`
                        : null
                  }
                />
                <Fact label="Building type" value={buildingType || null} />
                <Fact
                  label="Bedrooms"
                  value={property.bedrooms ? `${property.bedrooms}` : null}
                />
                <Fact
                  label="Bathrooms"
                  value={property.bathrooms ? `${property.bathrooms}` : null}
                />
                <Fact
                  label="Floors"
                  value={
                    property.floors_residential || property.number_of_floors
                      ? String(
                          property.floors_residential ||
                            property.number_of_floors,
                        )
                      : null
                  }
                />
                <Fact
                  label="Units / offices"
                  value={
                    property.units_offices
                      ? String(property.units_offices)
                      : null
                  }
                />
              </dl>

              {description && (
                <div className="mt-6 border-t border-secondary-100 pt-5">
                  <h4 className="text-xs font-bold uppercase tracking-[.14em] text-secondary-500">
                    About this property
                  </h4>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-secondary-600">
                    {description}
                  </p>
                </div>
              )}

              <div className="mt-6 border-t border-secondary-100 pt-5">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-secondary-500">
                  <MapPin className="h-4 w-4 text-primary-600" /> Estate
                  location
                </h4>
                {estate?.approximate_location ? (
                  <div className="mt-3">
                    <ApproximateMap
                      location={estate.approximate_location}
                      compact
                    />
                    <p className="mt-2 text-[11px] leading-5 text-secondary-400">
                      Approximate estate area only. Individual plot boundaries
                      and locations are not shown.
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-secondary-600">
                    {location || "Location details are not available."}
                  </p>
                )}
              </div>

              {property.documents.length > 0 && (
                <div className="mt-6 border-t border-secondary-100 pt-5">
                  <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-secondary-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />{" "}
                    Approved property documents
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {property.documents.map((document) => (
                      <li key={document.url}>
                        <a
                          href={baleMediaUrl(document.url) ?? document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-xl border border-secondary-100 px-3.5 py-3 text-sm font-semibold text-secondary-700 transition hover:border-secondary-300 hover:bg-secondary-50"
                        >
                          <FileText className="h-4 w-4 text-primary-600" />
                          <span className="min-w-0 flex-1 truncate">
                            {document.name}
                          </span>
                          <span className="text-xs text-primary-700">
                            Preview
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
