"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Service } from "@/lib/types";

interface HomeSkillBarsProps {
  services: Service[];
}

export default function HomeSkillBars({ services }: HomeSkillBarsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="space-y-6">
      {services.map((service, idx) => (
        <div key={service.id}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-display text-sm font-bold text-secondary-950 uppercase tracking-wide">
              {service.name}
            </span>
            <span className="text-sm font-bold text-primary-600">
              {service.rating}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-secondary-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-500"
              initial={{ width: 0 }}
              animate={isInView ? { width: `${service.rating}%` } : { width: 0 }}
              transition={{
                duration: 1.2,
                delay: idx * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
