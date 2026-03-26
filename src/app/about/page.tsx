import { getAboutData } from "@/lib/api";
import PageTitle from "@/components/PageTitle";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AnimatedCard from "@/components/ui/AnimatedCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { Phone, Search, Handshake, Truck, CheckCircle2, Facebook, Twitter, Instagram } from "lucide-react";
import type { Metadata } from "next";
import type { AboutData } from "@/lib/types";

export const metadata: Metadata = {
  title: "About - Bomach Group",
  description: "Learn about Bomach Group, our team, and our mission.",
};

export const revalidate = 60;

const processSteps = [
  { icon: Phone, title: "Contact Us", description: "Tell us about the project or service", step: "01" },
  { icon: Search, title: "Analyze Service", description: "We analyze the project or property with you", step: "02" },
  { icon: Handshake, title: "Choose Plan", description: "We keep in touch throughout the process", step: "03" },
  { icon: Truck, title: "Start Work", description: "We deliver fast and with quality", step: "04" },
];

export default async function AboutPage() {
  let data: AboutData | null = null;
  try {
    data = await getAboutData();
  } catch {}

  const employees = data?.employees || [];
  const partners = data?.partners || [];
  const employeesCount = data?.employees_count || 50;
  const projectCount = data?.project_count || 200;
  const happyCustomerCount = data?.happy_customer_count || 1000;

  return (
    <>
      <PageTitle
        title="About Us"
        bgImage="/images/about/bomach-engineering5.jpg"
        breadcrumbs={[{ label: "About Us" }]}
      />

      {/* Company Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Mosaic */}
            <AnimatedSection direction="left">
              <div className="relative">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src="/images/about/bomach-real5.jpg"
                      className="w-full h-64 object-cover"
                      alt="Bomach Real Estate"
                    />
                  </div>
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src="/images/about/bomach-engineering5.jpg"
                      className="w-full h-64 object-cover"
                      alt="Bomach Engineering"
                    />
                  </div>
                </div>
                {/* Project Count Badge */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-primary-600 text-white rounded-2xl p-6 shadow-2xl z-10">
                  <div className="text-center">
                    <span className="block font-display text-4xl font-black">{projectCount}+</span>
                    <span className="block text-sm font-medium mt-1 text-white/90">Projects<br />Complete</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Company Description */}
            <AnimatedSection direction="right" delay={0.2}>
              <SectionHeader
                subtitle="Who We Are"
                title="Delivering Excellence and Innovation"
                titleHighlight="Innovation"
                className="mb-8"
              />
              <div className="space-y-4 text-secondary-600 leading-relaxed">
                <p>
                  Welcome to Bomach Group of Company, a dynamic business consortium wholly dedicated to our valued customers and partners. With a strong foothold in Nigeria and years of experience, we have established ourselves as industry leaders in multiple sectors.
                </p>
                <p>
                  Our commitment to excellence, paired with a team of seasoned experts, sets us apart in delivering exceptional services to our clients. We offer a diverse range of services including Real Estate, Civil Engineering, ICT and Business Automation, Food Production, Land Services, and Logistics.
                </p>
                <p>
                  At Bomach Group, we believe in harnessing the power of modern technology to enhance our services. We stay at the forefront of industry advancements, integrating innovative solutions that drive efficiency and improve outcomes.
                </p>
                <div className="pt-4">
                  <h4 className="font-display text-lg font-bold text-secondary-950 mb-3">Our Associates</h4>
                  <ul className="space-y-2">
                    {["Bomach Shelters", "Alpha Logistics", "Heptagon Hills", "Yhuga"].map((name) => (
                      <li key={name} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0" />
                        <span>{name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <SectionHeader
                subtitle="Our Vision"
                title="Shaping the Future"
                titleHighlight="Future"
                className="mb-8"
              />
              <ul className="space-y-4">
                <li className="flex gap-3 text-secondary-600 leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                  <span>To revolutionize the real estate and construction industry through cutting-edge technology, exceptional customer service, and a commitment to environmental stewardship, delivering sustainable and resilient solutions.</span>
                </li>
                <li className="flex gap-3 text-secondary-600 leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                  <span>To be the leading provider of innovative and sustainable real estate solutions, enhancing communities and improving lives by making it easier for mankind to own a piece of the earth.</span>
                </li>
                <li className="flex gap-3 text-secondary-600 leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                  <span>To bring on transformative technological products that aid our daily lives and shape the future into a better course.</span>
                </li>
              </ul>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="/images/about/bomach-logistics.jpg"
                  className="w-full h-[500px] object-cover"
                  alt="Bomach Logistics"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="/images/hero/bomach-it.jpg"
                  className="w-full h-[500px] object-cover"
                  alt="Bomach IT"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <SectionHeader
                subtitle="What We Stand For"
                title="Our Core Values"
                titleHighlight="Values"
                className="mb-8"
              />
              <ul className="space-y-4">
                {[
                  { title: "Excellence", desc: "Striving for high-quality performance and continuous improvement, prioritizing customer satisfaction." },
                  { title: "Integrity", desc: "Upholding honesty, ethics, and transparency in all business dealings." },
                  { title: "Innovation", desc: "Encouraging creativity, forward-thinking, and a willingness to adapt and improve." },
                  { title: "Teamwork", desc: "Promoting collaboration, cooperation, and mutual support among employees." },
                  { title: "Accountability", desc: "Taking responsibility for actions, outcomes, and commitments." },
                  { title: "Sustainability", desc: "Demonstrating a commitment to environmental responsibility and social impact." },
                  { title: "Community Engagement", desc: "Engaging with and giving back to the local and global community." },
                ].map((value) => (
                  <li key={value.title} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-display font-bold text-secondary-950">{value.title}:</span>{" "}
                      <span className="text-secondary-600">{value.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Partners Strip */}
      <section className="bg-secondary-950 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <AnimatedSection direction="left" className="lg:w-1/3">
              <h2 className="font-display text-3xl font-black text-white">
                Our <span className="text-primary-500">Partners</span>
              </h2>
            </AnimatedSection>
            <div className="lg:w-2/3">
              <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
                {partners.map((partner) => (
                  <div key={partner.id} className="flex-shrink-0">
                    <img
                      src={partner.image_url}
                      className="max-h-16 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                      alt="Partner"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            subtitle="How We Work"
            title="Delivering Excellence With Business"
            titleHighlight="Excellence"
            align="center"
            className="mb-16"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <AnimatedCard key={step.step} index={index} className="card-premium text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-7 h-7" />
                </div>
                <span className="font-display text-5xl font-black text-primary-600/10">{step.step}</span>
                <h3 className="font-display text-xl font-bold text-secondary-950 mt-2 mb-3">{step.title}</h3>
                <p className="text-secondary-600 text-sm">{step.description}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Counter Stats */}
      <section className="bg-secondary-950 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { target: employeesCount, suffix: "+", label: "Expert Employees" },
              { target: projectCount, suffix: "+", label: "Completed Projects" },
              { target: happyCustomerCount, suffix: "+", label: "Happy Customers" },
            ].map((stat, index) => (
              <AnimatedCard key={stat.label} index={index} className="text-center p-8">
                <div className="font-display text-5xl font-black text-white mb-2">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </div>
                <p className="text-white/70 text-lg font-medium">{stat.label}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            subtitle="Our People"
            title="Our Executive Team"
            titleHighlight="Team"
            align="center"
            className="mb-16"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {employees.map((emp, index) => (
              <AnimatedCard key={emp.id} index={index} className="card-premium-hover group">
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img
                    src={emp.image_url}
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={emp.name}
                  />
                  {/* Social overlay on hover */}
                  {(emp.facebook || emp.twitter || emp.instagram) && (
                    <div className="absolute inset-0 bg-secondary-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      {emp.facebook && (
                        <a href={emp.facebook} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                      {emp.twitter && (
                        <a href={emp.twitter} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {emp.instagram && (
                        <a href={emp.instagram} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
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
