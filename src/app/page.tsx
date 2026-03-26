import Link from "next/link";
import Image from "next/image";
import { getHomepageData, sanitizeImageUrl } from "@/lib/api";
import HomeHeader from "@/components/HomeHeader";
import QuoteForm from "@/components/QuoteForm";
import HeroSlider from "@/components/home/HeroSlider";
import HomeProjectsSlider from "@/components/home/HomeProjectsSlider";
import HomeTestimonials from "@/components/home/HomeTestimonials";
import HomePartners from "@/components/home/HomePartners";
import HomeSkillBars from "@/components/home/HomeSkillBars";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AnimatedCard from "@/components/ui/AnimatedCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  Play,
  ArrowRight,
  Building2,
  Trophy,
  Star,
  Briefcase,
  Users,
  FolderKanban,
  Heart,
} from "lucide-react";
import type { HomepageData } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  let data: HomepageData | null = null;
  try {
    data = await getHomepageData();
  } catch (err) {
    console.error("Failed to fetch homepage data:", err);
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-black text-secondary-950 mb-4">
            Welcome to Bomach Group
          </h1>
          <p className="text-secondary-600 text-lg">
            Content is loading. Please ensure the backend API is running.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Transparent Header */}
      <HomeHeader />

      {/* ─── 1. Hero Slider ─── */}
      <HeroSlider sliders={data.sliders} />

      {/* ─── 2. Video / Experience Section ─── */}
      <section className="premium-section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image with play button */}
            <AnimatedSection direction="left">
              <div className="relative rounded-2xl overflow-hidden group h-[400px] lg:h-[500px]">
                <Image
                  src="/images/hero/bomach-real.jpg"
                  alt="Bomach Group experience"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-secondary-950/30 group-hover:bg-secondary-950/40 transition-colors duration-300" />
                <a
                  href="https://www.youtube.com/watch?v=3c2NoilqL64"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center"
                  aria-label="Play video"
                >
                  <span className="relative flex items-center justify-center">
                    {/* Pulsing ring */}
                    <span className="absolute w-24 h-24 rounded-full bg-primary-600/30 animate-ping" />
                    <span className="relative w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center shadow-2xl shadow-primary-600/40">
                      <Play size={32} className="text-white ml-1" fill="white" />
                    </span>
                  </span>
                </a>
              </div>
            </AnimatedSection>

            {/* Text content */}
            <AnimatedSection direction="right" delay={0.2}>
              <SectionHeader
                subtitle="What We Do"
                title="We are the best at what we do"
                description="With decades of experience and a team of industry professionals, we are committed to delivering optimum output and efficient results in all our project endeavours."
              />
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Building2 size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-secondary-950">
                      Industry Leaders
                    </h4>
                    <p className="text-secondary-600 mt-1">
                      A dynamic business consortium with a strong foothold in Nigeria across multiple sectors.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Trophy size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-secondary-950">
                      Proven Track Record
                    </h4>
                    <p className="text-secondary-600 mt-1">
                      Delivering excellence and innovation in real estate, engineering, and digital solutions.
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/about"
                className="btn-primary mt-8 inline-flex items-center gap-2"
              >
                Learn More
                <ArrowRight size={18} />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── 3. Services Grid ─── */}
      <section className="premium-section bg-secondary-50/50">
        <div className="container-custom">
          <AnimatedSection className="mb-14">
            <SectionHeader
              subtitle="Our Expertise"
              title="Our Services"
              titleHighlight="Services"
              align="center"
              description="Comprehensive solutions across real estate, engineering, digital innovation, and more."
            />
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.services.map((service, idx) => (
              <AnimatedCard key={service.id} index={idx} staggerDelay={0.1}>
                <Link
                  href={`/services/${service.slug}`}
                  className="card-premium-hover block p-8 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary-600/10 flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors duration-300">
                    <Briefcase
                      size={26}
                      className="text-primary-600 group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                  <h3 className="font-display text-xl font-bold text-secondary-950 mb-3">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-2 text-primary-600 font-bold text-sm uppercase tracking-wider">
                    Learn More
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. Quote Form Section ─── */}
      <section className="premium-section bg-secondary-950 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <AnimatedSection direction="left">
              <SectionHeader
                subtitle="Get a Quote"
                title="Let Us Handle Your Next Project"
                titleHighlight="Project"
                light
                description="Share your project details and our expert team will provide a comprehensive assessment and tailored solution within 24 hours."
              />
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-white/70">
                  <div className="w-2 h-2 rounded-full bg-primary-600" />
                  <span>Free initial consultation</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <div className="w-2 h-2 rounded-full bg-primary-600" />
                  <span>Response within 24 hours</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <div className="w-2 h-2 rounded-full bg-primary-600" />
                  <span>Tailored solutions for every project</span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <QuoteForm services={data.services} />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── 5. Experience / Skills Section ─── */}
      <section className="premium-section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection direction="left">
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="/images/hero/bomach-real4.jpg"
                  alt="Service experience"
                  width={800}
                  height={600}
                  className="w-full h-[400px] lg:h-[550px] object-cover"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <SectionHeader
                subtitle="Service Experience"
                title="Experience Excellence With Us"
                description="With decades of experience and a team of industry professionals, we are committed to delivering optimum output and efficient results."
              />
              <div className="mt-10">
                <HomeSkillBars services={data.services} />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── 6. Success Journey ─── */}
      <section className="premium-section bg-secondary-50/50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <AnimatedSection direction="left">
              <SectionHeader
                subtitle="Our Story"
                title="Our Success Journey"
                titleHighlight="Success"
              />
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-600/10 flex items-center justify-center flex-shrink-0">
                    <Building2 size={22} className="text-primary-600" />
                  </div>
                  <div>
                    <h5 className="font-display text-lg font-bold text-secondary-950 mb-1">
                      Delivering Excellence and Innovation
                    </h5>
                    <p className="text-secondary-600">
                      A dynamic business consortium wholly dedicated to our valued customers and partners with years of industry leadership.
                    </p>
                    <Link
                      href="/about"
                      className="text-primary-600 font-bold text-sm mt-2 inline-flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read more <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-600/10 flex items-center justify-center flex-shrink-0">
                    <Trophy size={22} className="text-primary-600" />
                  </div>
                  <div>
                    <h5 className="font-display text-lg font-bold text-secondary-950 mb-1">
                      Vision
                    </h5>
                    <p className="text-secondary-600">
                      To revolutionize the real estate and construction industry through cutting-edge technology and innovative solutions.
                    </p>
                    <Link
                      href="/about"
                      className="text-primary-600 font-bold text-sm mt-2 inline-flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read more <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-600/10 flex items-center justify-center flex-shrink-0">
                    <Star size={22} className="text-primary-600" />
                  </div>
                  <div>
                    <h5 className="font-display text-lg font-bold text-secondary-950 mb-1">
                      Our Core Values
                    </h5>
                    <p className="text-secondary-600">
                      Excellence, integrity, and customer satisfaction drive everything we do, ensuring value in every project.
                    </p>
                    <Link
                      href="/about"
                      className="text-primary-600 font-bold text-sm mt-2 inline-flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read more <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Image + CTA */}
            <AnimatedSection direction="right" delay={0.2}>
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="/images/hero/bomach-it.jpg"
                  alt="Bomach projects"
                  width={800}
                  height={600}
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-950/80 via-secondary-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="font-display text-2xl font-black text-white mb-2">
                    Have any queries?
                  </h3>
                  <p className="text-white/70 mb-6">
                    Reach out to us and let us help you.
                  </p>
                  <Link href="/booking" className="btn-primary">
                    Book Appointment
                    <ArrowRight size={18} className="ml-2" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── 7. Blog Preview ─── */}
      {data.blogs.length > 0 && (
        <section className="premium-section bg-white">
          <div className="container-custom">
            <AnimatedSection className="mb-14">
              <SectionHeader
                subtitle="Latest News"
                title="From Our Blog"
                titleHighlight="Blog"
                align="center"
              />
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.blogs.slice(0, 3).map((blog, idx) => (
                <AnimatedCard key={blog.id} index={idx} staggerDelay={0.15}>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="group block relative h-[420px] rounded-2xl overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sanitizeImageUrl(blog.image_url)}
                      alt={blog.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-950/90 via-secondary-950/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-primary-400 text-xs font-bold uppercase tracking-wider">
                        {blog.author}
                      </span>
                      <h3 className="font-display text-xl font-bold text-white mt-2 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-white/60 text-sm mt-2 line-clamp-2">
                        {blog.short_content}
                      </p>
                    </div>
                  </Link>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 8. Projects Slider ─── */}
      {data.projects.length > 0 && (
        <section className="premium-section bg-secondary-950 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary-600/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl" />
          <div className="container-custom relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-4">
                <AnimatedSection direction="left">
                  <SectionHeader
                    subtitle="Recent Projects"
                    title="Every Project is Important for Our Team"
                    titleHighlight="Project"
                    light
                    description="Your one-stop solution for real estate services, land services, engineering, digital innovation, and food production."
                  />
                  <Link
                    href="/projects"
                    className="btn-primary mt-8 inline-flex items-center gap-2"
                  >
                    All Projects
                    <ArrowRight size={18} />
                  </Link>
                </AnimatedSection>
              </div>
              <div className="lg:col-span-8">
                <AnimatedSection direction="right" delay={0.2}>
                  <HomeProjectsSlider projects={data.projects} />
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── 9. Testimonials + Stats ─── */}
      <section className="premium-section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Testimonials */}
            <AnimatedSection direction="left">
              <SectionHeader
                subtitle="Client Feedback"
                title="What Our Clients Say About Us"
                titleHighlight="Clients"
                className="mb-10"
              />
              <HomeTestimonials reviews={data.reviews} />
            </AnimatedSection>

            {/* Stats */}
            <AnimatedSection direction="right" delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 lg:mt-16">
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary-600/10 flex items-center justify-center mx-auto mb-4">
                    <Users size={28} className="text-primary-600" />
                  </div>
                  <AnimatedCounter
                    target={data.employees_count}
                    suffix="+"
                    className="font-display text-4xl md:text-5xl font-black text-secondary-950"
                  />
                  <p className="text-secondary-600 font-medium mt-2 uppercase tracking-wider text-sm">
                    Expert Employees
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary-600/10 flex items-center justify-center mx-auto mb-4">
                    <FolderKanban size={28} className="text-primary-600" />
                  </div>
                  <AnimatedCounter
                    target={data.project_count}
                    suffix="+"
                    className="font-display text-4xl md:text-5xl font-black text-secondary-950"
                  />
                  <p className="text-secondary-600 font-medium mt-2 uppercase tracking-wider text-sm">
                    Completed Projects
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary-600/10 flex items-center justify-center mx-auto mb-4">
                    <Heart size={28} className="text-primary-600" />
                  </div>
                  <AnimatedCounter
                    target={data.happy_customer_count}
                    suffix="+"
                    className="font-display text-4xl md:text-5xl font-black text-secondary-950"
                  />
                  <p className="text-secondary-600 font-medium mt-2 uppercase tracking-wider text-sm">
                    Happy Customers
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── 10. Partners ─── */}
      {data.partners.length > 0 && (
        <section className="py-20 lg:py-28 bg-gradient-to-b from-secondary-900 to-secondary-950 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-600 rounded-full blur-[120px]" />
          </div>
          <div className="container-custom relative z-10">
            <AnimatedSection className="mb-14">
              <p className="text-center text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Trusted By</p>
              <h2 className="text-center text-3xl lg:text-4xl font-bold text-white">
                Our <span className="text-primary-500">Partners</span>
              </h2>
              <div className="w-16 h-1 bg-primary-500 mx-auto mt-4 rounded-full" />
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <HomePartners partners={data.partners} />
            </AnimatedSection>
          </div>
        </section>
      )}
    </>
  );
}
