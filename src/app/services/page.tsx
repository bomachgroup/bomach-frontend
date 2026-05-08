import Link from "next/link";
import { getServices } from "@/lib/api";
import PageTitle from "@/components/PageTitle";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import type { Service } from "@/lib/types";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore Bomach Group's full range of construction, engineering, real estate, and digital innovation services.",
  alternates: { canonical: "/services" },
};

export const revalidate = 60;

export default async function ServicesPage() {
  let services: Service[] = [];
  try {
    services = await getServices();
  } catch {}

  return (
    <>
      <PageTitle
        title="Our Services"
        breadcrumbs={[{ label: "Our Services" }]}
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="mb-16">
            <SectionHeader
              subtitle="What We Do"
              title="Our Services"
              titleHighlight="Services"
              align="center"
            />
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <AnimatedCard key={service.id} index={index}>
                <Link
                  href={`/services/${service.slug}`}
                  className="card-premium-hover group relative overflow-hidden h-80 block rounded-2xl"
                >
                  <img
                    src={service.image_url}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={service.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-xl font-bold text-white mb-2">{service.name}</h3>
                    <div className="flex items-center gap-2 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium">Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
