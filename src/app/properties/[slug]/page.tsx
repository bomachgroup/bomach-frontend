"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
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

  // Booking form state
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", date: "", time: "" });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "" });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

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
              {/* Premium Gallery */}
              {galleryImages.length > 0 && (
                <AnimatedSection>
                  <div className="rounded-2xl overflow-hidden shadow-lg relative group">
                    <Swiper
                      modules={[Autoplay, Pagination, Navigation, EffectFade]}
                      effect="fade"
                      autoplay={{ delay: 3000, disableOnInteraction: false }}
                      pagination={{ clickable: true }}
                      navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                      }}
                      onSwiper={(swiper) => {
                        setTimeout(() => {
                          if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                          }
                          swiper.navigation.destroy();
                          swiper.navigation.init();
                          swiper.navigation.update();
                        });
                      }}
                      loop={galleryImages.length > 1}
                      className="property-gallery-swiper"
                    >
                      {galleryImages.map((img, idx) => (
                        <SwiperSlide key={idx}>
                          <img
                            src={img}
                            alt={`${property.name} - Image ${idx + 1}`}
                            className="w-full h-[500px] lg:h-[500px] md:h-[350px] object-cover"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    {galleryImages.length > 1 && (
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
                    <div
                      className="rich-content prose max-w-none text-secondary-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: property.description }}
                    />
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

              {/* Video Tour */}
              <AnimatedSection>
                <div
                  id="tour"
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-secondary-100 p-6 lg:p-8"
                >
                  <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4 pb-4 border-b-2 border-secondary-100">
                    Virtual Tour
                  </h2>
                  {property.property_videos && property.property_videos.length > 0 ? (
                    <div className="space-y-6">
                      {property.property_videos.map((videoUrl, idx) => {
                        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
                        const match = videoUrl.match(regExp);
                        const youtubeId = (match && match[7].length === 11) ? match[7] : null;

                        return (
                          <div key={idx} className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
                            {youtubeId ? (
                              <iframe
                                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={`Property Video Tour ${idx + 1}`}
                              />
                            ) : (
                              <video
                                src={videoUrl}
                                className="w-full h-full"
                                controls
                                preload="metadata"
                                title={`Property Video Tour ${idx + 1}`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-secondary-900 to-secondary-950 rounded-xl py-16 text-center text-white/60">
                      <PlayCircle className="w-12 h-12 mx-auto mb-3 text-primary-600" />
                      <p className="text-sm">Virtual tour coming soon</p>
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
                      { label: "Virtual Tour", href: "#tour" },
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
                            property_name: property.name,
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
    </>
  );
}
