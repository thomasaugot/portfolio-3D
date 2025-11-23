"use client";

import { useEffect, useState } from "react";
import { waitForScenes, onSceneProgress } from "./useThreeScene";

interface UseAppReadyOptions {
  criticalScenes?: string[];
}

export function useAppReady(options: UseAppReadyOptions = {}) {
  const { criticalScenes = [] } = options;
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    const startTime = Date.now();
    const MIN_DURATION = 2500; // Minimum 2.5 seconds for scan + progress bar

    async function init() {
      try {
        // console.log("🚀 useAppReady: Starting init");
        setProgress(20);

        // Wait for fonts to be loaded
        // console.log("⏳ Waiting for fonts...");
        await document.fonts.ready;
        if (!mounted) return;
        // console.log("✅ Fonts ready");
        setProgress(40);

        // Wait for all stylesheets to be loaded
        // console.log("⏳ Waiting for stylesheets...");
        const styleSheets = Array.from(document.styleSheets);
        await Promise.all(
          styleSheets.map(async (sheet) => {
            if (sheet.href && !sheet.href.startsWith(window.location.origin)) {
              // External stylesheet, wait for it to load
              return new Promise<void>((resolve) => {
                const link = document.querySelector(`link[href="${sheet.href}"]`);
                if (link) {
                  if ((link as HTMLLinkElement).sheet) {
                    resolve();
                  } else {
                    link.addEventListener('load', () => resolve());
                    link.addEventListener('error', () => resolve());
                  }
                } else {
                  resolve();
                }
              });
            }
          })
        );
        if (!mounted) return;
        // console.log("✅ Stylesheets ready");
        setProgress(50);

        if (criticalScenes.length > 0) {
          // Subscribe to progress updates (50% to 90%)
          const unsubscribe = onSceneProgress((loaded, total) => {
            if (!mounted) return;
            const sceneProgress = 50 + (loaded / total) * 40;
            setProgress(Math.round(sceneProgress));
          });

          await waitForScenes(criticalScenes);
          unsubscribe();
          if (!mounted) return;
        }

        setProgress(90);

        // Wait for minimum duration to allow progress bar to fill smoothly
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_DURATION - elapsed);

        if (remainingTime > 0) {
          // Animate progress from 90 to 100 over remaining time
          const steps = 10;
          const stepTime = remainingTime / steps;
          for (let i = 0; i < steps; i++) {
            await new Promise((resolve) => setTimeout(resolve, stepTime));
            if (!mounted) return;
            setProgress(90 + ((i + 1) / steps) * 10);
          }
        } else {
          setProgress(100);
        }

        if (!mounted) return;

        // Small delay before marking ready
        await new Promise((resolve) => setTimeout(resolve, 200));
        if (mounted) {
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
  }, [criticalScenes]);

  return { isReady, progress };
}
