"use client";

import { useRef } from "react";
import Link from "next/link";
import { sanitizeImageUrl } from "@/lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { EffectFade, Autoplay, Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
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
  const sectionRef = useRef<HTMLElement>(null);

  const animateSlide = (root: Element | null) => {
    if (!root) return;
    const smallText = root.querySelector(".hero-small");
    const words = root.querySelectorAll(".hero-word");
    const buttons = root.querySelectorAll(".hero-cta");
    const overlay = root.querySelector(".hero-overlay");

    gsap.set([smallText, words, buttons], { opacity: 0 });

    const tl = gsap.timeline();

    if (overlay) {
      tl.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" },
        0,
      );
    }

    tl.fromTo(
      smallText,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
      0.2,
    )
      .fromTo(
        words,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          ease: "expo.out",
        },
        0.35,
      )
      .fromTo(
        buttons,
        { y: 20, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        0.75,
      );
  };

  // Run entrance animation on mount
  useGSAP(
    () => {
      const firstSlide = sectionRef.current?.querySelector(
        ".swiper-slide-active",
      );
      animateSlide(firstSlide ?? sectionRef.current?.querySelector(".swiper-slide") ?? null);
    },
    { scope: sectionRef as React.RefObject<HTMLElement> },
  );

  const handleSlideChange = (swiper: SwiperType) => {
    const activeSlide = swiper.slides[swiper.activeIndex];
    animateSlide(activeSlide);
  };

  return (
    <section ref={sectionRef} className='relative min-h-screen'>
      <Swiper
        modules={[EffectFade, Autoplay, Navigation]}
        effect='fade'
        loop
        speed={1000}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onSwiper={(swiper) => {
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
        onSlideChangeTransitionStart={handleSlideChange}
        className='h-screen'>
        {sliders.map((slide) => {
          const words = slide.big_text.split(/\s+/).filter(Boolean);
          return (
            <SwiperSlide key={slide.id}>
              <div
                className='relative min-h-screen flex items-center justify-center bg-cover bg-center'
                style={{
                  backgroundImage: `url(${sanitizeImageUrl(slide.image_url)})`,
                }}>
                <div className='hero-overlay absolute inset-0 bg-secondary-950/40 backdrop-blur-[2px]' />
                <div className='absolute inset-0 bg-gradient-to-r from-secondary-950/80 via-secondary-950/20 to-transparent' />

                {/* Content */}
                <div className='relative z-10 container-custom text-center'>
                  <p className='hero-small text-xl text-white/80 mb-6 font-medium'>
                    {slide.small_text}
                  </p>
                  <h1 className='font-display text-5xl md:text-7xl font-black text-white uppercase mb-10 max-w-5xl mx-auto leading-tight'>
                    {words.map((word, i) => (
                      <span
                        key={i}
                        className='inline-block overflow-hidden align-bottom mr-[0.25em]'
                      >
                        <span
                          className='hero-word inline-block'
                          style={{ willChange: "transform" }}
                        >
                          {word}
                        </span>
                      </span>
                    ))}
                  </h1>
                  <div className='flex flex-wrap items-center justify-center gap-4'>
                    <Link href='/services' className='hero-cta btn-primary'>
                      Our Services
                    </Link>
                    <Link href='/booking' className='hero-cta btn-glass'>
                      Book Meeting
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
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
