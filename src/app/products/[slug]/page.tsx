"use client";

import { useEffect, useState } from "react";
import { getProductBySlug } from "@/lib/api";
import { Product } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Package, Shield, Truck, Zap, HardHat, FileDown, CheckCircle2, ChevronRight, Share2, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<(Product & { images: string[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (slug) {
      getProductBySlug(slug as string)
        .then(setProduct)
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] pt-32">
        <Package size={80} className="text-gray-200 mb-8" />
        <h1 className="text-4xl font-black text-[#1d284b] uppercase tracking-tight mb-4 text-center">Equipment Not Found</h1>
        <p className="text-gray-500 mb-10 text-lg">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products" className="px-10 py-5 bg-[#1d284b] text-white rounded-full font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl">Back to Catalog</Link>
      </div>
    );
  }

  const allImages = product.images.length > 0 ? product.images : [product.image_url || "/images/logo/bomach-logo-hd.png"];

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-40 pb-32">
      {/* Breadcrumbs & Navigation */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <Link href="/products" className="inline-flex items-center text-gray-500 hover:text-blue-700 font-black uppercase tracking-widest text-xs transition-colors group">
            <ArrowLeft size={16} className="mr-3 group-hover:-translate-x-2 transition-transform" /> Back to Products
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <Link href="/" className="hover:text-[#1d284b]">Home</Link>
            <ChevronRight size={10} />
            <Link href="/products" className="hover:text-[#1d284b]">Products</Link>
            <ChevronRight size={10} />
            <span className="text-blue-600">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-20">
          {/* Gallery Column */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-[500px] md:h-[650px] w-full rounded-[3rem] overflow-hidden bg-white shadow-2xl shadow-blue-900/10 border border-blue-50/50"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={allImages[activeImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Ken Burns Overlay Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              </AnimatePresence>

              {/* Video Badge if exists */}
              {product.video_url && (
                <Link href={product.video_url} target="_blank" className="absolute top-10 right-10 w-20 h-20 rounded-full bg-red-600/90 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 hover:bg-red-700 transition-all shadow-xl group cursor-pointer z-10">
                  <Play size={24} className="ml-1 fill-white" />
                  <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-20" />
                </Link>
              )}
            </motion.div>

            {/* Thumbnails */}
            <div className="flex flex-wrap gap-4 px-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? "border-blue-600 scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <Image src={img} alt={`${product.name} thumb ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Column */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center px-6 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest border border-blue-100 mb-8">
                {product.service_name} • # {product.id}
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-[#1d284b] mb-8 uppercase tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="h-1.5 w-24 bg-red-600 mb-10 rounded-full" />

              <div
                className="text-gray-500 text-lg leading-relaxed mb-12 font-medium prose prose-blue prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: product.content }}
              />

              {/* Quick Specs / Features */}
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="flex items-center gap-5 group">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-gray-50 flex items-center justify-center text-blue-700 transition-all group-hover:bg-[#1d284b] group-hover:text-white shadow-sm border border-gray-100">
                    <Shield size={28} />
                  </div>
                  <div>
                    <h4 className="text-[#1d284b] font-black uppercase text-xs tracking-widest mb-1">Durability</h4>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.1em]">Heavy Duty Built</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-gray-50 flex items-center justify-center text-blue-700 transition-all group-hover:bg-[#1d284b] group-hover:text-white shadow-sm border border-gray-100">
                    <Truck size={28} />
                  </div>
                  <div>
                    <h4 className="text-[#1d284b] font-black uppercase text-xs tracking-widest mb-1">Logistics</h4>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.1em]">Nationwide Delivery</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-gray-50 flex items-center justify-center text-blue-700 transition-all group-hover:bg-[#1d284b] group-hover:text-white shadow-sm border border-gray-100">
                    <Zap size={28} />
                  </div>
                  <div>
                    <h4 className="text-[#1d284b] font-black uppercase text-xs tracking-widest mb-1">Efficiency</h4>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.1em]">Latest Generation</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-gray-50 flex items-center justify-center text-blue-700 transition-all group-hover:bg-[#1d284b] group-hover:text-white shadow-sm border border-gray-100">
                    <HardHat size={28} />
                  </div>
                  <div>
                    <h4 className="text-[#1d284b] font-black uppercase text-xs tracking-widest mb-1">Safety</h4>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.1em]">Certified Standards</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 pt-10 border-t border-gray-100">
                <Link href="/contact" className="flex-1 px-10 py-6 bg-red-600 text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-[#1d284b] transition-all text-center shadow-xl shadow-red-900/20">
                  Request Quote
                </Link>
                <Link href="#" className="flex-1 px-10 py-6 bg-white text-[#1d284b] border-2 border-gray-100 rounded-full font-black uppercase tracking-widest text-sm hover:border-blue-600 hover:text-blue-600 transition-all text-center inline-flex items-center justify-center items-center">
                  <FileDown size={20} className="mr-3" /> Download Specs
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Corporate Trust Bar */}
      <section className="container mx-auto px-4 mt-32">
        <div className="bg-[#1d284b] rounded-[3rem] p-10 flex flex-wrap items-center justify-center md:justify-between gap-10">
          <div className="flex items-center gap-4 text-white">
            <CheckCircle2 className="text-red-600" size={32} />
            <div>
              <p className="font-black uppercase tracking-widest text-sm">ISO Certified</p>
              <p className="text-blue-200/50 text-[10px] uppercase font-bold tracking-tight">Quality Guaranteed</p>
            </div>
          </div>
          <div className="hidden lg:block h-12 w-px bg-white/10" />
          <div className="flex items-center gap-4 text-white">
            <Globe className="text-red-600" size={32} />
            <div>
              <p className="font-black uppercase tracking-widest text-sm">Pan-African Presence</p>
              <p className="text-blue-200/50 text-[10px] uppercase font-bold tracking-tight">Active In 5 Nations</p>
            </div>
          </div>
          <div className="hidden lg:block h-12 w-px bg-white/10" />
          <div className="flex items-center gap-4 text-white">
            <Share2 className="text-red-600" size={32} />
            <div>
              <p className="font-black uppercase tracking-widest text-sm">Direct Support</p>
              <p className="text-blue-200/50 text-[10px] uppercase font-bold tracking-tight">24/7 Technical Line</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
