"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { getJobById, updateJob } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Briefcase, Save, Loader2 } from "lucide-react";
import type { Job } from "@/lib/types";

export default function AdminJobEditPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const jobId = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string>("");
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!jobId || isNaN(jobId)) {
      setError("Invalid job ID");
      setFetching(false);
      return;
    }

    getJobById(jobId)
      .then(setJob)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load job");
      })
      .finally(() => setFetching(false));
  }, [jobId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken || !job) {
      setError("You must be logged in to update a job post.");
      return;
    }

    setLoading(true);
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
      await updateJob(jobId, payload, accessToken);
      router.push("/management/jobs");
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Failed to update job.");
    }
  }

  const inputClasses =
    "w-full px-4 py-3 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all text-secondary-900";
  const labelClasses =
    "block text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2";

  if (fetching) {
    return (
      <div className='max-w-4xl mx-auto space-y-6'>
        <div className='flex items-center gap-4'>
          <Link
            href='/management/jobs'
            className='p-2.5 rounded-xl border border-secondary-200 text-secondary-500 hover:text-secondary-900 hover:border-secondary-300 transition-all'>
            <ArrowLeft className='w-5 h-5' />
          </Link>
          <div>
            <h1 className='font-display text-2xl sm:text-3xl font-bold text-secondary-900'>
              Edit Job Posting
            </h1>
            <p className='text-secondary-500 mt-1'>Loading job details...</p>
          </div>
        </div>
        <div className='flex items-center justify-center h-56'>
          <Loader2 className='w-8 h-8 text-primary-600 animate-spin' />
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className='max-w-4xl mx-auto space-y-6'>
        <div className='flex items-center gap-4'>
          <Link
            href='/management/jobs'
            className='p-2.5 rounded-xl border border-secondary-200 text-secondary-500 hover:text-secondary-900 hover:border-secondary-300 transition-all'>
            <ArrowLeft className='w-5 h-5' />
          </Link>
          <div>
            <h1 className='font-display text-2xl sm:text-3xl font-bold text-secondary-900'>
              Edit Job Posting
            </h1>
            <p className='text-secondary-500 mt-1'>Error loading job</p>
          </div>
        </div>
        <div className='rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3'>
          {error}
        </div>
      </div>
    );
  }

  if (!job) return null;

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
            Edit Job Posting
          </h1>
          <p className='text-secondary-500 mt-1'>
            Update job opportunity details
          </p>
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
                defaultValue={job.title}
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
                defaultValue={job.company}
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
                defaultValue={job.location}
                className={inputClasses}
                placeholder='e.g. Lagos, Nigeria'
              />
            </div>
            <div>
              <label className={labelClasses}>Salary Range</label>
              <input
                name='salary_range'
                type='text'
                defaultValue={job.salary_range || ""}
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
                defaultValue={job.job_type}
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
                defaultValue={job.experience_level}
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
                defaultChecked={job.is_remote}
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
              defaultValue={job.description}
              className={inputClasses}
              placeholder='Describe the job role and responsibilities...'
            />
          </div>

          <div>
            <label className={labelClasses}>Requirements (one per line)</label>
            <textarea
              name='requirements'
              rows={4}
              defaultValue={
                Array.isArray(job.requirements)
                  ? (job.requirements as string[]).join("\n")
                  : ""
              }
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
              defaultValue={
                Array.isArray(job.responsibilities)
                  ? (job.responsibilities as string[]).join("\n")
                  : ""
              }
              className={inputClasses}
              placeholder='List the key responsibilities...'
            />
          </div>
        </div>

        {error && (
          <div className='rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3'>
            {error}
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
            disabled={loading}
            className='inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-all disabled:opacity-50'>
            {loading ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                Updating...
              </>
            ) : (
              <>
                <Save className='w-4 h-4' />
                Update Job
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
