"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * Mount-once client component that applies page-wide GSAP animations
 * to the homepage. It targets elements via CSS classes so the server
 * component can remain a pure server component.
 *
 * Classes this animator responds to:
 *   .gsap-section       — fade-in + slide-up with scroll trigger
 *   .gsap-header        — scroll-triggered heading reveal (split by words)
 *   .gsap-service-card  — service card cascade with rotation
 *   .gsap-blog-card     — blog card scale-in cascade
 *   .gsap-stat          — stat counter card lift-in
 *   .gsap-parallax-img  — background-linked image scaling
 *   .gsap-cta           — CTA elements with subtle bounce-in
 */
export default function HomePageAnimator() {
  const scopeRef = useRef<HTMLDivElement>(null);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    }
  }, []);

  useGSAP(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    // 1. Generic section fade-in/up
    gsap.utils.toArray<HTMLElement>(".gsap-section").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    // 2. Heading word-by-word reveal
    gsap.utils.toArray<HTMLElement>(".gsap-header").forEach((header) => {
      if (header.dataset.gsapSplit === "done") return;
      header.dataset.gsapSplit = "done";

      const text = header.textContent ?? "";
      const words = text.split(/\s+/).filter(Boolean);
      header.innerHTML = words
        .map(
          (w) =>
            `<span class="gsap-word-wrap inline-block overflow-hidden align-bottom"><span class="gsap-word inline-block" style="will-change:transform">${w}&nbsp;</span></span>`,
        )
        .join("");

      gsap.fromTo(
        header.querySelectorAll(".gsap-word"),
        { yPercent: 105, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: header,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    // 3. Service cards cascade
    const serviceCards = gsap.utils.toArray<HTMLElement>(".gsap-service-card");
    if (serviceCards.length) {
      gsap.fromTo(
        serviceCards,
        { y: 80, opacity: 0, rotateX: -10 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: serviceCards[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // 4. Blog cards scale-in
    const blogCards = gsap.utils.toArray<HTMLElement>(".gsap-blog-card");
    if (blogCards.length) {
      gsap.fromTo(
        blogCards,
        { scale: 0.9, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "expo.out",
          scrollTrigger: {
            trigger: blogCards[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // 5. Stat cards lift-in with slight overshoot
    const statCards = gsap.utils.toArray<HTMLElement>(".gsap-stat");
    if (statCards.length) {
      gsap.fromTo(
        statCards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.18,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: statCards[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // 6. Parallax images
    gsap.utils.toArray<HTMLElement>(".gsap-parallax-img").forEach((el) => {
      const target = el.querySelector("img") ?? el;
      gsap.fromTo(
        target,
        { yPercent: -8, scale: 1.1 },
        {
          yPercent: 8,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
    });

    // 7. CTAs — subtle pop-in
    gsap.utils.toArray<HTMLElement>(".gsap-cta").forEach((el) => {
      gsap.fromTo(
        el,
        { scale: 0.85, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.6)",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    // Refresh ScrollTrigger once images/layout settle
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => clearTimeout(refreshTimer);
  }, { scope: scopeRef });

  return <div ref={scopeRef} style={{ display: "contents" }} />;
}
