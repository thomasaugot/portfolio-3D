"use client";

import { useEffect, useState } from "react";
import { waitForScenes, onSceneProgress } from "./useThreeScene";

interface UseAppReadyOptions {
  criticalScenes?: string[];
  resetKey?: number; // When this changes, restart the loading process
}

export function useAppReady(options: UseAppReadyOptions = {}) {
  const { criticalScenes = [], resetKey = 0 } = options;
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    const startTime = Date.now();
    const MIN_DURATION = 2000; // Minimum 2.8 seconds for progressive loading

    async function init() {
      try {
        console.log("🚀 useAppReady: Starting init, resetKey:", resetKey);

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

        // Animate progress smoothly from 0 to 100 over MIN_DURATION
        const steps = 50;
        const stepTime = MIN_DURATION / steps;

        for (let i = 0; i < steps; i++) {
          await new Promise((resolve) => setTimeout(resolve, stepTime));
          if (!mounted) return;
          const newProgress = Math.round(((i + 1) / steps) * 100);
          setProgress(newProgress);
        }

        if (!mounted) return;

        // Small delay at 100% before marking ready
        await new Promise((resolve) => setTimeout(resolve, 150));
        if (mounted) {
          console.log("✅ useAppReady: Complete");
          setIsReady(true);
        }
      } catch (error) {
        console.error("❌ Init failed:", error);
        if (mounted) setIsReady(true);
      }
    }

    init();

    return () => {
      // console.log("🧹 useAppReady cleanup");
      mounted = false;
    };
  }, [criticalScenes, resetKey]);

  return { isReady, progress };
}
