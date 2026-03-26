"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Link2 } from "lucide-react";
import type { Project, Service } from "@/lib/types";

interface ProjectsFilterGridProps {
  projects: Project[];
  services: Service[];
}

export default function ProjectsFilterGrid({
  projects,
  services,
}: ProjectsFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>("*");

  const filteredProjects =
    activeFilter === "*"
      ? projects
      : projects.filter((p) => p.sub_service_name === activeFilter);

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button
          className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            activeFilter === "*"
              ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25"
              : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
          }`}
          onClick={() => setActiveFilter("*")}
        >
          All
        </button>
        {services.map((service) => (
          <button
            key={service.id}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeFilter === service.name
                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25"
                : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
            }`}
            onClick={() => setActiveFilter(service.name)}
          >
            {service.name}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="card-premium-hover group relative overflow-hidden h-72 rounded-2xl block"
              >
                {/* Image */}
                <img
                  src={project.image_url}
                  alt={project.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Project Name */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-display font-bold text-lg">
                    {project.name}
                  </h3>
                  {project.sub_service_name && (
                    <p className="text-white/70 text-sm mt-1">
                      {project.sub_service_name}
                    </p>
                  )}
                </div>

                {/* Hover Overlay with Icons */}
                <div className="absolute inset-0 bg-secondary-950/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/30 hover:bg-primary-600 hover:border-primary-600 transition-colors">
                    <Eye className="w-5 h-5" />
                  </span>
                  <span className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/30 hover:bg-primary-600 hover:border-primary-600 transition-colors">
                    <Link2 className="w-5 h-5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
