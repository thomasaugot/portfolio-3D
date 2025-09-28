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
      <div
        data-animate="loading-text"
        className="text-4xl md:text-5xl font-bold mb-8 text-text"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {t("common.loading")}
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
