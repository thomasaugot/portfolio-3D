"use client";

import { useEffect, useRef } from "react";
import type { Stage } from "./useStageNavigation";

interface UseTouchNavigationOptions {
  stage: Stage;
  isMorphing: boolean;
  goToHero: () => void;
  goToAbout: () => void;
  goToProjects: () => void;
  goToContact: () => void;
  clearPromptStage: () => void;
}

const SECTIONS: Stage[] = ["hero", "about", "projects", "contact"];
const SWIPE_THRESHOLD = 120; // minimum px to count as swipe
const SWIPE_MAX_TIME = 350; // max ms for the swipe gesture

export function useTouchNavigation({
  stage,
  isMorphing,
  goToHero,
  goToAbout,
  goToProjects,
  goToContact,
  clearPromptStage,
}: UseTouchNavigationOptions) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastStepRef = useRef(0);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isTabletSize = w >= 768 && w < 1024;
    // Portrait tablets use mobile layout; landscape tablets use desktop
    const isMobile = w < 768 || (isTabletSize && h > w);
    if (!isMobile) return;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      if (isMorphing) {
        touchStartRef.current = null;
        return;
      }

      // Projects section has its own touch handling
      if (stage === "projects") {
        touchStartRef.current = null;
        return;
      }

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const elapsed = Date.now() - touchStartRef.current.time;
      touchStartRef.current = null;

      // If the swipe started inside a scrollable terminal body, let the terminal scroll handle it
      const terminalBody = document.querySelector("[data-terminal-body]") as HTMLElement | null;
      if (terminalBody) {
        const rect = terminalBody.getBoundingClientRect();
        const startX = touch.clientX - deltaX;
        const startY = touch.clientY - deltaY;
        if (
          startX >= rect.left &&
          startX <= rect.right &&
          startY >= rect.top &&
          startY <= rect.bottom
        ) {
          const canScrollUp = terminalBody.scrollTop > 0;
          const canScrollDown =
            terminalBody.scrollHeight - terminalBody.scrollTop - terminalBody.clientHeight > 1;
          const swipingUp = deltaY < 0;
          // If terminal can scroll in the swipe direction, let it handle the gesture
          if ((swipingUp && canScrollUp) || (!swipingUp && canScrollDown)) return;
        }
      }

      // Must be a clearly vertical swipe (at least 2x more vertical than horizontal)
      if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;
      if (Math.abs(deltaX) > Math.abs(deltaY) * 0.5) return;
      if (elapsed > SWIPE_MAX_TIME) return;

      // Cooldown check
      const now = performance.now();
      if (now - lastStepRef.current < 1200) return;
      lastStepRef.current = now;

      const direction = deltaY < 0 ? 1 : -1; // swipe up = next, swipe down = prev

      if (stage === "about") {
        const aboutMobilePage = document.documentElement.dataset.aboutMobilePage;

        if (direction === 1 && aboutMobilePage === "0") {
          clearPromptStage();
          window.dispatchEvent(new CustomEvent("aboutMobileAdvance"));
          return;
        }

        if (direction === -1 && aboutMobilePage === "1") {
          clearPromptStage();
          window.dispatchEvent(new CustomEvent("aboutMobileBack"));
          return;
        }
      }

      const currentIndex = SECTIONS.indexOf(stage);
      const nextIndex = currentIndex + direction;

      if (nextIndex >= 0 && nextIndex < SECTIONS.length) {
        const nextStage = SECTIONS[nextIndex];
        clearPromptStage();

        switch (nextStage) {
          case "hero":
            goToHero();
            break;
          case "about":
            goToAbout();
            break;
          case "projects":
            goToProjects();
            break;
          case "contact":
            goToContact();
            break;
        }
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [stage, isMorphing, goToHero, goToAbout, goToProjects, goToContact, clearPromptStage]);
}
