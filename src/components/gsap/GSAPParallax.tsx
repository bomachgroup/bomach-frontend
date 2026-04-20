"use client";

import { useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface GSAPParallaxProps {
  children: ReactNode;
  className?: string;
  /** Vertical offset in pixels — negative = parallax up, positive = parallax down. */
  speed?: number;
  /** Scale boost during scroll. 1.15 means the element scales up by 15%. */
  scaleAmount?: number;
}

/**
 * Scroll-linked parallax with optional subtle zoom.
 * Wraps an element (usually an image) and moves it as the viewport scrolls.
 */
export default function GSAPParallax({
  children,
  className,
  speed = -80,
  scaleAmount = 1,
}: GSAPParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const target = ref.current.querySelector(".parallax-inner") || ref.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      tl.fromTo(
        target,
        { y: -speed / 2, scale: 1 },
        {
          y: speed / 2,
          scale: scaleAmount,
          ease: "none",
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <div className="parallax-inner w-full h-full">{children}</div>
    </div>
  );
}
