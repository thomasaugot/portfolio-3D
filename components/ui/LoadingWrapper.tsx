"use client";

import { ReactNode } from "react";
import AppLoader from "@/components/ui/AppLoader";
import { useAppReady } from "@/hooks/useAppReady";

export default function LoadingWrapper({ children }: { children: ReactNode }) {
  const { isReady, progress } = useAppReady();

  return (
    <>
      {!isReady && <AppLoader progress={progress} />}
      {children}
    </>
  );
}