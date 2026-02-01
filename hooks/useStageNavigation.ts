"use client";

import { useState, useCallback } from "react";
import {
  morphToAbout,
  morphToProjects,
  morphToContact,
  morphToHeroFromAny,
} from "@/utils/animations/terminal-morph";

export type Stage = "hero" | "about" | "projects" | "contact";
export type PromptStage = "more" | "work" | "contact" | null;

interface UseStageNavigationOptions {
  t: (key: string) => string;
}

export function useStageNavigation({ t }: UseStageNavigationOptions) {
  const [stage, setStage] = useState<Stage>("hero");
  const [promptStage, setPromptStage] = useState<PromptStage>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [heroReady, setHeroReady] = useState(false);
  const [isMorphing, setIsMorphing] = useState(false);

  const promptLabel =
    promptStage === "more"
      ? t("hero.prompt_more")
      : promptStage === "work"
        ? t("hero.prompt_work")
        : promptStage === "contact"
          ? t("hero.prompt_contact")
          : undefined;

  const transitionToStage = useCallback(
    (
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
    },
    []
  );

  const goToHero = useCallback(() => {
    setActiveIndex(-1);
    setStatusMessage(null);
    setPromptStage("more");
    transitionToStage("hero", morphToHeroFromAny);
  }, [transitionToStage]);

  const goToAbout = useCallback(() => {
    setActiveIndex(-1);
    setStatusMessage(null);
    setPromptStage(null);
    transitionToStage("about", morphToAbout);
  }, [transitionToStage]);

  const goToProjects = useCallback(() => {
    setActiveIndex(-1);
    setStatusMessage(null);
    setPromptStage(null);
    transitionToStage("projects", morphToProjects);
  }, [transitionToStage]);

  const goToContact = useCallback(() => {
    setActiveIndex(-1);
    setStatusMessage(null);
    setPromptStage(null);
    transitionToStage("contact", morphToContact);
  }, [transitionToStage]);

  const handlePromptYes = useCallback(() => {
    if (promptStage === "more") {
      setPromptStage(null);
      transitionToStage("about", morphToAbout);
      return;
    }
    if (promptStage === "work") {
      setPromptStage(null);
      setStatusMessage(t("hero.processing_portfolio"));
      window.setTimeout(() => {
        transitionToStage("projects", morphToProjects, () => {
          setActiveIndex(-1);
          setStatusMessage(null);
        });
      }, 350);
      return;
    }
    if (promptStage === "contact") {
      setPromptStage(null);
      transitionToStage("contact", morphToContact);
    }
  }, [promptStage, t, transitionToStage]);

  const handlePromptNo = useCallback(() => {
    setPromptStage(null);
  }, []);

  const handleBootComplete = useCallback(() => {
    setPromptStage("more");
  }, []);

  const handleAboutSeeWork = useCallback(() => {
    if (stage !== "about") return;
    setPromptStage(null);
    setStatusMessage(t("hero.processing_portfolio"));
    window.setTimeout(() => {
      transitionToStage("projects", morphToProjects, () => {
        setActiveIndex(-1);
        setStatusMessage(null);
      });
    }, 350);
  }, [stage, t, transitionToStage]);

  const handleBackToTop = useCallback(() => {
    setActiveIndex(-1);
    setStatusMessage(null);
    transitionToStage("hero", morphToHeroFromAny, () => {
      setPromptStage("more");
    });
  }, [transitionToStage]);

  const clearPromptStage = useCallback(() => {
    setPromptStage(null);
  }, []);

  return {
    stage,
    promptStage,
    promptLabel,
    activeIndex,
    setActiveIndex,
    statusMessage,
    heroReady,
    setHeroReady,
    isMorphing,
    setIsMorphing,
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
  };
}
