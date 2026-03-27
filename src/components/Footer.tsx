"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { subscribeEmail } from "@/lib/api";
import AnimatedSection from "@/components/ui/AnimatedSection";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  ArrowRight,
  Send,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Jobs", href: "/jobs" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { icon: Facebook, href: "https://web.facebook.com/bomachgroup", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: MessageCircle, href: "https://wa.me/2349018000118", label: "WhatsApp" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    try {
      await subscribeEmail(email);
      setMessage("Subscribed successfully!");
      setEmail("");
    } catch {
      setMessage("Email is invalid or already subscribed.");
    }
    setTimeout(() => setMessage(""), 4000);
  }

  return (
    <footer className="relative bg-gradient-to-b from-secondary-900 to-secondary-950">
      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/2349018000118"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40"
      >
        <svg className="relative h-7 w-7" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Newsletter Section */}
      <div className="border-b border-white/10 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection direction="up">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-12">
              <div className="grid items-center gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="font-display text-2xl font-bold text-white md:text-3xl">
                    Newsletter
                  </h3>
                  <p className="mt-2 text-secondary-400">
                    Subscribe to get the latest updates, news, and exclusive offers
                    delivered directly to your inbox.
                  </p>
                </div>
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-white placeholder:text-white/50 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
                  >
                    Subscribe
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
              {message && (
                <p
                  className={`mt-4 text-sm font-medium ${message.includes("success") ? "text-green-400" : "text-red-400"
                    }`}
                >
                  {message}
                </p>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {/* Logo + Description */}
            <AnimatedSection direction="up" delay={0}>
              <div>
                <Link href="/" className="inline-block">
                  <Image
                    src="/images/logo/bomach-logo-hd.png"
                    alt="Bomach Group Logo"
                    width={160}
                    height={60}
                    className="rounded-lg"
                    style={{ width: "auto", height: "auto" }}
                  />
                </Link>
                <p className="mt-6 leading-relaxed text-secondary-300">
                  BOMACH GROUP is your one-stop solution for real estate services,
                  land services, engineering, digital innovation, and food
                  production.
                </p>
              </div>
            </AnimatedSection>

            {/* Quick Links */}
            <AnimatedSection direction="up" delay={0.1}>
              <div>
                <h4 className="font-display text-lg font-bold text-white">
                  Quick Links
                </h4>
                <div className="mt-2 h-1 w-10 rounded-full bg-primary-600" />
                <ul className="mt-6 space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-2 text-secondary-400 transition-colors hover:text-primary-500"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            {/* Contact Info */}
            <AnimatedSection direction="up" delay={0.2}>
              <div>
                <h4 className="font-display text-lg font-bold text-white">
                  Contact Info
                </h4>
                <div className="mt-2 h-1 w-10 rounded-full bg-primary-600" />
                <ul className="mt-6 space-y-5">
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                    <span className="text-secondary-300">
                      3a Isiuzo Street, Independence Layout, Enugu State,
                      Nigeria.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                    <a
                      href="mailto:bomachgroupmanagement@gmail.com"
                      className="text-secondary-300 transition-colors hover:text-primary-500"
                    >
                      bomachgroupmanagement@gmail.com
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                    <div className="flex flex-col gap-1">
                      <a
                        href="tel:09018000118"
                        className="text-secondary-300 transition-colors hover:text-primary-500"
                      >
                        090 1800 0118
                      </a>
                      <a
                        href="tel:08036656173"
                        className="text-secondary-300 transition-colors hover:text-primary-500"
                      >
                        080 3665 6173
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Social Links Row */}
      <div className="border-t border-white/10 px-4 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-primary-600 hover:scale-110"
            >
              <social.icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 px-4 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-secondary-400">
            Copyright &copy; {new Date().getFullYear()}{" "}
            <Link href="/" className="font-semibold text-white hover:text-primary-500 transition-colors">
              Bomach Group
            </Link>
            . All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-secondary-400 transition-colors hover:text-primary-500"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm text-secondary-400 transition-colors hover:text-primary-500"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
