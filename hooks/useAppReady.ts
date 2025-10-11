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
        setProgress(20);

        await document.fonts.ready;
        if (!mounted) return;
        setProgress(50);

        if (criticalScenes.length > 0) {
          await waitForScenes(criticalScenes);
          if (!mounted) return;
        }

        setProgress(90);

        await new Promise(resolve => setTimeout(resolve, 300));
        if (!mounted) return;

        setProgress(100);
        setTimeout(() => {
          if (mounted) setIsReady(true);
        }, 200);
      } catch (error) {
        console.error("Init failed:", error);
        if (mounted) setIsReady(true);
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [criticalScenes]);

  return { isReady, progress };
}