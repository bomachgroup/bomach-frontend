import { getProjectBySlug, getProjects, sanitizeImageUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Calendar, Layers, FolderOpen } from "lucide-react";
import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bomachgroup.com";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((p) => ({ slug: p.slug }));
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
    const project = await getProjectBySlug(slug);
    const description = `Explore ${project.name} — a Bomach Group project showcasing our expertise in construction, engineering, and real estate.`;
    const image = project.image_url
      ? sanitizeImageUrl(project.image_url)
      : undefined;
    const url = `${SITE_URL}/projects/${slug}`;

    return {
      title: project.name,
      description,
      alternates: { canonical: `/projects/${slug}` },
      openGraph: {
        type: "article",
        title: project.name,
        description,
        url,
        siteName: "Bomach Group",
        images: image ? [{ url: image, alt: project.name }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: project.name,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: "Project" };
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let project;
  try {
    project = await getProjectBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <>
      <PageTitle
        title={project.name}
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Project Details" },
        ]}
      />

      <section className="py-20 bg-secondary-50/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <AnimatedSection>
                <div className="glass-card p-6 sticky top-24">
                  <h4 className="font-display text-xl font-bold text-secondary-900 mb-6 pb-4 border-b border-secondary-100">
                    Project Info
                  </h4>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <FolderOpen className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-secondary-500 uppercase tracking-wider">Name</span>
                        <p className="text-secondary-900 font-medium">{project.name}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-secondary-500 uppercase tracking-wider">Date</span>
                        <p className="text-secondary-900 font-medium">
                          {new Date(project.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Layers className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-secondary-500 uppercase tracking-wider">Service</span>
                        <p className="text-secondary-900 font-medium">
                          {project.sub_service_name || "N/A"}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </AnimatedSection>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <AnimatedSection>
                {/* Project Image */}
                <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
                  <img
                    src={project.image_url}
                    alt={project.name}
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Title */}
                <h2 className="font-display text-3xl font-bold text-secondary-900 mb-6">
                  {project.name}
                </h2>

                {/* Content */}
                {project.content ? (
                  <div
                    className="rich-content prose prose-lg max-w-none text-secondary-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.content }}
                  />
                ) : (
                  <p className="text-secondary-600 leading-relaxed">
                    Detailed description for this project is currently being
                    finalized.
                  </p>
                )}
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
