"use client";

import { useRef, ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface GSAPMagneticProps {
  children: ReactNode;
  className?: string;
  /** Pull strength — 0.3 means element moves 30% toward the cursor. */
  strength?: number;
  /** Subtle tilt (rotateX/Y) effect on hover. */
  tilt?: boolean;
}

/**
 * Magnetic hover wrapper — the child follows the cursor within its bounds.
 * Great for CTAs, cards, and interactive tiles.
 */
export default function GSAPMagnetic({
  children,
  className,
  strength = 0.25,
  tilt = false,
}: GSAPMagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
      const rxTo = gsap.quickTo(el, "rotationX", {
        duration: 0.6,
        ease: "power3.out",
      });
      const ryTo = gsap.quickTo(el, "rotationY", {
        duration: 0.6,
        ease: "power3.out",
      });

      const handleMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        xTo(x * strength);
        yTo(y * strength);
        if (tilt) {
          ryTo((x / rect.width) * 12);
          rxTo(-(y / rect.height) * 12);
        }
      };

      const handleLeave = () => {
        xTo(0);
        yTo(0);
        if (tilt) {
          rxTo(0);
          ryTo(0);
        }
      };

      el.addEventListener("mousemove", handleMove);
      el.addEventListener("mouseleave", handleLeave);

      return () => {
        el.removeEventListener("mousemove", handleMove);
        el.removeEventListener("mouseleave", handleLeave);
      };
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}
    </div>
  );
}
