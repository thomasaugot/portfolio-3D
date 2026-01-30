"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import LoadingProvider from "@/contexts/LoadingProvider";

interface ClientLoadingWrapperProps {
  children: ReactNode;
}

export default function ClientLoadingWrapper({ children }: ClientLoadingWrapperProps) {
  const pathname = usePathname();

  const criticalScenes = useMemo(() => {
    // The hero scene (hex floor + laptop) must be ready before revealing the page
    return ["hero"];
  }, [pathname]);

  return (
    <LoadingProvider criticalScenes={criticalScenes}>
      {children}
    </LoadingProvider>
  );
}
