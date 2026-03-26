"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { HomeSlider } from "@/lib/types";

interface HeroSliderProps {
  sliders: HomeSlider[];
}

export default function HeroSlider({ sliders }: HeroSliderProps) {
  return (
    <section className="relative h-[90vh] min-h-[700px] overflow-hidden bg-secondary-950">
      <Swiper
        modules={[Autoplay, Navigation, EffectFade]}
        effect="fade"
        speed={1000}
        loop
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        navigation={{
          prevEl: ".hero-prev",
          nextEl: ".hero-next",
        }}
        className="h-full w-full"
      >
        {sliders.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative h-full w-full">
            {({ isActive }) => (
              <>
                {/* Background Image with Ken Burns Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    initial={{ scale: 1.1 }}
                    animate={isActive ? { scale: 1 } : { scale: 1.1 }}
                    transition={{ duration: 6000, ease: "linear" }}
                    className="h-full w-full"
                  >
                    <img
                      src={slide.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary-950/80 via-secondary-950/40 to-transparent" />
                  </motion.div>
                </div>

                {/* Content Overlay */}
                <div className="container relative h-full flex items-center justify-center text-center">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <div className="z-10 px-4">
                        <motion.div
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                          className="mb-8"
                        >
                          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white leading-tight uppercase tracking-tight bg-black/20 backdrop-blur-sm px-8 py-4 inline-block">
                            {slide.big_text}
                          </h2>
                        </motion.div>

                        <motion.p
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                          className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-lg"
                        >
                          {slide.small_text}
                        </motion.p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </SwiperSlide>
        ))}

        {/* Custom Navigation Hooks */}
        <div className="absolute bottom-12 right-12 z-20 flex gap-4">
          <button className="hero-prev w-14 h-14 rounded-full glass-nav flex items-center justify-center text-white hover:bg-primary-600 hover:border-primary-500 hover:scale-110 active:scale-95 transition-all duration-300">
            <ChevronLeft size={24} />
          </button>
          <button className="hero-next w-14 h-14 rounded-full glass-nav flex items-center justify-center text-white hover:bg-primary-600 hover:border-primary-500 hover:scale-110 active:scale-95 transition-all duration-300">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-secondary-950 to-transparent z-10" />
      </Swiper>
      
      <style jsx global>{`
        .glass-nav {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </section>
  );
}
