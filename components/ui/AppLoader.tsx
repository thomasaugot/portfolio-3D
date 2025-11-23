"use client";

import { useEffect, useRef, useState } from "react";
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
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    // Minimum duration for scan effect
    const timer = setTimeout(() => {
      setScanComplete(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!scanComplete) return;
    const cleanup = initLoaderAnimations(loaderRef, progress);
    return cleanup;
  }, [progress, scanComplete]);

  return (
    <>
      <style jsx>{`
        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            var(--primary-color) 50%,
            transparent 100%
          );
          box-shadow: 0 0 30px var(--primary-color), 0 0 60px var(--primary-color);
          animation: scan 0.8s ease-in-out forwards;
        }
        .content-hidden {
          opacity: 0;
          transform: scale(0.95);
        }
        .content-visible {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes scan {
          from {
            left: 0;
          }
          to {
            left: 100%;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      <div
        ref={loaderRef}
        className="fixed inset-0 z-[99999] h-screen w-screen flex flex-col items-center justify-center bg-black overflow-hidden"
      >
        {/* Scan line */}
        {!scanComplete && <div className="scan-line" />}

        {/* Content appears after scan */}
        {scanComplete && (
          <div className="flex flex-col items-center content-visible">
            <div
              data-animate="loading-text"
              className="title-section mb-8 text-text h-12"
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

            <div className="mt-6 subtitle text-text" data-animate="percentage">
              0%
            </div>
          </div>
        )}
      </div>
    </>
  );
}
