import Link from "next/link";
import { getBlogs } from "@/lib/api";
import PageTitle from "@/components/PageTitle";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { CalendarCheck, User, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import type { Blog } from "@/lib/types";

export const metadata: Metadata = {
  title: "Blog - Bomach Group",
  description: "Latest news and updates from Bomach Group.",
};

export const revalidate = 60;

export default async function BlogPage() {
  let blogs: Blog[] = [];
  try {
    blogs = await getBlogs();
  } catch {}

  return (
    <>
      <PageTitle title="Blog" breadcrumbs={[{ label: "Blog" }]} />

      <section className="py-20 bg-secondary-50/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {blogs.map((blog, index) => (
                <AnimatedCard key={blog.id} index={index}>
                  <article className="card-premium-hover group bg-white rounded-2xl overflow-hidden">
                    {/* Image */}
                    <div className="relative h-60 overflow-hidden">
                      <Link href={`/blog/${blog.slug}`}>
                        <img
                          src={blog.image_url}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </Link>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-6 mb-4 text-sm text-secondary-500">
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
                      <h3 className="font-display text-2xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors">
                        <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </h3>

                      {/* Excerpt */}
                      <div
                        className="text-secondary-600 leading-relaxed mb-6 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: blog.short_content,
                        }}
                      />

                      {/* Read More */}
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="text-primary-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                </AnimatedCard>
              ))}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <AnimatedSection>
                <div className="glass-card p-6 sticky top-24">
                  <h4 className="font-display text-xl font-bold text-secondary-900 mb-6 pb-4 border-b border-secondary-100">
                    Recent Posts
                  </h4>
                  <div className="space-y-5">
                    {blogs.map((blog) => (
                      <div key={blog.id} className="flex gap-4 group/item">
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="shrink-0 w-20 h-20 rounded-xl overflow-hidden"
                        >
                          <img
                            src={blog.image_url}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <h6 className="font-semibold text-secondary-900 text-sm leading-tight mb-2 line-clamp-2 group-hover/item:text-primary-600 transition-colors">
                            <Link href={`/blog/${blog.slug}`}>
                              {blog.title}
                            </Link>
                          </h6>
                          <p className="text-xs text-secondary-500 flex items-center gap-1.5">
                            <CalendarCheck className="w-3 h-3" />
                            {new Date(blog.date).toLocaleDateString("en-US", {
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
