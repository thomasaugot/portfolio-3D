"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ResourceLoader } from "@/services/resource-loader";
import { loadGSAP } from "@/services/loaders/gsap-loader";
import { loadThreeJS } from "@/services/loaders/three-loader";
import { waitForDOMPaint } from "@/services/loaders/dom-loader";
import { waitForHeroReady } from "@/services/loaders/hero-loader";
import { createTranslationLoader } from "@/services/loaders/translation-loader";
import { waitForFonts } from "@/services/loaders/fonts-loader";

let globalIsReady = false;

export function isAppReady() {
  return globalIsReady;
}

export function useAppReady() {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  useEffect(() => {
    let mounted = true;
    const MINIMUM_LOAD_TIME = 2000;

    async function loadAll() {
      try {
        console.log("🚀 Starting app initialization...");
        const startTime = Date.now();

        const loader = new ResourceLoader();

        loader.onProgress((prog) => {
          if (mounted) {
            setProgress(prog);
          }
        });

        loader.addTask("GSAP", loadGSAP, 1);
        loader.addTask("Three.js", loadThreeJS, 2);
        loader.addTask("Fonts", waitForFonts, 1);
        loader.addTask(
          "Translations",
          createTranslationLoader(locale, ["common", "hero", "skills"]),
          1
        );
        loader.addTask("DOM Paint", waitForDOMPaint, 1);
        loader.addTask("Hero Container", waitForHeroReady, 2);

        await loader.loadAll();

        console.log("📋 All resources loaded");

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MINIMUM_LOAD_TIME - elapsed);

        if (remaining > 0) {
          console.log(
            `⏳ Waiting additional ${remaining}ms to meet minimum load time`
          );
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }

        await new Promise((resolve) => setTimeout(resolve, 200));

        console.log("✨ App ready!");

        if (mounted) {
          globalIsReady = true;
          setIsReady(true);
        }
      } catch (error) {
        console.error("❌ App initialization failed:", error);

        if (mounted) {
          globalIsReady = true;
          setIsReady(true);
        }
      }
    }

    loadAll();

    return () => {
      mounted = false;
    };
  }, [locale]);

  return { isReady, progress };
}