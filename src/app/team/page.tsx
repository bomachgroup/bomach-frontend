import { getTeam } from "@/lib/api";
import PageTitle from "@/components/PageTitle";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { Facebook, Twitter, Instagram } from "lucide-react";
import type { Metadata } from "next";
import type { Employee } from "@/lib/types";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the Bomach Group team — the experienced professionals leading our work in construction, engineering, and real estate across Nigeria.",
  alternates: { canonical: "/team" },
};

export const revalidate = 60;

export default async function TeamPage() {
  let employees: Employee[] = [];
  try {
    employees = await getTeam();
  } catch {}

  return (
    <>
      <PageTitle
        title="Team Member"
        bgImage="/images/about/bomach-engineering5.jpg"
        breadcrumbs={[{ label: "Team Member" }]}
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="mb-16">
            <SectionHeader
              subtitle="Our People"
              title="Executive Team"
              titleHighlight="Team"
              align="center"
            />
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {employees.map((emp, index) => (
              <AnimatedCard key={emp.id} index={index} className="card-premium-hover group">
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img
                    src={emp.image_url}
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={emp.name}
                  />
                  {(emp.facebook || emp.twitter || emp.instagram) && (
                    <div className="absolute inset-0 bg-secondary-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      {emp.facebook && (
                        <a
                          href={emp.facebook}
                          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                      {emp.twitter && (
                        <a
                          href={emp.twitter}
                          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {emp.instagram && (
                        <a
                          href={emp.instagram}
                          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-5 text-center">
                  <h4 className="font-display text-lg font-bold text-secondary-950">{emp.name}</h4>
                  <span className="text-sm text-secondary-500">{emp.job_title}</span>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
