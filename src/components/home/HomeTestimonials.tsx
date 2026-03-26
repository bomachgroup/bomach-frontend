"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Quote } from "lucide-react";
import type { CustomerReview } from "@/lib/types";

import "swiper/css";
import "swiper/css/pagination";

interface HomeTestimonialsProps {
  reviews: CustomerReview[];
}

export default function HomeTestimonials({ reviews }: HomeTestimonialsProps) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={24}
      slidesPerView={1}
      loop
      autoplay={{ delay: 6000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      className="testimonials-swiper"
    >
      {reviews.map((review) => (
        <SwiperSlide key={review.id}>
          <div className="pb-12">
            <div className="w-14 h-14 rounded-2xl bg-primary-600/10 flex items-center justify-center mb-6">
              <Quote size={28} className="text-primary-600" />
            </div>
            <p className="text-lg md:text-xl leading-relaxed text-secondary-700 mb-8 italic">
              &ldquo;{review.review}&rdquo;
            </p>
            <div>
              <h5 className="font-display text-lg font-bold text-secondary-950 uppercase">
                {review.name}
              </h5>
              <span className="text-sm text-secondary-500">{review.occupation}</span>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
