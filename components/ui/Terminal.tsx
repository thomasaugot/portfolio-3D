"use client";

import { ChevronsDown } from "lucide-react";
import { useEffect, useState, useMemo, useRef, useCallback, useLayoutEffect } from "react";
import { useTranslation } from "@/contexts/TranslationProvider";
import { useCanva } from "@/components/ui/Canva";
import { useIsAppReady } from "@/contexts/LoadingProvider";
import { morphToHero, getTerminalConfig } from "@/utils/animations/terminal-morph";
import { gsap } from "@/lib/gsap";
import TaglineCarousel from "@/components/ui/TaglineCarousel";
import ContactForm from "@/components/ui/ContactForm";
import TerminalLines from "@/components/ui/TerminalLines";
import TerminalPrompt from "@/components/ui/TerminalPrompt";
import AboutPortrait from "@/components/ui/AboutPortrait";
import { useTerminalTyping } from "@/hooks/useTerminalTyping";
import { useStageFocus } from "@/hooks/useStageFocus";
import {
  getAboutContentPages,
  getStageContent,
  getLoadingLines,
  getHeaderLabel,
  getPromptConfig,
  type Stage,
  type TerminalLine,
} from "@/data/terminal-content";
import { getViewportConfig, waitForStableStageMeasurement } from "@/utils/terminal-sizes";

type TerminalState = Stage | "loader";

export default function Terminal() {
  const { t, language } = useTranslation();
  const {
    stage,
    pendingStage,
    promptLabel,
    statusMessage,
    setHeroReady,
    handlePromptYes,
    handlePromptNo,
    handleBootComplete,
    goToProjects,
    goToHero,
    isMorphing,
    setIsMorphing,
    measurementVersion,
  } = useCanva();
  const { isReady, progress } = useIsAppReady();

  const [cursor, setCursor] = useState(true);
  const [prompt, setPrompt] = useState(false);
  const [heroActive, setHeroActive] = useState(false);
  const [hasExpanded, setHasExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [useCompactAboutLayout, setUseCompactAboutLayout] = useState(false);
  const [terminalContentHidden, setTerminalContentHidden] = useState(false);
  const [aboutMobilePage, setAboutMobilePage] = useState(0);
  const [aboutMeasurementVersion, setAboutMeasurementVersion] = useState(0);

  const prevStageRef = useRef(stage);
  const prevAboutMobilePageRef = useRef(aboutMobilePage);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const taglineSectionRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const terminalState: TerminalState = heroActive ? stage : "loader";
  const measurementStage: Stage | null =
    pendingStage && pendingStage !== "projects"
      ? pendingStage
      : !heroActive && isReady
        ? "hero"
        : null;
  const exactMeasureStage: Stage | null =
    measurementStage ?? (heroActive && stage === "about" && useCompactAboutLayout ? "about" : null);
  const terminalConfig = useMemo(
    () => {
      void measurementVersion;
      void aboutMeasurementVersion;
      return getTerminalConfig(terminalState);
    },
    [terminalState, measurementVersion, aboutMeasurementVersion]
  );
  const isHeroStage = stage === "hero";
  const terminalStyle = useMemo(
    () => ({
      width: terminalConfig.widthCss,
      height: terminalConfig.heightCss,
      maxHeight: "80svh",
    }),
    [terminalConfig]
  );
  const appliedTerminalStyle = isMorphing ? undefined : terminalStyle;

  const promptConfig = useMemo(
    () => {
      if (stage === "about" && useCompactAboutLayout) {
        if (aboutMobilePage === 0) {
          return {
            label: t("about.block_skills") || "Skills",
            yesLabel: t("hero.prompt_yes"),
            noLabel: t("hero.prompt_no"),
            onYes: () => {
              setPrompt(false);
              setAboutMobilePage(1);
            },
            onNo: () => {
              setPrompt(false);
              goToHero();
            },
          };
        }

        return {
          label: t("about.cta_work"),
          yesLabel: t("hero.prompt_yes"),
          noLabel: "Back",
          onYes: () => {
            setPrompt(false);
            goToProjects();
          },
          onNo: () => {
            setPrompt(false);
            setAboutMobilePage(0);
          },
        };
      }

      return getPromptConfig(stage, promptLabel, t, {
        setPrompt,
        handlePromptYes,
        handlePromptNo,
        goToProjects,
        goToHero,
      });
    },
    [
      aboutMobilePage,
      stage,
      useCompactAboutLayout,
      promptLabel,
      t,
      handlePromptYes,
      handlePromptNo,
      goToProjects,
      goToHero,
    ]
  );
  const measurementPromptConfig = useMemo(
    () => {
      if (!measurementStage) return null;
      if (measurementStage === "about" && useCompactAboutLayout) {
        return {
          label: t("about.block_skills") || "Skills",
          yesLabel: t("hero.prompt_yes"),
          noLabel: t("hero.prompt_no"),
          onYes: () => {},
          onNo: () => {},
        };
      }
      return getPromptConfig(measurementStage, promptLabel, t, {
        setPrompt: () => {},
        handlePromptYes: () => {},
        handlePromptNo: () => {},
        goToProjects: () => {},
        goToHero: () => {},
      });
    },
    [measurementStage, useCompactAboutLayout, promptLabel, t]
  );
  const exactMeasurementPromptConfig = useMemo(() => {
    if (!exactMeasureStage) return null;
    if (measurementStage) return measurementPromptConfig;
    if (exactMeasureStage === "about" && useCompactAboutLayout) return promptConfig;
    return null;
  }, [exactMeasureStage, measurementStage, measurementPromptConfig, promptConfig, useCompactAboutLayout]);

  const getContent = useCallback(
    () => {
      if (stage === "about" && useCompactAboutLayout) {
        return getAboutContentPages(t)[aboutMobilePage] ?? [];
      }
      return getStageContent(stage, t, isDesktop);
    },
    [aboutMobilePage, stage, t, isDesktop, useCompactAboutLayout]
  );
  const measurementLines = useMemo(
    () => {
      if (!measurementStage) return [];
      if (measurementStage === "about" && useCompactAboutLayout) {
        return getAboutContentPages(t)[0] ?? [];
      }
      return getStageContent(measurementStage, t, isDesktop);
    },
    [measurementStage, t, isDesktop, useCompactAboutLayout]
  );
  const exactMeasurementLines = useMemo(() => {
    if (!exactMeasureStage) return [];
    if (exactMeasureStage === "about" && useCompactAboutLayout) {
      return getAboutContentPages(t)[measurementStage ? 0 : aboutMobilePage] ?? [];
    }
    return getStageContent(exactMeasureStage, t, isDesktop);
  }, [exactMeasureStage, useCompactAboutLayout, t, measurementStage, aboutMobilePage, isDesktop]);

  const handleTypingComplete = useCallback(() => {
    if (stage === "about" && useCompactAboutLayout) {
      setPrompt(true);
      return;
    }
    setPrompt(true);
    if (stage === "hero") {
      handleBootComplete();
    }
  }, [stage, useCompactAboutLayout, handleBootComplete]);

  const {
    lines,
    typing,
    promptLabelTyped,
    contentReady,
    setContentReady,
    resetForStageChange,
  } = useTerminalTyping({
    heroActive,
    isMorphing,
    stage,
    getStageContent: getContent,
    promptLabel: promptConfig.label,
    onTypingComplete: handleTypingComplete,
  });

  const loadingLines = useMemo(() => getLoadingLines(t), [t]);
  const taglineBefore = t("hero.tagline_before");
  const taglineAfter = t("hero.tagline_after");
  const taglineWords = t("hero.tagline_words").split(",").map((w) => w.trim()).filter(Boolean);
  const showPrompt = heroActive && prompt;
  const showHeroTagline = isHeroStage && heroActive && !isMorphing;
  const stageContentHeadingId = `stage-content-heading-${stage}`;
  const stageContentLabel = getHeaderLabel(stage, heroActive, t);

  useEffect(() => {
    if (stage !== "about" || !useCompactAboutLayout) {
      prevAboutMobilePageRef.current = aboutMobilePage;
      return;
    }

    if (prevAboutMobilePageRef.current !== aboutMobilePage) {
      prevAboutMobilePageRef.current = aboutMobilePage;
      resetForStageChange();
      setContentReady(false);
      setPrompt(false);
    }
  }, [aboutMobilePage, stage, useCompactAboutLayout, resetForStageChange, setContentReady]);

  useLayoutEffect(() => {
    if (stage !== "about" || !useCompactAboutLayout) return;

    const frame = window.requestAnimationFrame(() => {
      setAboutMeasurementVersion((value) => value + 1);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [stage, useCompactAboutLayout, aboutMobilePage]);

  useEffect(() => {
    const handleAdvance = () => {
      if (stage !== "about" || !useCompactAboutLayout || aboutMobilePage !== 0) return;
      setPrompt(false);
      setAboutMobilePage(1);
    };

    const handleBack = () => {
      if (stage !== "about" || !useCompactAboutLayout || aboutMobilePage !== 1) return;
      setPrompt(false);
      setAboutMobilePage(0);
    };

    window.addEventListener("aboutMobileAdvance", handleAdvance);
    window.addEventListener("aboutMobileBack", handleBack);

    return () => {
      window.removeEventListener("aboutMobileAdvance", handleAdvance);
      window.removeEventListener("aboutMobileBack", handleBack);
    };
  }, [stage, useCompactAboutLayout, aboutMobilePage]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (stage === "about" && useCompactAboutLayout) {
      document.documentElement.dataset.aboutMobilePage = String(aboutMobilePage);
      return () => {
        delete document.documentElement.dataset.aboutMobilePage;
      };
    }

    delete document.documentElement.dataset.aboutMobilePage;
  }, [stage, useCompactAboutLayout, aboutMobilePage]);

  useStageFocus({
    stage,
    isMorphing,
    isReady: heroActive,
  });

  // Reset scroll position on stage or about-page change
  useEffect(() => {
    if (terminalBodyRef.current) terminalBodyRef.current.scrollTop = 0;
  }, [stage, aboutMobilePage]);

  // Scroll indicator check
  useEffect(() => {
    const el = terminalBodyRef.current;
    if (!el) return;
    const check = () => {
      const hasMore = el.scrollHeight - el.scrollTop - el.clientHeight > 8;
      setCanScrollDown(hasMore);
    };
    const rafId = window.requestAnimationFrame(check);
    el.addEventListener("scroll", check, { passive: true });
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => {
      window.cancelAnimationFrame(rafId);
      el.removeEventListener("scroll", check);
      observer.disconnect();
    };
  }, [lines, stage, aboutMobilePage, terminalContentHidden]);

  // Viewport-specific layout flags + cursor blink
  useEffect(() => {
    const syncViewportFlags = () => {
      const config = getViewportConfig();
      setIsDesktop(config.isDesktop);
      setUseCompactAboutLayout(config.useCompactAboutLayout);
    };

    syncViewportFlags();
    window.addEventListener("resize", syncViewportFlags);

    const cursorId = setInterval(() => setCursor((prev) => !prev), 530);
    return () => {
      window.removeEventListener("resize", syncViewportFlags);
      clearInterval(cursorId);
    };
  }, []);

  // Morph to hero when ready + set hero ready
  useEffect(() => {
    if (!isReady || hasExpanded) return;
    let cancelled = false;

    void waitForStableStageMeasurement("hero").then((height) => {
      if (cancelled || hasExpanded || height === null) return;
      setHasExpanded(true);
      setTerminalContentHidden(true);
      setIsMorphing(true);
      morphToHero(() => {
        setIsMorphing(false);
        setHeroActive(true);
        setHeroReady(true);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [isReady, hasExpanded, setIsMorphing, setHeroReady, measurementVersion]);

  // Handle stage/language changes and morphing state
  useEffect(() => {
    if (!heroActive) return;

    if (isMorphing) {
      setTerminalContentHidden(true);
      resetForStageChange();
      setPrompt(false);
      setContentReady(false);
      return;
    }

    if (prevStageRef.current !== stage) {
      prevStageRef.current = stage;
      setAboutMobilePage(0);
      resetForStageChange();
      setPrompt(false);
      setContentReady(false);
    }

    // Show content after morph ends
    const id = setTimeout(() => {
      setTerminalContentHidden(false);
      if (!contentReady) setContentReady(true);
    }, 260);

    return () => clearTimeout(id);
  }, [heroActive, isMorphing, stage, language, resetForStageChange, setContentReady, contentReady]);

  useLayoutEffect(() => {
    if (isMorphing) return;

    const wrapper = document.querySelector("[data-terminal-wrapper]") as HTMLElement | null;
    if (!wrapper) return;

    gsap.set(wrapper, {
      width: terminalConfig.width,
      height: terminalConfig.height,
    });
  }, [isMorphing, terminalConfig.width, terminalConfig.height, measurementVersion]);

  return (
    <div data-terminal-wrapper className="fixed z-[100] opacity-0">
      <div
        id={stage === "projects" ? undefined : "stage-content"}
        data-stage-focus-target={stage === "projects" ? undefined : stage}
        data-terminal-shell
        suppressHydrationWarning
        role="region"
        aria-labelledby="terminal-stage-title"
        tabIndex={-1}
        className="keyboard-focus-ring bg-bg-surface/96 backdrop-blur-sm rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col w-full h-full [html[data-theme='light']_&]:border-[#c8b99f] [html[data-theme='light']_&]:bg-[#f8f3e9]/96 [html[data-theme='light']_&]:shadow-[0_28px_80px_rgba(16,185,129,0.08),0_18px_40px_rgba(149,115,37,0.12)]"
        style={appliedTerminalStyle}
      >
        {/* Header */}
        <div
          data-terminal-header
          className="flex items-center gap-2 px-4 py-3 bg-bg-panel border-b border-border text-nowrap [html[data-theme='light']_&]:bg-[linear-gradient(90deg,rgba(16,185,129,0.07),rgba(245,158,11,0.06))] [html[data-theme='light']_&]:border-b-[#cdbda3]"
        >
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
          </div>
          <h2
            id="terminal-stage-title"
            className="ml-4 text-xs text-muted font-mono text-nowrap [html[data-theme='light']_&]:text-[#756a5b]"
          >
            {getHeaderLabel(stage, heroActive, t)}
          </h2>
        </div>

        {/* Hero tagline */}
        {showHeroTagline && (
          <div ref={taglineSectionRef} className="px-4 md:px-6 pt-4 pb-2 border-b border-border [html[data-theme='light']_&]:border-b-[#d4c7ae]">
            <p className="text-xs font-mono text-secondary mb-2 tracking-widest uppercase">
              {t("hero.tagline_prefix")}
            </p>
            <h1
              id={stageContentHeadingId}
              className="overflow-hidden text-xl font-bold leading-[1.2] sm:leading-[1.05] tracking-tight text-text sm:text-2xl md:text-2xl lg:text-3xl"
            >
              <TaglineCarousel
                before={taglineBefore}
                after={taglineAfter}
                words={taglineWords}
              />
            </h1>
          </div>
        )}

        {/* Body */}
        <div
          ref={terminalBodyRef}
          data-terminal-body
          className="relative p-4 md:p-6 font-mono text-sm leading-relaxed overflow-x-hidden overflow-y-auto flex-1 min-h-0 no-scrollbar"
        >
          <div
            data-terminal-content
            className={`transition-opacity duration-300 ${
              terminalContentHidden ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            {/* Loading state */}
            {!heroActive && typeof progress === "number" && (
              <div className="mb-4 rounded-lg border border-border bg-bg-surface/60 px-4 py-3">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{t("hero.terminal.initializing")}</span>
                  <span className="text-primary font-bold tabular-nums">{progress}%</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-text/12 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            {!heroActive && loadingLines.length > 0 && (
              <>
                {loadingLines.map((line: TerminalLine, index: number) => (
                  <div key={`loading-${index}`} className="mb-1.5 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">❯</span>
                      <span className="text-text">{line.content}</span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Active content */}
            {heroActive && (
              <section aria-labelledby={stageContentHeadingId}>
                {stage !== "hero" && (
                  <h2 id={stageContentHeadingId} className="sr-only">
                    {stageContentLabel}
                  </h2>
                )}
                <AboutPortrait visible={stage === "about" && !isDesktop && !isMorphing} />
                <TerminalLines lines={lines} />
              </section>
            )}

            {/* Typing cursor */}
            {typing && (
              <div className="flex items-center gap-2">
                <span className="text-primary">❯</span>
                <span
                  className={`w-2 h-5 bg-primary ${cursor ? "opacity-100" : "opacity-0"}`}
                />
              </div>
            )}

            {/* Status message */}
            {statusMessage && isHeroStage && (
              <div className="mt-3 text-text/82 flex items-center gap-2">
                <span className="text-primary">❯</span>
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Prompts */}
            {showPrompt && isHeroStage && (promptLabelTyped || promptLabel) && (
              <TerminalPrompt promptLabelTyped={promptLabelTyped} promptConfig={promptConfig} />
            )}
            {stage === "about" && heroActive && showPrompt && (
              <TerminalPrompt promptLabelTyped={promptLabelTyped} promptConfig={promptConfig} />
            )}
            {stage === "contact" && heroActive && showPrompt && (
              <ContactForm stage={stage} showPrompt={showPrompt} isDesktop={isDesktop} />
            )}
          </div>
          <div data-terminal-morph-layer className="absolute inset-0 opacity-0 pointer-events-none" />

          {/* Scroll indicator */}
          {heroActive && canScrollDown && (
            <div className="sticky bottom-0 left-0 right-0 flex justify-center pointer-events-none pt-4">
              <div className="bg-bg-surface/92 backdrop-blur-sm rounded-full px-3 py-1 border border-border pointer-events-auto">
                <ChevronsDown className="w-4 h-4 text-primary animate-bounce" />
              </div>
            </div>
          )}
        </div>
      </div>

      {exactMeasureStage && exactMeasurementPromptConfig && (
        <div
          aria-hidden="true"
          inert
          className="fixed -z-50 opacity-0 pointer-events-none top-0 left-0"
          style={{
            width: getTerminalConfig(exactMeasureStage).widthCss,
            maxWidth: "92vw",
            height: "auto",
          }}
        >
          <div
            data-stage-measurer-exact={exactMeasureStage}
            className="keyboard-focus-ring bg-bg-surface/96 backdrop-blur-sm rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col w-full h-auto [html[data-theme='light']_&]:border-[#c8b99f] [html[data-theme='light']_&]:bg-[#f8f3e9]/96 [html[data-theme='light']_&]:shadow-[0_28px_80px_rgba(16,185,129,0.08),0_18px_40px_rgba(149,115,37,0.12)]"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-bg-panel border-b border-border text-nowrap [html[data-theme='light']_&]:bg-[linear-gradient(90deg,rgba(16,185,129,0.07),rgba(245,158,11,0.06))] [html[data-theme='light']_&]:border-b-[#cdbda3]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
              </div>
              <div className="ml-4 text-xs text-muted font-mono text-nowrap [html[data-theme='light']_&]:text-[#756a5b]">
                {getHeaderLabel(exactMeasureStage, true, t)}
              </div>
            </div>

            {exactMeasureStage === "hero" && (
              <div className="px-4 md:px-6 pt-4 pb-2 border-b border-border [html[data-theme='light']_&]:border-b-[#d4c7ae]">
                <p className="text-xs font-mono text-secondary mb-2 tracking-widest uppercase">
                  {t("hero.tagline_prefix")}
                </p>
                <h1 className="overflow-hidden text-xl font-bold leading-[1.2] sm:leading-[1.05] tracking-tight text-text sm:text-2xl md:text-2xl lg:text-3xl">
                  <TaglineCarousel
                    before={taglineBefore}
                    after={taglineAfter}
                    words={taglineWords}
                  />
                </h1>
              </div>
            )}

            <div className="relative p-4 md:p-6 font-mono text-sm leading-relaxed overflow-visible">
              <AboutPortrait visible={exactMeasureStage === "about" && !isDesktop} />
              <TerminalLines lines={exactMeasurementLines} />

              {exactMeasureStage === "hero" && statusMessage && (
                <div className="mt-3 text-text/82 flex items-center gap-2">
                  <span className="text-primary">❯</span>
                  <span>{statusMessage}</span>
                </div>
              )}

              {(exactMeasureStage === "hero" || exactMeasureStage === "about") && (
                <TerminalPrompt
                  promptLabelTyped={exactMeasurementPromptConfig.label}
                  promptConfig={exactMeasurementPromptConfig}
                />
              )}

              {exactMeasureStage === "contact" && (
                <ContactForm stage={exactMeasureStage} showPrompt={true} isDesktop={isDesktop} />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
