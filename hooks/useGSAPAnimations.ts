"use client";

import { useEffect } from "react";
import { useGSAP } from "@/lib/animations";
import { useIsAppReady } from "@/lib/providers/LoadingProvider";

export function useGSAPAnimations(initFunction: () => void) {
  const { isReady } = useIsAppReady();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useGSAP(() => {
    if (!isReady) return;
    initFunction();
  }, [isReady]);
}