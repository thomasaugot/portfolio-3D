"use client";

import { useEffect, useRef, useState } from "react";
import { initLoaderAnimations } from "@/utils/animations/loader-animations";
import { useTheme } from "@/lib/providers/ThemeProvider";

interface AppLoaderProps {
  progress: number;
}

const loadingTexts: Record<string, string> = {
  en: "Loading",
  fr: "Chargement",
  es: "Cargando",
};

export default function AppLoader({ progress }: AppLoaderProps) {
  const { isLight } = useTheme();
  const loaderRef = useRef<HTMLDivElement>(null!);
  const [loadingText, setLoadingText] = useState("Loading");

  useEffect(() => {
    const detectedLang =
      typeof window !== "undefined"
        ? navigator.language.slice(0, 2)
        : "en";
    
    setLoadingText(loadingTexts[detectedLang] || loadingTexts.en);
  }, []);

  useEffect(() => {
    const cleanup = initLoaderAnimations(loaderRef, progress);
    return cleanup;
  }, [progress]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] h-screen w-screen flex flex-col items-center justify-center bg-bg"
    >
      <div
        data-animate="loading-text"
        className="text-4xl md:text-5xl font-bold mb-8 text-text"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {loadingText}
      </div>

      <div className="w-60 md:w-80 h-1 overflow-hidden rounded-full bg-border">
        <div
          data-animate="progress-bar"
          className="h-full gradient-primary rounded-full w-0"
        />
      </div>

      <div className="mt-6 text-lg text-text" data-animate="percentage">
        0%
      </div>
    </div>
  );
}