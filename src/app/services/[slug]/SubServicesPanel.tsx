"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { SubService } from "@/lib/types";

interface SubServicesPanelProps {
  subServices: SubService[];
}

export default function SubServicesPanel({
  subServices,
}: SubServicesPanelProps) {
  const [activeSlug, setActiveSlug] = useState<string>(
    subServices.length > 0 ? subServices[0].slug : ""
  );

  const activeSubService = subServices.find((s) => s.slug === activeSlug);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="glass-card p-6 sticky top-24">
          <h3 className="font-display text-lg font-bold text-secondary-950 mb-4">Sub-Services</h3>
          <ul className="space-y-1">
            {subServices.map((sub) => (
              <li key={sub.slug}>
                <button
                  onClick={() => setActiveSlug(sub.slug)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                    activeSlug === sub.slug
                      ? "bg-primary-50 text-primary-600 border-l-4 border-primary-600 font-semibold"
                      : "text-secondary-600 hover:bg-gray-50 hover:text-secondary-950"
                  }`}
                >
                  <span className="truncate">{sub.name}</span>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${
                    activeSlug === sub.slug ? "text-primary-600" : "text-secondary-400"
                  }`} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-2">
        {activeSubService && (
          <div>
            <div className="overflow-hidden rounded-2xl mb-8">
              <img
                src={activeSubService.image_url}
                className="w-full h-auto object-cover"
                alt={activeSubService.name}
              />
            </div>
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-6">
              {activeSubService.name}
            </h2>
            <div
              className="rich-content prose prose-lg max-w-none text-secondary-600"
              dangerouslySetInnerHTML={{ __html: activeSubService.content }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
