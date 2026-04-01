"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getPropertyById, getProperties, sanitizeImageUrl, submitBooking, submitContact } from "@/lib/api";
import AnimatedSection from "@/components/ui/AnimatedSection";
import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/ui/PropertyMap"), { ssr: false });
import {
  MapPin,
  ChevronRight,
  PlayCircle,
  Mail,
  Share2,
  Volume2,
  VolumeX,
  Loader2,
  Calendar,
  Tag,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  BadgeDollarSign,
} from "lucide-react";
import type { Property } from "@/lib/types";

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params?.slug as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [otherProperties, setOtherProperties] = useState<Property[]>([]);

  const [copied, setCopied] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);

  const handleShare = async () => {
    const url = window.location.href;
    const title = property?.name || "Check out this property";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled or share failed — ignore
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Booking form state
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", date: "", time: "" });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [descExpanded, setDescExpanded] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<Map<number, HTMLIFrameElement | HTMLVideoElement>>(new Map());
  const activeSlideRef = useRef(0);

  // Pause all videos in the carousel
  const pauseAllVideos = useCallback(() => {
    videoRefs.current.forEach((el) => {
      if (el instanceof HTMLIFrameElement) {
        el.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
          "*",
        );
      } else if (el instanceof HTMLVideoElement) {
        el.pause();
      }
    });
  }, []);

  // Play the video on a specific slide index (0-based among video slides)
  const playVideo = useCallback((slideVideoIndex: number) => {
    const el = videoRefs.current.get(slideVideoIndex);
    if (!el) return;
    if (el instanceof HTMLIFrameElement) {
      el.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "*",
      );
    } else if (el instanceof HTMLVideoElement) {
      el.play().catch(() => {});
    }
  }, []);

  // Toggle mute/unmute on all video elements
  const toggleMute = useCallback(() => {
    const newMuted = !videoMuted;
    setVideoMuted(newMuted);
    videoRefs.current.forEach((el) => {
      if (el instanceof HTMLIFrameElement) {
        el.contentWindow?.postMessage(
          JSON.stringify({
            event: "command",
            func: newMuted ? "mute" : "unMute",
            args: [],
          }),
          "*",
        );
      } else if (el instanceof HTMLVideoElement) {
        el.muted = newMuted;
      }
    });
  }, [videoMuted]);

  // IntersectionObserver to pause videos when gallery scrolls out of view
  useEffect(() => {
    const galleryEl = galleryRef.current;
    if (!galleryEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          pauseAllVideos();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(galleryEl);
    return () => observer.disconnect();
  }, [pauseAllVideos, property]);

  useEffect(() => {
    if (!propertyId) return;
    setLoading(true);
    getPropertyById(propertyId)
      .then((data) => setProperty(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    getProperties(undefined, 1)
      .then((data) => {
        const others = data.items.filter((p) => String(p.id) !== String(propertyId));
        setOtherProperties(others.slice(0, 5));
      })
      .catch(() => {});
  }, [propertyId]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
        <p className="text-secondary-500">Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="py-20 text-center">
        <h2 className="font-display text-3xl font-bold text-secondary-900 mb-4">
          Property Not Found
        </h2>
        <Link
          href="/properties"
          className="text-primary-600 font-semibold hover:underline"
        >
          Back to Properties
        </Link>
      </div>
    );
  }

  const galleryImages = (
    property.property_images && property.property_images.length > 0
      ? property.property_images
      : []
  ).map(sanitizeImageUrl);

  // Extract YouTube IDs from video URLs for the carousel
  const videoSlides = (property.property_videos || []).map((videoUrl) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(shorts\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = videoUrl.match(regExp);
    const youtubeId = (match && match[8].length === 11) ? match[8] : null;
    return { url: videoUrl, youtubeId };
  });

  const totalSlides = galleryImages.length + videoSlides.length;

  const locationString = `${property.address}, ${property.city}, ${property.state}`;

  return (
    <>
      {/* Hero Title Section */}
      <section className="bg-gradient-to-br from-secondary-950 to-secondary-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_1px)] bg-[length:30px_30px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h1 className="font-display text-3xl lg:text-5xl font-bold text-white mb-4">
            {property.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 bg-white/10 px-5 py-2.5 rounded-full text-white/80 text-sm">
              <MapPin className="w-4 h-4 text-primary-600" />
              {locationString}
            </span>
            <span className="inline-flex items-center gap-2 bg-primary-600/20 px-4 py-2 rounded-full text-primary-300 text-sm">
              <Tag className="w-4 h-4" />
              {property.category} &middot; {property.sub_category}
            </span>
            {property.is_featured && (
              <span className="inline-flex items-center gap-1 bg-amber-500/20 px-4 py-2 rounded-full text-amber-300 text-sm font-semibold">
                ★ Featured
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <section className="py-16 bg-secondary-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content - Right */}
            <div className="lg:col-span-2 order-1 lg:order-2 space-y-8">
              {/* Premium Gallery (Videos first, then Images) */}
              {totalSlides > 0 && (
                <AnimatedSection>
                  <div ref={galleryRef} className="space-y-3">
                    {/* Main Carousel */}
                    <div className="rounded-2xl overflow-hidden shadow-lg relative group">
                      <Swiper
                        modules={[Autoplay, Navigation]}
                        autoplay={videoSlides.length > 0 ? false : { delay: 5000, disableOnInteraction: true, pauseOnMouseEnter: true }}
                        navigation={{
                          prevEl: prevRef.current,
                          nextEl: nextRef.current,
                        }}
                        onSwiper={(swiper) => {
                          swiperRef.current = swiper;
                          setTimeout(() => {
                            if (swiper?.params?.navigation && typeof swiper.params.navigation !== "boolean") {
                              swiper.params.navigation.prevEl = prevRef.current;
                              swiper.params.navigation.nextEl = nextRef.current;
                            }
                            swiper?.navigation?.destroy();
                            swiper?.navigation?.init();
                            swiper?.navigation?.update();
                          });
                        }}
                        onSlideChange={(swiper) => {
                          activeSlideRef.current = swiper.realIndex;
                          setActiveIndex(swiper.realIndex);
                          pauseAllVideos();
                          const newIndex = swiper.realIndex;
                          if (newIndex < videoSlides.length) {
                            playVideo(newIndex);
                          }
                        }}
                        loop={totalSlides > 1}
                        className="property-gallery-swiper"
                      >
                        {/* Videos come first */}
                        {videoSlides.map((video, idx) => (
                          <SwiperSlide key={`vid-${idx}`}>
                            <div className="w-full h-[500px] lg:h-[500px] md:h-[350px] bg-black flex items-center justify-center relative">
                              {video.youtubeId ? (
                                <iframe
                                  ref={(el) => {
                                    if (el) videoRefs.current.set(idx, el);
                                  }}
                                  src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1&enablejsapi=1${idx === 0 ? "&autoplay=1&mute=1" : ""}`}
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  title={`${property.name} - Video ${idx + 1}`}
                                />
                              ) : (
                                <video
                                  ref={(el) => {
                                    if (el) videoRefs.current.set(idx, el);
                                  }}
                                  src={video.url}
                                  className="w-full h-full object-contain"
                                  controls
                                  muted
                                  autoPlay={idx === 0}
                                  preload={idx === 0 ? "auto" : "metadata"}
                                  title={`${property.name} - Video ${idx + 1}`}
                                />
                              )}
                              <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5 pointer-events-none">
                                <PlayCircle className="w-3.5 h-3.5" /> Video
                              </div>
                              <button
                                onClick={toggleMute}
                                className="absolute bottom-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                                aria-label={videoMuted ? "Unmute video" : "Mute video"}
                              >
                                {videoMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                              </button>
                            </div>
                          </SwiperSlide>
                        ))}
                        {/* Then images */}
                        {galleryImages.map((img, idx) => (
                          <SwiperSlide key={`img-${idx}`}>
                            <img
                              src={img}
                              alt={`${property.name} - Image ${idx + 1}`}
                              className="w-full h-[500px] lg:h-[500px] md:h-[350px] object-contain bg-secondary-950"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      {totalSlides > 1 && (
                        <>
                          <button
                            ref={prevRef}
                            aria-label="Previous slide"
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
                          >
                            <ArrowLeft size={20} />
                          </button>
                          <button
                            ref={nextRef}
                            aria-label="Next slide"
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
                          >
                            <ArrowRight size={20} />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Strip */}
                    {totalSlides > 1 && (
                      <div className="flex gap-2.5 justify-center overflow-x-auto p-1 scrollbar-thin">
                        {/* Video thumbnails first */}
                        {videoSlides.map((video, idx) => (
                          <button
                            key={`thumb-vid-${idx}`}
                            onClick={() => {
                              if (swiperRef.current) {
                                swiperRef.current.slideToLoop(idx);
                              }
                            }}
                            className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                              activeIndex === idx
                                ? "border-red-500 scale-105 shadow-md"
                                : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                          >
                            {video.youtubeId ? (
                              <img
                                src={`https://img.youtube.com/vi/${video.youtubeId}/default.jpg`}
                                alt={`Video ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-secondary-900 flex items-center justify-center">
                                <PlayCircle className="w-5 h-5 text-white" />
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <PlayCircle className="w-5 h-5 text-white" />
                            </div>
                          </button>
                        ))}
                        {/* Image thumbnails */}
                        {galleryImages.map((img, idx) => {
                          const slideIndex = videoSlides.length + idx;
                          return (
                            <button
                              key={`thumb-img-${idx}`}
                              onClick={() => {
                                if (swiperRef.current) {
                                  swiperRef.current.slideToLoop(slideIndex);
                                }
                              }}
                              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                                activeIndex === slideIndex
                                  ? "border-red-500 scale-105 shadow-md"
                                  : "border-transparent opacity-70 hover:opacity-100"
                              }`}
                            >
                              <img
                                src={img}
                                alt={`Image ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              )}

              {/* Property Description */}
              {property.description && (
                <AnimatedSection>
                  <div
                    id="overview"
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-secondary-100 p-6 lg:p-8"
                  >
                    <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4 pb-4 border-b-2 border-secondary-100">
                      Property Description
                    </h2>
                    <div className="relative">
                      <div
                        className={`rich-content prose max-w-none text-secondary-600 leading-relaxed overflow-hidden transition-all duration-300 ${
                          !descExpanded ? "max-h-[15em]" : "max-h-none"
                        }`}
                        dangerouslySetInnerHTML={{ __html: property.description }}
                      />
                      {!descExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDescExpanded((v) => !v)}
                      className="mt-3 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      {descExpanded ? "Show less" : "See more"}
                    </button>
                  </div>
                </AnimatedSection>
              )}

              {/* Property Details Card */}
              <AnimatedSection>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-secondary-100 p-6 lg:p-8">
                  <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4 pb-4 border-b-2 border-secondary-100">
                    Property Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-xl">
                      <Tag className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="text-xs text-secondary-400">Category</p>
                        <p className="font-semibold text-secondary-900">{property.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-xl">
                      <Tag className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="text-xs text-secondary-400">Sub Category</p>
                        <p className="font-semibold text-secondary-900">{property.sub_category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="text-xs text-secondary-400">City</p>
                        <p className="font-semibold text-secondary-900">{property.city}, {property.state}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="text-xs text-secondary-400">Listed</p>
                        <p className="font-semibold text-secondary-900">
                          {new Date(property.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Location Map */}
              <AnimatedSection>
                <div
                  id="location-map"
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-secondary-100 p-6 lg:p-8"
                >
                  <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4 pb-4 border-b-2 border-secondary-100">
                    Location
                  </h2>
                  {property.latitude && property.longitude ? (
                    <PropertyMap
                      lat={parseFloat(property.latitude)}
                      lng={parseFloat(property.longitude)}
                      title={property.name}
                      className="h-[400px]"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl py-16 text-center text-secondary-400">
                      <MapPin className="w-12 h-12 mx-auto mb-3 text-primary-600/50" />
                      <p className="text-sm">Map coordinates not available for this property</p>
                      <p className="text-xs mt-1">{locationString}</p>
                    </div>
                  )}
                </div>
              </AnimatedSection>

              {/* Book A Consultation */}
              <AnimatedSection>
                <div
                  id="consultation"
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-secondary-100 p-6 lg:p-8"
                >
                  <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4 pb-4 border-b-2 border-secondary-100">
                    Book A Consultation
                  </h2>
                  {bookingSuccess ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <p className="text-lg font-semibold text-secondary-900 mb-1">Consultation Booked!</p>
                      <p className="text-sm text-secondary-500">We will get back to you shortly.</p>
                    </div>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setBookingLoading(true);
                        setBookingError("");
                        try {
                          await submitBooking({
                            name: bookingForm.name,
                            phone: bookingForm.phone,
                            date: bookingForm.date,
                            time: bookingForm.time,
                            property_name: property.name,
                          });
                          setBookingSuccess(true);
                        } catch (err: unknown) {
                          setBookingError(err instanceof Error ? err.message : "Failed to book consultation. Please try again.");
                        } finally {
                          setBookingLoading(false);
                        }
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          required
                          className="w-full px-5 py-3 border-2 border-secondary-200 rounded-xl text-sm font-sans bg-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 transition-all placeholder:text-secondary-400"
                          placeholder="Your Name"
                          name="name"
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm((f) => ({ ...f, name: e.target.value }))}
                        />
                        <input
                          type="tel"
                          required
                          className="w-full px-5 py-3 border-2 border-secondary-200 rounded-xl text-sm font-sans bg-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 transition-all placeholder:text-secondary-400"
                          placeholder="Phone Number"
                          name="phone"
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm((f) => ({ ...f, phone: e.target.value }))}
                        />
                        <input
                          type="date"
                          required
                          className="w-full px-5 py-3 border-2 border-secondary-200 rounded-xl text-sm font-sans bg-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 transition-all"
                          name="date"
                          value={bookingForm.date}
                          onChange={(e) => setBookingForm((f) => ({ ...f, date: e.target.value }))}
                        />
                        <input
                          type="time"
                          required
                          className="w-full px-5 py-3 border-2 border-secondary-200 rounded-xl text-sm font-sans bg-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 transition-all"
                          name="time"
                          value={bookingForm.time}
                          onChange={(e) => setBookingForm((f) => ({ ...f, time: e.target.value }))}
                        />
                      </div>
                      {bookingError && (
                        <p className="mt-3 text-sm text-red-600">{bookingError}</p>
                      )}
                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="mt-5 w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold py-4 rounded-xl uppercase tracking-wider text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {bookingLoading ? (
                          <span className="inline-flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </span>
                        ) : (
                          "Book Consultation"
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </AnimatedSection>
            </div>

            {/* Sidebar - Left */}
            <div className="lg:col-span-1 order-2 lg:order-1 space-y-8">
              {/* Other Properties */}
              {otherProperties.length > 0 && (
                <AnimatedSection>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-secondary-100 p-6">
                    <h4 className="font-sans text-base font-semibold text-secondary-900 uppercase tracking-wider mb-4 pb-3 border-b-2 border-secondary-100">
                      Other Properties
                    </h4>
                    <ul className="space-y-1">
                      {otherProperties.map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/properties/${p.id}`}
                            className="flex items-center justify-between px-4 py-3 rounded-lg text-secondary-900 font-medium text-sm hover:bg-primary-600 hover:text-white hover:translate-x-1 transition-all"
                          >
                            {p.name}
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              )}

              {/* Property Info (Quick Nav) */}
              <AnimatedSection>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-secondary-100 p-6">
                  <h4 className="font-sans text-base font-semibold text-secondary-900 uppercase tracking-wider mb-4 pb-3 border-b-2 border-secondary-100">
                    Property Info
                  </h4>
                  <ul className="space-y-1">
                    {[
                      { label: "Overview", href: "#overview" },
                      { label: "Location Map", href: "#location-map" },
                      { label: "Book Consultation", href: "#consultation" },
                    ].map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          className="flex items-center justify-between px-4 py-3 rounded-lg text-secondary-900 font-medium text-sm hover:bg-primary-600 hover:text-white hover:translate-x-1 transition-all"
                        >
                          {item.label}
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              {/* Landmarks */}
              {property.landmarks && property.landmarks.length > 0 && (
                <AnimatedSection>
                  <div id="landmarks" className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-secondary-100 p-6">
                    <h4 className="font-sans text-base font-semibold text-secondary-900 uppercase tracking-wider mb-4 pb-3 border-b-2 border-secondary-100">
                      Landmarks
                    </h4>
                    <ul className="space-y-2">
                      {property.landmarks.map((landmark, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-3 px-3 py-2.5 bg-secondary-50 rounded-lg border border-secondary-100"
                        >
                          <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
                          <span className="text-sm text-secondary-700 font-medium">{landmark}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              )}

              {/* Documents */}
              <AnimatedSection>
                <div id="documents" className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-secondary-100 p-6">
                  <h4 className="font-sans text-base font-semibold text-secondary-900 uppercase tracking-wider mb-4 pb-3 border-b-2 border-secondary-100">
                    Documents
                  </h4>
                  <ul className="space-y-2">
                    {[
                      { name: "Acknowledge Receipt (Temporal)", price: null },
                      { name: "Purchase Receipts", price: null },
                      { name: "Registered Survey Plan", price: "₦250,000" },
                      { name: "Deed of Assignment", price: null },
                      { name: "Power of Attorney", price: "₦100,000" },
                      { name: "Contract of Sale", price: null },
                    ].map((doc, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between gap-2 px-3 py-2.5 bg-secondary-50 rounded-lg border border-secondary-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-primary-600 shrink-0" />
                          <span className="text-sm text-secondary-700 font-medium">{doc.name}</span>
                        </div>
                        {doc.price && (
                          <span className="text-xs font-bold text-primary-600 whitespace-nowrap">{doc.price}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              {/* FAQ Button */}
              <button
                onClick={() => {
                  // TODO: Replace with actual PDF URL
                  // window.open("/path-to-faq.pdf", "_blank");
                }}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-lg shadow-primary-600/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-600/30 transition-all duration-200"
              >
                <FileText className="w-5 h-5" />
                FAQ
              </button>

              {/* Get More Info Form */}
              <AnimatedSection>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-secondary-100 p-6">
                  <h4 className="font-sans text-base font-semibold text-secondary-900 uppercase tracking-wider mb-4 pb-3 border-b-2 border-secondary-100">
                    Get More Info
                  </h4>
                  {contactSuccess ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <p className="text-lg font-semibold text-secondary-900 mb-1">Request Sent!</p>
                      <p className="text-sm text-secondary-500">We will reach out to you shortly.</p>
                    </div>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setContactLoading(true);
                        setContactError("");
                        try {
                          await submitContact({
                            name: contactForm.name,
                            phone: contactForm.phone,
                            email: contactForm.email,
                            message: contactForm.message,
                          });
                          setContactSuccess(true);
                        } catch (err: unknown) {
                          setContactError(err instanceof Error ? err.message : "Failed to send request. Please try again.");
                        } finally {
                          setContactLoading(false);
                        }
                      }}
                      className="space-y-3"
                    >
                      <input
                        type="text"
                        required
                        className="w-full px-5 py-3 border-2 border-secondary-200 rounded-xl text-sm font-sans bg-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 transition-all placeholder:text-secondary-400"
                        placeholder="Your Name"
                        name="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                      />
                      <input
                        type="tel"
                        required
                        className="w-full px-5 py-3 border-2 border-secondary-200 rounded-xl text-sm font-sans bg-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 transition-all placeholder:text-secondary-400"
                        placeholder="Phone Number"
                        name="phone"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))}
                      />
                      <input
                        type="email"
                        required
                        className="w-full px-5 py-3 border-2 border-secondary-200 rounded-xl text-sm font-sans bg-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 transition-all placeholder:text-secondary-400"
                        placeholder="Email Address"
                        name="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                      />
                      <textarea
                        rows={3}
                        required
                        className="w-full px-5 py-3 border-2 border-secondary-200 rounded-xl text-sm font-sans bg-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 transition-all placeholder:text-secondary-400 resize-none"
                        placeholder="Message"
                        name="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                      />
                      {contactError && (
                        <p className="text-sm text-red-600">{contactError}</p>
                      )}
                      <button
                        type="submit"
                        disabled={contactLoading}
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold py-4 rounded-xl uppercase tracking-wider text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {contactLoading ? (
                          <span className="inline-flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </span>
                        ) : (
                          "Request Info"
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer Strip */}
      <div className="bg-gradient-to-br from-secondary-950 to-secondary-900 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center text-white/80">
              <MapPin className="w-6 h-6 text-primary-600 mx-auto mb-3" />
              <h5 className="text-white text-sm font-semibold uppercase tracking-wider mb-1">
                Location
              </h5>
              <p className="text-xs text-white/60">{locationString}</p>
            </div>
            <div className="text-center text-white/80">
              <Mail className="w-6 h-6 text-primary-600 mx-auto mb-3" />
              <h5 className="text-white text-sm font-semibold uppercase tracking-wider mb-1">
                Email
              </h5>
              <a
                href="mailto:bomachgroupmanagement@gmail.com"
                className="text-xs text-white/60 hover:text-primary-600 transition-colors"
              >
                bomachgroupmanagement@gmail.com
              </a>
            </div>
            <div className="text-center text-white/80">
              <Share2 className="w-6 h-6 text-primary-600 mx-auto mb-3" />
              <h5 className="text-white text-sm font-semibold uppercase tracking-wider mb-1">
                Social
              </h5>
              <a
                href="#"
                className="text-xs text-white/60 hover:text-primary-600 transition-colors"
              >
                @bomachgroup
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Share FAB — positioned above the BackToTop button */}
      <button
        onClick={handleShare}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
        aria-label="Share property"
      >
        {copied ? <CheckCircle className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
      </button>
      {copied && (
        <div className="fixed bottom-40 right-6 z-50 bg-secondary-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg">
          Link copied!
        </div>
      )}
    </>
  );
}
