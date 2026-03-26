import { ReactNode } from "react";

interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

function highlightText(
  title: string,
  highlight: string,
  light: boolean
): ReactNode {
  const index = title.toLowerCase().indexOf(highlight.toLowerCase());
  if (index === -1) return title;

  const before = title.slice(0, index);
  const match = title.slice(index, index + highlight.length);
  const after = title.slice(index + highlight.length);

  return (
    <>
      {before}
      <span className={light ? "text-primary-400" : "text-primary-600"}>
        {match}
      </span>
      {after}
    </>
  );
}

export default function SectionHeader({
  subtitle,
  title,
  titleHighlight,
  description,
  align = "left",
  light = false,
  className,
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div className={`${isCenter ? "text-center" : ""} ${className ?? ""}`}>
      {subtitle && (
        <p
          className={`uppercase tracking-[0.2em] text-xs font-bold mb-4 ${
            light ? "text-white" : "text-primary-600"
          }`}
        >
          {subtitle}
        </p>
      )}

      <h2
        className={`font-display text-4xl md:text-5xl font-black mb-4 ${
          light ? "text-white" : "text-secondary-950"
        }`}
      >
        {titleHighlight ? highlightText(title, titleHighlight, light) : title}
      </h2>

      <div
        className={`section-divider w-16 h-1 bg-primary-600 mb-6 ${
          isCenter ? "mx-auto" : ""
        }`}
      />

      {description && (
        <p
          className={`text-lg max-w-2xl ${
            light ? "text-white/80" : "text-secondary-600"
          } ${isCenter ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
