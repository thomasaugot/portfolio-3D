"use client";

import { ReactNode } from "react";
import AppLoader from "@/components/ui/AppLoader";
import { useAppReady } from "@/hooks/useAppReady";

interface LoadingProviderProps {
  children: ReactNode;
  criticalSelectors?: string[];
}

export default function LoadingProvider({
  children,
  criticalSelectors,
}: LoadingProviderProps) {
  const { isReady, progress } = useAppReady({ criticalSelectors });

  return (
    <>
      {!isReady && <AppLoader progress={progress} />}
      {children}
    </>
  );
}