"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Shield } from "lucide-react";
import type { Service } from "@/lib/types";

interface ServicesExperienceProps {
  services: Service[];
  employeesCount: number;
  projectCount: number;
  customerCount: number;
}

export default function ServicesExperience({ services, employeesCount, projectCount, customerCount }: ServicesExperienceProps) {
  return (
    <section className="py-32 bg-secondary-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-500 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary-700 rounded-full blur-[150px]" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[3rem] overflow-hidden border border-white/10 aspect-square shadow-2xl"
            >
              <img
                src="/images/hero/bomach-real4.jpg"
                alt="Service Experience"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-950 via-secondary-950/20 to-transparent" />
              
              <div className="absolute bottom-10 left-10 right-10 grid grid-cols-3 gap-4">
                {[
                  { val: employeesCount, label: "Specialists" },
                  { val: projectCount, label: "Projects" },
                  { val: customerCount, label: "Partners" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="glass-card p-4 rounded-3xl text-center"
                  >
                    <p className="text-2xl md:text-3xl font-black text-white">{stat.val}+</p>
                    <p className="text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-widest">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -left-10 w-32 h-32 bg-primary-600 rounded-full flex flex-col items-center justify-center text-white border-8 border-secondary-950 shadow-2xl z-20"
            >
              <Award size={32} className="mb-1" />
              <p className="text-[10px] font-black uppercase tracking-tighter">Premium</p>
              <p className="text-[10px] font-black uppercase tracking-tighter">Certified</p>
            </motion.div>
          </div>
          
          <div className="space-y-12 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="section-subtitle !text-primary-400">Mastery & Precision</span>
              <h2 className="section-title !text-white !mb-0">
                Engineered for <br />
                <span className="text-secondary-400">Superior Results</span>
              </h2>
              <p className="text-secondary-400 text-lg leading-relaxed max-w-xl">
                We leverage proprietary methodologies and high-performance engineering standards 
                to ensure every project benchmark is not just met, but exceeded.
              </p>
            </motion.div>

            <div className="space-y-10">
              {services.slice(0, 4).map((service, idx) => (
                <motion.div 
                  key={service.id} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-end">
                    <h5 className="text-lg font-bold text-white flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      {service.name}
                    </h5>
                    <span className="text-primary-400 font-display font-black text-xl">{service.rating}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${service.rating}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-gradient-to-r from-primary-600 to-primary-400 h-full rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="pt-8 flex items-center gap-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-400">
                  <Shield size={24} />
                </div>
                <div>
                  <p className="text-white font-bold">100% Secure</p>
                  <p className="text-xs text-white/40">Guaranteed Compliance</p>
                </div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-400">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-white font-bold">Award Winning</p>
                  <p className="text-xs text-white/40">National Recognition</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
