"use client";

import { useState } from "react";
import { submitContact } from "@/lib/api";
import PageTitle from "@/components/PageTitle";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { MapPin, Phone, Mail, Send, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    lines: ["Suite 9 Swiss Guard Plaza,", "450 Ogui Road, Enugu State"],
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

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      await submitContact(data);
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Submission failed.");
    }
    setTimeout(() => setStatus("idle"), 8000);
  }

  return (
    <>
      <PageTitle
        title="Contact Us"
        bgImage="/images/about/bomach-engineering5.jpg"
        breadcrumbs={[{ label: "Contact Us" }]}
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="mb-16">
            <SectionHeader
              subtitle="Get In Touch"
              title="If You Have Any Query, Don't Hesitate to Contact Us"
              titleHighlight="Contact"
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

            {/* Contact Form */}
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
                      <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        required
                        className="input-premium"
                      />
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
                      <button
                        type="submit"
                        className="btn-primary w-full"
                        disabled={status === "loading"}
                      >
                        <Send className="w-4 h-4 mr-2 inline-block" />
                        {status === "loading" ? "Sending..." : "Send Message"}
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
                        <span>Thank you! Your message has been sent successfully.</span>
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
