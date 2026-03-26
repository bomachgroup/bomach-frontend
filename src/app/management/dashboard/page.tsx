"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getProperties, getFeaturedProperties } from "@/lib/api";
import {
  Building2,
  Star,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import type { Property } from "@/lib/types";

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [totalProperties, setTotalProperties] = useState(0);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [allProps, featured] = await Promise.all([
          getProperties(undefined, 1),
          getFeaturedProperties(20),
        ]);
        setTotalProperties(allProps.total);
        setFeaturedCount(featured.length);
        setRecentProperties(allProps.items.slice(0, 5));
      } catch {
        // API might be down
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats: StatCard[] = [
    {
      label: "Total Properties",
      value: totalProperties,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Featured",
      value: featuredCount,
      icon: Star,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Standard",
      value: totalProperties - featuredCount,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-secondary-900">
            Dashboard
          </h1>
          <p className="text-secondary-500 mt-1 text-sm sm:text-base">
            Welcome back, {user?.email || "Admin"}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-secondary-900">{stat.value}</p>
            <p className="text-sm text-secondary-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-2xl border border-secondary-100 shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-secondary-100">
          <h2 className="font-display text-xl font-bold text-secondary-900">
            Recent Properties
          </h2>
          <Link
            href="/management/properties"
            className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1"
          >
            View All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {recentProperties.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-secondary-500">No properties yet</p>
            <Link
              href="/management/properties/create"
              className="text-primary-600 font-semibold text-sm hover:underline mt-2 inline-block"
            >
              Create your first property
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-secondary-100">
            {recentProperties.map((prop) => (
              <div
                key={prop.id}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-secondary-50/50 transition-colors"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-secondary-100 flex-shrink-0">
                  {prop.property_images?.[0] ? (
                    <img
                      src={prop.property_images[0]}
                      alt={prop.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-secondary-900 truncate text-sm sm:text-base">
                    {prop.name}
                  </p>
                  <p className="text-xs sm:text-sm text-secondary-500 truncate">
                    {prop.city}, {prop.state}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  {prop.is_featured && (
                    <span className="bg-amber-50 text-amber-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                  <span className="bg-secondary-100 text-secondary-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    {prop.category}
                  </span>
                </div>
                <Link
                  href={`/management/properties/${prop.id}/edit`}
                  className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-semibold flex-shrink-0"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
