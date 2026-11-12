"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  ArrowRight,
  BedDouble,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  FileText,
  LandPlot,
  MapPin,
  RefreshCw,
  Ruler,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  getBaleEstateDetail,
  getBaleEstateProperties,
  getBaleEstates,
} from "@/lib/api";
import type {
  BaleEstate,
  BaleEstateDetail,
  BaleProperty,
  PaginatedBaleProperties,
} from "@/lib/types";
import { baleMediaUrl } from "./bale-media";
import BalePropertyDetailDialog from "./BalePropertyDetailDialog";

const ApproximateMap = dynamic(() => import("./BaleApproximateMap"), {
  ssr: false,
  loading: () => (
    <div className="h-48 animate-pulse rounded-2xl bg-secondary-100 sm:h-72" />
  ),
});

const PAGE_SIZE = 24;

type EstateLoadState = "loading" | "success" | "error";
type PropertyLoadState = "idle" | "loading" | "success" | "error";

function displayInventoryDescription(value: string): string {
  return value.replace(/^\[seed:[^\]]+\]\s*/i, "").trim();
}

function formatNaira(value: number | string): string {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "Price on request";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatMeasure(value: number | string | null): string | null {
  if (value === null || value === "") return null;
  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-NG", { maximumFractionDigits: 2 }).format(
        amount,
      )
    : null;
}

function propertyMeasure(property: BaleProperty): string | null {
  if (property.plot_size !== null) {
    const size = formatMeasure(property.plot_size);
    return size ? `${size} ${property.plot_size_unit || "sqm"}` : null;
  }
  const totalArea = formatMeasure(
    property.property_type === "commercial"
      ? property.total_area_commercial
      : property.total_area_residential,
  );
  return totalArea ? `${totalArea} sqft` : null;
}

function EstateSkeleton() {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-label="Loading estates"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="h-40 animate-pulse rounded-2xl border border-secondary-100 bg-white p-4 sm:h-44 sm:p-6"
        >
          <div className="h-3 w-24 rounded bg-secondary-100" />
          <div className="mt-5 h-6 w-3/4 rounded bg-secondary-100" />
          <div className="mt-3 h-3 w-1/2 rounded bg-secondary-100" />
          <div className="mt-8 h-3 w-2/3 rounded bg-secondary-100" />
        </div>
      ))}
    </div>
  );
}

function PropertySkeleton() {
  return (
    <div
      className="max-h-[min(94vh,560px)] overflow-y-auto overscroll-contain rounded-2xl border border-secondary-200 bg-secondary-50/60 p-2"
      role="region"
      aria-label="Loading property listings"
      tabIndex={0}
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 16 }, (_, index) => (
          <div
            key={index}
            className="flex min-h-[120px] flex-col rounded-xl border border-secondary-100 bg-white p-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="h-7 w-7 animate-pulse rounded-md bg-secondary-100" />
              <div className="h-5 w-14 animate-pulse rounded-full bg-secondary-100" />
            </div>
            <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-secondary-100" />
            <div className="mt-1 h-3 w-2/3 animate-pulse rounded bg-secondary-100" />
            <div className="mt-auto flex items-center justify-between gap-2 pt-1">
              <div className="h-4 w-2/5 animate-pulse rounded bg-secondary-100" />
              <div className="h-8 w-16 animate-pulse rounded-lg bg-secondary-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PropertyThumbnail({ property }: { property: BaleProperty }) {
  const [failed, setFailed] = useState(false);
  const source = baleMediaUrl(property.images?.[0]?.url ?? null);

  if (!source || failed) {
    return (
      <div
        role="img"
        aria-label="No property photo available"
        title="No property photo available"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary-50 text-primary-600"
      >
        <LandPlot className="h-3.5 w-3.5" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md bg-secondary-100">
      <Image
        src={source}
        alt={property.images?.[0]?.caption || property.property_name}
        fill
        sizes="28px"
        unoptimized
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function EstateCard({
  estate,
  selected,
  onSelect,
}: {
  estate: BaleEstate;
  selected: boolean;
  onSelect: () => void;
}) {
  const perSquareMetre = Number(estate.price_per_sqm);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative flex min-h-40 flex-col items-start rounded-2xl border p-4 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:min-h-44 sm:p-5 ${
        selected
          ? "border-secondary-950 bg-secondary-950 text-white shadow-lg shadow-secondary-950/15"
          : "border-secondary-100 bg-white text-secondary-900 hover:border-secondary-300"
      }`}
    >
      <span
        className={`text-[10px] font-bold uppercase tracking-[.18em] ${selected ? "text-primary-300" : "text-primary-700"}`}
      >
        {estate.estate_type || "Participating estate"}
      </span>
      <span className="mt-3 font-display text-xl font-bold leading-tight">
        {estate.estate_name}
      </span>
      <span
        className={`mt-2 inline-flex items-center gap-1.5 text-sm ${selected ? "text-white/65" : "text-secondary-500"}`}
      >
        <MapPin className="h-3.5 w-3.5" />
        {[estate.city_town, estate.state].filter(Boolean).join(", ")}
      </span>
      <span
        className={`mt-auto flex w-full items-center justify-between border-t pt-4 text-sm font-semibold ${selected ? "border-white/15 text-white" : "border-secondary-100 text-secondary-800"}`}
      >
        <span>
          {Number.isFinite(perSquareMetre) && perSquareMetre > 0 ? (
            <>
              {formatNaira(perSquareMetre)}{" "}
              <span
                className={`text-xs font-medium ${selected ? "text-white/55" : "text-secondary-400"}`}
              >
                / sqm
              </span>
            </>
          ) : (
            "Price per sqm on request"
          )}
        </span>
        <ArrowRight
          className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${selected ? "text-primary-300" : "text-primary-600"}`}
        />
      </span>
    </button>
  );
}

function EstateLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="rounded-2xl border border-red-200 bg-red-50 p-7 text-center"
      role="alert"
    >
      <CircleAlert className="mx-auto h-8 w-8 text-primary-700" />
      <h3 className="mt-4 text-lg font-bold text-secondary-950">
        The BALE catalogue is unavailable
      </h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-secondary-600">
        We couldn&apos;t load participating estates. Please try again in a
        moment.
      </p>
      <button
        onClick={onRetry}
        type="button"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary-800"
      >
        <RefreshCw className="h-4 w-4" /> Try again
      </button>
    </div>
  );
}

function PropertyTile({
  property,
  onView,
}: {
  property: BaleProperty;
  onView: () => void;
}) {
  const measure = propertyMeasure(property);
  const typeLabel = property.property_type_display || property.property_type;
  const useLabel = property.plot_use_display || property.plot_use;

  return (
    <article className="flex min-h-[120px] min-w-0 flex-col rounded-xl border border-secondary-200 bg-white p-2 transition-colors hover:border-secondary-300 hover:shadow-md">
      <div className="flex min-w-0 items-center justify-between gap-1.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <PropertyThumbnail property={property} />
          <p className="truncate text-[9px] font-semibold uppercase tracking-[.08em] text-secondary-500">
            {typeLabel}
          </p>
        </div>
        <span
          role="img"
          aria-label="Available property listing"
          title="Currently marked available in the estate inventory"
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-1 text-[8px] font-bold uppercase tracking-wide text-emerald-800"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          <span className="hidden min-[360px]:inline">Available</span>
        </span>
      </div>
      <h3 className="mt-1 truncate font-display text-sm font-bold leading-5 text-secondary-950 sm:text-base">
        {property.property_name}
      </h3>
      <div className="mt-1 flex min-w-0 items-center gap-1 truncate text-[10px] font-medium text-secondary-600 sm:text-xs">
        {measure && (
          <span className="inline-flex min-w-0 items-center gap-1 truncate">
            <Ruler className="h-3 w-3 shrink-0 text-primary-600" />
            <span className="truncate">{measure}</span>
          </span>
        )}
        {useLabel && <span className="truncate">{useLabel}</span>}
        {!measure && !useLabel && property.bedrooms !== null && (
          <span className="inline-flex items-center gap-1 truncate">
            <BedDouble className="h-3 w-3 shrink-0 text-primary-600" />
            {property.bedrooms} bed
          </span>
        )}
      </div>
      <div className="mt-auto flex min-w-0 items-center justify-between gap-1 pt-1">
        <p className="min-w-0 truncate text-sm font-black leading-5 tracking-tight text-secondary-950 sm:text-base">
          {formatNaira(property.price)}
        </p>
        <button
          type="button"
          onClick={onView}
          aria-label={`View details for ${property.property_name}`}
          className="inline-flex min-h-8 shrink-0 items-center justify-center gap-1 rounded-lg bg-secondary-950 px-2 text-[10px] font-bold text-white transition hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:text-xs"
        >
          Details <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}

export default function BaleInventoryExplorer() {
  const [estates, setEstates] = useState<BaleEstate[]>([]);
  const [estateState, setEstateState] = useState<EstateLoadState>("loading");
  const [selectedEstateCode, setSelectedEstateCode] = useState("");
  const [estateRetry, setEstateRetry] = useState(0);
  const [propertyPage, setPropertyPage] = useState(0);
  const [propertyState, setPropertyState] = useState<PropertyLoadState>("idle");
  const [propertyResult, setPropertyResult] =
    useState<PaginatedBaleProperties | null>(null);
  const [propertyRetry, setPropertyRetry] = useState(0);
  const [estateDetail, setEstateDetail] = useState<BaleEstateDetail | null>(
    null,
  );
  const [estateDetailCode, setEstateDetailCode] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null,
  );
  const [draftFilters, setDraftFilters] = useState({
    search: "",
    propertyType: "",
    minSizeSqm: "",
    maxSizeSqm: "",
  });
  const [filters, setFilters] = useState(draftFilters);
  const [filterError, setFilterError] = useState("");

  const selectedEstate =
    estates.find((estate) => estate.estate_code === selectedEstateCode) ?? null;
  const selectedEstateDetail =
    estateDetailCode === selectedEstateCode ? estateDetail : null;
  const estateDescription = selectedEstate
    ? displayInventoryDescription(selectedEstate.estate_description)
    : "";

  useEffect(() => {
    const controller = new AbortController();
    getBaleEstates({ signal: controller.signal })
      .then((result) => {
        setEstates(result);
        setEstateState("success");
        setSelectedEstateCode(
          (current) => current || result[0]?.estate_code || "",
        );
        if (result.length > 0) setPropertyState("loading");
      })
      .catch(() => {
        if (!controller.signal.aborted) setEstateState("error");
      });
    return () => controller.abort();
  }, [estateRetry]);

  useEffect(() => {
    if (!selectedEstateCode) return;
    const controller = new AbortController();
    getBaleEstateDetail(selectedEstateCode, { signal: controller.signal })
      .then((result) => {
        setEstateDetail(result);
        setEstateDetailCode(selectedEstateCode);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setEstateDetail(null);
          setEstateDetailCode(selectedEstateCode);
        }
      });
    return () => controller.abort();
  }, [selectedEstateCode]);

  useEffect(() => {
    if (!selectedEstateCode) return;
    const controller = new AbortController();
    getBaleEstateProperties(selectedEstateCode, {
      limit: PAGE_SIZE,
      offset: propertyPage * PAGE_SIZE,
      search: filters.search,
      propertyType: filters.propertyType || undefined,
      minSizeSqm: filters.minSizeSqm,
      maxSizeSqm: filters.maxSizeSqm,
      signal: controller.signal,
    })
      .then((result) => {
        setPropertyResult(result);
        setPropertyState("success");
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setPropertyState("error");
        }
      });
    return () => controller.abort();
  }, [selectedEstateCode, propertyPage, propertyRetry, filters]);

  function selectEstate(estateCode: string) {
    if (estateCode === selectedEstateCode) return;
    setSelectedEstateCode(estateCode);
    setPropertyPage(0);
    setPropertyResult(null);
    setPropertyState("loading");
  }

  function changePage(nextPage: number) {
    setPropertyPage(nextPage);
    setPropertyResult(null);
    setPropertyState("loading");
  }

  function retryProperties() {
    setPropertyResult(null);
    setPropertyState("loading");
    setPropertyRetry((value) => value + 1);
  }

  function applyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const minimum = draftFilters.minSizeSqm
      ? Number(draftFilters.minSizeSqm)
      : null;
    const maximum = draftFilters.maxSizeSqm
      ? Number(draftFilters.maxSizeSqm)
      : null;
    if (
      (minimum !== null && (!Number.isFinite(minimum) || minimum < 0)) ||
      (maximum !== null && (!Number.isFinite(maximum) || maximum < 0))
    ) {
      setFilterError("Enter valid non-negative sizes in square metres.");
      return;
    }
    if (minimum !== null && maximum !== null && minimum > maximum) {
      setFilterError("Minimum size must not exceed maximum size.");
      return;
    }
    setFilterError("");
    setFilters({ ...draftFilters });
    setPropertyPage(0);
    setPropertyResult(null);
    setPropertyState("loading");
  }

  function clearFilters() {
    const empty = {
      search: "",
      propertyType: "",
      minSizeSqm: "",
      maxSizeSqm: "",
    };
    setDraftFilters(empty);
    setFilters(empty);
    setFilterError("");
    setPropertyPage(0);
    setPropertyResult(null);
    setPropertyState("loading");
  }

  const closePropertyModal = useCallback(() => {
    setSelectedPropertyId(null);
  }, []);

  const properties = propertyResult?.items ?? [];
  const totalProperties = propertyResult?.count ?? 0;
  const pageCount = Math.ceil(totalProperties / PAGE_SIZE);
  const hasActiveFilters = Boolean(
    filters.search ||
    filters.propertyType ||
    filters.minSizeSqm ||
    filters.maxSizeSqm,
  );
  const hasPrevious = propertyPage > 0;
  const hasNext = (propertyPage + 1) * PAGE_SIZE < totalProperties;

  return (
    <section
      id="estates"
      className="scroll-mt-24 bg-secondary-50 py-11 sm:py-20 lg:py-24"
    >
      <div className="container-custom">
        <div className="mb-7 flex flex-col gap-4 border-b border-secondary-200 pb-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-5 sm:pb-7">
          <div>
            <p className="section-subtitle">Explore BALE estates</p>
            <h2 className="text-2xl font-black tracking-tight text-secondary-950 sm:text-4xl">
              Find an estate that fits your plans
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary-500 sm:text-base">
              Browse participating estates and current published availability.
              Select an estate to review its listings and available details.
            </p>
          </div>
          {estateState === "success" && estates.length > 0 && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-secondary-200 bg-white px-4 py-2 text-xs font-semibold text-secondary-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {estates.length} {estates.length === 1 ? "estate" : "estates"}{" "}
              listed
            </span>
          )}
        </div>

        {estateState === "loading" && <EstateSkeleton />}

        {estateState === "error" && (
          <EstateLoadError
            onRetry={() => {
              setEstateState("loading");
              setEstateRetry((value) => value + 1);
            }}
          />
        )}

        {estateState === "success" && estates.length === 0 && (
          <div className="rounded-3xl border border-secondary-200 bg-white px-6 py-14 text-center sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-500">
              <LandPlot className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-secondary-950">
              No BALE estates are listed yet
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-secondary-500">
              Participating estates will appear here when they are published in
              the Bomach catalogue.
            </p>
          </div>
        )}

        {estateState === "success" && estates.length > 0 && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              {estates.map((estate) => (
                <EstateCard
                  key={estate.estate_code}
                  estate={estate}
                  selected={estate.estate_code === selectedEstateCode}
                  onSelect={() => selectEstate(estate.estate_code)}
                />
              ))}
            </div>

            {selectedEstate && (
              <div className="mt-6 grid gap-4 rounded-3xl border border-secondary-200 bg-white p-4 shadow-sm sm:mt-8 sm:gap-6 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3 className="font-display text-lg font-bold text-secondary-950 sm:text-xl">
                      {selectedEstate.estate_name}
                    </h3>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-emerald-800">
                      Participating estate
                    </span>
                  </div>
                  <p className="mt-2 flex items-center gap-2 text-sm text-secondary-500">
                    <MapPin className="h-4 w-4 shrink-0 text-primary-600" />
                    {[
                      selectedEstate.city_town,
                      selectedEstate.state,
                      selectedEstate.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {estateDescription && (
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-secondary-600">
                      {estateDescription}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
                  {selectedEstate.available_plot_sizes && (
                    <span className="inline-flex items-center gap-2 rounded-xl bg-secondary-50 px-3.5 py-2.5 text-xs font-semibold text-secondary-700">
                      <Ruler className="h-4 w-4 text-primary-600" />
                      Plot sizes: {selectedEstate.available_plot_sizes}
                    </span>
                  )}
                  {selectedEstate.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-secondary-100 px-3 py-2 text-xs font-medium text-secondary-600"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-accent-500" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedEstateDetail &&
              (selectedEstateDetail.approximate_location ||
                selectedEstateDetail.documents.length > 0) && (
                <div
                  className={`mt-4 grid gap-4 sm:mt-5 sm:gap-5 ${selectedEstateDetail.approximate_location && selectedEstateDetail.documents.length > 0 ? "lg:grid-cols-[1.2fr_.8fr]" : "lg:grid-cols-1"}`}
                >
                  {selectedEstateDetail.approximate_location && (
                    <section className="rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm sm:p-5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary-700">
                            Estate area
                          </p>
                          <h4 className="mt-1 font-display text-lg font-bold text-secondary-950">
                            Approximate location
                          </h4>
                        </div>
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${selectedEstateDetail.approximate_location.lat}&mlon=${selectedEstateDetail.approximate_location.lng}#map=13/${selectedEstateDetail.approximate_location.lat}/${selectedEstateDetail.approximate_location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center text-xs font-semibold text-primary-700 hover:text-primary-800"
                        >
                          Open map
                        </a>
                      </div>
                      <ApproximateMap
                        location={selectedEstateDetail.approximate_location}
                      />
                      <p className="mt-2 text-[11px] leading-5 text-secondary-400">
                        The marker shows the approximate estate area, not
                        property boundaries or individual plot locations.
                      </p>
                    </section>
                  )}

                  {selectedEstateDetail.documents.length > 0 ? (
                    <section className="rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm sm:p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary-700">
                        Estate resources
                      </p>
                      <h4 className="mt-1 font-display text-lg font-bold text-secondary-950">
                        Approved documents
                      </h4>
                      <ul className="mt-4 space-y-2">
                        {selectedEstateDetail.documents.map((document) => (
                          <li key={document.url}>
                            <a
                              href={baleMediaUrl(document.url) ?? document.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 rounded-xl border border-secondary-100 px-3.5 py-3 text-sm font-semibold text-secondary-700 transition hover:border-secondary-300 hover:bg-secondary-50"
                            >
                              <FileText className="h-4 w-4 shrink-0 text-primary-600" />
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
                      <p className="mt-4 text-xs leading-5 text-secondary-400">
                        Only campaign-approved estate documents are shown.
                      </p>
                    </section>
                  ) : null}
                </div>
              )}

            <div className="mb-4 mt-9 flex flex-col gap-2 sm:mb-5 sm:mt-12 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-700">
                  Available inventory
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-secondary-950 sm:mt-2 sm:text-2xl">
                  Properties in this estate
                </h3>
              </div>
              {propertyState === "success" && (
                <p className="text-sm font-medium text-secondary-500">
                  {totalProperties} matching{" "}
                  {totalProperties === 1 ? "property" : "properties"}
                </p>
              )}
            </div>

            <form
              onSubmit={applyFilters}
              className="mb-5 rounded-2xl border border-secondary-200 bg-white p-3.5 shadow-sm sm:mb-6 sm:p-5"
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(200px,1.5fr)_minmax(150px,.8fr)_repeat(2,minmax(130px,.65fr))_auto]">
                <label className="col-span-2 block sm:col-span-1">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-secondary-500">
                    Search inventory
                  </span>
                  <span className="flex h-11 items-center gap-2 rounded-xl border border-secondary-200 px-3 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100">
                    <Search className="h-4 w-4 shrink-0 text-secondary-400" />
                    <input
                      value={draftFilters.search}
                      onChange={(event) =>
                        setDraftFilters((current) => ({
                          ...current,
                          search: event.target.value,
                        }))
                      }
                      maxLength={100}
                      placeholder="Property or plot number"
                      className="min-w-0 flex-1 bg-transparent text-sm text-secondary-900 outline-none placeholder:text-secondary-400"
                    />
                  </span>
                </label>
                <label className="col-span-2 block sm:col-span-1">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-secondary-500">
                    Property type
                  </span>
                  <select
                    value={draftFilters.propertyType}
                    onChange={(event) =>
                      setDraftFilters((current) => ({
                        ...current,
                        propertyType: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-xl border border-secondary-200 bg-white px-3 text-sm text-secondary-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="">All types</option>
                    <option value="plot">Plots of land</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-secondary-500">
                    Minimum size (m²)
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={draftFilters.minSizeSqm}
                    onChange={(event) =>
                      setDraftFilters((current) => ({
                        ...current,
                        minSizeSqm: event.target.value,
                      }))
                    }
                    placeholder="Any"
                    className="h-11 w-full rounded-xl border border-secondary-200 bg-white px-3 text-sm text-secondary-800 outline-none placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-secondary-500">
                    Maximum size (m²)
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={draftFilters.maxSizeSqm}
                    onChange={(event) =>
                      setDraftFilters((current) => ({
                        ...current,
                        maxSizeSqm: event.target.value,
                      }))
                    }
                    placeholder="Any"
                    className="h-11 w-full rounded-xl border border-secondary-200 bg-white px-3 text-sm text-secondary-800 outline-none placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </label>
                <div className="col-span-2 flex items-end gap-2 sm:col-span-2 lg:col-span-1">
                  <button
                    type="submit"
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-secondary-950 px-4 text-sm font-bold text-white transition hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    <Check className="h-4 w-4" /> Apply
                  </button>
                  <button
                    type="button"
                    onClick={clearFilters}
                    aria-label="Clear filters"
                    title="Clear filters"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-secondary-200 text-secondary-600 transition hover:bg-secondary-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {filterError && (
                <p
                  className="mt-3 text-sm font-medium text-red-700"
                  role="alert"
                >
                  {filterError}
                </p>
              )}
            </form>

            {propertyState === "loading" && <PropertySkeleton />}

            {propertyState === "error" && (
              <div
                className="rounded-2xl border border-red-200 bg-red-50 p-7 text-center"
                role="alert"
              >
                <CircleAlert className="mx-auto h-8 w-8 text-primary-700" />
                <h4 className="mt-4 text-lg font-bold text-secondary-950">
                  Properties couldn&apos;t be loaded
                </h4>
                <p className="mt-2 text-sm leading-6 text-secondary-600">
                  Please try loading this estate&apos;s inventory again.
                </p>
                <button
                  onClick={retryProperties}
                  type="button"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary-800"
                >
                  <RefreshCw className="h-4 w-4" /> Try again
                </button>
              </div>
            )}

            {propertyState === "success" && properties.length === 0 && (
              <div className="rounded-2xl border border-secondary-200 bg-white px-6 py-12 text-center">
                <LandPlot className="mx-auto h-8 w-8 text-secondary-400" />
                <h4 className="mt-4 text-lg font-bold text-secondary-950">
                  {hasActiveFilters
                    ? "No properties match these filters"
                    : "No available properties in this estate"}
                </h4>
                <p className="mt-2 text-sm leading-6 text-secondary-500">
                  {hasActiveFilters
                    ? "Try a different search, property type, or size range."
                    : "There are no available property listings to show at the moment."}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 rounded-full border border-secondary-200 px-4 py-2 text-sm font-semibold text-secondary-700 transition hover:bg-secondary-50"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {propertyState === "success" && properties.length > 0 && (
              <>
                <div
                  className="max-h-[min(94vh,560px)] overflow-y-auto overscroll-contain rounded-2xl border border-secondary-200 bg-secondary-50/60 p-2"
                  role="region"
                  aria-label="Available property listings"
                  tabIndex={0}
                >
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
                    {properties.map((property) => (
                      <PropertyTile
                        key={property.id}
                        property={property}
                        onView={() => setSelectedPropertyId(property.id)}
                      />
                    ))}
                  </div>
                </div>
                {(hasPrevious || hasNext) && (
                  <nav
                    className="mt-5 flex flex-col items-center gap-3 sm:mt-7 sm:flex-row sm:justify-between"
                    aria-label="Property pages"
                  >
                    <p className="text-xs font-medium text-secondary-500">
                      Showing {propertyPage * PAGE_SIZE + 1}–
                      {Math.min(
                        (propertyPage + 1) * PAGE_SIZE,
                        totalProperties,
                      )}{" "}
                      of {totalProperties} properties
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => changePage(propertyPage - 1)}
                        disabled={!hasPrevious}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-secondary-200 bg-white px-3 py-2.5 text-xs font-semibold text-secondary-700 transition hover:border-secondary-400 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-2 sm:px-4 sm:text-sm"
                      >
                        <ChevronLeft className="h-4 w-4" /> Previous
                      </button>
                      <select
                        aria-label="Go to inventory page"
                        value={propertyPage}
                        onChange={(event) =>
                          changePage(Number(event.target.value))
                        }
                        className="h-11 max-w-[145px] rounded-full border border-secondary-200 bg-white px-3 text-xs font-semibold text-secondary-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      >
                        {Array.from({ length: pageCount }, (_, index) => (
                          <option key={index} value={index}>
                            Page {index + 1} of {pageCount}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => changePage(propertyPage + 1)}
                        disabled={!hasNext}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-secondary-200 bg-white px-3 py-2.5 text-xs font-semibold text-secondary-700 transition hover:border-secondary-400 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-2 sm:px-4 sm:text-sm"
                      >
                        Next <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </nav>
                )}
              </>
            )}
          </>
        )}
      </div>
      <div className="container-custom mt-12 border-t border-secondary-200 pt-7">
        <p className="text-xs leading-5 text-secondary-500">
          Availability and property details are supplied by Bomach&apos;s estate
          inventory and may change as records are updated.
        </p>
      </div>
      {selectedEstate && selectedPropertyId !== null && (
        <BalePropertyDetailDialog
          estateCode={selectedEstate.estate_code}
          estate={selectedEstateDetail}
          propertyId={selectedPropertyId}
          onClose={closePropertyModal}
        />
      )}
    </section>
  );
}
