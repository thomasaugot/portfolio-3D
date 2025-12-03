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
  const [ignoreReadyState, setIgnoreReadyState] = useState(false);
  const [overrideProgress, setOverrideProgress] = useState<number | null>(null);
  const { isReady, progress: actualProgress } = useAppReady({ criticalScenes, resetKey });

  // Use override if set, otherwise use actual progress
  const progress = overrideProgress !== null ? overrideProgress : actualProgress;

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

  // Clear ignore flag once we see progress has reset
  useEffect(() => {
    if (ignoreReadyState && actualProgress > 0 && actualProgress < 10) {
      console.log('[LoadingProvider] Progress reset detected, re-enabling exit condition');
      setIgnoreReadyState(false);
    }
  }, [ignoreReadyState, actualProgress]);

  // Clear override once actual progress starts
  useEffect(() => {
    if (overrideProgress !== null && actualProgress > 0) {
      console.log('[LoadingProvider] Clearing progress override, actual progress:', actualProgress);
      setOverrideProgress(null);
    }
  }, [overrideProgress, actualProgress]);

  // When progress hits 100% AND page is ready, start exiting (for navigation transitions)
  useEffect(() => {
    // Ignore stale state from previous navigation
    if (ignoreReadyState) {
      console.log('[LoadingProvider] Ignoring stale ready state - progress:', progress, 'isReady:', isReady);
      return;
    }

    if (hasInitiallyLoaded && progress === 100 && isReady && loaderPhase === 'loading' && !showContent) {
      console.log('[LoadingProvider] Navigation complete (progress:', progress, 'isReady:', isReady, '), starting exit phase');
      setLoaderPhase('exiting');
    }
  }, [progress, isReady, loaderPhase, showContent, hasInitiallyLoaded, ignoreReadyState]);

  const startTransition = useCallback((url: string, clickPos?: { x: number; y: number }) => {
    return new Promise<void>((resolve) => {
      const position = clickPos || { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      console.log('[LoadingProvider] Starting transition to:', url);

      // FORCE progress to 0 immediately to prevent flash of old progress
      setOverrideProgress(0);

      // Reset ALL state and hide content
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

      // CRITICAL: Keep progress at 0 during phase transition
      console.log('[LoadingProvider] Forcing progress override to 0 before loading phase');
      setOverrideProgress(0);

      // CRITICAL: Ignore stale isReady/progress state until reset
      console.log('[LoadingProvider] Setting ignoreReadyState = true to prevent premature exit');
      setIgnoreReadyState(true);

      // Change to loading phase and restart useAppReady
      setLoaderPhase('loading');
      setResetKey(prev => prev + 1);

      // Navigate using Next.js router (client-side, no page reload)
      router.push(url);
    }
  }, [router]);

  const handleExitComplete = useCallback(() => {
    console.log('[LoadingProvider] Exit complete, showing content');
    setShowContent(true);
    setIsTransitioning(false);
    setLoaderPhase(null);
  }, []);

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
          transition: showContent ? 'opacity 0.3s ease' : 'none',
          pointerEvents: showContent ? 'auto' : 'none',
        }}
      >
        {children}
      </div>
    </LoadingContext.Provider>
  );
}