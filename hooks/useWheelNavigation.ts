"use client";

import { useEffect, useRef } from "react";
import type { Stage } from "./useStageNavigation";

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
  const lastStepRef = useRef(0);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (isMorphing) return;
      if (stage === "projects") return;

      if (Math.abs(event.deltaY) < 5) return;

      const now = performance.now();
      if (now - lastStepRef.current < 800) return;
      lastStepRef.current = now;

      const direction = event.deltaY > 0 ? 1 : -1;

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
        clearPromptStage();
        const nextStage = SECTIONS[nextIndex];
        switch (nextStage) {
          case "hero": goToHero(); break;
          case "about": goToAbout(); break;
          case "projects": goToProjects(); break;
          case "contact": goToContact(); break;
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [stage, isMorphing, goToHero, goToAbout, goToProjects, goToContact, clearPromptStage]);
}
