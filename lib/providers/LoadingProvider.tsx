"use client";

import { ReactNode, createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLoader from "@/components/ui/AppLoader";
import { useAppReady } from "@/hooks/useAppReady";

interface LoadingContextType {
  isReady: boolean;
  startTransition: (url: string, clickPosition?: { x: number; y: number }) => Promise<void>;
  isTransitioning: boolean;
  clickPosition: { x: number; y: number } | null;
}

const LoadingContext = createContext<LoadingContextType>({
  isReady: false,
  startTransition: async () => {},
  isTransitioning: false,
  clickPosition: null,
});

export const useIsAppReady = () => useContext(LoadingContext);
export const useTransition = () => useContext(LoadingContext);

const TRANSITION_STORAGE_KEY = "page-transition-state";

interface LoadingProviderProps {
  children: ReactNode;
  criticalScenes?: string[];
}

export default function LoadingProvider({
  children,
  criticalScenes = ["hero"],
}: LoadingProviderProps) {
  const router = useRouter();
  const [resetKey, setResetKey] = useState(0);
  const { isReady, progress } = useAppReady({ criticalScenes, resetKey });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [showContent, setShowContent] = useState(false); // Start hidden, show when ready
  const [loaderPhase, setLoaderPhase] = useState<'entering' | 'loading' | 'exiting' | null>('loading'); // Start with initial loading
  const pendingUrl = useRef<string | null>(null);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  // Initial page load - show loader until ready
  useEffect(() => {
    if (!hasInitiallyLoaded && isReady && progress >= 100) {
      console.log('[LoadingProvider] Initial load complete');
      setLoaderPhase('exiting');
      setHasInitiallyLoaded(true);
    }
  }, [isReady, progress, hasInitiallyLoaded]);

  // Clean up on mount
  useEffect(() => {
    sessionStorage.removeItem(TRANSITION_STORAGE_KEY);
  }, []);

  // When progress hits 100% AND page is ready, start exiting (for navigation transitions)
  useEffect(() => {
    if (hasInitiallyLoaded && progress >= 100 && isReady && loaderPhase === 'loading' && !showContent) {
      console.log('[LoadingProvider] Navigation complete, starting exit phase');
      setLoaderPhase('exiting');
    }
  }, [progress, isReady, loaderPhase, showContent, hasInitiallyLoaded]);

  const startTransition = useCallback((url: string, clickPos?: { x: number; y: number }) => {
    return new Promise<void>((resolve) => {
      const position = clickPos || { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      console.log('[LoadingProvider] Starting transition to:', url);

      // Reset state and hide content
      setShowContent(false);
      setIsTransitioning(true);
      setClickPosition(position);
      setLoaderPhase('entering');
      pendingUrl.current = url;

      resolve();
    });
  }, []);

  const handleEntranceComplete = useCallback(() => {
    console.log('[LoadingProvider] Entrance complete, navigating to:', pendingUrl.current);

    if (pendingUrl.current) {
      const url = pendingUrl.current;
      pendingUrl.current = null;

      // Change to loading phase and restart useAppReady
      setLoaderPhase('loading');
      setResetKey(prev => prev + 1); // This triggers useAppReady to restart

      // Navigate using Next.js router (client-side, no page reload)
      router.push(url);
    }
  }, [router]);

  const handleExitComplete = useCallback(() => {
    console.log('[LoadingProvider] Exit animation complete, showing content NOW');
    setShowContent(true);
    setIsTransitioning(false);
    setLoaderPhase(null);
  }, []);

  console.log('[LoadingProvider] Render - showContent:', showContent, 'isTransitioning:', isTransitioning, 'isReady:', isReady, 'loaderPhase:', loaderPhase, 'progress:', progress);

  return (
    <LoadingContext.Provider value={{
      isReady: showContent,
      startTransition,
      isTransitioning,
      clickPosition,
    }}>
      {/* Always render loader, just hide it when not needed */}
      <div style={{ display: loaderPhase ? 'block' : 'none' }}>
        <AppLoader
          progress={progress}
          phase={loaderPhase || 'loading'}
          onEntranceComplete={handleEntranceComplete}
          onExitComplete={handleExitComplete}
          clickPosition={clickPosition}
        />
      </div>

      <div
        style={{
          opacity: showContent ? 1 : 0,
          transition: showContent ? 'opacity 0.4s ease' : 'none',
          pointerEvents: showContent ? 'auto' : 'none',
        }}
      >
        {children}
      </div>
    </LoadingContext.Provider>
  );
}