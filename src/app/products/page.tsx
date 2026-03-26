"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Search, Filter, Package, ArrowRight, Video, FileText, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = products;

    if (activeCategory !== "All") {
      result = result.filter(p => p.service_name === activeCategory);
    }

    if (searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, activeCategory, products]);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.service_name).filter(Boolean)))];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-32 pb-20">
      {/* Header */}
      <section className="container mx-auto px-4 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-red-600 font-black uppercase tracking-[0.2em] text-sm mb-4 block">
              Innovative Solutions
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-[#1d284b] mb-8 uppercase tracking-tight">
              Our <span className="text-blue-700">Product</span> Lineup
            </h1>
            <div className="h-1.5 w-24 bg-red-600 mx-auto mb-8 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-blue-50/50">
          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat || "All")}
                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border ${activeCategory === cat
                    ? "bg-[#1d284b] text-white border-[#1d284b] shadow-lg shadow-blue-900/20"
                    : "bg-white text-gray-500 border-gray-100 hover:border-blue-200 hover:bg-blue-50"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-full focus:ring-2 focus:ring-blue-500/20 text-[#1d284b] font-medium transition-all"
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  variants={cardVariants}
                  className="group block"
                >
                  <Link href={`/products/${product.slug}`} className="block h-full">
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-blue-50 shadow-2xl shadow-blue-900/5 transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-blue-900/10 flex flex-col h-full">
                      {/* Image */}
                      <div className="relative h-80 w-full overflow-hidden">
                        <Image
                          src={product.image_url || "/images/logo/bomach-logo-hd.png"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                          <span className="text-white font-black uppercase tracking-widest text-sm flex items-center">
                            View Details <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
                          </span>
                        </div>

                        {/* Service Tag */}
                        <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full border border-whiteShadow-lg text-[10px] font-black uppercase tracking-widest text-blue-700">
                          {product.service_name}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-10 flex-grow">
                        <h3 className="text-2xl font-black text-[#1d284b] mb-4 uppercase tracking-tight group-hover:text-blue-700 transition-colors">
                          {product.name}
                        </h3>
                        <div
                          className="text-gray-500 line-clamp-3 text-sm leading-relaxed mb-8 font-medium"
                          dangerouslySetInnerHTML={{ __html: product.content }}
                        />

                        <div className="flex items-center gap-6 pt-6 border-t border-gray-50">
                          {product.video_url && (
                            <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest">
                              <Video size={16} /> 1 Video
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                            <FileText size={16} /> Catalog
                          </div>
                        </div>
                      </div>

                      {/* ID Badge */}
                      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-mono text-gray-400 font-bold"># {product.id}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <Package size={64} className="mx-auto text-gray-200 mb-6" />
              <h2 className="text-2xl font-black text-[#1d284b] uppercase tracking-tight mb-2">No Products Found</h2>
              <p className="text-gray-400">Try adjusting your search or category filters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Global Newsletter Strip */}
      <section className="container mx-auto px-4 mt-32">
        <div className="bg-[#1d284b] rounded-[3rem] p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tight">Need a <span className="text-red-600">Custom</span> Solution?</h2>
            <p className="text-blue-200/60 text-lg">Download our corporate catalog or talk to an expert today.</p>
          </div>
          <div className="flex gap-4 relative z-10">
            <Link href="/contact" className="px-10 py-5 bg-white text-[#1d284b] rounded-full font-black uppercase tracking-widest text-sm hover:bg-red-600 hover:text-white transition-all shadow-xl">Request Demo</Link>
            <Link href="#" className="px-10 py-5 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-xl">Download PDF</Link>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
        </div>
      </section>
    </div>
  );
}
