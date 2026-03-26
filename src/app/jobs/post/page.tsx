"use client";

import { useState } from "react";
import Link from "next/link";
import { createJob } from "@/lib/api";
import PageTitle from "@/components/PageTitle";
import { useAuth } from "@/contexts/AuthContext";

export default function JobPostPage() {
  const { accessToken, isAuthenticated } = useAuth();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isAuthenticated || !accessToken) {
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
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to submit job.");
    }
  }

  return (
    <>
      <PageTitle
        title='Post a Job'
        breadcrumbs={[
          { label: "Jobs", href: "/jobs" },
          { label: "Post a Job" },
        ]}
      />

      <section className='py-16'>
        <div className='max-w-4xl mx-auto px-6 lg:px-8'>
          <div className='bg-white rounded-3xl shadow-xl p-8'>
            <div className='mb-8 flex items-center justify-between'>
              <h2 className='text-3xl font-bold text-secondary-900'>
                Create a Job Posting
              </h2>
              <Link
                href='/jobs'
                className='text-primary-600 hover:text-primary-700 font-semibold text-sm'>
                Back to jobs
              </Link>
            </div>

            {!isAuthenticated ? (
              <div className='bg-amber-100 border border-amber-300 text-amber-700 rounded-xl p-4 mb-6'>
                Please log in to post a job.{" "}
                <Link href='/management/login' className='underline'>
                  Go to login
                </Link>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-secondary-700 mb-1'>
                    Job Title
                  </label>
                  <input
                    name='title'
                    type='text'
                    required
                    className='w-full rounded-xl border border-secondary-200 px-4 py-2 text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-secondary-700 mb-1'>
                    Company
                  </label>
                  <input
                    name='company'
                    type='text'
                    required
                    className='w-full rounded-xl border border-secondary-200 px-4 py-2 text-sm'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-secondary-700 mb-1'>
                    Location
                  </label>
                  <input
                    name='location'
                    type='text'
                    required
                    className='w-full rounded-xl border border-secondary-200 px-4 py-2 text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-secondary-700 mb-1'>
                    Salary Range
                  </label>
                  <input
                    name='salary_range'
                    type='text'
                    className='w-full rounded-xl border border-secondary-200 px-4 py-2 text-sm'
                    placeholder='e.g. 400k-600k'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-secondary-700 mb-1'>
                    Type
                  </label>
                  <select
                    name='job_type'
                    defaultValue='full_time'
                    className='w-full rounded-xl border border-secondary-200 px-4 py-2 text-sm'>
                    <option value='full_time'>Full Time</option>
                    <option value='part_time'>Part Time</option>
                    <option value='contract'>Contract</option>
                    <option value='internship'>Internship</option>
                    <option value='temporary'>Temporary</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-semibold text-secondary-700 mb-1'>
                    Experience Level
                  </label>
                  <select
                    name='experience_level'
                    defaultValue='entry'
                    className='w-full rounded-xl border border-secondary-200 px-4 py-2 text-sm'>
                    <option value='entry'>Entry</option>
                    <option value='mid'>Mid</option>
                    <option value='senior'>Senior</option>
                    <option value='lead'>Lead</option>
                  </select>
                </div>
                <div className='flex items-center gap-2 mt-6'>
                  <input
                    id='is_remote'
                    name='is_remote'
                    type='checkbox'
                    className='w-4 h-4 rounded text-primary-600'
                  />
                  <label
                    htmlFor='is_remote'
                    className='text-sm text-secondary-700'>
                    Remote Friendly
                  </label>
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-secondary-700 mb-1'>
                  Description
                </label>
                <textarea
                  name='description'
                  required
                  rows={5}
                  className='w-full rounded-xl border border-secondary-200 p-4 text-sm'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-secondary-700 mb-1'>
                  Requirements (one per line)
                </label>
                <textarea
                  name='requirements'
                  rows={4}
                  className='w-full rounded-xl border border-secondary-200 p-4 text-sm'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-secondary-700 mb-1'>
                  Responsibilities (one per line)
                </label>
                <textarea
                  name='responsibilities'
                  rows={4}
                  className='w-full rounded-xl border border-secondary-200 p-4 text-sm'
                />
              </div>

              {status === "error" && (
                <div className='text-red-600 font-medium'>
                  {error || "Job submission failed."}
                </div>
              )}
              {status === "success" && (
                <div className='text-green-700 font-medium'>
                  Job posted successfully.
                </div>
              )}

              <button
                type='submit'
                disabled={status === "loading" || !isAuthenticated}
                className='w-full py-3 rounded-xl text-white font-semibold bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-50'>
                {status === "loading" ? "Posting..." : "Post Job"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
