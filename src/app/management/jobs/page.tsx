"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getJobs, deleteJob } from "@/lib/api";
import {
  Loader2,
  Trash2,
  Pencil,
  Plus,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import type { Job } from "@/lib/types";

export default function AdminJobsPage() {
  const { accessToken, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadJobs = useCallback(() => {
    setLoading(true);
    getJobs()
      .then(setJobs)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to load jobs");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  async function handleDelete(id: number) {
    if (!accessToken) return;

    if (!confirm("Delete this job posting?")) return;
    setDeleting(id);

    try {
      await deleteJob(id, accessToken);
      loadJobs();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete job.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <div>
          <h1 className='font-display text-3xl font-bold text-secondary-900'>
            Job Management
          </h1>
          <p className='text-secondary-500 mt-1'>
            Create, view, update, and delete job postings.
          </p>
        </div>
        <div className='flex gap-2'>
          <Link
            href='/management/jobs/create'
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-primary-600 text-white hover:bg-primary-700'>
            <Plus className='w-4 h-4' /> Post Job
          </Link>
          <Link
            href='/jobs'
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-secondary-100 text-secondary-700 hover:bg-secondary-200'>
            <ExternalLink className='w-4 h-4' /> View Public Jobs
          </Link>
        </div>
      </div>

      {error && (
        <div className='rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3'>
          {error}
        </div>
      )}

      {loading ? (
        <div className='flex items-center justify-center h-56'>
          <Loader2 className='w-8 h-8 text-primary-600 animate-spin' />
        </div>
      ) : jobs.length === 0 ? (
        <div className='rounded-xl border border-dashed border-secondary-300 p-8 text-center'>
          <Briefcase className='mx-auto w-10 h-10 text-secondary-300 mb-3' />
          <p className='text-secondary-500'>
            No jobs found. Click Post Job to add one.
          </p>
        </div>
      ) : (
        <div className='grid gap-4'>
          {jobs.map((job) => (
            <div
              key={job.id}
              className='bg-white border border-secondary-100 rounded-2xl p-4 shadow-sm'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                <div>
                  <h2 className='text-lg font-semibold text-secondary-900'>
                    {job.title}
                  </h2>
                  <p className='text-secondary-600 text-sm'>
                    {job.company || "Unknown company"} • {job.location}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <Link
                    href={`/jobs/${job.id}`}
                    className='inline-flex items-center gap-1 text-primary-600 text-sm font-medium hover:underline'>
                    <ExternalLink className='w-4 h-4' /> View
                  </Link>
                  <Link
                    href={`/management/jobs/${job.id}/edit`}
                    className='inline-flex items-center gap-1 text-secondary-700 text-sm font-medium hover:text-primary-600'>
                    <Pencil className='w-4 h-4' /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id)}
                    disabled={deleting === job.id || !accessToken}
                    className='inline-flex items-center gap-1 text-red-600 text-sm font-medium hover:text-red-800 disabled:opacity-50'>
                    {deleting === job.id ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      <Trash2 className='w-4 h-4' />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
