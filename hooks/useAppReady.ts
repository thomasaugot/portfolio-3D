"use client";

import { useEffect, useState, useRef } from "react";
import { waitForScenes, onSceneProgress } from "./useThreeScene";
import { debug } from "@/utils/debug";
import { preloadModels, getModelURLs, cleanupCache } from "@/utils/model-cache";

interface UseAppReadyOptions {
  criticalScenes?: string[];
  resetKey?: number; // When this changes, restart the loading process
}

// Maximum wait time to prevent infinite loading (30 seconds)
const MAX_LOAD_TIME = 30000;

export function useAppReady(options: UseAppReadyOptions = {}) {
  const { criticalScenes = [], resetKey = 0 } = options;
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel any previous running animation
    if (abortControllerRef.current) {
      debug.log("🛑 useAppReady: Aborting previous animation");
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Reset state IMMEDIATELY
    setIsReady(false);
    setProgress(0);

    // Cleanup expired cache entries on load
    cleanupCache();

    async function init() {
      const startTime = Date.now();

      try {
        const animateToProgress = async (target: number, duration: number) => {
          const current = await new Promise<number>((resolve) => {
            let val = 0;
            setProgress((prev) => {
              val = prev;
              return prev;
            });
            setTimeout(() => resolve(val), 0);
          });

          const steps = 5;
          const increment = (target - current) / steps;
          const stepTime = duration / steps;

          for (let i = 0; i < steps; i++) {
            if (abortController.signal.aborted) return;
            await new Promise((resolve) => setTimeout(resolve, stepTime));
            setProgress(Math.round(current + increment * (i + 1)));
          }
        };

        // Check if we've exceeded max load time
        const checkTimeout = () => Date.now() - startTime > MAX_LOAD_TIME;

        // STAGE 1: Fonts (0% → 20%)
        debug.log("📝 Stage 1: Loading fonts...");
        setProgress(5);
        await document.fonts.ready;
        await animateToProgress(20, 200);
        debug.log("✅ Fonts ready");

        if (abortController.signal.aborted) return;

        // STAGE 2: Stylesheets (20% → 35%)
        debug.log("🎨 Stage 2: Loading stylesheets...");
        await Promise.all(
          Array.from(document.styleSheets).map(async (sheet) => {
            if (sheet.href && !sheet.href.startsWith(window.location.origin)) {
              return new Promise<void>((resolve) => {
                const link = document.querySelector(`link[href="${sheet.href}"]`);
                if (link && !(link as HTMLLinkElement).sheet) {
                  link.addEventListener('load', () => resolve());
                  link.addEventListener('error', () => resolve());
                  setTimeout(resolve, 2000); // 2s timeout per stylesheet
                } else {
                  resolve();
                }
              });
            }
          })
        );
        await animateToProgress(35, 200);
        if (abortController.signal.aborted) return;

        // STAGE 3: Preload models into IndexedDB (35% → 55%)
        debug.log("📦 Stage 3: Preloading 3D models into cache...");
        if (!checkTimeout()) {
          await preloadModels(getModelURLs());
        }
        await animateToProgress(55, 300);
        if (abortController.signal.aborted) return;

        // STAGE 4: Wait for 3D scenes to be fully initialized (55% → 95%)
        if (criticalScenes.length > 0) {
          debug.log("🎬 Stage 4: Waiting for 3D scenes to initialize...", criticalScenes);

          // Subscribe to scene progress for granular updates
          const unsubscribe = onSceneProgress((loaded, total) => {
            if (total > 0) {
              const sceneProgress = 55 + Math.round((loaded / total) * 40);
              setProgress(Math.min(sceneProgress, 95));
            }
          });

          // Wait for scenes without timeout - they must be ready
          await Promise.race([
            waitForScenes(criticalScenes),
            new Promise((resolve) => setTimeout(resolve, MAX_LOAD_TIME - (Date.now() - startTime)))
          ]);

          unsubscribe();
          debug.log("✅ All critical 3D scenes ready");
        }
        await animateToProgress(95, 200);

        if (abortController.signal.aborted) return;

        // STAGE 5: Final preparation (95% → 100%)
        await animateToProgress(100, 200);

        if (abortController.signal.aborted) return;

        // Brief moment at 100% for visual feedback
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (!abortController.signal.aborted) {
          debug.log("🚀 App fully ready!");
          setIsReady(true);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        debug.error("❌ Init failed:", error);
        // Still show content on error but mark ready
        setProgress(100);
        setIsReady(true);
      }
    }

    init();

    return () => {
      abortController.abort();
    };
  }, [criticalScenes, resetKey]);

  return { isReady, progress };
}
