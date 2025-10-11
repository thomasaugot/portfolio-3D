"use client";

import { useGSAP } from "@/lib/animations";
import { useIsAppReady } from "@/lib/providers/LoadingProvider";

export function useGSAPAnimations(initFunction: () => void) {
  const { isReady } = useIsAppReady();

  useGSAP(() => {
    if (!isReady) return;
    initFunction();
  }, [isReady]);
}