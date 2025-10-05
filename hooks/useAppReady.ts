"use client";

import { useEffect, useState } from "react";

interface UseAppReadyOptions {
  criticalSelectors?: string[];
}

export function useAppReady(options: UseAppReadyOptions = {}) {
  const { criticalSelectors = [] } = options;
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

        if (criticalSelectors.length > 0) {
          await new Promise<void>((resolve) => {
            const timeout = setTimeout(() => {
              console.warn("Critical elements timeout");
              resolve();
            }, 10000);

            const check = () => {
              const allReady = criticalSelectors.every((selector) => 
                document.querySelector(selector)
              );

              if (allReady) {
                clearTimeout(timeout);
                resolve();
              } else {
                requestAnimationFrame(check);
              }
            };

            check();
          });
        }

        if (!mounted) return;
        setProgress(90);

        await new Promise((resolve) => setTimeout(resolve, 300));
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
  }, []);

  return { isReady, progress };
}