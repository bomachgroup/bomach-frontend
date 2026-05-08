import Link from "next/link";
import { getJobs } from "@/lib/api";
import PageTitle from "@/components/PageTitle";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedCard from "@/components/ui/AnimatedCard";
import {
  MapPin,
  Clock,
  AlertCircle,
  ArrowRight,
  Briefcase,
  Mail,
} from "lucide-react";
import type { Metadata } from "next";
import type { Job } from "@/lib/types";

export const metadata: Metadata = {
  title: "Careers & Open Positions",
  description:
    "Join Bomach Group. Explore open roles in construction, engineering, real estate, and operations across Nigeria.",
  alternates: { canonical: "/jobs" },
};

export const revalidate = 60;

export default async function JobsPage() {
  let jobs: Job[] = [];
  try {
    jobs = await getJobs();
  } catch {}

  return (
    <>
      <PageTitle title='Jobs' breadcrumbs={[{ label: "Jobs" }]} />

      <section className='py-4 lg:py-8'>
        <div className='max-w-7xl mx-auto px-6 lg:px-8'>
          {/* Post a Job button removed - now only in management */}
        </div>
      </section>

      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-6 lg:px-8'>
          <SectionHeader
            subtitle='Join Our Team'
            title='Job Opportunities'
            titleHighlight='Opportunities'
            description="We're always looking for talented and passionate individuals to join our growing team. Check out our current openings below."
          />

          <div className='mt-12'>
            {jobs.length > 0 ? (
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {jobs.map((job, index) => (
                  <AnimatedCard key={job.id} index={index}>
                    <div className='card-premium-hover bg-white rounded-2xl overflow-hidden h-full flex flex-col'>
                      {/* Job Image */}
                      {job.image_url ? (
                        <div className='relative h-48 overflow-hidden'>
                          <img
                            src={job.image_url}
                            alt={job.title}
                            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                          />
                          <span className='absolute top-4 right-4 bg-white/95 text-secondary-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md'>
                            {job.job_type}
                          </span>
                        </div>
                      ) : (
                        <div className='relative h-48 bg-gradient-to-br from-accent-500 to-secondary-900 flex items-center justify-center'>
                          <Briefcase className='w-16 h-16 text-white/20' />
                          <span className='absolute top-4 right-4 bg-white/95 text-secondary-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md'>
                            {job.job_type}
                          </span>
                        </div>
                      )}

                      {/* Job Content */}
                      <div className='p-6 flex-1 flex flex-col'>
                        {/* Title */}
                        <h3 className='font-bold text-xl text-secondary-900 mb-3'>
                          <Link
                            href={`/jobs/${job.id}`}
                            className='hover:text-primary-600 transition-colors'>
                            {job.title}
                          </Link>
                        </h3>

                        {/* Meta */}
                        <div className='flex flex-wrap gap-4 pb-4 mb-4 border-b border-secondary-100'>
                          <span className='flex items-center gap-2 text-sm text-secondary-500'>
                            <MapPin className='w-4 h-4 text-primary-600' />
                            {job.location}
                          </span>
                          <span className='flex items-center gap-2 text-sm text-secondary-500'>
                            <Clock className='w-4 h-4 text-primary-600' />
                            Posted{" "}
                            {new Date(job.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Salary Range */}
                        {job.salary_range && (
                          <div className='bg-gradient-to-r from-secondary-50 to-secondary-100/50 border-l-4 border-primary-600 rounded-r-lg px-4 py-3 mb-4'>
                            <p className='text-xs text-secondary-400 mb-1'>
                              Salary Range
                            </p>
                            <p className='font-bold text-sm text-secondary-900'>
                              {job.salary_range}
                            </p>
                          </div>
                        )}

                        {/* Deadline */}
                        {job.deadline && (
                          <div className='flex items-center gap-2 text-red-500 text-xs font-semibold py-3 border-t border-secondary-100 mb-4'>
                            <AlertCircle className='w-4 h-4' />
                            Application Deadline:{" "}
                            {new Date(job.deadline).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                        )}

                        {/* Apply Button */}
                        <Link
                          href={`/jobs/${job.id}`}
                          className='mt-auto block text-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/25 flex items-center justify-center gap-2'>
                          <ArrowRight className='w-4 h-4' />
                          View & Apply Now
                        </Link>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            ) : (
              <div className='py-20 text-center flex flex-col items-center'>
                <Briefcase className='w-20 h-20 text-secondary-200 mb-5' />
                <h3 className='font-display text-2xl font-bold text-secondary-900 mb-3'>
                  No Jobs Available
                </h3>
                <p className='text-secondary-500 mb-8 max-w-md'>
                  Currently, there are no open positions. Please check back
                  later or contact us for more information.
                </p>
                <Link
                  href='/contact'
                  className='inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg'>
                  <Mail className='w-4 h-4' />
                  Get in Touch
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
