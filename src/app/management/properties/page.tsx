"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getProperties, deleteProperty } from "@/lib/api";
import {
  Building2,
  Plus,
  Search,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
  Star,
} from "lucide-react";
import type { Property } from "@/lib/types";

export default function AdminPropertiesPage() {
  const { accessToken } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Add debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchInput);
      setPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const loadProperties = useCallback(() => {
    setLoading(true);
    getProperties(query, page)
      .then((data) => {
        setProperties(data.items);
        setTotalPages(data.pages);
        setTotal(data.total);
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [query, page]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQuery(searchInput);
  }

  async function handleDelete(id: number, name: string) {
    if (!accessToken) return;
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;

    setDeleting(id);
    try {
      await deleteProperty(id, accessToken);
      loadProperties();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete property";
      alert(message);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-secondary-900">
            Properties
          </h1>
          <p className="text-secondary-500 mt-1 text-sm">
            {total} {total === 1 ? "property" : "properties"} total
          </p>
        </div>
        <Link
          href="/management/properties/create"
          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 sm:px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/25 text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-secondary-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-4 py-3 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all text-sm sm:text-base"
          />
        </div>
        <button
          type="submit"
          className="bg-secondary-900 hover:bg-secondary-800 text-white font-semibold px-4 sm:px-6 rounded-xl transition-colors text-sm sm:text-base"
        >
          Search
        </button>
      </form>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-secondary-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="p-10 sm:p-16 text-center">
            <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-secondary-900 mb-2">No Properties Found</h3>
            <p className="text-secondary-500 mb-6 text-sm sm:text-base">
              {query ? "Try a different search term." : "Create your first property listing."}
            </p>
            {!query && (
              <Link
                href="/management/properties/create"
                className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl text-sm"
              >
                <Plus className="w-5 h-5" /> Create Property
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary-50 border-b border-secondary-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-secondary-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary-100 flex-shrink-0">
                            {prop.property_images?.[0] ? (
                              <img
                                src={prop.property_images[0]}
                                alt={prop.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-secondary-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-secondary-900 truncate max-w-[200px]">
                              {prop.name}
                            </p>
                            <p className="text-xs text-secondary-400">ID: {prop.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-secondary-100 text-secondary-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          {prop.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-secondary-600">{prop.city}, {prop.state}</p>
                      </td>
                      <td className="px-6 py-4">
                        {prop.is_featured ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <Star className="w-3 h-3" /> Featured
                          </span>
                        ) : (
                          <span className="bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-secondary-500">
                          {new Date(prop.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/properties/${prop.id}`}
                            target="_blank"
                            className="p-2 rounded-lg text-secondary-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                            title="View on site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/management/properties/${prop.id}/edit`}
                            className="p-2 rounded-lg text-secondary-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(prop.id, prop.name)}
                            disabled={deleting === prop.id}
                            className="p-2 rounded-lg text-secondary-400 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                            title="Delete"
                          >
                            {deleting === prop.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-secondary-100">
              {properties.map((prop) => (
                <div key={prop.id} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary-100 flex-shrink-0">
                      {prop.property_images?.[0] ? (
                        <img
                          src={prop.property_images[0]}
                          alt={prop.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-secondary-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-secondary-900 truncate text-sm">
                        {prop.name}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {prop.city}, {prop.state}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-secondary-100 text-secondary-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        {prop.category}
                      </span>
                      {prop.is_featured && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3" /> Featured
                        </span>
                      )}
                      <span className="text-xs text-secondary-400">
                        {new Date(prop.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/properties/${prop.id}`}
                        target="_blank"
                        className="p-2 rounded-lg text-secondary-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/management/properties/${prop.id}/edit`}
                        className="p-2 rounded-lg text-secondary-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(prop.id, prop.name)}
                        disabled={deleting === prop.id}
                        className="p-2 rounded-lg text-secondary-400 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                      >
                        {deleting === prop.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-secondary-100">
                <p className="text-xs sm:text-sm text-secondary-500">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-2 rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="p-2 rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
