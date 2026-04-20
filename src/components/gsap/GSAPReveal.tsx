"use client";

import { useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Direction = "up" | "down" | "left" | "right" | "fade" | "scale";

interface GSAPRevealProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  stagger?: number;
  /** If true, animates each direct child individually with stagger. */
  staggerChildren?: boolean;
  /** ScrollTrigger start position, e.g. "top 80%". */
  start?: string;
  once?: boolean;
}

const directionMap: Record<Direction, gsap.TweenVars> = {
  up: { y: 50, opacity: 0 },
  down: { y: -50, opacity: 0 },
  left: { x: -60, opacity: 0 },
  right: { x: 60, opacity: 0 },
  fade: { opacity: 0 },
  scale: { scale: 0.85, opacity: 0 },
};

/**
 * Scroll-triggered reveal wrapper powered by GSAP.
 * Drop-in replacement for simple AnimatedSection use cases —
 * but with smoother easing and an option to stagger direct children.
 */
export default function GSAPReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 1,
  distance,
  stagger = 0.1,
  staggerChildren = false,
  start = "top 85%",
  once = true,
}: GSAPRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const from: gsap.TweenVars = { ...directionMap[direction] };
      if (distance !== undefined) {
        if ("y" in from) from.y = (from.y as number) > 0 ? distance : -distance;
        if ("x" in from) from.x = (from.x as number) > 0 ? distance : -distance;
      }

      const targets = staggerChildren
        ? Array.from(containerRef.current.children)
        : containerRef.current;

      gsap.fromTo(
        targets,
        from,
        {
          y: 0,
          x: 0,
          opacity: 1,
          scale: 1,
          duration,
          delay,
          stagger: staggerChildren ? stagger : 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
