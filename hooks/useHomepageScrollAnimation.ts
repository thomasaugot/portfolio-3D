"use client";

import { initHeroScrollAnimation } from "@/utils/animations/hero-scroll-animation";
import { useEffect } from "react";

export function useHomepageScrollAnimation() {
  useEffect(() => {
    const cleanup = initHeroScrollAnimation();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);
}
