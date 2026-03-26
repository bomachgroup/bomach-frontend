"use client";

import { sanitizeImageUrl } from "@/lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Partner } from "@/lib/types";

import "swiper/css";

interface HomePartnersProps {
  partners: Partner[];
}

export default function HomePartners({ partners }: HomePartnersProps) {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={30}
      slidesPerView={2}
      loop
      autoplay={{ delay: 2000, disableOnInteraction: false }}
      speed={800}
      breakpoints={{
        480: { slidesPerView: 3, spaceBetween: 30 },
        768: { slidesPerView: 4, spaceBetween: 40 },
        1024: { slidesPerView: 5, spaceBetween: 50 },
        1280: { slidesPerView: 6, spaceBetween: 50 },
      }}
      className="items-center"
    >
      {partners.map((partner) => (
        <SwiperSlide key={partner.id} className="flex items-center justify-center py-6">
          <div className={`group flex items-center justify-center h-24 w-full px-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-500 ${
              partner.image_url.includes("mk.")
                ? "bg-black hover:bg-black border-white/20 hover:border-primary-500/30"
                : "bg-white hover:bg-white border-white/20 hover:border-primary-500/30"
            }`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sanitizeImageUrl(partner.image_url)}
              alt={partner.company}
              className="max-h-14 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
