"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getProjects, deleteProject } from "@/lib/api";
import { Loader2, Plus, ExternalLink, Trash2 } from "lucide-react";
import type { Project } from "@/lib/types";

export default function AdminProjectsPage() {
  const { accessToken } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadProjects = useCallback(() => {
    setLoading(true);
    getProjects()
      .then(setProjects)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Unable to load projects",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleDelete = async (projectId: number) => {
    if (!accessToken) {
      alert("You must be logged in to delete a project");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeletingId(projectId);
    try {
      await deleteProject(projectId, accessToken);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <div>
          <h1 className='font-display text-3xl font-bold text-secondary-900'>
            Project Management
          </h1>
          <p className='text-secondary-500 mt-1'>
            View and manage project entries.
          </p>
        </div>
        <div className='flex gap-2'>
          <Link
            href='/management/projects/create'
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-primary-600 text-white hover:bg-primary-700'>
            <Plus className='w-4 h-4' /> New Project
          </Link>
          <Link
            href='/projects'
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-secondary-100 text-secondary-700 hover:bg-secondary-200'>
            <ExternalLink className='w-4 h-4' /> View Public Projects
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
      ) : projects.length === 0 ? (
        <div className='rounded-xl border border-dashed border-secondary-300 p-8 text-center'>
          <p className='text-secondary-500'>
            No projects found. Add a project to begin.
          </p>
        </div>
      ) : (
        <div className='grid gap-4'>
          {projects.map((project) => (
            <div
              key={project.id}
              className='bg-white border border-secondary-100 rounded-2xl p-4 shadow-sm'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                <div>
                  <h2 className='text-lg font-semibold text-secondary-900'>
                    {project.name}
                  </h2>
                  <p className='text-secondary-600 text-sm'>
                    {project.sub_service_name || "General"}
                  </p>
                </div>
                <div className='flex gap-2'>
                  <Link
                    href={`/projects/${project.slug}`}
                    className='text-primary-600 text-sm hover:underline'>
                    View
                  </Link>
                  <Link
                    href={`/management/projects/${project.id}/edit`}
                    className='text-secondary-700 text-sm hover:text-primary-600'>
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className='text-red-600 text-sm hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed'>
                    {deletingId === project.id ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      <Trash2 className='w-4 h-4' />
                    )}
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
