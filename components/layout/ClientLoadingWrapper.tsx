"use client";

import { ReactNode } from "react";
import LoadingProvider from "@/contexts/LoadingProvider";
import { useInputModality } from "@/hooks/useInputModality";

const criticalScenes = ["hero"];

interface ClientLoadingWrapperProps {
  children: ReactNode;
}

export default function ClientLoadingWrapper({ children }: ClientLoadingWrapperProps) {
  useInputModality();

  return (
    <LoadingProvider criticalScenes={criticalScenes}>
      {children}
    </LoadingProvider>
  );
}
