"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { getProjectById, updateProject, uploadFile } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Project } from "@/lib/types";

export default function AdminProjectEditPage() {
  const router = useRouter();
  const params = useParams();
  const { accessToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image_url: "",
    sub_service_name: "",
    content: "",
    priority: 0,
    date: "",
    is_published: true,
  });

  const projectId = parseInt(params.id as string);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await getProjectById(projectId);
        setFormData({
          name: project.name,
          slug: project.slug,
          image_url: project.image_url || "",
          sub_service_name: project.sub_service_name || "",
          content: (project as any).content || "",
          priority: project.priority,
          date: new Date(project.date).toISOString().split("T")[0],
          is_published: (project as any).is_published ?? true,
        });
        if (project.image_url) {
          setImagePreview(project.image_url);
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
        alert("Failed to load project data");
        router.push("/management/projects");
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      alert("You must be logged in to update a project");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = formData.image_url;

      // Upload image if selected
      if (selectedImage) {
        const uploadResult = await uploadFile(selectedImage, accessToken);
        imageUrl = uploadResult.url;
      }

      const projectData = {
        ...formData,
        image_url: imageUrl,
      };

      await updateProject(projectId, projectData, accessToken);
      router.push("/management/projects");
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Failed to update project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='max-w-3xl mx-auto space-y-6'>
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto'></div>
          <p className='mt-2 text-secondary-600'>Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto space-y-6'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='font-display text-3xl font-bold text-secondary-900'>
            Edit Project
          </h1>
          <p className='text-secondary-500'>Update project information</p>
        </div>
        <Link
          href='/management/projects'
          className='text-primary-600 hover:underline'>
          Back to projects
        </Link>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-secondary-700 mb-2'>
              Project Name *
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
              className='w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
            />
          </div>

          <div>
            <label
              htmlFor='slug'
              className='block text-sm font-medium text-secondary-700 mb-2'>
              Slug *
            </label>
            <input
              type='text'
              id='slug'
              name='slug'
              value={formData.slug}
              onChange={handleInputChange}
              required
              className='w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-secondary-700 mb-2'>
            Project Image
          </label>
          <div className='space-y-4'>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
            />
            {imagePreview && (
              <div className='relative'>
                <img
                  src={imagePreview}
                  alt='Preview'
                  className='w-full max-w-md h-48 object-cover rounded-md border'
                />
              </div>
            )}
            <div>
              <label
                htmlFor='image_url'
                className='block text-sm font-medium text-secondary-700 mb-2'>
                Or enter Image URL
              </label>
              <input
                type='url'
                id='image_url'
                name='image_url'
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder='https://example.com/image.jpg'
                className='w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor='sub_service_name'
            className='block text-sm font-medium text-secondary-700 mb-2'>
            Sub Service Name
          </label>
          <input
            type='text'
            id='sub_service_name'
            name='sub_service_name'
            value={formData.sub_service_name}
            onChange={handleInputChange}
            className='w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
          />
        </div>

        <div>
          <label
            htmlFor='content'
            className='block text-sm font-medium text-secondary-700 mb-2'>
            Content
          </label>
          <textarea
            id='content'
            name='content'
            value={formData.content}
            onChange={handleInputChange}
            rows={6}
            className='w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div>
            <label
              htmlFor='priority'
              className='block text-sm font-medium text-secondary-700 mb-2'>
              Priority
            </label>
            <input
              type='number'
              id='priority'
              name='priority'
              value={formData.priority}
              onChange={handleInputChange}
              min='0'
              className='w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
            />
          </div>

          <div>
            <label
              htmlFor='date'
              className='block text-sm font-medium text-secondary-700 mb-2'>
              Date *
            </label>
            <input
              type='date'
              id='date'
              name='date'
              value={formData.date}
              onChange={handleInputChange}
              required
              className='w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
            />
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='is_published'
              name='is_published'
              checked={formData.is_published}
              onChange={handleCheckboxChange}
              className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded'
            />
            <label
              htmlFor='is_published'
              className='ml-2 block text-sm text-secondary-700'>
              Published
            </label>
          </div>
        </div>

        <div className='flex justify-end space-x-4'>
          <Link
            href='/management/projects'
            className='px-4 py-2 text-secondary-700 bg-secondary-100 hover:bg-secondary-200 rounded-md transition-colors'>
            Cancel
          </Link>
          <button
            type='submit'
            disabled={isSubmitting}
            className='px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
            {isSubmitting ? "Updating..." : "Update Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
