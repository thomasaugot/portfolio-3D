"use client";

import { ReactNode } from "react";
import AppLoader from "@/components/ui/AppLoader";
import { useAppReady } from "@/hooks/useAppReady";
import { useTranslationReady } from "@/hooks/useTranslationReady";
import { initializeGSAP } from "@/utils/animations/gsap-init";

export default function LoadingWrapper({ children }: { children: ReactNode }) {
  const translationsReady = useTranslationReady();
  
  const isReady = useAppReady([
    async () => initializeGSAP(),
    async () => { await document.fonts.ready; },
    async () => {
      // Wait for translations to be ready
      return new Promise<void>((resolve) => {
        if (translationsReady) {
          resolve();
        } else {
          const interval = setInterval(() => {
            if (translationsReady) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        }
      });
    }
  ]);

  if (!isReady) {
    return <AppLoader />;
  }

  return <>{children}</>;
}