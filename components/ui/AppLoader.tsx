"use client";

import { useEffect, useRef } from "react";
import { initLoaderAnimations } from "@/utils/animations/loader-animations";
import { useTheme } from "@/lib/providers/ThemeProvider";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { useTranslationReady } from "@/hooks/useTranslationReady";

interface AppLoaderProps {
  progress: number;
}

export default function AppLoader({ progress }: AppLoaderProps) {
  const { isLight } = useTheme();
  const loaderRef = useRef<HTMLDivElement>(null!);
  const { t } = useTranslation();
  const translationsReady = useTranslationReady();

  useEffect(() => {
    const cleanup = initLoaderAnimations(loaderRef, progress);
    return cleanup;
  }, [progress]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] h-screen w-screen flex flex-col items-center justify-center bg-black"
    >
      <div
        data-animate="loading-text"
        className="text-4xl md:text-5xl font-bold mb-8 text-text h-12"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {translationsReady && <span>{t("common.status.loading")}</span>}
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
