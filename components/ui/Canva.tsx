"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import Background from "@/components/ui/Background";
import Terminal from "@/components/ui/Terminal";
import { useTranslation } from "@/contexts/TranslationProvider";
import {
  morphToAbout,
  morphToProjects,
  morphToContact,
  morphToHeroFromAny,
} from "@/utils/animations/terminal-morph";
import { getAllProjects } from "@/data/projects";

type Stage = "hero" | "about" | "projects" | "contact";
type PromptStage = "more" | "work" | "contact" | null;

interface CanvaController {
  projects: ReturnType<typeof getAllProjects>;
  stage: Stage;
  promptStage: PromptStage;
  promptLabel?: string;
  statusMessage: string | null;
  heroReady: boolean;
  setHeroReady: (ready: boolean) => void;
  isMorphing: boolean;
  setIsMorphing: (value: boolean) => void;
  handlePromptYes: () => void;
  handlePromptNo: () => void;
  handleBootComplete: () => void;
  handleAboutSeeWork: () => void;
  handleBackToTop: () => void;
  goToHero: () => void;
  goToAbout: () => void;
  goToProjects: () => void;
  goToContact: () => void;
}

const CanvaContext = createContext<CanvaController | null>(null);

export function useCanva() {
  const ctx = useContext(CanvaContext);
  if (!ctx) {
    throw new Error("useCanva must be used within Canva");
  }
  return ctx;
}

interface CanvaProps {
  children: ReactNode;
}

export default function Canva({ children }: CanvaProps) {
  const { t } = useTranslation();
  const projects = useMemo(() => getAllProjects().slice(0, 5), []);
  const [stage, setStage] = useState<Stage>("hero");
  const [promptStage, setPromptStage] = useState<PromptStage>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [heroReady, setHeroReady] = useState(false);
  const [isMorphing, setIsMorphing] = useState(false);
  const scrollAccumulatorRef = useRef(0);
  const lastStepRef = useRef(0);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDirectionRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const promptLabel =
    promptStage === "more"
      ? t("hero.prompt_more")
      : promptStage === "work"
      ? t("hero.prompt_work")
      : promptStage === "contact"
      ? t("hero.prompt_contact")
      : undefined;

  const transitionToStage = (
    targetStage: Stage,
    morphFn: (onComplete?: () => void) => void,
    onComplete?: () => void
  ) => {
    setIsMorphing(true);
    morphFn(() => {
      setIsMorphing(false);
      setStage(targetStage);
      onComplete?.();
    });
  };

  const handlePromptYes = () => {
    if (promptStage === "more") {
      setPromptStage(null);
      transitionToStage("about", morphToAbout);
      return;
    }
    if (promptStage === "work") {
      setPromptStage(null);
      setStatusMessage(t("hero.processing_portfolio"));
      window.setTimeout(() => {
        transitionToStage(
          "projects",
          morphToProjects,
          () => {
            setActiveIndex(-1);
            setStatusMessage(null);
          }
        );
      }, 350);
      return;
    }
    if (promptStage === "contact") {
      setPromptStage(null);
      transitionToStage("contact", morphToContact);
    }
  };

  const handlePromptNo = () => {
    setPromptStage(null);
  };

  const handleBootComplete = () => {
    setPromptStage("more");
  };

  const handleAboutSeeWork = () => {
    if (stage !== "about") return;
    setPromptStage(null);
    setStatusMessage(t("hero.processing_portfolio"));
    window.setTimeout(() => {
      transitionToStage(
        "projects",
        morphToProjects,
        () => {
          setActiveIndex(-1);
          setStatusMessage(null);
        }
      );
    }, 350);
  };

  const goToHero = () => {
    setActiveIndex(-1);
    setStatusMessage(null);
    setPromptStage("more");
    transitionToStage("hero", morphToHeroFromAny);
  };

  const goToAbout = () => {
    setActiveIndex(-1);
    setStatusMessage(null);
    setPromptStage(null);
    transitionToStage("about", morphToAbout);
  };

  const goToProjects = () => {
    setActiveIndex(-1);
    setStatusMessage(null);
    setPromptStage(null);
    transitionToStage("projects", morphToProjects);
  };

  const goToContact = () => {
    setActiveIndex(-1);
    setStatusMessage(null);
    setPromptStage(null);
    transitionToStage("contact", morphToContact);
  };

  const handleBackToTop = () => {
    setActiveIndex(-1);
    setStatusMessage(null);
    transitionToStage("hero", morphToHeroFromAny, () => {
      setPromptStage("more");
    });
  };

  useEffect(() => {
    const sections: Stage[] = ["hero", "about", "projects", "contact"];

    const onWheel = (event: WheelEvent) => {
      // Don't handle scroll during morphing transitions
      if (isMorphing) return;

      // Projects section has its own scroll handling
      if (stage === "projects") return;

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

        // Navigate between sections based on scroll direction
        const currentIndex = sections.indexOf(stage);
        const nextIndex = currentIndex + direction;

        if (nextIndex >= 0 && nextIndex < sections.length) {
          const nextStage = sections[nextIndex];

          // Clear prompt state when scrolling
          setPromptStage(null);

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
  }, [stage, isMorphing]);

  // Touch/swipe navigation for mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (!isMobile) return;

    const sections: Stage[] = ["hero", "about", "projects", "contact"];
    const SWIPE_THRESHOLD = 50; // minimum px to count as swipe
    const SWIPE_MAX_TIME = 500; // max ms for the swipe gesture

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

      // Must be a vertical swipe (more vertical than horizontal)
      if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;
      if (Math.abs(deltaX) > Math.abs(deltaY)) return;
      if (elapsed > SWIPE_MAX_TIME) return;

      // Cooldown check
      const now = performance.now();
      if (now - lastStepRef.current < 800) return;
      lastStepRef.current = now;

      const direction = deltaY < 0 ? 1 : -1; // swipe up = next, swipe down = prev
      const currentIndex = sections.indexOf(stage);
      const nextIndex = currentIndex + direction;

      if (nextIndex >= 0 && nextIndex < sections.length) {
        const nextStage = sections[nextIndex];
        setPromptStage(null);

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
  }, [stage, isMorphing]);

  useEffect(() => {
    const handleIndexChange = (event: Event) => {
      if (stage !== "projects") return;
      const detail = (event as CustomEvent).detail;
      const index = typeof detail?.index === "number" ? detail.index : null;
      if (index === null) return;
      setActiveIndex(index - 1);
    };

    window.addEventListener("portfolioIndexChange", handleIndexChange);
    return () => window.removeEventListener("portfolioIndexChange", handleIndexChange);
  }, [stage]);

  // Listen for goToContact event from portfolio CTA
  useEffect(() => {
    const handleGoToContact = () => {
      goToContact();
    };

    window.addEventListener("goToContact", handleGoToContact);
    return () => window.removeEventListener("goToContact", handleGoToContact);
  }, []);

  const value = useMemo(
    () => ({
      projects,
      stage,
      promptStage,
      promptLabel,
      statusMessage,
      heroReady,
      setHeroReady,
      isMorphing,
      setIsMorphing,
      handlePromptYes,
      handlePromptNo,
      handleBootComplete,
      handleAboutSeeWork,
      handleBackToTop,
      goToHero,
      goToAbout,
      goToProjects,
      goToContact,
    }),
    [
      projects,
      stage,
      promptStage,
      promptLabel,
      statusMessage,
      heroReady,
      setHeroReady,
      isMorphing,
      setIsMorphing,
    ]
  );

  const navSections: Stage[] = ["hero", "about", "projects", "contact"];
  const currentIndex = navSections.indexOf(stage);
  const canGoUp = currentIndex > 0;
  const canGoDown = currentIndex < navSections.length - 1;

  const goToPrev = () => {
    if (isMorphing || !canGoUp) return;
    const prev = navSections[currentIndex - 1];
    switch (prev) {
      case "hero": goToHero(); break;
      case "about": goToAbout(); break;
      case "projects": goToProjects(); break;
    }
  };

  const goToNext = () => {
    if (isMorphing || !canGoDown) return;
    const next = navSections[currentIndex + 1];
    switch (next) {
      case "about": goToAbout(); break;
      case "projects": goToProjects(); break;
      case "contact": goToContact(); break;
    }
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-bg text-white relative">
      <Background />
      <CanvaContext.Provider value={value}>
        <Terminal />
        {children}
        {/* Mobile nav - minimal chevrons on right edge */}
        <div className="fixed right-3 top-1/2 -translate-y-1/2 z-[9999] flex flex-col gap-6 lg:hidden">
          <button
            onClick={goToPrev}
            disabled={!canGoUp || isMorphing}
            className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-200 ${
              canGoUp
                ? "bg-white/5 border border-white/10 text-primary active:scale-90"
                : "opacity-0 pointer-events-none"
            }`}
            aria-label="Previous section"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 12.5L10 7.5L15 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex flex-col items-center gap-1 py-1">
            {navSections.map((_, i) => (
              <div
                key={i}
                className={`w-0.5 transition-all duration-300 rounded-full ${
                  i === currentIndex ? "h-4 bg-primary" : "h-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
          <button
            onClick={goToNext}
            disabled={!canGoDown || isMorphing}
            className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-200 ${
              canGoDown
                ? "bg-white/5 border border-white/10 text-primary active:scale-90"
                : "opacity-0 pointer-events-none"
            }`}
            aria-label="Next section"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </CanvaContext.Provider>
    </main>
  );
}
