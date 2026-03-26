"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  title: string;
  items: { label: string; href?: string }[];
  bgImage?: string;
}

export default function Breadcrumb({ title, items, bgImage }: BreadcrumbProps) {
  const defaultBg = "/images/about/bomach-engineering5.jpg";

  return (
    <section className="relative py-24 md:py-32 overflow-hidden flex items-center justify-center text-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage || defaultBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-secondary/70 backdrop-blur-[2px]" />

      <div className="container-custom relative z-20 text-white">
        <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight animate-fadeInUp">
          {title}
        </h1>
        
        <nav className="flex justify-center items-center gap-2 text-sm md:text-base font-bold text-gray-200">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-4 h-4 text-primary" />
              {item.href ? (
                <Link href={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-white">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
