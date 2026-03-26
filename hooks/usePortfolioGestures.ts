"use client";

import { useRef, useCallback } from "react";

export function usePortfolioGestures() {
  const lastStartActivationRef = useRef(0);
  const touchStartRef = useRef<{ y: number; time: number } | null>(null);

  const triggerStart = useCallback(() => {
    (window as Window & { __portfolioPendingStart?: boolean }).__portfolioPendingStart = true;
    window.dispatchEvent(new CustomEvent("portfolioStartRequested"));
  }, []);

  const activateStart = useCallback(() => {
    const now = Date.now();
    if (now - lastStartActivationRef.current < 400) return;
    lastStartActivationRef.current = now;
    triggerStart();
  }, [triggerStart]);

  const handleStartButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    activateStart();
  }, [activateStart]);

  const handleStartButtonTouchEnd = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    activateStart();
  }, [activateStart]);

  const handleStartButtonPointerUp = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "touch") return;
    e.preventDefault();
    e.stopPropagation();
    activateStart();
  }, [activateStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { y: e.touches[0].clientY, time: Date.now() };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaY = touchStartRef.current.y - e.changedTouches[0].clientY;
    const elapsed = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;
    if (deltaY > 30 && elapsed < 1000) triggerStart();
  }, [triggerStart]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.deltaY <= 0 || Math.abs(e.deltaY) < 5) return;
    activateStart();
  }, [activateStart]);

  return {
    handleStartButtonClick,
    handleStartButtonTouchEnd,
    handleStartButtonPointerUp,
    handleTouchStart,
    handleTouchEnd,
    handleWheel,
  };
}
