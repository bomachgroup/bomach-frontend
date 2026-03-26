"use client";

import React, { useState } from "react";
import { Play, X, Shield, Award, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="experience-area py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="row mb-12">
            <div className="w-full text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-display font-black text-secondary-950 uppercase tracking-tight mb-8">
                  We are the <span className="text-primary-600">best</span> at what we do
                </h2>
              </motion.div>
            </div>
          </div>
          <div className="row">
            <div className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative group rounded-[3rem] overflow-hidden shadow-2xl"
              >
                <img
                  src="/images/hero/bomach-real.jpg"
                  alt="Experience Video"
                  className="w-full h-full object-cover min-h-[500px]"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center group/btn"
                  >
                    <div className="absolute inset-0 bg-primary-600 rounded-full transition-transform duration-300 group-hover/btn:scale-110" />
                    <Play className="relative z-10 w-8 h-8 md:w-10 md:h-10 text-white fill-current ml-1" />
                    
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity">
                      <h5 className="text-white font-black uppercase tracking-widest text-sm">Play Video</h5>
                    </div>
                  </button>
                </div>

                {/* Optional: 25 Years Experience Box (matching commented out in template) */}
                <div className="absolute top-12 left-12 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] hidden md:block">
                  <span className="text-5xl font-black text-primary-400 block mb-2">25</span>
                  <h3 className="text-white font-bold leading-tight uppercase tracking-widest text-sm">Years <br /> Experience</h3>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-secondary-950/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:bg-red-500 transition-colors group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-6xl aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
            >
              <iframe
                src="https://www.youtube.com/embed/3c2NoilqL64?autoplay=1"
                title="Bomach Group Experience"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
