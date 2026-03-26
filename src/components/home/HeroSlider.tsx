"use client";

import { useRef } from "react";
import Link from "next/link";
import { sanitizeImageUrl } from "@/lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { HomeSlider } from "@/lib/types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

interface HeroSliderProps {
  sliders: HomeSlider[];
}

export default function HeroSlider({ sliders }: HeroSliderProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className='relative min-h-screen'>
      <Swiper
        modules={[EffectFade, Autoplay, Navigation]}
        effect='fade'
        loop
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onSwiper={(swiper) => {
          // Timeout ensures refs are attached after render
          setTimeout(() => {
            if (
              swiper.params &&
              swiper.params.navigation &&
              typeof swiper.params.navigation !== "boolean" &&
              prevRef.current &&
              nextRef.current
            ) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              if (swiper.navigation) {
                swiper.navigation.destroy();
                swiper.navigation.init();
                swiper.navigation.update();
              }
            }
          });
        }}
        className='h-screen'>
        {sliders.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className='relative min-h-screen flex items-center justify-center bg-cover bg-center'
              style={{
                backgroundImage: `url(${sanitizeImageUrl(slide.image_url)})`,
              }}>
              {/* Gradient overlay - improved for readability with backdrop-blur */}
              <div className='absolute inset-0 bg-secondary-950/40 backdrop-blur-[2px] transition-all duration-700' />
              <div className='absolute inset-0 bg-gradient-to-r from-secondary-950/80 via-secondary-950/20 to-transparent' />

              {/* Content */}
              <div className='relative z-10 container-custom text-center'>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className='text-xl text-white/80 mb-6 font-medium'>
                  {slide.small_text}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className='font-display text-5xl md:text-7xl font-black text-white uppercase mb-10 max-w-5xl mx-auto leading-tight'>
                  {slide.big_text}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className='flex flex-wrap items-center justify-center gap-4'>
                  <Link href='/services' className='btn-primary'>
                    Our Services
                  </Link>
                  <Link href='/booking' className='btn-glass'>
                    Book Meeting
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation arrows */}
      <button
        ref={prevRef}
        aria-label='Previous slide'
        className='absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300'>
        <ArrowLeft size={24} />
      </button>
      <button
        ref={nextRef}
        aria-label='Next slide'
        className='absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300'>
        <ArrowRight size={24} />
      </button>
    </section>
  );
}
