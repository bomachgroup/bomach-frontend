"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProperties, getPropertyCities, sanitizeImageUrl } from "@/lib/api";
import { PROPERTY_CATEGORIES } from "@/lib/data";
import PageTitle from "@/components/PageTitle";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { MapPin, Search, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import type { Property } from "@/lib/types";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = Object.keys(PROPERTY_CATEGORIES);

  // Fetch cities on mount
  useEffect(() => {
    getPropertyCities().then((data) => setCities([...new Set(data)]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const options: { category?: string; city?: string } = {};
    if (selectedCategory) options.category = selectedCategory;
    if (selectedCity) options.city = selectedCity;
    getProperties(query, page, Object.keys(options).length > 0 ? options : undefined)
      .then((data) => {
        setProperties(data.items);
        setTotalPages(data.pages);
        setCurrentPage(data.page);
        setHasPrevious(data.has_previous);
        setHasNext(data.has_next);
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [query, page, selectedCategory, selectedCity]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(searchInput);
  }

  function handleClearFilters() {
    setSearchInput("");
    setQuery("");
    setSelectedCategory("");
    setSelectedCity("");
    setPage(1);
  }

  const hasActiveFilters = query !== "" || selectedCategory !== "" || selectedCity !== "";

  // Generate page range for pagination
  const pageRange: (number | "ellipsis")[] = [];
  for (let num = 1; num <= totalPages; num++) {
    if (num > currentPage - 2 && num < currentPage + 3) {
      pageRange.push(num);
    } else if (num === currentPage - 2 || num === currentPage + 3) {
      pageRange.push("ellipsis");
    }
  }

  return (
    <>
      <PageTitle
        title="Properties"
        breadcrumbs={[{ label: "Properties" }]}
      />

      <section className="py-20 bg-secondary-50/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Search & Filters */}
          <div className="max-w-4xl mx-auto mb-14 space-y-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="input-premium w-full pl-5 pr-32 py-4 text-base"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                className="input-premium flex-1 pl-5 pr-10 py-3 text-base appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedCity}
                onChange={(e) => { setSelectedCity(e.target.value); setPage(1); }}
                className="input-premium flex-1 pl-5 pr-10 py-3 text-base appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat cursor-pointer"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-secondary-300 text-secondary-700 hover:bg-secondary-100 font-semibold transition-colors whitespace-nowrap"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
              <p className="text-secondary-500">Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="py-20 text-center">
              <MapPin className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-secondary-900 mb-2">
                No Properties Found
              </h3>
              <p className="text-secondary-500">
                Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            <>
              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((prop, index) => (
                  <AnimatedCard key={prop.id} index={index}>
                    <div className="card-premium-hover group bg-white rounded-2xl overflow-hidden h-full flex flex-col">
                      {/* Image */}
                      <div className="relative h-60 overflow-hidden">
                        <img
                          src={sanitizeImageUrl(prop.property_images?.[0])}
                          alt={prop.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {prop.is_featured && (
                          <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-display text-lg font-bold text-secondary-900 mb-1 group-hover:text-primary-600 transition-colors">
                          <Link href={`/properties/${prop.id}`}>
                            {prop.name}
                          </Link>
                        </h3>
                        <p className="font-display text-xl font-bold text-primary-600 mb-3">
                          Price on request
                        </p>
                        <p className="flex items-center gap-2 text-sm text-secondary-500 mb-3">
                          <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
                          {prop.address}, {prop.city}, {prop.state}
                        </p>
                        <div className="flex gap-2 mb-4">
                          <span className="inline-block bg-secondary-100 text-secondary-700 text-xs font-medium px-3 py-1 rounded-full w-fit">
                            {prop.category}
                          </span>
                          {prop.sub_category && (
                            <span className="inline-block bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1 rounded-full w-fit">
                              {prop.sub_category}
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/properties/${prop.id}`}
                          className="mt-auto block text-center bg-secondary-50 hover:bg-primary-600 text-secondary-900 hover:text-white font-semibold py-3 rounded-xl transition-all duration-300"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-14">
                  <button
                    onClick={() => setPage(1)}
                    disabled={!hasPrevious}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      hasPrevious
                        ? "text-secondary-700 hover:bg-secondary-100"
                        : "text-secondary-300 cursor-not-allowed"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    First
                  </button>

                  {pageRange.map((num, idx) =>
                    num === "ellipsis" ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-3 py-2 text-secondary-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                          currentPage === num
                            ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25"
                            : "text-secondary-700 hover:bg-secondary-100"
                        }`}
                      >
                        {num}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => setPage(totalPages)}
                    disabled={!hasNext}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      hasNext
                        ? "text-secondary-700 hover:bg-secondary-100"
                        : "text-secondary-300 cursor-not-allowed"
                    }`}
                  >
                    Last
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
