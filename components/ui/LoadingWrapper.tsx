"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import AppLoader from "@/components/ui/AppLoader";
import { useTranslationReady } from "@/hooks/useTranslationReady";
import { initializeGSAP } from "@/utils/animations/gsap-init";

export default function LoadingWrapper({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const translationsReady = useTranslationReady();
  const progressRef = useRef(0);

  useEffect(() => {
    const startTime = Date.now();
    const MINIMUM_LOAD_TIME = 2000;
    let progressInterval: NodeJS.Timeout;

    async function initialize() {
      try {
        // Start progress animation
        progressInterval = setInterval(() => {
          progressRef.current = Math.min(progressRef.current + 2, 95); // Never reach 100% until actually done
          setLoadingProgress(progressRef.current);
        }, 50);

        // Run initialization tasks
        await initializeGSAP();
        await document.fonts.ready;
        
        // Wait for translations
        while (!translationsReady) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        // All tasks completed - set progress to 95%
        progressRef.current = 95;
        setLoadingProgress(95);

        // Calculate remaining time to reach minimum
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MINIMUM_LOAD_TIME - elapsed);
        
        if (remaining > 0) {
          await new Promise(resolve => setTimeout(resolve, remaining));
        }

        // Complete progress bar
        clearInterval(progressInterval);
        setLoadingProgress(100);
        
        // Small delay to show 100% completion
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setIsLoading(false);
      } catch (error) {
        console.error("Initialization failed:", error);
        
        clearInterval(progressInterval);
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MINIMUM_LOAD_TIME - elapsed);
        if (remaining > 0) {
          await new Promise(resolve => setTimeout(resolve, remaining));
        }
        
        setLoadingProgress(100);
        setIsLoading(false);
      }
    }

    initialize();

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [translationsReady]);

  if (isLoading) {
    return <AppLoader progress={loadingProgress} />;
  }

  return <>{children}</>;
}