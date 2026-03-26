import { getServiceBySlug, getServices } from "@/lib/api";
import { notFound } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SubServicesPanel from "./SubServicesPanel";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const services = await getServices();
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const service = await getServiceBySlug(slug);
    return { title: `${service.name} - Bomach Group` };
  } catch {
    return { title: "Service - Bomach Group" };
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let service;
  try {
    service = await getServiceBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <>
      <PageTitle
        title={service.name}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: service.name },
        ]}
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {!service.sub_services || service.sub_services.length === 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <AnimatedSection direction="up" className="lg:col-span-2">
                <div className="overflow-hidden rounded-2xl mb-8">
                  <img
                    src={service.image_url}
                    className="w-full h-auto object-cover"
                    alt={service.name}
                  />
                </div>
                <h2 className="font-display text-2xl font-bold text-secondary-950 mb-6">
                  {service.name}
                </h2>
                <div
                  className="rich-content prose prose-lg max-w-none text-secondary-600"
                  dangerouslySetInnerHTML={{ __html: service.content }}
                />
              </AnimatedSection>
            </div>
          ) : (
            <SubServicesPanel subServices={service.sub_services} />
          )}
        </div>
      </section>
    </>
  );
}
