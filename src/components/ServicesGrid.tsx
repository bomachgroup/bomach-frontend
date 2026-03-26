"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/types";

interface ServicesGridProps {
  services: Service[];
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <section className="py-24 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary-200 to-transparent" />
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="section-subtitle">Our Specializations</span>
          <h2 className="section-title">Core Business Verticals</h2>
          <p className="text-secondary-600">
            Integrated infrastructure solutions designed for the next generation of Nigerian development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group relative block p-10 bg-accent-50 rounded-[2.5rem] border border-accent-100 hover:bg-white hover:shadow-2xl hover:shadow-primary-600/10 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 -mr-16 -mt-16 rounded-full group-hover:scale-[2.5] transition-transform duration-700" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                    <span className="text-2xl font-black">0{idx + 1}</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-secondary-950 mb-4 group-hover:text-primary-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-secondary-500 group-hover:text-secondary-700 transition-colors line-clamp-2 mb-6">
                    Leading solutions in {service.name.toLowerCase()} for industrial and commercial sectors.
                  </p>
                  <div className="flex items-center gap-2 text-primary-600 font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                    Learn More <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary-200 to-transparent" />
    </section>
  );
}
