import Link from "next/link";
import { getBlogBySlug, getBlogs } from "@/lib/api";
import { notFound } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { CalendarCheck, User } from "lucide-react";
import type { Metadata } from "next";
import type { Blog } from "@/lib/types";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const blogs = await getBlogs();
    return blogs.map((b) => ({ slug: b.slug }));
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
    const blog = await getBlogBySlug(slug);
    return { title: `${blog.title} - Bomach Group` };
  } catch {
    return { title: "Blog - Bomach Group" };
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let blog;
  let blogs: Blog[] = [];
  try {
    blog = await getBlogBySlug(slug);
  } catch {
    notFound();
  }
  try {
    blogs = await getBlogs();
  } catch {}

  return (
    <>
      <PageTitle
        title={blog.title}
        breadcrumbs={[
          { label: "Blog", href: "/blog" },
          { label: "Blog Details" },
        ]}
      />

      <section className="py-20 bg-secondary-50/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <article>
                  {/* Featured Image */}
                  <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>

                  {/* Meta Bar */}
                  <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-secondary-500">
                    <span className="flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-primary-600" />
                      {new Date(blog.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary-600" />
                      {blog.author}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-display text-3xl lg:text-4xl font-bold text-secondary-900 mb-8">
                    {blog.title}
                  </h2>

                  {/* Content */}
                  <div
                    className="rich-content prose prose-lg max-w-none text-secondary-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </article>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <AnimatedSection>
                <div className="glass-card p-6 sticky top-24">
                  <h4 className="font-display text-xl font-bold text-secondary-900 mb-6 pb-4 border-b border-secondary-100">
                    Recent Posts
                  </h4>
                  <div className="space-y-5">
                    {blogs.map((b) => (
                      <div key={b.id} className="flex gap-4 group/item">
                        <Link
                          href={`/blog/${b.slug}`}
                          className="shrink-0 w-20 h-20 rounded-xl overflow-hidden"
                        >
                          <img
                            src={b.image_url}
                            alt={b.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <h6 className="font-semibold text-secondary-900 text-sm leading-tight mb-2 line-clamp-2 group-hover/item:text-primary-600 transition-colors">
                            <Link href={`/blog/${b.slug}`}>{b.title}</Link>
                          </h6>
                          <p className="text-xs text-secondary-500 flex items-center gap-1.5">
                            <CalendarCheck className="w-3 h-3" />
                            {new Date(b.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
