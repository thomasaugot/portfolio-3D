"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

import { useTranslation } from "@/contexts/TranslationProvider";
import { useThreeScene } from "@/hooks/useThreeScene";
import { initPortfolioScene } from "@/utils/animations/portfolio-3d-scene";
import { useCanva } from "@/components/ui/Canva";
import { Button } from "@/components/ui/Button";
import { Check, Play } from "lucide-react";
import ProjectPanel from "@/components/sections/ProjectPanel";
import StageMeasurer from "@/components/ui/StageMeasurer";
import {
  MOBILE_TERMINAL_WIDTH_CSS,
  getViewportConfig,
  getProjectsIntroSize,
  setMeasuredPortfolioHeight,
} from "@/utils/terminal-sizes";
const PORTFOLIO_PANEL_FRAME_CLASS =
  "absolute inset-0 flex flex-col justify-start p-4 pb-6 md:p-6 md:pb-8 font-mono text-sm leading-relaxed overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y [scrollbar-gutter:stable] [-webkit-overflow-scrolling:touch] no-scrollbar";
const PORTFOLIO_PANEL_CTA_CLASS =
  "mt-auto pt-3 pb-1 md:pb-0 border-t border-border opacity-0 bg-bg-surface shrink-0";


type IntroTerminalSize = {
  widthCss: string;
  heightCss: string;
};

const PORTFOLIO_MEASURER_FRAME_CLASS =
  "relative flex flex-col justify-start p-4 md:p-6 font-mono text-sm leading-relaxed overflow-visible bg-bg-surface";

export default function ProjectsSection() {

  const { t } = useTranslation();
  const { projects, goToContact } = useCanva();
  const sceneRef = useThreeScene(initPortfolioScene, "portfolio");
  const [introSize, setIntroSize] = useState<IntroTerminalSize | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [measurerTarget, setMeasurerTarget] = useState<HTMLElement | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const touchStartRef = useRef<{ y: number; time: number } | null>(null);
  const wheelAccRef = useRef(0);
  const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastStartActivationRef = useRef(0);
  const [viewportConfig, setViewportConfig] = useState(() => ({
    width: 375,
    height: 812,
    isMobile: true,
    isTinyMobile: true,
    isTallMobile: true,
    isTabletPortrait: false,
    isTablet: false,
    isSmallDesktop: false,
    useCompactAboutLayout: false,
    isDesktop: false,
  }));

  const syncIntroSize = useCallback(() => {
    const size = getProjectsIntroSize();
    if (size.height <= 0) return;
    setIntroSize({ widthCss: size.widthCss, heightCss: size.heightCss });
  }, []);

  useEffect(() => {
    syncIntroSize();

    if (typeof document !== "undefined" && "fonts" in document) {
      void (document as Document & { fonts?: FontFaceSet }).fonts?.ready.then(syncIntroSize);
    }

    window.addEventListener("resize", syncIntroSize);

    return () => {
      window.removeEventListener("resize", syncIntroSize);
    };
  }, [syncIntroSize]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    setMeasurerTarget(document.body);
  }, []);

  useEffect(() => {
    const syncViewportConfig = () => {
      setViewportConfig(getViewportConfig());
    };

    syncViewportConfig();
    window.addEventListener("resize", syncViewportConfig);

    return () => {
      window.removeEventListener("resize", syncViewportConfig);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const contentZone = document.createElement("div");
    contentZone.setAttribute("data-portfolio-content-zone", "");
    contentZone.style.position = "absolute";
    contentZone.style.zIndex = "60";
    contentZone.style.overflowX = "hidden";
    contentZone.style.overflowY = "auto";
    contentZone.style.overscrollBehavior = "contain";
    contentZone.style.scrollbarWidth = "none";
    contentZone.style.setProperty("-ms-overflow-style", "none");
    contentZone.style.setProperty("-webkit-overflow-scrolling", "touch");
    contentZone.style.touchAction = "pan-y";
    contentZone.style.pointerEvents = "none";
    contentZone.className = "no-scrollbar";
    section.appendChild(contentZone);
    setPortalTarget(contentZone);

    let rafId: number;
    const sync = () => {
      const terminal = section.querySelector("[data-portfolio-terminal]") as HTMLElement | null;
      if (terminal && contentZone) {
        const rect = terminal.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        const headerHeight = 44;
        contentZone.style.left = `${rect.left - sectionRect.left}px`;
        contentZone.style.top = `${rect.top - sectionRect.top + headerHeight}px`;
        contentZone.style.width = `${rect.width}px`;
        contentZone.style.height = `${Math.max(0, rect.height - headerHeight)}px`;
      }
      rafId = requestAnimationFrame(sync);
    };
    rafId = requestAnimationFrame(sync);

    return () => {
      cancelAnimationFrame(rafId);
      contentZone.remove();
    };
  }, []);

  const triggerStart = useCallback(() => {
    (window as Window & { __portfolioPendingStart?: boolean }).__portfolioPendingStart = true;
    window.dispatchEvent(new CustomEvent("portfolioStartRequested"));
  }, []);

  const activateStart = useCallback(() => {
    const now = Date.now();
    if (now - lastStartActivationRef.current < 400) return;
    lastStartActivationRef.current = now;
    triggerStart();
  }, [triggerStart]);

  const handleStartButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    activateStart();
  }, [activateStart]);

  const handleStartButtonTouchEnd = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    activateStart();
  }, [activateStart]);

  const handleStartButtonPointerUp = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "touch") return;
    e.preventDefault();
    e.stopPropagation();
    activateStart();
  }, [activateStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { y: e.touches[0].clientY, time: Date.now() };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaY = touchStartRef.current.y - e.changedTouches[0].clientY;
    const elapsed = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;
    if (deltaY > 30 && elapsed < 1000) triggerStart();
  }, [triggerStart]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.deltaY <= 0) return;
    if (Math.abs(e.deltaY) < 5) return;
    activateStart();
  }, [activateStart]);

  const useCompactPortfolioLayout = viewportConfig.isTablet || viewportConfig.isSmallDesktop;
  const useCompactPortfolioContent = viewportConfig.isMobile;
  const useCompactPortfolioDensity = viewportConfig.isTablet || viewportConfig.isSmallDesktop;


  const portfolioMeasureWidth = viewportConfig.isMobile
    ? MOBILE_TERMINAL_WIDTH_CSS
    : viewportConfig.isTablet
      ? "clamp(360px, 60vw, 560px)"
      : viewportConfig.isSmallDesktop
        ? "clamp(420px, 56vw, 640px)"
      : "clamp(280px, 88vw, 640px)";
  const portfolioCtaMeasureWidth = viewportConfig.isMobile
    ? MOBILE_TERMINAL_WIDTH_CSS
    : viewportConfig.isTablet
      ? "clamp(360px, 58vw, 540px)"
      : viewportConfig.isSmallDesktop
        ? "clamp(400px, 50vw, 580px)"
      : "clamp(360px, 46vw, 600px)";
  const portfolioProjectMeasureWidth = viewportConfig.isMobile
    ? MOBILE_TERMINAL_WIDTH_CSS
    : viewportConfig.isTablet
      ? "clamp(380px, 60vw, 600px)"
      : viewportConfig.isSmallDesktop
        ? "clamp(420px, 52vw, 620px)"
      : "clamp(340px, 42vw, 680px)";
  const handlePortfolioMeasure = useCallback((key: string, height: number) => {
    const changed = setMeasuredPortfolioHeight(key, height);
    if (changed && key === "intro") {
      const size = getProjectsIntroSize();
      if (size.height > 0) {
        setIntroSize({
          widthCss: size.widthCss,
          heightCss: size.heightCss,
        });
      }
    }
  }, []);

  return (
    <>
      {measurerTarget &&
        createPortal(
          <>
            <StageMeasurer
              measureKey="intro"
              widthCss={portfolioMeasureWidth}
              onMeasureCustom={handlePortfolioMeasure}
            >
        <div
          className="relative flex flex-col bg-bg-surface/96 backdrop-blur-sm rounded-xl border border-border shadow-2xl overflow-hidden [html[data-theme='light']_&]:border-[#c8b99f] [html[data-theme='light']_&]:bg-[#f8f3e9]/96 [html[data-theme='light']_&]:shadow-[0_28px_80px_rgba(16,185,129,0.08),0_18px_40px_rgba(149,115,37,0.12)]"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-bg-panel border-b border-border flex-shrink-0 [html[data-theme='light']_&]:bg-[linear-gradient(90deg,rgba(16,185,129,0.07),rgba(245,158,11,0.06))] [html[data-theme='light']_&]:border-b-[#cdbda3]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
            </div>
            <div className="ml-4 text-xs text-muted font-mono text-nowrap [html[data-theme='light']_&]:text-[#756a5b]">
              {t("projects.terminal.header") || "tom@portfolio ~ % ./projects.sh"}
            </div>
          </div>
          <div className={PORTFOLIO_MEASURER_FRAME_CLASS}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary">❯</span>
              <span className="text-primary">./projects.sh</span>
            </div>
            <div className="text-text pl-4 mb-2">
              {t("projects.terminal.intro_line1") || "Initializing project showcase..."}
            </div>
            <div className="text-text pl-4 flex items-center gap-2 mb-3">
              <Check className="w-4 h-4 text-primary" />
              <span>{t("projects.terminal.project_count") || "5 featured projects loaded"}</span>
            </div>
            <div className="flex items-center gap-2 mb-2 mt-2">
              <span className="text-primary">❯</span>
              <span className="text-primary">cat README.md</span>
            </div>
            <div className="block text-text/82 pl-4 mb-2">
              {t("projects.terminal.intro_line2") || "This is a curated selection of my best work."}
            </div>
            <div className="block text-text/82 pl-4 mb-4">
              {t("projects.terminal.intro_line3") || "Each project demonstrates my skills in modern web development, from interactive 3D experiences to full-stack platforms."}
            </div>
            <div
              className={`${PORTFOLIO_PANEL_CTA_CLASS} mt-auto opacity-100`}
              style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom, 0px))" }}
            >
              <div className="flex items-center gap-2 text-text mb-3">
                <span className="text-primary">❯</span>
                <span>{t("projects.terminal.scroll_cta") || "Ready to explore?"}</span>
              </div>
              <Button type="button" variant="orange" size="md">
                <Play className="w-4 h-4" />
                {t("projects.start_exploring") || "Start exploring"}
              </Button>
            </div>
          </div>
        </div>
            </StageMeasurer>

      <StageMeasurer
        measureKey="cta"
        widthCss={portfolioCtaMeasureWidth}
        onMeasureCustom={handlePortfolioMeasure}
      >
        <div
          className="relative flex flex-col bg-bg-surface/96 backdrop-blur-sm rounded-xl border border-border shadow-2xl overflow-hidden [html[data-theme='light']_&]:border-[#c8b99f] [html[data-theme='light']_&]:bg-[#f8f3e9]/96 [html[data-theme='light']_&]:shadow-[0_28px_80px_rgba(16,185,129,0.08),0_18px_40px_rgba(149,115,37,0.12)]"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-bg-panel border-b border-border flex-shrink-0 [html[data-theme='light']_&]:bg-[linear-gradient(90deg,rgba(16,185,129,0.07),rgba(245,158,11,0.06))] [html[data-theme='light']_&]:border-b-[#cdbda3]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
            </div>
            <div className="ml-4 text-xs text-muted font-mono text-nowrap [html[data-theme='light']_&]:text-[#756a5b]">
              {t("projects.terminal.header") || "tom@portfolio ~ % ./projects.sh"}
            </div>
          </div>
          <div className={PORTFOLIO_MEASURER_FRAME_CLASS}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary">❯</span>
              <span className="text-primary">./wrap-up.sh</span>
            </div>
            <div className="text-text pl-4 flex items-center gap-2 mb-3">
              <Check className="w-4 h-4 text-primary" />
              <span>{t("projects.cta_complete") || "All projects explored!"}</span>
            </div>
            <div className="flex items-center gap-2 mb-2 mt-2">
              <span className="text-primary">❯</span>
              <span className="text-primary">echo $NEXT_STEP</span>
            </div>
            <h3 className="pl-4 text-xl md:text-2xl font-bold text-text leading-tight mb-4">
              {t("projects.cta_title") || "Let's build something together"}
            </h3>
            <div className="text-text/82 pl-4 mb-4">
              {t("projects.cta_description") || "I'm always excited to take on new challenges and bring ideas to life."}
            </div>
            <div
              className={`${PORTFOLIO_PANEL_CTA_CLASS} mt-auto opacity-100`}
              style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom, 0px))" }}
            >
              <div className="flex items-center gap-2 text-text">
                <span className="text-primary">❯</span>
                <span>{t("projects.cta_prompt") || "Ready to start a conversation?"}</span>
              </div>
            </div>
            <Button type="button" variant="orange" size="md" className="mt-3 self-start">
              {t("projects.cta_contact") || "Get in touch"}
            </Button>
          </div>
        </div>
      </StageMeasurer>

      {projects.map((project, index) => (
        <StageMeasurer
          key={`project-measure-${project.id}`}
          measureKey={`project-${index}`}
          widthCss={portfolioProjectMeasureWidth}
          onMeasureCustom={handlePortfolioMeasure}
        >
          <div
            className="relative flex flex-col bg-bg-surface/96 backdrop-blur-sm rounded-xl border border-border shadow-2xl overflow-hidden [html[data-theme='light']_&]:border-[#c8b99f] [html[data-theme='light']_&]:bg-[#f8f3e9]/96 [html[data-theme='light']_&]:shadow-[0_28px_80px_rgba(16,185,129,0.08),0_18px_40px_rgba(149,115,37,0.12)]"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-bg-panel border-b border-border flex-shrink-0 [html[data-theme='light']_&]:bg-[linear-gradient(90deg,rgba(16,185,129,0.07),rgba(245,158,11,0.06))] [html[data-theme='light']_&]:border-b-[#cdbda3]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
              </div>
              <div className="ml-4 text-xs text-muted font-mono text-nowrap [html[data-theme='light']_&]:text-[#756a5b]">
                {t("projects.terminal.header") || "tom@portfolio ~ % ./projects.sh"}
              </div>
              <div className="ml-auto flex items-center gap-3">
                <span className="text-lg font-bold text-primary font-mono">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <span className="text-muted">/</span>
                <span className="text-sm text-muted font-mono">
                  {projects.length.toString().padStart(2, "0")}
                </span>
              </div>
            </div>
            <ProjectPanel
              project={project}
              index={index}
              t={t}
              measure={true}
              useCompactContent={useCompactPortfolioContent}
              useCompactDensity={useCompactPortfolioDensity}
            />
          </div>
        </StageMeasurer>
      ))}
          </>,
          measurerTarget
        )}

      <section
        ref={sectionRef}
        data-canvas-projects
        data-portfolio-section
        aria-labelledby="projects-stage-title"
        className="fixed inset-0 bg-transparent overflow-hidden"
        style={{ visibility: "hidden", opacity: 0 }}
      >
        <div
          data-portfolio-terminal
          className="absolute flex flex-col bg-bg-surface/96 backdrop-blur-sm rounded-xl border border-border shadow-2xl overflow-hidden z-50 [html[data-theme='light']_&]:border-[#c8b99f] [html[data-theme='light']_&]:bg-[#f8f3e9]/96 [html[data-theme='light']_&]:shadow-[0_28px_80px_rgba(16,185,129,0.08),0_18px_40px_rgba(149,115,37,0.12)]"
          style={{
            width: introSize?.widthCss,
            height: introSize?.heightCss,
            maxHeight: viewportConfig.isDesktop && !viewportConfig.isSmallDesktop ? "80svh" : "75svh",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            visibility: introSize ? "visible" : "hidden",
          }}
        >
        <div
          data-portfolio-terminal-header
          className="flex items-center gap-2 px-4 py-3 bg-bg-panel border-b border-border flex-shrink-0 [html[data-theme='light']_&]:bg-[linear-gradient(90deg,rgba(16,185,129,0.07),rgba(245,158,11,0.06))] [html[data-theme='light']_&]:border-b-[#cdbda3]"
        >
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
          </div>
          <h2
            id="projects-stage-title"
            className="ml-4 text-xs text-muted font-mono text-nowrap hidden sm:block [html[data-theme='light']_&]:text-[#756a5b]"
          >
            {t("projects.terminal.header") || "tom@portfolio ~ % ./projects.sh"}
          </h2>
          <div data-project-counter className="ml-auto flex items-center gap-3 opacity-0">
            <span data-counter-number className="text-lg font-bold text-primary font-mono">
              01
            </span>
            <span className="text-muted">/</span>
            <span className="text-sm text-muted font-mono">
              {projects.length.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative overflow-hidden">
          <div
            data-project-panel="0"
            data-intro-panel
            className={`${PORTFOLIO_PANEL_FRAME_CLASS} pointer-events-auto bg-bg-surface`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            <div data-typewriter-line className="flex items-center gap-2 mb-2">
              <span className="text-primary">❯</span>
              <span
                data-typewriter
                data-typewriter-delay="100"
                data-typewriter-speed="30"
                className="text-primary"
              >
                ./projects.sh
              </span>
            </div>
            <div data-typewriter-line className="text-text pl-4 mb-2">
              <span data-typewriter data-typewriter-delay="300" data-typewriter-speed="18">
                {t("projects.terminal.intro_line1") || "Initializing project showcase..."}
              </span>
            </div>
            <div data-typewriter-line className="text-text pl-4 flex items-center gap-2 mb-3">
              <Check className="w-4 h-4 text-primary" />
              <span data-typewriter data-typewriter-delay="200" data-typewriter-speed="20">
                {t("projects.terminal.project_count") || "5 featured projects loaded"}
              </span>
            </div>
            <div data-typewriter-line className="flex items-center gap-2 mb-2 mt-2">
              <span className="text-primary">❯</span>
              <span
                data-typewriter
                data-typewriter-delay="300"
                data-typewriter-speed="30"
                className="text-primary"
              >
                cat README.md
              </span>
            </div>
            <div data-typewriter-line className="block text-text/82 pl-4 mb-2">
              <span data-typewriter data-typewriter-delay="200" data-typewriter-speed="12">
                {t("projects.terminal.intro_line2") ||
                  "This is a curated selection of my best work."}
              </span>
            </div>
            <div data-typewriter-line className="block text-text/82 pl-4 mb-4">
              <span data-typewriter data-typewriter-delay="100" data-typewriter-speed="8">
                {t("projects.terminal.intro_line3") ||
                  "Each project demonstrates my skills in modern web development, from interactive 3D experiences to full-stack platforms."}
              </span>
            </div>
            <div
              data-intro-cta
              className={`${PORTFOLIO_PANEL_CTA_CLASS} mt-auto`}
              style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom, 0px))" }}
            >
              <div className="flex items-center gap-2 text-text mb-3">
                <span className="text-primary">❯</span>
                <span>{t("projects.terminal.scroll_cta") || "Ready to explore?"}</span>
              </div>
              <Button
                data-start-projects-btn
                type="button"
                variant="orange"
                size="sm"
                className="pointer-events-auto touch-manipulation"
                onClick={handleStartButtonClick}
                onTouchEnd={handleStartButtonTouchEnd}
                onPointerUp={handleStartButtonPointerUp}
              >
                {t("projects.start_exploring") || "Explore"}
              </Button>
            </div>
          </div>

          <div
            data-project-panel={projects.length + 1}
            data-cta-panel
            className={`${PORTFOLIO_PANEL_FRAME_CLASS} opacity-0 bg-bg-surface`}
            style={{ pointerEvents: "none" }}
          >
            <div data-typewriter-line className="flex items-center gap-2 mb-2">
              <span className="text-primary">❯</span>
              <span
                data-typewriter
                data-typewriter-delay="100"
                data-typewriter-speed="25"
                className="text-primary"
              >
                ./wrap-up.sh
              </span>
            </div>
            <div data-typewriter-line className="text-text pl-4 flex items-center gap-2 mb-3">
              <Check className="w-4 h-4 text-primary" />
              <span data-typewriter data-typewriter-delay="300" data-typewriter-speed="18">
                {t("projects.cta_complete") || "All projects explored!"}
              </span>
            </div>
            <div data-typewriter-line className="flex items-center gap-2 mb-2 mt-2">
              <span className="text-primary">❯</span>
              <span
                data-typewriter
                data-typewriter-delay="350"
                data-typewriter-speed="25"
                className="text-primary"
              >
                echo $NEXT_STEP
              </span>
            </div>
            <h3
              data-typewriter-line
              data-cta-title
              className="pl-4 text-xl md:text-2xl font-bold text-text leading-tight mb-4"
            >
              <span data-typewriter data-typewriter-delay="300" data-typewriter-speed="22">
                {t("projects.cta_title") || "Let's build something together"}
              </span>
            </h3>
            <div data-typewriter-line className="text-text/82 pl-4 mb-4">
              <span data-typewriter data-typewriter-delay="250" data-typewriter-speed="10">
                {t("projects.cta_description") ||
                  "I'm always excited to take on new challenges and bring ideas to life."}
              </span>
            </div>
            <div
              className={`${PORTFOLIO_PANEL_CTA_CLASS} mt-auto pointer-events-auto`}
              data-typewriter-reveal
              data-typewriter-delay="400"
              style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom, 0px))" }}
            >
              <div className="flex items-center gap-2 text-text">
                <span className="text-primary">❯</span>
                <span>{t("projects.cta_prompt") || "Ready to start a conversation?"}</span>
              </div>
            </div>
            <Button
              data-contact-cta-btn
              type="button"
              variant="orange"
              size="md"
              className="mt-3 self-start pointer-events-auto touch-manipulation relative z-[100010]"
              data-typewriter-reveal
              data-typewriter-delay="400"
              onClick={goToContact}
            >
              {t("projects.cta_contact") || "Get in touch"}
            </Button>
          </div>
        </div>
        </div>

        <div
        data-portfolio-3d-container
        data-3d-container="portfolio-hex"
        ref={sceneRef}
        aria-hidden="true"
        className={`absolute opacity-0 pointer-events-none inset-0 ${
          useCompactPortfolioLayout ? "top-0 bottom-[2%] left-[47%] right-0" : "lg:top-0 lg:bottom-0 lg:left-[45%] lg:right-0"
        }`}
        style={{ zIndex: 55 }}
      />

        {portalTarget &&
          createPortal(
            projects.map((project, index) => (
              <ProjectPanel
                key={project.id}
                project={project}
                index={index}
                t={t}
                useCompactContent={useCompactPortfolioContent}
                useCompactDensity={useCompactPortfolioDensity}
              />
            )),
            portalTarget
          )}

        <div
        data-scroll-indicator
        aria-hidden="true"
        className="hidden lg:flex fixed bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 opacity-0 pointer-events-none z-20"
      >
        <span className="text-xs text-text/72 font-mono">
          {t("projects.scroll_explore") || "Scroll to explore"}
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-text/45 flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
        </div>
        </div>
      </section>
    </>
  );
}
