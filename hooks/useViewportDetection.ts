"use client";

import { useState, useEffect } from "react";

export function useViewportDetection() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isTabletSize = w >= 768 && w < 1024;
      setIsDesktop(w >= 1024 || (isTabletSize && w >= h));
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isDesktop;
}
