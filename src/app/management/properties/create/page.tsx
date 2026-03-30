"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { uploadFile, uploadFilesAsync, submitProperty } from "@/lib/api";
import {
  PROPERTY_CATEGORIES,
  NIGERIAN_STATES,
  NIGERIAN_STATES_CITIES,
} from "@/lib/data";
import SearchableSelect from "@/components/ui/SearchableSelect";
import {
  Building2,
  Camera,
  MapPin,
  ArrowLeft,
  Save,
  Plus,
  X,
  Loader2,
  Tag,
  Star,
  Video,
  Landmark,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categoryNames = Object.keys(PROPERTY_CATEGORIES);
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function AdminPropertyCreatePage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    sub_category: "",
    address: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
    is_featured: false,
  });

  const subCategories = PROPERTY_CATEGORIES[formData.category] || [];

  // Images
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Videos (YouTube URLs)
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [videoInput, setVideoInput] = useState("");

  // Landmarks
  const [landmarks, setLandmarks] = useState<string[]>([]);
  const [landmarkInput, setLandmarkInput] = useState("");

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter((f) => {
        if (f.size > MAX_FILE_SIZE) {
          setError(`Image "${f.name}" exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setImages((prev) => [...prev, ...validFiles]);
        setPreviews((prev) => [
          ...prev,
          ...validFiles.map((f) => URL.createObjectURL(f)),
        ]);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const getYoutubeThumbnail = (url: string) => {
    const id = extractYoutubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
  };

  const addVideoUrl = () => {
    const trimmed = videoInput.trim();
    if (trimmed && !videoUrls.includes(trimmed)) {
      setVideoUrls((prev) => [...prev, trimmed]);
      setVideoInput("");
    }
  };

  const removeVideo = (index: number) => {
    setVideoUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const addLandmark = () => {
    const trimmed = landmarkInput.trim();
    if (trimmed && !landmarks.includes(trimmed)) {
      setLandmarks((prev) => [...prev, trimmed]);
      setLandmarkInput("");
    }
  };

  const removeLandmark = (index: number) => {
    setLandmarks((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setLoading(true);
    setError(null);

    try {
      // Upload images
      let imageUrls: string[] = [];
      if (images.length > 0) {
        setLoadingStatus(`Uploading ${images.length} image${images.length > 1 ? "s" : ""}...`);
        const results = await uploadFilesAsync(images, accessToken);
        imageUrls = results.map((r) => r.url);
      }

      // Upload videos
      // (YouTube URLs are already in videoUrls)

      setLoadingStatus("Creating property...");
      await submitProperty(
        {
          name: formData.name,
          description: formData.description || null,
          category: formData.category,
          sub_category: formData.sub_category,
          property_images: imageUrls,
          property_videos: videoUrls,
          landmarks,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          is_featured: formData.is_featured,
        },
        accessToken,
      );

      router.push("/management/properties");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create property";
      setError(message);
    } finally {
      setLoading(false);
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
          href='/management/properties'
          className='p-2.5 rounded-xl border border-secondary-200 text-secondary-500 hover:text-secondary-900 hover:border-secondary-300 transition-all'>
          <ArrowLeft className='w-5 h-5' />
        </Link>
        <div>
          <h1 className='font-display text-2xl sm:text-3xl font-bold text-secondary-900'>
            Create Property
          </h1>
          <p className='text-secondary-500 mt-1'>Add a new property listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Basic Info */}
        <div className='bg-white rounded-2xl border border-secondary-100 shadow-sm p-6 space-y-5'>
          <div className='flex items-center gap-3 pb-4 border-b border-secondary-100'>
            <Building2 className='w-5 h-5 text-primary-600' />
            <h2 className='font-display text-lg font-bold text-secondary-900'>
              Basic Information
            </h2>
          </div>

          <div>
            <label className={labelClasses}>
              Property Name <span className='text-red-500'>*</span>
            </label>
            <input
              required
              type='text'
              className={inputClasses}
              placeholder='e.g. Fortress City Estate'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
              <label className={labelClasses}>
                Category <span className='text-red-500'>*</span>
              </label>
              <select
                required
                className={inputClasses}
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                    sub_category: "",
                  })
                }>
                <option value=''>Select category</option>
                {categoryNames.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>
                Sub Category <span className='text-red-500'>*</span>
              </label>
              <select
                required
                className={inputClasses}
                value={formData.sub_category}
                onChange={(e) =>
                  setFormData({ ...formData, sub_category: e.target.value })
                }
                disabled={!formData.category}>
                <option value=''>
                  {formData.category
                    ? "Select sub-category"
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

          <div>
            <label className={labelClasses}>
              Description <span className='text-secondary-300'>(optional)</span>
            </label>
            <textarea
              rows={5}
              className={inputClasses}
              placeholder='Describe the property features, amenities, and details...'
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <label className='flex items-center gap-3 cursor-pointer'>
            <input
              type='checkbox'
              checked={formData.is_featured}
              onChange={(e) =>
                setFormData({ ...formData, is_featured: e.target.checked })
              }
              className='w-5 h-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500'
            />
            <Star className='w-4 h-4 text-amber-500' />
            <span className='text-sm font-medium text-secondary-700'>
              Mark as Featured Property
            </span>
          </label>
        </div>

        {/* Location */}
        <div className='bg-white rounded-2xl border border-secondary-100 shadow-sm p-6 space-y-5'>
          <div className='flex items-center gap-3 pb-4 border-b border-secondary-100'>
            <MapPin className='w-5 h-5 text-primary-600' />
            <h2 className='font-display text-lg font-bold text-secondary-900'>
              Location
            </h2>
          </div>

          <div>
            <label className={labelClasses}>
              Street Address <span className='text-red-500'>*</span>
            </label>
            <input
              required
              type='text'
              className={inputClasses}
              placeholder='Full street address'
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
              <label className={labelClasses}>
                State <span className='text-red-500'>*</span>
              </label>
              <SearchableSelect
                options={NIGERIAN_STATES}
                value={formData.state}
                onChange={(val) =>
                  setFormData({ ...formData, state: val, city: "" })
                }
                placeholder='Select state'
                required
              />
            </div>
            <div>
              <label className={labelClasses}>
                City <span className='text-red-500'>*</span>
              </label>
              <SearchableSelect
                options={NIGERIAN_STATES_CITIES[formData.state] || []}
                value={formData.city}
                onChange={(val) => setFormData({ ...formData, city: val })}
                placeholder={
                  formData.state ? "Select city" : "Select a state first"
                }
                disabled={!formData.state}
                required
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
              <label className={labelClasses}>
                Latitude <span className='text-secondary-300'>(optional)</span>
              </label>
              <input
                type='text'
                className={inputClasses}
                placeholder='e.g. 6.4541'
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelClasses}>
                Longitude <span className='text-secondary-300'>(optional)</span>
              </label>
              <input
                type='text'
                className={inputClasses}
                placeholder='e.g. 3.3947'
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Images — before Videos */}
        <div className='bg-white rounded-2xl border border-secondary-100 shadow-sm p-6 space-y-5'>
          <div className='flex items-center gap-3 pb-4 border-b border-secondary-100'>
            <Camera className='w-5 h-5 text-primary-600' />
            <h2 className='font-display text-lg font-bold text-secondary-900'>
              Images
            </h2>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4'>
            {previews.map((url, idx) => (
              <div
                key={idx}
                className='relative aspect-square rounded-xl overflow-hidden group border border-secondary-100'>
                <Image
                  src={url}
                  alt={`Image ${idx + 1}`}
                  fill
                  className='object-cover'
                />
                <button
                  type='button'
                  onClick={() => removeImage(idx)}
                  className='absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
                  <X size={12} />
                </button>
                {idx === 0 && (
                  <span className='absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded-full font-bold'>
                    COVER
                  </span>
                )}
              </div>
            ))}
            <input
              type='file'
              multiple
              accept='image/*'
              onChange={handleImagesChange}
              className='hidden'
              id='admin-images'
            />
            <label
              htmlFor='admin-images'
              className='aspect-square rounded-xl border-2 border-dashed border-secondary-200 hover:border-primary-400 hover:bg-primary-50 transition-all cursor-pointer flex flex-col items-center justify-center text-secondary-400 gap-1'>
              <Plus className='w-6 h-6' />
              <span className='text-[10px] font-semibold'>Add</span>
            </label>
          </div>
          <p className='text-xs text-secondary-400'>
            First image will be used as the cover photo.
          </p>
        </div>

        {/* Video Tour — YouTube URL */}
        <div className='bg-white rounded-2xl border border-secondary-100 shadow-sm p-6 space-y-5'>
          <div className='flex items-center gap-3 pb-4 border-b border-secondary-100'>
            <Video className='w-5 h-5 text-primary-600' />
            <h2 className='font-display text-lg font-bold text-secondary-900'>
              Video Tour (YouTube)
            </h2>
          </div>

          {videoUrls.length > 0 && (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {videoUrls.map((url, idx) => (
                <div
                  key={idx}
                  className='relative aspect-video rounded-xl overflow-hidden border border-secondary-100 bg-secondary-900'>
                  {getYoutubeThumbnail(url) ? (
                    <img
                      src={getYoutubeThumbnail(url)!}
                      className='w-full h-full object-cover opacity-60'
                      alt='YouTube Preview'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <Video className='w-8 h-8 text-white/30' />
                    </div>
                  )}
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <PlayCircle className='w-12 h-12 text-white/80' />
                  </div>
                  <button
                    type='button'
                    onClick={() => removeVideo(idx)}
                    className='absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg'>
                    <X size={14} />
                  </button>
                  <div className='absolute bottom-0 inset-x-0 p-2 bg-black/60'>
                    <p className='text-[10px] text-white truncate font-mono'>
                      {url}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className='flex gap-2'>
            <input
              type='url'
              className={inputClasses}
              placeholder='Paste YouTube URL (e.g. https://www.youtube.com/watch?v=...)'
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addVideoUrl();
                }
              }}
            />
            <button
              type='button'
              onClick={addVideoUrl}
              className='px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shrink-0 flex items-center gap-2'>
              <Plus className='w-5 h-5' />
              <span className='hidden sm:inline font-semibold'>Add</span>
            </button>
          </div>
          <p className='text-xs text-secondary-400'>
            Add one or more YouTube video URLs for the property virtual tour.
          </p>
        </div>

        {/* Landmarks */}
        <div className='bg-white rounded-2xl border border-secondary-100 shadow-sm p-6 space-y-5'>
          <div className='flex items-center gap-3 pb-4 border-b border-secondary-100'>
            <Landmark className='w-5 h-5 text-primary-600' />
            <h2 className='font-display text-lg font-bold text-secondary-900'>
              Landmarks
            </h2>
          </div>

          {landmarks.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {landmarks.map((lm, idx) => (
                <span
                  key={idx}
                  className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100'>
                  {lm}
                  <button
                    type='button'
                    onClick={() => removeLandmark(idx)}
                    className='p-0.5 hover:bg-primary-200 rounded-full transition-colors'>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className='flex gap-2'>
            <input
              type='text'
              className={inputClasses}
              placeholder='e.g. Lagos-Ibadan Expressway, Shoprite Mall...'
              value={landmarkInput}
              onChange={(e) => setLandmarkInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLandmark();
                }
              }}
            />
            <button
              type='button'
              onClick={addLandmark}
              className='px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shrink-0'>
              <Plus className='w-5 h-5' />
            </button>
          </div>
          <p className='text-xs text-secondary-400'>
            Add nearby landmarks, schools, hospitals, roads, etc. Press Enter or
            click + to add.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className='p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm'>
            {error}
          </div>
        )}

        {/* Submit */}
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2'>
          <button
            type='submit'
            disabled={loading}
            className='flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/25 text-sm sm:text-base'>
            {loading ? (
              <Loader2 className='w-5 h-5 animate-spin' />
            ) : (
              <Save className='w-5 h-5' />
            )}
            {loading ? loadingStatus || "Creating..." : "Create Property"}
          </button>
          <Link
            href='/management/properties'
            className='px-6 sm:px-8 py-3.5 sm:py-4 border border-secondary-200 text-secondary-600 font-semibold rounded-xl hover:bg-secondary-50 transition-all text-center text-sm sm:text-base'>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
