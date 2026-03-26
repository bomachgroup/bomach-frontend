"use client";

import React from "react";
import { Building2, Trophy, Award, Calendar, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const journeyItems = [
  {
    icon: Building2,
    title: "Heritage of Innovation",
    content: "Welcome to Bomach Group, a dynamic business consortium dedicated to pioneering engineering solutions. With decades of excellence in Nigeria, we lead through precision and a partnership-first approach.",
    link: "/about"
  },
  {
    icon: Zap,
    title: "Technological Vision",
    content: "Revolutionizing the industry through cutting-edge technology (BOS), we strive for high-performance standards and continuous evolution in construction and real estate.",
    link: "/about"
  },
  {
    icon: Award,
    title: "Unyielding Values",
    content: "Our excellence is measured by quality performance and client satisfaction. We prioritize value delivery and long-term sustainability in every blueprint.",
    link: "/about"
  }
];

export default function SuccessJourney() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-24 items-stretch">
          {/* Left Column: Journey / Timeline */}
          <div className="lg:w-7/12 space-y-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="section-subtitle">Our Evolution</span>
              <h2 className="section-title">The Foundation of <br/>Our Success</h2>
              <p className="text-lg text-secondary-600 max-w-xl">
                Iterative growth and a commitment to global engineering standards have defined 
                our trajectory over the past 25 years.
              </p>
            </motion.div>

            <div className="space-y-12 relative">
              {/* Vertical line decorative */}
              <div className="absolute left-[31px] top-4 bottom-4 w-px bg-gradient-to-b from-primary-600/50 via-primary-600/20 to-transparent hidden sm:block" />
              
              {journeyItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  className="relative flex flex-col sm:flex-row gap-8 group"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white shadow-xl shadow-primary-600/5 flex items-center justify-center text-primary-600 border border-primary-50 px-4 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 z-10">
                    <item.icon size={32} />
                  </div>
                  <div className="space-y-4 pt-2">
                    <h3 className="text-2xl font-display font-bold text-secondary-950 group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-secondary-600 leading-relaxed max-w-lg">
                      {item.content}
                    </p>
                    <Link 
                      href={item.link} 
                      className="inline-flex items-center gap-2 text-primary-600 font-bold text-sm uppercase tracking-widest hover:gap-3 transition-all"
                    >
                      Learn More <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Appointment / Contact Card */}
          <div className="lg:w-5/12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative h-full min-h-[600px] rounded-[3rem] overflow-hidden shadow-2xl group"
            >
              <img
                src="/images/hero/bomach-it.jpg"
                alt="Consultation Support"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-950 via-secondary-950/40 to-transparent" />
              
              <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
                <div className="space-y-8">
                  <span className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                    <Calendar size={14} className="text-primary-400" />
                    Priority Consultation
                  </span>
                  
                  <h3 className="text-4xl font-display font-black leading-tight">
                    Discuss Your <br/>
                    <span className="text-primary-400 text-5xl">Next Venture</span>
                  </h3>
                  
                  <p className="text-secondary-200 text-lg leading-relaxed max-w-xs">
                    Connect with our technical specialists for a professional project evaluation.
                  </p>
                  
                  <div className="pt-6">
                    <Link 
                      href="/booking" 
                      className="btn-primary group !px-10"
                    >
                      Schedule Appointment
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Decorative Corner Element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 backdrop-blur-3xl -mr-16 -mt-16 rounded-full" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
