"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ChevronDown } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
  exit: { x: "100%" },
};

const panelTransition = {
  type: "spring" as const,
  damping: 25,
  stiffness: 200,
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.05 * i,
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export default function MobileNav({ isOpen, onClose, items }: MobileNavProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  function toggleExpanded(label: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  function handleLinkClick() {
    setExpandedItems(new Set());
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={panelTransition}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-secondary-100">
              <span className="font-display text-xl font-black text-secondary-950 tracking-tight">
                BOMACH
              </span>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-lg text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 transition-colors"
                aria-label="Close navigation"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="space-y-1">
                {items.map((item, i) => (
                  <motion.li
                    key={item.label}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                  >
                    {item.children && item.children.length > 0 ? (
                      <>
                        <button
                          onClick={() => toggleExpanded(item.label)}
                          className="flex items-center justify-between w-full py-3 text-lg font-semibold text-secondary-900 hover:text-primary-600 transition-colors"
                        >
                          {item.label}
                          <motion.span
                            animate={{
                              rotate: expandedItems.has(item.label) ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </motion.span>
                        </button>

                        <AnimatePresence>
                          {expandedItems.has(item.label) && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                              className="overflow-hidden pl-4 border-l-2 border-primary-100"
                            >
                              {item.children.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    onClick={handleLinkClick}
                                    className="block py-2.5 text-base text-secondary-600 hover:text-primary-600 transition-colors"
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className="block py-3 text-lg font-semibold text-secondary-900 hover:text-primary-600 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Footer CTA */}
            <div className="px-6 py-6 border-t border-secondary-100">
              <Link
                href="/contact"
                onClick={handleLinkClick}
                className="block w-full py-3.5 text-center text-base font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
