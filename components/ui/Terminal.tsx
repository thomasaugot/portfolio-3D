"use client";

import { ChevronsDown } from "lucide-react";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useTranslation } from "@/contexts/TranslationProvider";
import { useCanva } from "@/components/ui/Canva";
import { useIsAppReady } from "@/contexts/LoadingProvider";
import { morphToHero, getTerminalConfig } from "@/utils/animations/terminal-morph";
import TypewriterText from "@/components/ui/TypewriterText";
import ContactForm from "@/components/ui/ContactForm";
import TerminalLines from "@/components/ui/TerminalLines";
import TerminalPrompt from "@/components/ui/TerminalPrompt";
import AboutPortrait from "@/components/ui/AboutPortrait";
import { useTerminalTyping } from "@/hooks/useTerminalTyping";
import {
  getStageContent,
  getLoadingLines,
  getHeaderLabel,
  getPromptConfig,
  type Stage,
  type TerminalLine,
} from "@/data/terminal-content";

type TerminalState = Stage | "loader";

export default function Terminal() {
  const { t, language } = useTranslation();
  const {
    stage,
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
  } = useCanva();
  const { isReady, progress } = useIsAppReady();

  const [cursor, setCursor] = useState(true);
  const [prompt, setPrompt] = useState(false);
  const [heroActive, setHeroActive] = useState(false);
  const [hasExpanded, setHasExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [terminalContentHidden, setTerminalContentHidden] = useState(false);

  const prevStageRef = useRef(stage);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const terminalState: TerminalState = heroActive ? stage : "loader";
  const terminalConfig = useMemo(() => getTerminalConfig(terminalState), [terminalState]);
  const terminalStyle = useMemo(
    () => ({
      width: terminalConfig.widthCss,
      height: terminalConfig.heightCss,
    }),
    [terminalConfig]
  );
  const appliedTerminalStyle = isMorphing ? undefined : terminalStyle;

  const promptConfig = useMemo(
    () =>
      getPromptConfig(stage, promptLabel, t, {
        setPrompt,
        handlePromptYes,
        handlePromptNo,
        goToProjects,
        goToHero,
      }),
    [stage, promptLabel, t, handlePromptYes, handlePromptNo, goToProjects, goToHero]
  );

  const getContent = useCallback(
    () => getStageContent(stage, t, isDesktop),
    [stage, t, isDesktop]
  );

  const handleTypingComplete = useCallback(() => {
    setPrompt(true);
    if (stage === "hero") {
      handleBootComplete();
    }
  }, [stage, handleBootComplete]);

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
  const heroTagline = t("hero.tagline");
  const isHeroStage = stage === "hero";
  const showPrompt = heroActive && prompt;
  const showHeroTagline = isHeroStage && heroActive && !isMorphing;

  // Scroll indicator check
  useEffect(() => {
    const el = terminalBodyRef.current;
    if (!el) return;
    const check = () => {
      const hasMore = el.scrollHeight - el.scrollTop - el.clientHeight > 8;
      setCanScrollDown(hasMore);
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      observer.disconnect();
    };
  }, [lines, stage]);

  // Desktop detection + cursor blink (init effects)
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isTabletSize = w >= 768 && w < 1024;
    const isTabletPortrait = isTabletSize && h > w;
    // Landscape tablets + desktops use desktop content; portrait tablets use mobile content
    setIsDesktop(w >= 1024 || (isTabletSize && !isTabletPortrait));

    const cursorId = setInterval(() => setCursor((prev) => !prev), 530);
    return () => clearInterval(cursorId);
  }, []);

  // Morph to hero when ready + set hero ready
  useEffect(() => {
    if (!isReady || hasExpanded) return;
    setHasExpanded(true);
    setTerminalContentHidden(true);
    setIsMorphing(true);
    morphToHero(() => {
      setIsMorphing(false);
      setHeroActive(true);
      setHeroReady(true);
    });
  }, [isReady, hasExpanded, setIsMorphing, setHeroReady]);

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

    // Stage changed
    if (prevStageRef.current !== stage) {
      prevStageRef.current = stage;
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

  return (
    <div data-terminal-wrapper className="fixed z-[100] opacity-0">
      <div
        data-terminal-shell
        suppressHydrationWarning
        className="bg-bg-surface/95 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col w-full h-full"
        style={appliedTerminalStyle}
      >
        {/* Header */}
        <div
          data-terminal-header
          className="flex items-center gap-2 px-4 py-3 bg-bg-panel border-b border-white/10 text-nowrap"
        >
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
          </div>
          <span className="ml-4 text-xs text-white/40 font-mono text-nowrap">
            {getHeaderLabel(stage, heroActive, t)}
          </span>
        </div>

        {/* Hero tagline */}
        {showHeroTagline && (
          <div className="px-4 md:px-6 pt-4 pb-2 border-b border-white/10">
            <p className="text-xs font-mono text-secondary mb-2 tracking-widest uppercase">
              {t("hero.tagline_prefix")}
            </p>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-white leading-tight">
              <TypewriterText text={heroTagline} speed={45} />
            </h1>
          </div>
        )}

        {/* Body */}
        <div
          ref={terminalBodyRef}
          data-terminal-body
          className="relative p-4 md:p-6 font-mono text-sm leading-relaxed overflow-y-auto overflow-x-hidden flex-1 min-h-0 no-scrollbar"
        >
          <div
            data-terminal-content
            className={`transition-opacity duration-300 ${
              terminalContentHidden ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            {/* Loading state */}
            {!heroActive && typeof progress === "number" && (
              <div className="mb-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>{t("hero.terminal.initializing")}</span>
                  <span className="text-primary font-bold tabular-nums">{progress}%</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
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
                      <span className="text-white">{line.content}</span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Active content */}
            {heroActive && (
              <>
                <AboutPortrait visible={stage === "about" && !isDesktop && !isMorphing} />
                <TerminalLines lines={lines} />
              </>
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
              <div className="mt-3 text-secondary/80 flex items-center gap-2">
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
          {heroActive && canScrollDown && !isDesktop && (
            <div className="sticky bottom-0 left-0 right-0 flex justify-center pointer-events-none pt-4">
              <div className="bg-bg-surface/90 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10 pointer-events-auto">
                <ChevronsDown className="w-4 h-4 text-primary animate-bounce" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
