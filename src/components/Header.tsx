"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Menu,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import MobileNav from "@/components/ui/MobileNav";
import type { Service } from "@/lib/types";
import { getServices } from "@/lib/api";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
    ],
  },
  { label: "Properties", href: "/properties" },
  {
    label: "Services",
    href: "/services",
    children: [] as { label: string; href: string }[],
  },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Jobs", href: "/jobs" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [services, setServices] = useState<Service[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollDirection, isAtTop } = useScrollDirection();

  useEffect(() => {
    getServices().then(setServices).catch(() => { });
  }, []);

  // Build nav items with dynamic services dropdown
  const navItems = NAV_ITEMS.map((item) => {
    if (item.label === "Services" && services.length > 0) {
      return {
        ...item,
        children: services.map((s) => ({
          label: s.name,
          href: `/services/${s.slug}`,
        })),
      };
    }
    return item;
  });

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 w-full"
        animate={{
          y: scrollDirection === "down" && !isAtTop ? -100 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Top Bar */}
        <div className="bg-secondary-950 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-10 text-sm">
              {/* Social Links */}
              <div className="hidden sm:flex items-center gap-4">
                <span className="text-secondary-300 text-xs font-medium tracking-wide uppercase">
                  Follow us
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://web.facebook.com/bomachgroup"
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary-300 hover:text-primary-500 transition-colors duration-200"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary-300 hover:text-primary-500 transition-colors duration-200"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary-300 hover:text-primary-500 transition-colors duration-200"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary-300 hover:text-primary-500 transition-colors duration-200"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-center gap-5 ml-auto">
                <a
                  href="tel:08036656173"
                  className="flex items-center gap-1.5 text-secondary-300 hover:text-white transition-colors duration-200"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-xs">080 3665 6173</span>
                </a>
                <a
                  href="mailto:bomachgroupmanagement@gmail.com"
                  className="hidden md:flex items-center gap-1.5 text-secondary-300 hover:text-white transition-colors duration-200"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span className="text-xs">bomachgroupmanagement@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div
          className={`transition-all duration-300 ${isAtTop
              ? "bg-white"
              : "bg-white/80 backdrop-blur-xl border-b border-secondary-100 shadow-sm"
            }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <img
                  src="/images/logo/bomach-logo-hd.png"
                  alt="Bomach Group"
                  className="max-h-14 w-auto"
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => (
                  <div key={item.label} className="relative group">
                    {item.children && item.children.length > 0 ? (
                      <>
                        <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors duration-200">
                          {item.label}
                          <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                        </button>
                        {/* Dropdown */}
                        <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <div className="min-w-[200px] bg-white rounded-xl shadow-xl shadow-secondary-900/10 border border-secondary-100 py-2 overflow-hidden">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block px-4 py-2.5 text-sm text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-150"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="px-3 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}

                {/* CTA Button */}
                <Link
                  href="/booking"
                  className="ml-4 inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-md shadow-primary-600/20"
                >
                  Book Meeting
                </Link>
              </nav>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 -mr-2 rounded-lg text-secondary-700 hover:text-secondary-900 hover:bg-secondary-100 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-[104px] lg:h-[120px]" />

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={navItems}
      />
    </>
  );
}
