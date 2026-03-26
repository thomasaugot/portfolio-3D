"use client";

import { ReactNode, createContext, useContext, useState, useCallback } from "react";
import { debug } from "@/utils/debug";
import { useAppReady } from "@/hooks/useAppReady";

interface LoadingContextType {
  isReady: boolean;
  progress: number;
  startTransition: (url: string, clickPosition?: { x: number; y: number }) => Promise<void>;
  isTransitioning: boolean;
  clickPosition: { x: number; y: number } | null;
}

const LoadingContext = createContext<LoadingContextType>({
  isReady: false,
  progress: 0,
  startTransition: async () => {},
  isTransitioning: false,
  clickPosition: null,
});

export const useIsAppReady = () => useContext(LoadingContext);
export const useTransition = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: ReactNode;
  criticalScenes?: string[];
}

export default function LoadingProvider({ children, criticalScenes = ["hero"] }: LoadingProviderProps) {
  const { isReady, progress } = useAppReady({ criticalScenes });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);

  const startTransition = useCallback((url: string, clickPos?: { x: number; y: number }) => {
    return new Promise<void>((resolve) => {
      const position = clickPos || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      debug.log("[LoadingProvider] Starting fast route transition to:", url);
      setIsTransitioning(true);
      setClickPosition(position);
      resolve();
    });
  }, []);

  return (
    <LoadingContext.Provider value={{ isReady, progress, startTransition, isTransitioning, clickPosition }}>
      <div style={{ opacity: 1, transition: "none", pointerEvents: isTransitioning ? "none" : "auto" }}>
        {children}
      </div>
    </LoadingContext.Provider>
  );
}
