"use client";

import { ReactNode } from "react";
import AppLoader from "@/components/ui/AppLoader";
import { useAppReady } from "@/hooks/useAppReady";
import { initializeGSAP } from "@/utils/animations/gsap-init";

export default function LoadingWrapper({ children }: { children: ReactNode }) {
  const isReady = useAppReady([
    async () => initializeGSAP(),    // GSAP + ScrollTrigger init
    async () => { await document.fonts.ready; } // wait for fonts
  ]);

  if (!isReady) {
    return <AppLoader />;
  }

  return <>{children}</>;
}
