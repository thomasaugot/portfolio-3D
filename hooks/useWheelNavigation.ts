"use client";

import { useEffect, useRef } from "react";
import type { Stage } from "@/hooks/useStageNavigation";

interface UseWheelNavigationOptions {
  stage: Stage;
  isMorphing: boolean;
  goToHero: () => void;
  goToAbout: () => void;
  goToProjects: () => void;
  goToContact: () => void;
  clearPromptStage: () => void;
}

const SECTIONS: Stage[] = ["hero", "about", "projects", "contact"];

export function useWheelNavigation({
  stage,
  isMorphing,
  goToHero,
  goToAbout,
  goToProjects,
  goToContact,
  clearPromptStage,
}: UseWheelNavigationOptions) {
  const scrollAccumulatorRef = useRef(0);
  const lastStepRef = useRef(0);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDirectionRef = useRef(0);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      // Don't handle scroll during morphing transitions
      if (isMorphing) return;

      // Projects section has its own scroll handling
      if (stage === "projects") return;

      // If scrolling inside a scrollable terminal body, let it scroll instead
      const terminalBody = document.querySelector("[data-terminal-body]") as HTMLElement | null;
      if (terminalBody && terminalBody.contains(event.target as Node)) {
        const canScrollUp = terminalBody.scrollTop > 0;
        const canScrollDown =
          terminalBody.scrollHeight - terminalBody.scrollTop - terminalBody.clientHeight > 1;
        if ((event.deltaY < 0 && canScrollUp) || (event.deltaY > 0 && canScrollDown)) return;
      }

      const delta = event.deltaY;
      if (Math.abs(delta) < 18) return;

      scrollAccumulatorRef.current += delta;
      pendingDirectionRef.current = scrollAccumulatorRef.current > 0 ? 1 : -1;

      const threshold = event.deltaMode === 1 ? 12 : 200;

      if (scrollTimeoutRef.current) return;
      scrollTimeoutRef.current = setTimeout(() => {
        const now = performance.now();
        const minDelay = 800; // Prevent rapid section changes
        const direction = pendingDirectionRef.current || 1;

        if (Math.abs(scrollAccumulatorRef.current) < threshold) {
          scrollAccumulatorRef.current = 0;
          pendingDirectionRef.current = 0;
          scrollTimeoutRef.current = null;
          return;
        }

        if (now - lastStepRef.current < minDelay) {
          scrollAccumulatorRef.current = 0;
          pendingDirectionRef.current = 0;
          scrollTimeoutRef.current = null;
          return;
        }

        scrollAccumulatorRef.current = 0;
        pendingDirectionRef.current = 0;
        lastStepRef.current = now;
        scrollTimeoutRef.current = null;

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

        // Navigate between sections based on scroll direction
        const currentIndex = SECTIONS.indexOf(stage);
        const nextIndex = currentIndex + direction;

        if (nextIndex >= 0 && nextIndex < SECTIONS.length) {
          const nextStage = SECTIONS[nextIndex];

          // Clear prompt state when scrolling
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
      }, 100);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [stage, isMorphing, goToHero, goToAbout, goToProjects, goToContact, clearPromptStage]);
}
