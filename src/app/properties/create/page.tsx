"use client";

import { useState } from "react";
import { uploadFile, submitProperty } from "@/lib/api";
import { PROPERTY_CATEGORIES } from "@/lib/data";
import { motion } from "framer-motion";
import {
  Building2,
  Camera,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  X,
  Image as ImageIcon,
  Briefcase,
  FileText,
  Tag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categoryNames = Object.keys(PROPERTY_CATEGORIES);

export default function PropertyCreatePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    sub_category: "",
    address: "",
    city: "",
    state: "",
  });

  const subCategories = PROPERTY_CATEGORIES[formData.category] || [];

  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleGalleryImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setGalleryImages((prev) => [...prev, ...files]);
      const newPreviews = files.map((f) => URL.createObjectURL(f));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get auth token from localStorage (set during login)
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error(
          "You must be logged in to submit a property. Please log in first.",
        );
      }

      // Upload images first via the upload endpoint
      let imageUrls: string[] = [];
      if (galleryImages.length > 0) {
        const uploadResults = await Promise.all(
          galleryImages.map((img) => uploadFile(img, accessToken)),
        );
        imageUrls = uploadResults.map((r) => r.url);
      }

      // Submit property as JSON
      await submitProperty(
        {
          name: formData.name,
          description: formData.description || null,
          category: formData.category,
          sub_category: formData.sub_category,
          property_images: imageUrls,
          address: formData.address,
          city: formData.city,
          state: formData.state,
        },
        accessToken,
      );

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting the property.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className='min-h-screen pt-40 pb-20 bg-[#f8f9fa] flex items-center justify-center px-4'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='max-w-xl w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-blue-50'>
          <div className='w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8'>
            <CheckCircle2 size={48} />
          </div>
          <h1 className='text-3xl font-black text-[#1d284b] uppercase tracking-tight mb-4'>
            Submission Successful!
          </h1>
          <p className='text-gray-500 mb-10 text-lg'>
            Your property has been submitted for review. Our management team
            will verify the details and activate the listing shortly.
          </p>
          <div className='flex flex-col sm:flex-row gap-4'>
            <Link
              href='/properties'
              className='flex-1 px-8 py-4 bg-[#1d284b] text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all text-center'>
              View Listings
            </Link>
            <button
              onClick={() => setSuccess(false)}
              className='flex-1 px-8 py-4 border-2 border-gray-100 text-[#1d284b] rounded-full font-black uppercase tracking-widest text-sm hover:border-blue-600 hover:text-blue-600 transition-all'>
              Submit Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#fcfcfc] pt-40 pb-32'>
      <div className='container mx-auto px-4'>
        <div className='max-w-5xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-16'>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}>
              <span className='text-red-600 font-black uppercase tracking-[0.2em] text-sm mb-4 block'>
                List Your Asset
              </span>
              <h1 className='text-4xl md:text-6xl font-black text-[#1d284b] mb-6 uppercase tracking-tight'>
                Lease Or <span className='text-blue-700'>Sell</span> Property
              </h1>
              <p className='text-gray-400 max-w-2xl mx-auto text-lg'>
                Reach thousands of potential investors and buyers through the
                Bomach Group ecosystem.
              </p>
            </motion.div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-12'>
            {/* Step 1: Property Basic Info */}
            <motion.div
              className='bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-blue-900/5 border border-blue-50'
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>
              <div className='flex items-center gap-4 mb-10 pb-6 border-b border-gray-50'>
                <div className='w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600'>
                  <Building2 size={24} />
                </div>
                <h2 className='text-2xl font-black text-[#1d284b] uppercase tracking-tight'>
                  Property Info
                </h2>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
                <div className='space-y-2 md:col-span-2'>
                  <label className='text-[10px] font-black uppercase tracking-widest text-blue-700 px-2'>
                    Property Name
                  </label>
                  <div className='relative'>
                    <Briefcase
                      className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300'
                      size={18}
                    />
                    <input
                      required
                      type='text'
                      className='w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-[1.25rem] transition-all font-bold text-[#1d284b]'
                      placeholder='e.g. 5 Bedroom Duplex at Lekki'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black uppercase tracking-widest text-blue-700 px-2'>
                    Category
                  </label>
                  <div className='relative'>
                    <Tag
                      className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300'
                      size={18}
                    />
                    <select
                      required
                      className='w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-[1.25rem] transition-all font-bold text-[#1d284b] appearance-none'
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value,
                          sub_category: "",
                        })
                      }>
                      <option value=''>Select Category</option>
                      {categoryNames.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black uppercase tracking-widest text-blue-700 px-2'>
                    Sub Category
                  </label>
                  <div className='relative'>
                    <Tag
                      className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300'
                      size={18}
                    />
                    <select
                      required
                      className='w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-[1.25rem] transition-all font-bold text-[#1d284b] appearance-none disabled:opacity-50'
                      value={formData.sub_category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sub_category: e.target.value,
                        })
                      }
                      disabled={!formData.category}>
                      <option value=''>
                        {formData.category
                          ? "Select Sub-Category"
                          : "Select a category first"}
                      </option>
                      {subCategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 2: Location */}
            <motion.div
              className='bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-blue-900/5 border border-blue-50'
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>
              <div className='flex items-center gap-4 mb-10 pb-6 border-b border-gray-50'>
                <div className='w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700'>
                  <MapPin size={24} />
                </div>
                <h2 className='text-2xl font-black text-[#1d284b] uppercase tracking-tight'>
                  Location
                </h2>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                <div className='space-y-2 md:col-span-3'>
                  <label className='text-[10px] font-black uppercase tracking-widest text-blue-700 px-2'>
                    Street Address
                  </label>
                  <div className='relative'>
                    <MapPin
                      className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300'
                      size={18}
                    />
                    <input
                      required
                      type='text'
                      className='w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-[1.25rem] transition-all font-bold text-[#1d284b]'
                      placeholder='Full street address'
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black uppercase tracking-widest text-blue-700 px-2'>
                    City
                  </label>
                  <input
                    required
                    type='text'
                    className='w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-[1.25rem] transition-all font-bold text-[#1d284b]'
                    placeholder='e.g. Lagos'
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black uppercase tracking-widest text-blue-700 px-2'>
                    State
                  </label>
                  <input
                    required
                    type='text'
                    className='w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-[1.25rem] transition-all font-bold text-[#1d284b]'
                    placeholder='e.g. Lagos State'
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>
              </div>
            </motion.div>

            {/* Step 3: Media Upload */}
            <motion.div
              className='bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-blue-900/5 border border-blue-50'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>
              <div className='flex items-center gap-4 mb-10 pb-6 border-b border-gray-50'>
                <div className='w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600'>
                  <Camera size={24} />
                </div>
                <h2 className='text-2xl font-black text-[#1d284b] uppercase tracking-tight'>
                  Property Images
                </h2>
              </div>

              <div className='space-y-4'>
                <div className='grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4'>
                  {previews.map((url, idx) => (
                    <div
                      key={idx}
                      className='relative aspect-square rounded-xl overflow-hidden group'>
                      <Image
                        src={url}
                        alt={`Image ${idx + 1}`}
                        fill
                        className='object-cover'
                      />
                      <button
                        type='button'
                        onClick={() => removeGalleryImage(idx)}
                        className='absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
                        <X size={12} />
                      </button>
                      {idx === 0 && (
                        <span className='absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full font-bold'>
                          COVER
                        </span>
                      )}
                    </div>
                  ))}
                  <input
                    type='file'
                    multiple
                    accept='image/*'
                    onChange={handleGalleryImagesChange}
                    className='hidden'
                    id='gallery-input'
                  />
                  <label
                    htmlFor='gallery-input'
                    className='aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center text-gray-300 gap-2'>
                    <Plus size={24} />
                    <span className='text-[9px] font-bold uppercase tracking-widest'>
                      Add Photos
                    </span>
                  </label>
                </div>
                <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>
                  First image will be the cover. Upload up to 10 photos.
                </p>
              </div>
            </motion.div>

            {/* Step 4: Description */}
            <motion.div
              className='bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-blue-900/5 border border-blue-50'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}>
              <div className='flex items-center gap-4 mb-10 pb-6 border-b border-gray-50'>
                <div className='w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700'>
                  <FileText size={24} />
                </div>
                <h2 className='text-2xl font-black text-[#1d284b] uppercase tracking-tight'>
                  Detailed Description
                </h2>
              </div>

              <div className='space-y-2'>
                <label className='text-[10px] font-black uppercase tracking-widest text-blue-700 px-2'>
                  Property Features & Details
                </label>
                <textarea
                  rows={8}
                  className='w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-[2rem] transition-all font-medium text-[#1d284b]'
                  placeholder="Describe the property, amenities, utilities, and why it's a great choice..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </motion.div>

            {/* Submit Section */}
            <div className='pt-8'>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='mb-8 p-6 bg-red-50 text-red-700 rounded-2xl flex items-center gap-4 border border-red-100 font-bold uppercase text-[10px] tracking-widest'>
                  <AlertCircle size={20} />
                  {error}
                </motion.div>
              )}

              <button
                disabled={loading}
                className={`w-full py-8 rounded-full font-black uppercase tracking-[0.2em] transition-all text-sm flex items-center justify-center gap-4 shadow-2xl ${
                  loading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#1d284b] text-white hover:bg-red-600 shadow-blue-900/20 active:scale-[0.98]"
                }`}>
                {loading ? (
                  <>
                    <Loader2 className='animate-spin' size={24} /> Processing
                    Listing...
                  </>
                ) : (
                  <>
                    Submit Property For Review <Send size={20} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
