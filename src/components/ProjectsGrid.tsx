"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";

interface ProjectsGridProps {
  projects: Project[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <section className="py-32 bg-secondary-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-subtitle !text-primary-400">Our Portfolio</span>
              <h2 className="section-title !text-white !mb-0">
                Engineering <span className="text-secondary-400">Excellence</span> <br/> 
                Across Every Project
              </h2>
            </motion.div>
          </div>
          <Link href="/projects" className="btn-glass group">
            View All Projects
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link 
                href={`/projects/${project.slug}`} 
                className="group relative block rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-2xl border border-white/5"
              >
                <img 
                  src={project.image_url} 
                  alt={project.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-950 via-secondary-950/20 to-transparent flex flex-col justify-end p-10 opacity-90 group-hover:opacity-100 transition-opacity">
                  <div className="space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/20 backdrop-blur-md border border-primary-600/30 text-primary-400 text-xs font-black uppercase tracking-widest">
                      {project.sub_service_name}
                    </span>
                    <h3 className="text-2xl font-display font-bold text-white leading-tight">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-white/40 font-bold text-xs uppercase tracking-[0.2em] pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      View Details <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
