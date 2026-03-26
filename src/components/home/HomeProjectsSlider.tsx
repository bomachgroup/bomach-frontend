"use client";

import { useRef } from "react";
import Link from "next/link";
import { sanitizeImageUrl } from "@/lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";

import "swiper/css";
import "swiper/css/navigation";

interface HomeProjectsSliderProps {
  projects: Project[];
}

export default function HomeProjectsSlider({ projects }: HomeProjectsSliderProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          1024: { slidesPerView: 2 },
        }}
      >
        {projects.map((project) => (
          <SwiperSlide key={project.id}>
            <Link
              href={`/projects/${project.slug}`}
              className="group block relative h-[450px] rounded-2xl overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sanitizeImageUrl(project.image_url)}
                alt={project.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-950/90 via-secondary-950/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {project.sub_service_name && (
                  <span className="text-primary-400 text-sm font-bold uppercase tracking-wider">
                    {project.sub_service_name}
                  </span>
                )}
                <h4 className="text-white font-display text-xl font-bold mt-1">
                  {project.name}
                </h4>
              </div>
              {/* Arrow */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight size={18} />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        <button
          ref={prevRef}
          aria-label="Previous project"
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          ref={nextRef}
          aria-label="Next project"
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
