"use client";

import { useState, useEffect } from "react";
import { submitBooking, getProperties } from "@/lib/api";
import PageTitle from "@/components/PageTitle";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { MapPin, Phone, Mail, CalendarCheck, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [propertyNames, setPropertyNames] = useState<string[]>([]);

  useEffect(() => {
    getProperties()
      .then((data) => {
        const names = data.items
          .map((p) => p.name)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
        setPropertyNames(names);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus("loading");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const meetingDate = formData.get("meeting_date") as string;
    const meetingTime = formData.get("meeting_time") as string;

    try {
      await submitBooking({
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        date: meetingDate,
        time: meetingTime,
        property_name: (formData.get("property_name") as string) || null,
      });
      setStatus("success");
      form.reset();
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
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        required
                        className="input-premium"
                      />
                    </div>
                    <div>
                      <select
                        name="property_name"
                        className="input-premium"
                      >
                        <option value="">Select Property (optional)</option>
                        {propertyNames.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        name="meeting_date"
                        required
                        className="input-premium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Preferred Time
                      </label>
                      <input
                        type="time"
                        name="meeting_time"
                        required
                        className="input-premium"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="btn-primary w-full"
                        disabled={status === "loading"}
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
