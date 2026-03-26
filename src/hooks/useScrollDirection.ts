"use client";
import { useState, useEffect, useRef, useCallback } from "react";

interface ScrollInfo {
  scrollDirection: "up" | "down";
  scrollY: number;
  isAtTop: boolean;
}

export function useScrollDirection(threshold: number = 10): ScrollInfo {
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    scrollDirection: "up",
    scrollY: 0,
    isAtTop: true,
  });

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollInfo = useCallback(() => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY.current;

    if (Math.abs(delta) > threshold) {
      setScrollInfo({
        scrollDirection: delta > 0 ? "down" : "up",
        scrollY: currentScrollY,
        isAtTop: currentScrollY < 10,
      });
      lastScrollY.current = currentScrollY;
    } else {
      // Still update position and isAtTop even if direction didn't change
      setScrollInfo((prev) => ({
        ...prev,
        scrollY: currentScrollY,
        isAtTop: currentScrollY < 10,
      }));
    }

    ticking.current = false;
  }, [threshold]);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(updateScrollInfo);
      }
    };

    // Initialize with current scroll position
    lastScrollY.current = window.scrollY;
    setScrollInfo({
      scrollDirection: "up",
      scrollY: window.scrollY,
      isAtTop: window.scrollY < 10,
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [updateScrollInfo]);

  return scrollInfo;
}
