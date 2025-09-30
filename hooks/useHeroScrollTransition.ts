// hooks/useHeroScrollTransition.ts
import { useEffect } from "react";
import { initHeroScrollTransition } from "@/utils/animations/hero-scroll-transition";

export function useHeroScrollTransition() {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const cleanup = initHeroScrollTransition();
      
      return () => {
        cleanup?.();
      };
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);
}