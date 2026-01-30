"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import {
  ensureTerminalFixed,
  animateTerminalToCorner,
  animateTerminalCenter,
  animateTerminalSlideLeft,
  animateTerminalExit,
  fadeHeroVisual,
  showOverlay,
  hideOverlay,
} from "@/utils/animations/gsap/section-transitions";

export type Stage = "hero" | "about" | "projects" | "contact";
export type PromptStage = "more" | "work" | "contact" | null;

interface UseSectionNavigationProps {
  projectCount: number;
  translations: {
    processingPortfolio: string;
  };
}

interface SectionRefs {
  about: HTMLElement | null;
  projects: HTMLElement | null;
  contact: HTMLElement | null;
}

export function useSectionNavigation({
  projectCount,
  translations,
}: UseSectionNavigationProps) {
  const [stage, setStage] = useState<Stage>("hero");
  const [promptStage, setPromptStage] = useState<PromptStage>("more");
  const [activeProject, setActiveProject] = useState(0);
  const [terminalStatus, setTerminalStatus] = useState<string | null>(null);

  const sectionsRef = useRef<SectionRefs>({
    about: null,
    projects: null,
    contact: null,
  });
  const wheelLockRef = useRef(false);
  const wheelDeltaRef = useRef(0);

  // Initialize section refs
  useEffect(() => {
    sectionsRef.current.about = document.querySelector(
      "[data-about-section]"
    ) as HTMLElement | null;
    sectionsRef.current.projects = document.querySelector(
      "[data-canvas-projects]"
    ) as HTMLElement | null;
    sectionsRef.current.contact = document.querySelector(
      "#contact"
    ) as HTMLElement | null;

    // Set initial states for all overlays
    Object.values(sectionsRef.current).forEach((section) => {
      if (section) {
        gsap.set(section, {
          position: "fixed",
          inset: 0,
          autoAlpha: 0,
          pointerEvents: "none",
          zIndex: 20,
        });
      }
    });
  }, []);

  // Handle "Yes" response to prompts
  const handlePromptYes = useCallback(() => {
    const { about, projects, contact } = sectionsRef.current;

    if (promptStage === "more") {
      setPromptStage(null);
      setStage("about");
      animateTerminalToCorner();
      fadeHeroVisual();
      showOverlay(about, "right");
      return;
    }

    if (promptStage === "work") {
      setPromptStage(null);
      setTerminalStatus(translations.processingPortfolio);
      animateTerminalCenter();
      hideOverlay(about, "left");

      setTimeout(() => {
        setStage("projects");
        animateTerminalSlideLeft();
        showOverlay(projects, "right");
        setActiveProject(-1);
        setTerminalStatus(null);
      }, 700);
      return;
    }

    if (promptStage === "contact") {
      setPromptStage(null);
      setStage("contact");
      animateTerminalExit();
      hideOverlay(projects, "right");
      showOverlay(contact, "up");
    }
  }, [promptStage, translations.processingPortfolio]);

  // Handle "No" response to prompts
  const handlePromptNo = useCallback(() => {
    setPromptStage(null);
  }, []);

  // Handle "See Work" button from About section
  const handleAboutSeeWork = useCallback(() => {
    if (stage !== "about") return;

    const { about, projects } = sectionsRef.current;

    setPromptStage(null);
    setTerminalStatus(translations.processingPortfolio);
    hideOverlay(about, "left");
    animateTerminalCenter();

    setTimeout(() => {
      setStage("projects");
      animateTerminalSlideLeft();
      showOverlay(projects, "right");
      setActiveProject(-1);
      setTerminalStatus(null);
    }, 700);
  }, [stage, translations.processingPortfolio]);

  // Wheel navigation handler
  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();

      // In about stage, scroll triggers work prompt
      if (stage === "about" && promptStage === null) {
        if (Math.abs(event.deltaY) < 15) return;
        animateTerminalCenter();
        setPromptStage("work");
        return;
      }

      // In projects stage, navigate between projects
      if (stage !== "projects" || promptStage !== null) return;

      wheelDeltaRef.current += event.deltaY;
      if (wheelLockRef.current) return;
      if (Math.abs(wheelDeltaRef.current) < 50) return;

      const direction = wheelDeltaRef.current > 0 ? 1 : -1;
      wheelDeltaRef.current = 0;
      wheelLockRef.current = true;

      const nextIndex = Math.max(
        -1,
        Math.min(projectCount - 1, activeProject + direction)
      );

      if (nextIndex !== activeProject) {
        setActiveProject(nextIndex);
      } else if (activeProject === projectCount - 1 && direction > 0) {
        // Last project, show contact prompt
        animateTerminalCenter();
        setPromptStage("contact");
        if (sectionsRef.current.projects) {
          gsap.set(sectionsRef.current.projects, { pointerEvents: "none" });
        }
      }

      setTimeout(() => {
        wheelLockRef.current = false;
      }, 400);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [activeProject, promptStage, projectCount, stage]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (promptStage === null) return;

      if (event.key === "Enter" || event.key === "y" || event.key === "Y") {
        event.preventDefault();
        handlePromptYes();
      }

      if (event.key === "Escape" || event.key === "n" || event.key === "N") {
        event.preventDefault();
        handlePromptNo();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [promptStage, handlePromptYes, handlePromptNo]);

  // Ensure terminal z-index during contact prompt
  useEffect(() => {
    if (promptStage !== "contact") return;

    const terminal = ensureTerminalFixed();
    if (terminal) {
      gsap.set(terminal, { zIndex: 80, pointerEvents: "auto" });
    }
    if (sectionsRef.current.projects) {
      gsap.set(sectionsRef.current.projects, { pointerEvents: "none", zIndex: 10 });
    }
  }, [promptStage]);

  return {
    stage,
    promptStage,
    activeProject,
    terminalStatus,
    handlePromptYes,
    handlePromptNo,
    handleAboutSeeWork,
  };
}
