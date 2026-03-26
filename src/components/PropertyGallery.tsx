"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function PropertyGallery({ images, title }: { images: string[], title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="space-y-6">
      <div className="relative h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl group border border-blue-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="relative h-full w-full"
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} - image ${activeIndex + 1}`}
              fill
              className="object-cover transition-transform duration-[10000ms] group-hover:scale-110"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-blue-700 z-10"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-blue-700 z-10"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Center Badge */}
        <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest z-10">
          {activeIndex + 1} / {images.length} Photos
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-4 px-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                activeIndex === idx ? "border-blue-600 scale-105 shadow-xl" : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`thumb ${idx}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
