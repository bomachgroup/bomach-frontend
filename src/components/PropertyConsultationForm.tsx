"use client";

import { useState } from "react";
import { submitBooking } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Phone, Mail, Calendar, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function PropertyConsultationForm({ propertyId, propertyTitle }: { propertyId: number | string, propertyTitle: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Construct the booking data
    const bookingData = {
      ...data,
      message: `Inquiry for Property: ${propertyTitle} (#${propertyId}). ${data.message || ""}`,
      meeting_time: `${data.date}T${data.time}:00`,
    };

    try {
      await submitBooking(bookingData);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Appointment scheduling failed. Please try again.");
    }
  }

  const inputClasses = "w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white focus:outline-none transition-all duration-300 font-bold text-[#1d284b] text-sm placeholder:text-gray-400 placeholder:font-bold placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]";
  const labelClasses = "block text-[10px] font-black uppercase tracking-widest text-blue-700 mb-2 px-2";

  if (status === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10"
      >
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h4 className="text-xl font-black text-[#1d284b] uppercase tracking-tight mb-2">Booking Confirmed!</h4>
        <p className="text-gray-500 text-sm mb-8">Our real estate concierge will contact you shortly to confirm the appointment.</p>
        <button 
          onClick={() => setStatus("idle")}
          className="text-blue-600 font-black uppercase tracking-widest text-[10px] hover:underline"
        >
          Schedule another time
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className={labelClasses}>Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input name="name" required className={inputClasses} placeholder="Your Name" />
          </div>
        </div>
        <div className="space-y-1">
          <label className={labelClasses}>Phone / WhatsApp</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input name="phone" required className={inputClasses} placeholder="Contact Number" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className={labelClasses}>Preferred Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input name="date" type="date" required className={inputClasses} />
          </div>
        </div>
        <div className="space-y-1">
          <label className={labelClasses}>Preferred Time</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input name="time" type="time" required className={inputClasses} />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>Email (Optional)</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input name="email" type="email" className={inputClasses} placeholder="Email for confirmation" />
        </div>
      </div>

      <button
        disabled={status === "loading"}
        className="w-full py-5 bg-red-600 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-[#1d284b] transition-all shadow-xl shadow-red-900/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
      >
        {status === "loading" ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            Schedule Meeting <Send size={16} />
          </>
        )}
      </button>

      {status === "error" && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}
    </form>
  );
}
