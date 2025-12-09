"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import LoadingProvider from "@/lib/providers/LoadingProvider";

interface ClientLoadingWrapperProps {
  children: ReactNode;
}

export default function ClientLoadingWrapper({ children }: ClientLoadingWrapperProps) {
  const pathname = usePathname();

  const criticalScenes = useMemo(() => {
    // Remove locale prefix to get the actual route
    const route = pathname.replace(/^\/(en|es|fr)/, '');

    if (route === '/portfolio') {
      return ['portfolio'];
    } else if (route === '/' || route === '') {
      // Both hero and projects scenes must be ready before showing homepage
      return ['hero', 'projects'];
    }

    // For other pages, no critical 3D scenes
    return [];
  }, [pathname]);

  return (
    <LoadingProvider criticalScenes={criticalScenes}>
      {children}
    </LoadingProvider>
  );
}
