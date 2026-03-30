"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createJob } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Briefcase, Save, Loader2 } from "lucide-react";

export default function AdminJobCreatePage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) {
      setError("You must be logged in to submit a job post.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      title: (formData.get("title") as string) || "",
      company: (formData.get("company") as string) || "",
      description: (formData.get("description") as string) || "",
      location: (formData.get("location") as string) || "",
      is_remote: formData.get("is_remote") === "on",
      job_type: (formData.get("job_type") as string) || "full_time",
      experience_level: (formData.get("experience_level") as string) || "entry",
      salary_range: (formData.get("salary_range") as string) || null,
      requirements: ((formData.get("requirements") as string) || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      responsibilities: ((formData.get("responsibilities") as string) || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      await createJob(payload, accessToken);
      setStatus("success");
      router.push("/management/jobs");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to submit job.");
    }
  }

  const inputClasses =
    "w-full px-4 py-3 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all text-secondary-900";
  const labelClasses =
    "block text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2";

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link
          href='/management/jobs'
          className='p-2.5 rounded-xl border border-secondary-200 text-secondary-500 hover:text-secondary-900 hover:border-secondary-300 transition-all'>
          <ArrowLeft className='w-5 h-5' />
        </Link>
        <div>
          <h1 className='font-display text-2xl sm:text-3xl font-bold text-secondary-900'>
            Create Job Posting
          </h1>
          <p className='text-secondary-500 mt-1'>Add a new job opportunity</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Basic Info */}
        <div className='bg-white rounded-2xl border border-secondary-100 shadow-sm p-6 space-y-5'>
          <div className='flex items-center gap-3 pb-4 border-b border-secondary-100'>
            <Briefcase className='w-5 h-5 text-primary-600' />
            <h2 className='font-display text-lg font-bold text-secondary-900'>
              Job Details
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
              <label className={labelClasses}>
                Job Title <span className='text-red-500'>*</span>
              </label>
              <input
                name='title'
                type='text'
                required
                className={inputClasses}
                placeholder='e.g. Senior Software Engineer'
              />
            </div>
            <div>
              <label className={labelClasses}>
                Company <span className='text-red-500'>*</span>
              </label>
              <input
                name='company'
                type='text'
                required
                className={inputClasses}
                placeholder='e.g. Bomach Group'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
              <label className={labelClasses}>
                Location <span className='text-red-500'>*</span>
              </label>
              <input
                name='location'
                type='text'
                required
                className={inputClasses}
                placeholder='e.g. Lagos, Nigeria'
              />
            </div>
            <div>
              <label className={labelClasses}>Salary Range</label>
              <input
                name='salary_range'
                type='text'
                className={inputClasses}
                placeholder='e.g. 400k-600k'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            <div>
              <label className={labelClasses}>Job Type</label>
              <select
                name='job_type'
                defaultValue='full_time'
                className={inputClasses}>
                <option value='full_time'>Full Time</option>
                <option value='part_time'>Part Time</option>
                <option value='contract'>Contract</option>
                <option value='internship'>Internship</option>
                <option value='temporary'>Temporary</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Experience Level</label>
              <select
                name='experience_level'
                defaultValue='entry'
                className={inputClasses}>
                <option value='entry'>Entry</option>
                <option value='mid'>Mid</option>
                <option value='senior'>Senior</option>
                <option value='lead'>Lead</option>
              </select>
            </div>
            <div className='flex items-center gap-3 mt-6'>
              <input
                id='is_remote'
                name='is_remote'
                type='checkbox'
                className='w-4 h-4 rounded text-primary-600'
              />
              <label htmlFor='is_remote' className='text-sm text-secondary-700'>
                Remote Friendly
              </label>
            </div>
          </div>

          <div>
            <label className={labelClasses}>
              Description <span className='text-red-500'>*</span>
            </label>
            <textarea
              name='description'
              required
              rows={5}
              className={inputClasses}
              placeholder='Describe the job role and responsibilities...'
            />
          </div>

          <div>
            <label className={labelClasses}>Requirements (one per line)</label>
            <textarea
              name='requirements'
              rows={4}
              className={inputClasses}
              placeholder='List the required skills and qualifications...'
            />
          </div>

          <div>
            <label className={labelClasses}>
              Responsibilities (one per line)
            </label>
            <textarea
              name='responsibilities'
              rows={4}
              className={inputClasses}
              placeholder='List the key responsibilities...'
            />
          </div>
        </div>

        {status === "error" && (
          <div className='rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3'>
            {error || "Job submission failed."}
          </div>
        )}
        {status === "success" && (
          <div className='rounded-xl bg-green-50 border border-green-100 text-green-700 px-4 py-3'>
            Job posted successfully. Redirecting...
          </div>
        )}

        <div className='flex justify-end gap-3'>
          <Link
            href='/management/jobs'
            className='px-6 py-3 rounded-xl border border-secondary-200 text-secondary-700 hover:bg-secondary-50 transition-all'>
            Cancel
          </Link>
          <button
            type='submit'
            disabled={status === "loading"}
            className='inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-all disabled:opacity-50'>
            {status === "loading" ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                Posting...
              </>
            ) : (
              <>
                <Save className='w-4 h-4' />
                Post Job
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
