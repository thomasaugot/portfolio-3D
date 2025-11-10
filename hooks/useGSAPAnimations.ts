"use client";

import { useGSAP } from "@/lib/animations";
import { useIsAppReady } from "@/lib/providers/LoadingProvider";

export function useGSAPAnimations(initFunction: () => void) {
  const { isReady } = useIsAppReady();

  // console.log("🎯 useGSAPAnimations hook - isReady:", isReady);

  useGSAP(() => {
    if (!isReady) {
      // console.log("⏸️ Not ready yet, skipping GSAP init");
      return;
    }

    // console.log("▶️ App is READY - Initializing GSAP animations");
    initFunction();
  }, [isReady]);
}