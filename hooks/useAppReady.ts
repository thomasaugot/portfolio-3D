"use client";

import { useEffect, useState, useRef } from "react";
import { waitForScenes } from "./useThreeScene";

interface UseAppReadyOptions {
  criticalScenes?: string[];
  resetKey?: number; // When this changes, restart the loading process
}

export function useAppReady(options: UseAppReadyOptions = {}) {
  const { criticalScenes = [], resetKey = 0 } = options;
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel any previous running animation
    if (abortControllerRef.current) {
      console.log("🛑 useAppReady: Aborting previous animation");
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const MIN_DURATION = 3400;

    console.log("🚀 useAppReady: Starting new animation, resetKey:", resetKey);

    // Reset state IMMEDIATELY
    setIsReady(false);
    setProgress(0);

    async function init() {
      try {
        console.log("🚀 useAppReady: Starting init loop");

        // Start background tasks (don't wait for them)
        Promise.all([
          document.fonts.ready,
          Promise.all(
            Array.from(document.styleSheets).map(async (sheet) => {
              if (sheet.href && !sheet.href.startsWith(window.location.origin)) {
                return new Promise<void>((resolve) => {
                  const link = document.querySelector(`link[href="${sheet.href}"]`);
                  if (link && !(link as HTMLLinkElement).sheet) {
                    link.addEventListener('load', () => resolve());
                    link.addEventListener('error', () => resolve());
                  } else {
                    resolve();
                  }
                });
              }
            })
          )
        ]);

        if (criticalScenes.length > 0) {
          waitForScenes(criticalScenes);
        }

        // Animate progress in 3% increments from 0 to 100 over MIN_DURATION
        const steps = 34; // 3% increments (3, 6, 9... 99, 100)
        const stepTime = MIN_DURATION / steps;

        for (let i = 0; i < steps; i++) {
          if (abortController.signal.aborted) {
            console.log("⚠️ useAppReady: Animation aborted at", (i + 1) * 3, "%");
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, stepTime));
          const newProgress = Math.min((i + 1) * 3, 100);
          setProgress(newProgress);
        }

        if (abortController.signal.aborted) return;

        // Wait at 100% to ensure new page content is rendered
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (!abortController.signal.aborted) {
          console.log("✅ useAppReady: Complete - marking ready");
          setIsReady(true);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log("⚠️ useAppReady: Aborted");
          return;
        }
        console.error("❌ Init failed:", error);
        setIsReady(true);
      }
    }

    init();

    return () => {
      console.log("🧹 useAppReady cleanup");
      abortController.abort();
    };
  }, [criticalScenes, resetKey]);

  return { isReady, progress };
}
