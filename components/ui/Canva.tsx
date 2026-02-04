"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo } from "react";
import Background from "@/components/ui/Background";
import Terminal from "@/components/ui/Terminal";
import MobileNav from "@/components/ui/MobileNav";
import BackToTop from "@/components/ui/BackToTop";
import { useTranslation } from "@/contexts/TranslationProvider";
import { useStageNavigation } from "@/hooks/useStageNavigation";
import { useWheelNavigation } from "@/hooks/useWheelNavigation";
import { useTouchNavigation } from "@/hooks/useTouchNavigation";
import { useViewportReload } from "@/hooks/useViewportReload";
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

  // Reload when viewport crosses a layout breakpoint (e.g. tablet rotation)
  useViewportReload();

  const {
    stage,
    promptStage,
    promptLabel,
    statusMessage,
    heroReady,
    setHeroReady,
    isMorphing,
    setIsMorphing,
    setActiveIndex,
    goToHero,
    goToAbout,
    goToProjects,
    goToContact,
    handlePromptYes,
    handlePromptNo,
    handleBootComplete,
    handleAboutSeeWork,
    handleBackToTop,
    clearPromptStage,
  } = useStageNavigation({ t });

  // Wheel navigation for desktop
  useWheelNavigation({
    stage,
    isMorphing,
    goToHero,
    goToAbout,
    goToProjects,
    goToContact,
    clearPromptStage,
  });

  // Touch navigation for mobile
  useTouchNavigation({
    stage,
    isMorphing,
    goToHero,
    goToAbout,
    goToProjects,
    goToContact,
    clearPromptStage,
  });

  // Listen for project index changes
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
  }, [stage, setActiveIndex]);

  // Listen for goToContact event from portfolio CTA
  useEffect(() => {
    const handleGoToContact = () => {
      goToContact();
    };

    window.addEventListener("goToContact", handleGoToContact);
    return () => window.removeEventListener("goToContact", handleGoToContact);
  }, [goToContact]);

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
      handlePromptYes,
      handlePromptNo,
      handleBootComplete,
      handleAboutSeeWork,
      handleBackToTop,
      goToHero,
      goToAbout,
      goToProjects,
      goToContact,
    ]
  );

  return (
    <main className="h-screen w-screen overflow-hidden bg-bg text-white relative">
      <Background />
      <CanvaContext.Provider value={value}>
        <Terminal />
        {children}
        <MobileNav
          currentStage={stage}
          isMorphing={isMorphing}
          goToHero={goToHero}
          goToAbout={goToAbout}
          goToProjects={goToProjects}
          goToContact={goToContact}
        />
        <BackToTop />
      </CanvaContext.Provider>
    </main>
  );
}
