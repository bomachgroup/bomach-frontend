"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { getJobBySlug, submitJobApplication } from "@/lib/api";
import PageTitle from "@/components/PageTitle";
import AnimatedSection from "@/components/ui/AnimatedSection";
import {
  MapPin,
  Briefcase,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  File,
  MessageSquare,
  Send,
  AlertCircle,
  HelpCircle,
  Loader2,
  Info,
} from "lucide-react";
import type { JobDetail } from "@/lib/types";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getJobBySlug(slug)
      .then(setJob)
      .catch(() => {});
  }, [slug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!job) return;
    setStatus("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("job", String(job.id));

    const resume = formData.get("resume") as File;
    const maxSize = 5 * 1024 * 1024;

    if (resume && resume.size > maxSize) {
      setStatus("error");
      setErrorMsg("Resume file size should be less than 5MB.");
      return;
    }

    try {
      await submitJobApplication(formData);
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Submission failed."
      );
    }
    setTimeout(() => setStatus("idle"), 8000);
  }

  if (!job) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
        <p className="text-secondary-500">Loading position details...</p>
      </div>
    );
  }

  return (
    <>
      <PageTitle
        title={job.title}
        breadcrumbs={[
          { label: "Jobs", href: "/jobs" },
          { label: "Job Details" },
        ]}
      />

      <section className="py-20 bg-secondary-50/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Header Card */}
              <AnimatedSection>
                <div className="glass-card p-8">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                    <div className="flex-1">
                      <h2 className="font-display text-3xl font-bold text-secondary-900 mb-5">
                        {job.title}
                      </h2>
                      <div className="flex flex-wrap gap-5">
                        <span className="flex items-center gap-2 text-sm text-secondary-600">
                          <MapPin className="w-4 h-4 text-primary-600" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-2 text-sm text-secondary-600">
                          <Briefcase className="w-4 h-4 text-primary-600" />
                          {job.job_type}
                        </span>
                        <span className="flex items-center gap-2 text-sm text-secondary-600">
                          <Calendar className="w-4 h-4 text-primary-600" />
                          Posted{" "}
                          {new Date(job.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    {job.salary_range && (
                      <div className="bg-gradient-to-br from-accent-600 to-secondary-900 px-6 py-5 rounded-2xl text-right text-white shadow-lg">
                        <p className="text-xs text-white/80 uppercase tracking-wider font-semibold mb-1">
                          Salary Range
                        </p>
                        <p className="font-bold text-xl">{job.salary_range}</p>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>

              {/* Job Image */}
              {job.image_url && (
                <AnimatedSection>
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={job.image_url}
                      alt={job.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </AnimatedSection>
              )}

              {/* Description */}
              {job.description && (
                <AnimatedSection>
                  <div className="glass-card p-8">
                    <h3 className="font-display text-xl font-bold text-secondary-900 mb-4 pb-3 border-b border-secondary-100">
                      About This Position
                    </h3>
                    <div
                      className="rich-content prose max-w-none text-secondary-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                  </div>
                </AnimatedSection>
              )}

              {/* Responsibilities */}
              {job.responsibilities && (
                <AnimatedSection>
                  <div className="glass-card p-8">
                    <h3 className="font-display text-xl font-bold text-secondary-900 mb-4 pb-3 border-b border-secondary-100">
                      Responsibilities
                    </h3>
                    <div
                      className="rich-content prose max-w-none text-secondary-600 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: job.responsibilities,
                      }}
                    />
                  </div>
                </AnimatedSection>
              )}

              {/* Requirements */}
              {job.requirements && (
                <AnimatedSection>
                  <div className="glass-card p-8">
                    <h3 className="font-display text-xl font-bold text-secondary-900 mb-4 pb-3 border-b border-secondary-100">
                      Requirements
                    </h3>
                    <div
                      className="rich-content prose max-w-none text-secondary-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: job.requirements }}
                    />
                  </div>
                </AnimatedSection>
              )}

              {/* Benefits */}
              {job.benefits && (
                <AnimatedSection>
                  <div className="glass-card p-8">
                    <h3 className="font-display text-xl font-bold text-secondary-900 mb-4 pb-3 border-b border-secondary-100">
                      Benefits
                    </h3>
                    <div
                      className="rich-content prose max-w-none text-secondary-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: job.benefits }}
                    />
                  </div>
                </AnimatedSection>
              )}

              {/* Deadline Warning */}
              {job.deadline && (
                <AnimatedSection>
                  <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl px-6 py-5">
                    <p className="text-amber-800 font-semibold flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Application Deadline:{" "}
                      {new Date(job.deadline).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </AnimatedSection>
              )}
            </div>

            {/* Application Form Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-accent-600 to-secondary-900 text-white rounded-2xl p-8 sticky top-24">
                {/* Header */}
                <div className="mb-7">
                  <FileText className="w-7 h-7 text-white/80 mb-3" />
                  <h3 className="text-2xl font-bold text-white">Apply Now</h3>
                  <p className="text-white/80 text-sm mt-2">
                    Complete the form below to apply
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="flex items-center gap-1.5 text-white text-xs font-semibold mb-2">
                      <User className="w-3.5 h-3.5" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      required
                      className="w-full bg-white/95 rounded-xl px-4 py-3 text-sm text-secondary-900 border-2 border-transparent outline-none focus:border-white/50 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.2)] transition-all placeholder:text-secondary-400"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-1.5 text-white text-xs font-semibold mb-2">
                      <Mail className="w-3.5 h-3.5" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your email"
                      required
                      className="w-full bg-white/95 rounded-xl px-4 py-3 text-sm text-secondary-900 border-2 border-transparent outline-none focus:border-white/50 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.2)] transition-all placeholder:text-secondary-400"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-1.5 text-white text-xs font-semibold mb-2">
                      <Phone className="w-3.5 h-3.5" />
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Your phone number"
                      required
                      className="w-full bg-white/95 rounded-xl px-4 py-3 text-sm text-secondary-900 border-2 border-transparent outline-none focus:border-white/50 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.2)] transition-all placeholder:text-secondary-400"
                    />
                  </div>

                  {/* Resume */}
                  <div>
                    <label className="flex items-center gap-1.5 text-white text-xs font-semibold mb-2">
                      <FileText className="w-3.5 h-3.5" />
                      Resume / CV (PDF, DOC, DOCX) *
                    </label>
                    <input
                      type="file"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      required
                      className="w-full bg-white/95 rounded-xl px-3 py-2.5 text-xs text-secondary-900 border-2 border-transparent cursor-pointer file:bg-accent-600 file:text-white file:border-0 file:px-3 file:py-1.5 file:rounded-md file:cursor-pointer file:text-xs file:font-semibold file:mr-3 hover:bg-white transition-all"
                    />
                    <p className="text-white/70 text-xs mt-1.5 flex items-center gap-1">
                      <Info className="w-3 h-3" /> Max 5MB
                    </p>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="flex items-center gap-1.5 text-white text-xs font-semibold mb-2">
                      <File className="w-3.5 h-3.5" />
                      Cover Letter (Optional)
                    </label>
                    <input
                      type="file"
                      name="cover_letter"
                      accept=".pdf,.doc,.docx"
                      className="w-full bg-white/95 rounded-xl px-3 py-2.5 text-xs text-secondary-900 border-2 border-transparent cursor-pointer file:bg-accent-600 file:text-white file:border-0 file:px-3 file:py-1.5 file:rounded-md file:cursor-pointer file:text-xs file:font-semibold file:mr-3 hover:bg-white transition-all"
                    />
                    <p className="text-white/70 text-xs mt-1.5 flex items-center gap-1">
                      <Info className="w-3 h-3" /> Max 5MB
                    </p>
                  </div>

                  {/* Additional Message */}
                  <div>
                    <label className="flex items-center gap-1.5 text-white text-xs font-semibold mb-2">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Why You&apos;re Interested (Optional)
                    </label>
                    <textarea
                      name="message"
                      placeholder="Tell us why you're a great fit..."
                      rows={4}
                      className="w-full bg-white/95 rounded-xl px-4 py-3 text-sm text-secondary-900 border-2 border-transparent outline-none focus:border-white/50 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.2)] transition-all resize-y min-h-[100px] placeholder:text-secondary-400"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-white text-secondary-900 font-bold py-3.5 rounded-xl text-center transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {status === "loading"
                      ? "Submitting..."
                      : "Submit Application"}
                  </button>
                </form>

                {/* Status messages */}
                {status === "success" && (
                  <div className="mt-5 bg-white/15 border border-white/30 text-white rounded-xl px-4 py-3 text-sm">
                    Application submitted successfully!
                  </div>
                )}
                {status === "error" && (
                  <div className="mt-5 bg-white/15 border border-white/30 text-white rounded-xl px-4 py-3 text-sm">
                    {errorMsg}
                  </div>
                )}

                {/* Contact Section */}
                <div className="border-t border-white/20 mt-7 pt-6">
                  <p className="text-xs text-white/80 font-semibold mb-3 flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Have Questions?
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-2">
                    <p className="text-xs flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-white/70" />
                      <a
                        href="mailto:bomachgroupmanagement@gmail.com"
                        className="text-white/90 hover:text-white transition-colors"
                      >
                        bomachgroupmanagement@gmail.com
                      </a>
                    </p>
                    <p className="text-xs flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-white/70" />
                      <a
                        href="tel:09018000118"
                        className="text-white/90 hover:text-white transition-colors"
                      >
                        090 1800 0118
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
