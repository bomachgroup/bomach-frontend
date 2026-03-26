"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProject, uploadFile } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

export default function AdminProjectCreatePage() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sub_service_name: "",
    content: "",
    priority: 0,
    date: new Date().toISOString().split("T")[0],
    is_published: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));

    // Auto-generate slug from name
    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const processImageFile = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) processImageFile(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      alert("You must be logged in to create a project");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = "";

      if (selectedImage) {
        const uploadResult = await uploadFile(selectedImage, accessToken);
        imageUrl = uploadResult.url;
      }

      await createProject({ ...formData, image_url: imageUrl }, accessToken);
      router.push("/management/projects");
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/management/projects"
          className="p-2 rounded-xl text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-secondary-900">
            Add New Project
          </h1>
          <p className="text-secondary-500 text-sm">
            Create a new project entry
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-white rounded-2xl border border-secondary-100 shadow-sm p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold text-secondary-900 pb-3 border-b border-secondary-100">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-secondary-700 mb-1.5">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g. Bomach City Estate"
                className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-secondary-700 mb-1.5">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                placeholder="auto-generated-from-name"
                className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="sub_service_name"
              className="block text-sm font-medium text-secondary-700 mb-1.5">
              Sub Service / Category
            </label>
            <input
              type="text"
              id="sub_service_name"
              name="sub_service_name"
              value={formData.sub_service_name}
              onChange={handleInputChange}
              placeholder="e.g. Real Estate, Civil Engineering"
              className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Image Upload Card */}
        <div className="bg-white rounded-2xl border border-secondary-100 shadow-sm p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold text-secondary-900 pb-3 border-b border-secondary-100">
            Project Image
          </h2>

          {imagePreview ? (
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-56 object-cover rounded-xl border border-secondary-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                dragActive
                  ? "border-primary-500 bg-primary-50"
                  : "border-secondary-200 hover:border-primary-300 hover:bg-secondary-50"
              }`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="mx-auto w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-secondary-400" />
                </div>
                <p className="text-sm font-medium text-secondary-700">
                  Drag & drop an image here, or{" "}
                  <span className="text-primary-600">browse</span>
                </p>
                <p className="text-xs text-secondary-400 mt-1">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </label>
            </div>
          )}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl border border-secondary-100 shadow-sm p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold text-secondary-900 pb-3 border-b border-secondary-100">
            Content
          </h2>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-secondary-700 mb-1.5">
              Project Description
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={8}
              placeholder="Describe the project in detail..."
              className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-y"
            />
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-2xl border border-secondary-100 shadow-sm p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold text-secondary-900 pb-3 border-b border-secondary-100">
            Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-secondary-700 mb-1.5">
                Priority
              </label>
              <input
                type="number"
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-secondary-700 mb-1.5">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center pt-7">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="is_published"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleCheckboxChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
                <span className="ml-3 text-sm font-medium text-secondary-700">
                  Published
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/management/projects"
            className="px-5 py-2.5 text-sm font-medium text-secondary-700 bg-secondary-100 hover:bg-secondary-200 rounded-xl transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-primary-600/20">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
