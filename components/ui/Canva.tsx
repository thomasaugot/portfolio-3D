"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Background from "@/components/ui/Background";
import StageTerminal from "@/components/ui/terminal/StageTerminal";
import StageMeasurer from "@/components/ui/StageMeasurer";
import MobileNav from "@/components/layout/MobileNav";
import BackToTop from "@/components/ui/BackToTop";
import MotionToggle from "@/components/ui/MotionToggle";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTranslation } from "@/contexts/TranslationProvider";
import { useStageNavigation } from "@/hooks/useStageNavigation";
import { useWheelNavigation } from "@/hooks/useWheelNavigation";
import { useTouchNavigation } from "@/hooks/useTouchNavigation";
import { useViewportReload } from "@/hooks/useViewportReload";
import { getAllProjects } from "@/data/projects";
import type { Stage as TerminalStage } from "@/data/terminal-content";
import {
  setMeasuredStageHeight,
  getHeroTerminalSize,
  getAboutTerminalSize,
  getContactTerminalSize,
  getViewportConfig,
} from "@/utils/terminal-sizes";

type Stage = "hero" | "about" | "projects" | "contact";
type PromptStage = "more" | "work" | "contact" | null;

interface CanvaController {
  projects: ReturnType<typeof getAllProjects>;
  stage: Stage;
  pendingStage: Stage | null;
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
  measurementVersion: number;
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
  const [isDesktop, setIsDesktop] = useState(false);
  const [useCompactAboutLayout, setUseCompactAboutLayout] = useState(false);
  const [useCompactHeroTitle, setUseCompactHeroTitle] = useState(false);
  const [measurementVersion, setMeasurementVersion] = useState(0);

  useEffect(() => {
    const syncViewportFlags = () => {
      const config = getViewportConfig();
      setIsDesktop(config.isDesktop);
      setUseCompactAboutLayout(config.useCompactAboutLayout);
      setUseCompactHeroTitle(config.isTablet || config.isSmallDesktop);
    };

    syncViewportFlags();
    window.addEventListener("resize", syncViewportFlags);

    return () => {
      window.removeEventListener("resize", syncViewportFlags);
    };
  }, []);

  // Reload when viewport crosses a layout breakpoint (e.g. tablet rotation)
  useViewportReload();

  const {
    stage,
    pendingStage,
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

  // Compute size info for measurers (client-side only)
  const heroWidthCss = getHeroTerminalSize().widthCss;
  const aboutWidthCss = getAboutTerminalSize().widthCss;
  const contactWidthCss = getContactTerminalSize().widthCss;

  const handleMeasure = (stage: string, height: number) => {
    const changed = setMeasuredStageHeight(stage, height);
    if (changed) {
      setMeasurementVersion((value) => value + 1);
    }
  };

  const value = useMemo(
    () => ({
      projects,
      stage,
      pendingStage,
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
      measurementVersion,
    }),
    [
      projects,
      stage,
      pendingStage,
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
      measurementVersion,
    ]
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-bg text-text relative">
      <Background />
      {/* Hidden stage measurers — run during load to give real content heights */}
      <StageMeasurer
        stage={"hero" as TerminalStage}
        t={t}
        isDesktop={isDesktop}
        useCompactAboutLayout={useCompactAboutLayout}
        useCompactHeroTitle={useCompactHeroTitle}
        widthCss={heroWidthCss}
        promptLabel={t("hero.prompt_more")}
        yesLabel={t("hero.prompt_yes")}
        noLabel={t("hero.prompt_no")}
        onMeasure={handleMeasure}
      />
      <StageMeasurer
        stage={"about" as TerminalStage}
        t={t}
        isDesktop={isDesktop}
        useCompactAboutLayout={useCompactAboutLayout}
        useCompactHeroTitle={useCompactHeroTitle}
        widthCss={aboutWidthCss}
        promptLabel={t("about.cta_work")}
        yesLabel={t("hero.prompt_yes")}
        noLabel={t("hero.prompt_no")}
        onMeasure={handleMeasure}
      />
      <StageMeasurer
        stage={"contact" as TerminalStage}
        t={t}
        isDesktop={isDesktop}
        useCompactAboutLayout={useCompactAboutLayout}
        useCompactHeroTitle={useCompactHeroTitle}
        widthCss={contactWidthCss}
        promptLabel=""
        yesLabel=""
        noLabel=""
        onMeasure={handleMeasure}
      />
      <CanvaContext.Provider value={value}>
        <StageTerminal />
        {children}
        <MobileNav
          currentStage={stage}
          isMorphing={isMorphing}
          goToHero={goToHero}
          goToAbout={goToAbout}
          goToProjects={goToProjects}
          goToContact={goToContact}
        />
        <div className="fixed bottom-12 md:bottom-6 left-6 z-[100002] flex items-center gap-2">
          <MotionToggle />
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
        </div>
        <BackToTop />
      </CanvaContext.Provider>
    </div>
  );
}
