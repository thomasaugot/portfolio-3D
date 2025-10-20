"use client";

import { useEffect, useState } from "react";
import { waitForScenes } from "./useThreeScene";

interface UseAppReadyOptions {
  criticalScenes?: string[];
}

export function useAppReady(options: UseAppReadyOptions = {}) {
  const { criticalScenes = [] } = options;
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        console.log("🚀 useAppReady: Starting init");
        setProgress(20);

        console.log("⏳ Waiting for fonts...");
        await document.fonts.ready;
        if (!mounted) return;
        console.log("✅ Fonts ready");
        setProgress(50);

        if (criticalScenes.length > 0) {
          console.log(`⏳ Waiting for scenes: ${criticalScenes.join(", ")}`);
          await waitForScenes(criticalScenes);
          if (!mounted) return;
          console.log("✅ All critical scenes loaded");
        }

        setProgress(90);

        console.log("⏳ Final delay (300ms)...");
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (!mounted) return;

        setProgress(100);
        console.log("⏳ Setting isReady in 200ms...");
        setTimeout(() => {
          if (mounted) {
            console.log("✅ APP IS READY!");
            setIsReady(true);
          }
        }, 200);
      } catch (error) {
        console.error("❌ Init failed:", error);
        if (mounted) setIsReady(true);
      }
    }

    init();

    return () => {
      console.log("🧹 useAppReady cleanup");
      mounted = false;
    };
  }, [criticalScenes]);

  return { isReady, progress };
}
