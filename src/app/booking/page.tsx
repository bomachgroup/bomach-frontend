"use client";

import { useState, useEffect } from "react";
import { getServices, getSubServices, submitBooking, checkAvailability } from "@/lib/api";
import PageTitle from "@/components/PageTitle";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { MapPin, Phone, Mail, CalendarCheck, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Service, SubService } from "@/lib/types";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    lines: ["3a Isiuzo Street,", "Independence Layout, Enugu State"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["090 1800 0118", "080 3665 6173"],
    links: ["tel:09018000118", "tel:08036656173"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["bomachgroupmanagement@gmail.com"],
    links: ["mailto:bomachgroupmanagement@gmail.com"],
  },
];

export default function BookingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [availability, setAvailability] = useState<{ available: boolean; message: string } | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getServices().then(setServices).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedService) {
      getSubServices(Number(selectedService)).then(setSubServices).catch(() => setSubServices([]));
    } else {
      setSubServices([]);
    }
  }, [selectedService]);

  useEffect(() => {
    if (meetingTime) {
      checkAvailability(meetingTime).then(setAvailability).catch(() => {});
    } else {
      setAvailability(null);
    }
  }, [meetingTime]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (availability && !availability.available) return;

    setStatus("loading");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      await submitBooking(data);
      setStatus("success");
      form.reset();
      setSelectedService("");
      setSubServices([]);
      setMeetingTime("");
      setAvailability(null);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Booking failed.");
    }
    setTimeout(() => setStatus("idle"), 8000);
  }

  return (
    <>
      <PageTitle
        title="Book Us"
        bgImage="/images/about/bomach-engineering5.jpg"
        breadcrumbs={[{ label: "Book Us" }]}
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="mb-16">
            <SectionHeader
              subtitle="Book An Appointment"
              title="If You Have Any Query, Book an Appointment With Us"
              titleHighlight="Appointment"
            />
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <AnimatedCard key={info.title} index={index} className="glass-card-hover p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-bold text-secondary-950 mb-2">{info.title}</h4>
                      {info.lines.map((line, i) =>
                        info.links?.[i] ? (
                          <a
                            key={i}
                            href={info.links[i]}
                            className="block text-secondary-600 hover:text-primary-600 transition-colors"
                          >
                            {line}
                          </a>
                        ) : (
                          <p key={i} className="text-secondary-600">{line}</p>
                        )
                      )}
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>

            {/* Booking Form */}
            <AnimatedSection direction="right" delay={0.2} className="lg:col-span-2">
              <div className="card-premium p-8">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        required
                        className="input-premium"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        required
                        className="input-premium"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        required
                        className="input-premium"
                      />
                    </div>
                    <div>
                      <select name="location" required className="select-premium">
                        <option value="Enugu Branch">Enugu Branch</option>
                        <option value="Port Harcourt Branch">Port Harcourt Branch</option>
                      </select>
                    </div>
                    <div>
                      <select
                        name="service"
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        required
                        className="select-premium"
                      >
                        <option value="">Select Service</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        name="sub_service"
                        disabled={!selectedService}
                        className="select-premium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Select Sub-Service</option>
                        {subServices.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <textarea
                        name="message"
                        placeholder="Message"
                        rows={5}
                        required
                        className="input-premium resize-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Preferred Meeting Time
                      </label>
                      <input
                        type="datetime-local"
                        name="meeting_time"
                        required
                        value={meetingTime}
                        onChange={(e) => setMeetingTime(e.target.value)}
                        className="input-premium"
                      />
                      <AnimatePresence mode="wait">
                        {availability && availability.available && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="mt-2 flex items-center gap-2 text-sm text-green-600"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{availability.message || "Selected time slot is available!"}</span>
                          </motion.div>
                        )}
                        {availability && !availability.available && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="mt-2 flex items-center gap-2 text-sm text-red-600"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>{availability.message || "Time slot not available"}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="btn-primary w-full"
                        disabled={status === "loading" || (availability !== null && !availability.available)}
                      >
                        <CalendarCheck className="w-4 h-4 mr-2 inline-block" />
                        {status === "loading" ? "Booking..." : "Book Appointment"}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {status === "success" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-green-50 text-green-700 border border-green-200"
                      >
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <span>Meeting booked successfully! Check your email for confirmation.</span>
                      </motion.div>
                    )}
                    {status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200"
                      >
                        <XCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{errorMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
