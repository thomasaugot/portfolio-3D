"use client";

import { ReactNode, createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLoader from "@/components/ui/AppLoader";
import RouteTransition from "@/components/ui/RouteTransition";
import { useAppReady } from "@/hooks/useAppReady";
import { debug } from "@/utils/debug";

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
  const { isReady, progress } = useAppReady({ criticalScenes });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [loaderPhase, setLoaderPhase] = useState<'entering' | 'loading' | 'exiting' | null>('loading');
  const pendingUrl = useRef<string | null>(null);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  // Route transition state (fast wipe for navigation)
  const [routeTransitionActive, setRouteTransitionActive] = useState(false);

  // Initial page load - show full loader until ready
  useEffect(() => {
    if (!hasInitiallyLoaded && isReady && progress >= 100) {
      debug.log('[LoadingProvider] Initial load complete');
      setLoaderPhase('exiting');
      setHasInitiallyLoaded(true);
    }
  }, [isReady, progress, hasInitiallyLoaded]);

  // Clean up on mount
  useEffect(() => {
    sessionStorage.removeItem(TRANSITION_STORAGE_KEY);
  }, []);

  // Fast route transition for navigation (after initial load)
  const startTransition = useCallback((url: string, clickPos?: { x: number; y: number }) => {
    return new Promise<void>((resolve) => {
      const position = clickPos || { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      debug.log('[LoadingProvider] Starting fast route transition to:', url);

      setShowContent(false);
      setIsTransitioning(true);
      setClickPosition(position);
      setRouteTransitionActive(true);
      pendingUrl.current = url;

      resolve();
    });
  }, []);

  // Called at midpoint of animation - do the navigation
  const handleNavigate = useCallback(() => {
    debug.log('[LoadingProvider] Animation midpoint - navigating to:', pendingUrl.current);
    if (pendingUrl.current) {
      router.push(pendingUrl.current);
      pendingUrl.current = null;
    }
  }, [router]);

  // Called when full animation completes
  const handleTransitionComplete = useCallback(() => {
    debug.log('[LoadingProvider] Full transition complete');
    setShowContent(true);
    setIsTransitioning(false);
    setRouteTransitionActive(false);
  }, []);

  // Full loader handlers (for initial load only)
  const handleEntranceComplete = useCallback(() => {
    debug.log('[LoadingProvider] Full loader entrance complete');
    // This is only used for the initial load, which doesn't need entrance handling
  }, []);

  const handleExitComplete = useCallback(() => {
    debug.log('[LoadingProvider] Full loader exit complete, showing content');
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
      {/* Full loader - only for initial page load / refresh */}
      <div style={{ display: loaderPhase ? 'block' : 'none' }}>
        <AppLoader
          progress={progress}
          phase={loaderPhase || 'loading'}
          onEntranceComplete={handleEntranceComplete}
          onExitComplete={handleExitComplete}
        />
      </div>

      {/* Fast route transition - for client-side navigation */}
      <RouteTransition
        isActive={routeTransitionActive}
        onNavigate={handleNavigate}
        onComplete={handleTransitionComplete}
      />

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