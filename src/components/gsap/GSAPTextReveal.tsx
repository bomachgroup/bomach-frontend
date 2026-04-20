"use client";

import { useRef, ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface GSAPTextRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  /** "words" splits by word (default), "chars" splits by character. */
  splitBy?: "words" | "chars";
  delay?: number;
  duration?: number;
  stagger?: number;
  /** Whether to reveal on scroll or immediately on mount. */
  onScroll?: boolean;
}

/**
 * Text reveal with per-word or per-character stagger.
 * Uses manual splitting to avoid the paid SplitText plugin (free SplitText
 * was released in GSAP 3.13, but manual works everywhere).
 */
export default function GSAPTextReveal({
  text,
  className,
  as = "h2",
  splitBy = "words",
  delay = 0,
  duration = 0.8,
  stagger = 0.06,
  onScroll = true,
}: GSAPTextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  const units = splitBy === "words" ? text.split(" ") : Array.from(text);

  useGSAP(
    () => {
      if (!ref.current) return;
      const spans = ref.current.querySelectorAll(".reveal-unit");

      const config: gsap.TweenVars = {
        yPercent: 0,
        opacity: 1,
        duration,
        delay,
        stagger,
        ease: "power3.out",
      };

      if (onScroll) {
        config.scrollTrigger = {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none none",
        };
      }

      gsap.fromTo(spans, { yPercent: 100, opacity: 0 }, config);
    },
    { scope: ref as React.RefObject<HTMLElement>, dependencies: [text] },
  );

  const Tag = as as ElementType;

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className}>
      {units.map((unit, i) => (
        <span
          key={i}
          className="reveal-unit-wrap inline-block overflow-hidden align-bottom"
        >
          <span className="reveal-unit inline-block" style={{ willChange: "transform" }}>
            {unit}
            {splitBy === "words" && i < units.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
