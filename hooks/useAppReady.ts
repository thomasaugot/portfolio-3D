"use client";

import { useEffect, useState, useRef } from "react";
import { waitForScenes } from "./useThreeScene";
import { debug } from "@/utils/debug";

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
      debug.log("🛑 useAppReady: Aborting previous animation");
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Reset state IMMEDIATELY
    setIsReady(false);
    setProgress(0);

    async function init() {
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

        // STAGE 1: Fonts (0% → 30%)
        debug.log("📝 Stage 1: Loading fonts...");
        setProgress(5);
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 500)) // Quick animation even if fonts load fast
        ]);
        await animateToProgress(30, 300);
        debug.log("✅ Fonts ready");

        if (abortController.signal.aborted) return;

        // STAGE 2: Stylesheets (30% → 55%)
        debug.log("🎨 Stage 2: Loading stylesheets...");
        await Promise.race([
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
          ),
          new Promise((resolve) => setTimeout(resolve, 400))
        ]);
        await animateToProgress(55, 300);
        if (abortController.signal.aborted) return;

        // STAGE 3: 3D Scenes (55% → 90%)
        if (criticalScenes.length > 0) {
          debug.log("🎬 Stage 3: Loading 3D scenes...");
          await Promise.race([
            waitForScenes(criticalScenes),
            new Promise((resolve) => setTimeout(resolve, 600))
          ]);
          await animateToProgress(90, 400);
        } else {
          await animateToProgress(90, 500);
        }

        if (abortController.signal.aborted) return;

        // STAGE 4: Final preparation (90% → 100%)
        await animateToProgress(100, 300);

        if (abortController.signal.aborted) return;

        // Brief moment at 100%
        await new Promise((resolve) => setTimeout(resolve, 150));
        if (!abortController.signal.aborted) {
          setIsReady(true);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        debug.error("❌ Init failed:", error);
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
