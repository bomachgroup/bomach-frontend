"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

function splitDescription(description: string) {
  const paragraphs = description.trim().split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  if (paragraphs.length > 1) {
    return { preview: paragraphs[0], remaining: paragraphs.slice(1) };
  }

  const sentences = (paragraphs[0] || "").split(/(?<=[.!?])\s+(?=[A-Z₦])/u);
  return {
    preview: sentences[0] || "",
    remaining: sentences.slice(1),
  };
}

export default function FortressCityAbout({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const { preview, remaining } = splitDescription(description);
  const hasMore = remaining.length > 0;
  const detailsId = "fortress-city-about-details";

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">About Fortress City Estate</p>
      <h2 className="mt-3 max-w-lg font-display text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
        Space to build, in a connected part of Enugu.
      </h2>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">{preview}</p>

      {hasMore && (
        <>
          <div id={detailsId} hidden={!expanded} className="mt-3 max-w-xl space-y-3 text-base leading-relaxed text-slate-600">
            {remaining.map((paragraph, index) => <p key={`${index}-${paragraph}`}>{paragraph}</p>)}
          </div>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={detailsId}
            onClick={() => setExpanded((value) => !value)}
            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-bold text-red-800 underline decoration-red-300 underline-offset-4 transition hover:text-red-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
          >
            {expanded ? "Show less" : "Read full estate details"}
            <ChevronDown size={17} aria-hidden="true" className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
          </button>
        </>
      )}
    </div>
  );
}
