"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type MotionMode = "full" | "reduced";

interface MotionPreferenceContextValue {
  motionMode: MotionMode;
  reducedMotion: boolean;
  isSystemPreference: boolean;
  toggleMotionMode: () => void;
}

const STORAGE_KEY = "motion-preference";
const MotionPreferenceContext = createContext<MotionPreferenceContextValue | null>(null);

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const [systemMode, setSystemMode] = useState<MotionMode>("full");
  const [overrideMode, setOverrideMode] = useState<MotionMode | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncSystemMode = () => {
      setSystemMode(mediaQuery.matches ? "reduced" : "full");
    };

    syncSystemMode();

    const storedMode = window.localStorage.getItem(STORAGE_KEY);
    if (storedMode === "full" || storedMode === "reduced") {
      setOverrideMode(storedMode);
    }

    mediaQuery.addEventListener("change", syncSystemMode);
    return () => mediaQuery.removeEventListener("change", syncSystemMode);
  }, []);

  const motionMode = overrideMode ?? systemMode;
  const reducedMotion = motionMode === "reduced";
  const isSystemPreference = overrideMode === null;

  useEffect(() => {
    document.documentElement.dataset.motionPreference = motionMode;
  }, [motionMode]);

  const toggleMotionMode = useCallback(() => {
    const nextMode: MotionMode = motionMode === "reduced" ? "full" : "reduced";
    setOverrideMode(nextMode);
    window.localStorage.setItem(STORAGE_KEY, nextMode);
  }, [motionMode]);

  const value = useMemo(
    () => ({
      motionMode,
      reducedMotion,
      isSystemPreference,
      toggleMotionMode,
    }),
    [motionMode, reducedMotion, isSystemPreference, toggleMotionMode]
  );

  return (
    <MotionPreferenceContext.Provider value={value}>
      {children}
    </MotionPreferenceContext.Provider>
  );
}

export function useMotionPreference() {
  const context = useContext(MotionPreferenceContext);

  if (!context) {
    throw new Error("useMotionPreference must be used within MotionPreferenceProvider");
  }

  return context;
}
