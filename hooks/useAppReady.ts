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
          // console.log(`⏳ Waiting for scenes: ${criticalScenes.join(", ")}`);
          await waitForScenes(criticalScenes);
          if (!mounted) return;
          // console.log("✅ All critical scenes loaded");
        }

        setProgress(90);

        // Add a delay to ensure all resources (fonts, scenes, etc.) are fully settled
        // console.log("⏳ Final stabilization delay (500ms)...");
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (!mounted) return;

        setProgress(100);
        // console.log("⏳ Setting isReady in 300ms...");
        setTimeout(() => {
          if (mounted) {
            // console.log("✅ APP IS READY!");
            setIsReady(true);
          }
        }, 300);
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
