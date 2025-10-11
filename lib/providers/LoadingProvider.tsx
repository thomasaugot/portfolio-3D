"use client";

import { ReactNode, createContext, useContext } from "react";
import AppLoader from "@/components/ui/AppLoader";
import { useAppReady } from "@/hooks/useAppReady";

interface LoadingContextType {
  isReady: boolean;
}

const LoadingContext = createContext<LoadingContextType>({ isReady: false });

export const useIsAppReady = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: ReactNode;
  criticalScenes?: string[];
}

export default function LoadingProvider({
  children,
  criticalScenes = ["hero"],
}: LoadingProviderProps) {
  const { isReady, progress } = useAppReady({ criticalScenes });

  return (
    <LoadingContext.Provider value={{ isReady }}>
      {!isReady && <AppLoader progress={progress} />}
      {children}
    </LoadingContext.Provider>
  );
}