"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Package, Play, Layers } from "lucide-react";
import Link from "next/link";
import type { HomepageData } from "@/lib/types";

interface ProductCatalogueProps {
  data: HomepageData["products_by_service"];
}

export default function ProductCatalogue({ data }: ProductCatalogueProps) {
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [activeProductIdxs, setActiveProductIdxs] = useState<Record<number, number>>({});

  const products = data[activeServiceIdx]?.products || [];
  const currentProductIdx = activeProductIdxs[activeServiceIdx] || 0;
  const activeProduct = products[currentProductIdx];

  if (data.length === 0) return null;

  return (
    <section className="py-32 bg-accent-50/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="section-subtitle">Product Ecosystem</span>
            <h2 className="section-title !mb-0 text-secondary-950">
              Innovative Solutions for <span className="text-primary-600">Modern Infrastructure</span>
            </h2>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex bg-white p-1.5 rounded-[2rem] shadow-xl shadow-secondary-900/5 border border-secondary-100">
            {data.map((item, idx) => (
              <button
                key={item.service.id}
                onClick={() => setActiveServiceIdx(idx)}
                className={`px-6 py-3 rounded-[1.5rem] font-bold text-sm transition-all duration-300 ${
                  activeServiceIdx === idx
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                    : "text-secondary-500 hover:text-secondary-900 hover:bg-secondary-50"
                }`}
              >
                {item.service.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-3 mb-6 px-4">
              <div className="w-8 h-8 rounded-lg bg-primary-600/10 flex items-center justify-center text-primary-600">
                <Layers size={18} />
              </div>
              <p className="font-display font-black text-secondary-900 uppercase tracking-tighter">Inventory List</p>
            </div>
            
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {products.map((prod, pIdx) => (
                  <motion.button
                    key={prod.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: pIdx * 0.05 }}
                    onClick={() => setActiveProductIdxs({ ...activeProductIdxs, [activeServiceIdx]: pIdx })}
                    className={`w-full p-5 text-left rounded-3xl transition-all duration-300 flex items-center gap-4 group ${
                      currentProductIdx === pIdx
                        ? "bg-white shadow-2xl shadow-primary-600/10 border border-primary-100 translate-x-2"
                        : "hover:bg-white/50 border border-transparent"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      currentProductIdx === pIdx ? "bg-primary-600 text-white" : "bg-accent-100 text-secondary-400"
                    }`}>
                      <Package size={20} />
                    </div>
                    <span className={`font-bold transition-colors ${
                      currentProductIdx === pIdx ? "text-secondary-950" : "text-secondary-500 group-hover:text-secondary-900"
                    }`}>{prod.name}</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Main Display Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeProduct ? (
                <motion.div
                  key={activeProduct.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl border border-secondary-50 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 -mr-32 -mt-32 rounded-full blur-3xl opacity-50" />
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 relative z-10">
                    {/* Media Block */}
                    <div className="space-y-8">
                      {/* Video Embed with Glass Overlay */}
                      <div className="aspect-video rounded-[2rem] overflow-hidden bg-secondary-900 shadow-2xl relative group/video">
                        <iframe
                          src={activeProduct.video_url.replace("watch?v=", "embed/")}
                          title={activeProduct.name}
                          className="w-full h-full opacity-80 group-hover/video:opacity-100 transition-opacity"
                          allowFullScreen
                        />
                        <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5 rounded-[2rem]" />
                      </div>

                      {/* Small Swiper */}
                      <div className="relative group/swiper">
                        <Swiper
                          modules={[Navigation, Pagination, Autoplay]}
                          navigation={{
                            prevEl: ".cat-prev",
                            nextEl: ".cat-next",
                          }}
                          autoplay={{ delay: 4000 }}
                          pagination={{ clickable: true }}
                          className="rounded-[2rem] h-64 md:h-80 shadow-xl"
                        >
                          <SwiperSlide>
                            <img
                              src={activeProduct.image_url}
                              alt={activeProduct.name}
                              className="w-full h-full object-cover"
                            />
                          </SwiperSlide>
                        </Swiper>
                        
                        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 z-10 flex justify-between opacity-0 group-hover/swiper:opacity-100 transition-opacity">
                          <button className="cat-prev w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-secondary-950 transition-all">
                            <ChevronLeft size={20} />
                          </button>
                          <button className="cat-next w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-secondary-950 transition-all">
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Content Block */}
                    <div className="flex flex-col justify-center space-y-8">
                      <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 rounded-full text-primary-600 text-xs font-black uppercase tracking-widest mb-6">
                          <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse" />
                          Premium Asset #{activeProduct.id}
                        </div>
                        <h3 className="text-4xl md:text-5xl font-display font-black text-secondary-950 mb-6 leading-tight">
                          {activeProduct.name}
                        </h3>
                        <div 
                          className="prose prose-slate max-w-none text-secondary-600 text-lg leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: activeProduct.content }}
                        />
                      </div>

                      <div className="flex items-center gap-6 pt-6 border-t border-secondary-100">
                        <Link 
                          href="/booking" 
                          className="btn-primary"
                        >
                          Request Technical Data
                        </Link>
                        <div className="flex items-center gap-3 text-secondary-400">
                          <div className="w-10 h-10 rounded-full border border-secondary-100 flex items-center justify-center">
                            <Play size={16} />
                          </div>
                          <span className="text-sm font-bold uppercase tracking-widest">Case Study</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[500px] flex items-center justify-center rounded-[3rem] bg-white italic text-secondary-300 border-2 border-dashed border-secondary-100 font-medium">
                  Select a product from the list to view specifications
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .swiper-pagination-bullet {
          @apply bg-white/50 w-8 h-1 rounded-full opacity-100 transition-all !important;
        }
        .swiper-pagination-bullet-active {
          @apply bg-white w-12 !important;
        }
        
        .prose ul {
          @apply list-none p-0 space-y-3;
        }
        .prose li {
          @apply flex items-start gap-3 before:content-[''] before:block before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary-500 before:mt-2.5;
        }
      `}</style>
    </section>
  );
}
