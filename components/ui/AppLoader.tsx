"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useTranslation } from "@/hooks/useTranslation";
import { initLoaderAnimations } from "@/utils/animations/loader-animations";

interface AppLoaderProps {
  progress?: number;
}

export default function AppLoader({ progress = 0 }: AppLoaderProps) {
  const { isLight } = useTheme();
  const { t } = useTranslation();
  const loaderRef: any = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanup = initLoaderAnimations(loaderRef, progress);
    return cleanup;
  }, [progress]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] h-screen w-screen flex flex-col items-center justify-center bg-bg"
    >
      {/* Floating elements for light mode */}
      {isLight && (
        <>
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
          <div
            className="absolute bottom-32 right-16 w-80 h-80 rounded-full bg-secondary/5 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </>
      )}

      <div
        data-animate="loading-text"
        className="text-4xl md:text-5xl font-bold mb-8 text-text"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {t('common.loading')}
      </div>

      <div className="w-60 md:w-80 h-1 overflow-hidden rounded-full bg-border">
        <div
          data-animate="progress-bar"
          className="h-full gradient-primary rounded-full transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-6 text-lg text-text" data-animate="percentage">
        {Math.round(progress)}%
      </div>
    </div>
  );
}