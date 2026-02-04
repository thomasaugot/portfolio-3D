"use client";

import { useEffect } from "react";

/**
 * Reloads the page when the viewport crosses a layout breakpoint.
 * On device rotation: blacks out the screen immediately, waits for
 * the viewport to settle, then reloads cleanly.
 * On desktop resize: debounced category check.
 */
export function useViewportReload() {
  useEffect(() => {
    const getCategory = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isTabletSize = w >= 768 && w < 1024;
      if (w < 768) return "mobile";
      if (isTabletSize && h > w) return "tablet-portrait";
      if (isTabletSize) return "tablet-landscape";
      return "desktop";
    };

    const initialCategory = getCategory();
    let resizeTimeout: ReturnType<typeof setTimeout>;

    // On rotation: black out immediately, reload once viewport settles
    const handleOrientation = () => {
      document.documentElement.style.backgroundColor = "#1a1a1a";
      document.body.style.opacity = "0";
      document.body.style.transition = "none";
      setTimeout(() => window.location.reload(), 150);
    };

    // Desktop browser resize across breakpoints
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (getCategory() !== initialCategory) {
          window.location.reload();
        }
      }, 300);
    };

    screen.orientation?.addEventListener("change", handleOrientation);
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(resizeTimeout);
      screen.orientation?.removeEventListener("change", handleOrientation);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
}
