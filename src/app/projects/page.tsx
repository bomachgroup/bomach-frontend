import { getProjects, getServices } from "@/lib/api";
import PageTitle from "@/components/PageTitle";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectsFilterGrid from "./ProjectsFilterGrid";
import type { Metadata } from "next";
import type { Project, Service } from "@/lib/types";

export const metadata: Metadata = {
  title: "Projects - Bomach Group",
  description:
    "View our portfolio of construction and engineering projects.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  let projects: Project[] = [];
  let services: Service[] = [];
  try {
    [projects, services] = await Promise.all([getProjects(), getServices()]);
  } catch {}

  return (
    <>
      <PageTitle
        title="Our Projects"
        breadcrumbs={[{ label: "Our Projects" }]}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            subtitle="Our Work"
            title="Project Showcase"
            titleHighlight="Showcase"
            description="Explore our portfolio of completed projects across construction, engineering, and real estate development."
          />

          <div className="mt-12">
            <ProjectsFilterGrid projects={projects} services={services} />
          </div>
        </div>
      </section>
    </>
  );
}
