"use client";

import { useEffect } from "react";
import { typewriter, loadingDots } from "@/utils/animations/tab-title-animation";

export const useTabTitleAnimation = (phrases: string[], isLoading: boolean = false) => {
  useEffect(() => {
    if (isLoading) {
      const loadingInterval = loadingDots();
      return () => clearInterval(loadingInterval);
    }
    
    if (phrases.length === 0) return;
    
    const interval = typewriter(phrases);
    
    return () => {
      clearInterval(interval);
      document.title = phrases[0];
    };
  }, [phrases, isLoading]);
};