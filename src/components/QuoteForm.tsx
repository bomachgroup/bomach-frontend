"use client";

import { useState, useEffect } from "react";
import { submitQuote, getSubServices } from "@/lib/api";
import { Send, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Service, SubService } from "@/lib/types";

export default function QuoteForm({ services }: { services: Service[] }) {
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (selectedService) {
      getSubServices(Number(selectedService))
        .then(setSubServices)
        .catch(() => setSubServices([]));
    } else {
      setSubServices([]);
    }
  }, [selectedService]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      await submitQuote(data);
      setStatus("success");
      form.reset();
      setSelectedService("");
      setSubServices([]);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Submission failed");
    }
    setTimeout(() => setStatus("idle"), 8000);
  }

  const inputClasses =
    "w-full px-5 py-4 rounded-xl bg-white text-secondary-950 border border-secondary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all duration-300 placeholder:text-secondary-400 text-sm";
  const selectClasses = `${inputClasses} appearance-none cursor-pointer pr-10`;

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-10 text-center shadow-xl flex flex-col items-center justify-center space-y-5 min-h-[460px]"
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-display font-bold text-secondary-950">
              Request Received!
            </h3>
            <p className="text-secondary-500 max-w-sm">
              Thank you for reaching out. Our team will review your project details
              and get back to you within 24 hours.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="btn-primary mt-4 !py-3 !px-8 !text-sm"
            >
              Submit Another Request
            </button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-8 md:p-10 shadow-xl space-y-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-2">
              <h3 className="font-display text-xl font-bold text-secondary-950">
                Request a Free Quote
              </h3>
              <p className="text-secondary-400 text-sm mt-1">
                Fill in your details and we&apos;ll get back to you shortly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="name"
                required
                placeholder="Full Name"
                className={inputClasses}
              />
              <input
                name="phone"
                required
                placeholder="Phone Number"
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="email"
                type="email"
                required
                placeholder="Email Address"
                className={inputClasses}
              />
              <input
                name="location"
                required
                placeholder="Project Location"
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <select
                  name="service"
                  required
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className={selectClasses}
                >
                  <option value="">Select Service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none"
                  size={16}
                />
              </div>
              <div className="relative">
                <select
                  name="sub_service"
                  className={`${selectClasses} ${!selectedService ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!selectedService}
                >
                  <option value="">Select Sub-Service</option>
                  {subServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            <textarea
              name="message"
              required
              placeholder="Tell us about your project..."
              rows={4}
              className={`${inputClasses} resize-none`}
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary w-full !py-4 flex items-center justify-center gap-3 disabled:opacity-50 text-sm font-bold uppercase tracking-wider"
            >
              {status === "loading" ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Get Free Quote
                  <Send size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

            <AnimatePresence>
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm"
                >
                  <AlertCircle size={18} />
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
