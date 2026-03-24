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
import { getProjectsIntroSize } from "@/utils/terminal-sizes";
import {
  PORTFOLIO_PANEL_CTA_CLASS,
  PORTFOLIO_PANEL_FRAME_CLASS,
} from "@/components/sections/portfolio-panel-styles";

const INTRO_SIZE_FALLBACK = {
  widthCss: "min(640px, 88vw)",
  heightCss: "min(92vh, 75vh)",
};

export default function ProjectsSection() {
  const { t } = useTranslation();
  const { projects, goToContact } = useCanva();
  const sceneRef = useThreeScene(initPortfolioScene, "portfolio");
  const [introSize, setIntroSize] = useState(INTRO_SIZE_FALLBACK);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const touchStartRef = useRef<{ y: number; time: number } | null>(null);
  const wheelAccRef = useRef(0);
  const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const size = getProjectsIntroSize();
    setIntroSize({ widthCss: size.widthCss, heightCss: size.heightCss });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const contentZone = document.createElement("div");
    contentZone.setAttribute("data-portfolio-content-zone", "");
    contentZone.style.position = "absolute";
    contentZone.style.zIndex = "60";
    contentZone.style.overflow = "hidden";
    contentZone.style.pointerEvents = "none";
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
    wheelAccRef.current += e.deltaY;
    if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    wheelTimeoutRef.current = setTimeout(() => {
      wheelAccRef.current = 0;
    }, 300);
    if (wheelAccRef.current >= 50) {
      wheelAccRef.current = 0;
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
      triggerStart();
    }
  }, [triggerStart]);

  return (
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
        className="absolute flex flex-col bg-bg-surface/96 backdrop-blur-sm rounded-xl border border-border shadow-2xl overflow-hidden z-50 pointer-events-none [html[data-theme='light']_&]:border-[#c8b99f] [html[data-theme='light']_&]:bg-[#f8f3e9]/96 [html[data-theme='light']_&]:shadow-[0_28px_80px_rgba(16,185,129,0.08),0_18px_40px_rgba(149,115,37,0.12)]"
        style={{
          width: introSize.widthCss,
          height: introSize.heightCss,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
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
            className="ml-4 text-xs text-muted font-mono text-nowrap [html[data-theme='light']_&]:text-[#756a5b]"
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
            <span
              data-counter-name
              className="text-xs text-muted font-mono hidden md:block"
            >
              {projects[0]?.client || ""}
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
            >
              <div className="flex items-center gap-2 text-text mb-3">
                <span className="text-primary">❯</span>
                <span>{t("projects.terminal.scroll_cta") || "Ready to explore?"}</span>
              </div>
              <Button
                data-start-projects-btn
                type="button"
                variant="orange"
                size="md"
                className="pointer-events-auto"
                onClick={triggerStart}
              >
                <Play className="w-4 h-4" />
                {t("projects.start_exploring") || "Start exploring"}
              </Button>
            </div>
          </div>

          <div
            data-project-panel={projects.length + 1}
            data-cta-panel
            className={`${PORTFOLIO_PANEL_FRAME_CLASS} opacity-0 pointer-events-none bg-bg-surface`}
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
              data-cta-buttons-wrapper
              className={`${PORTFOLIO_PANEL_CTA_CLASS} mt-auto`}
              data-typewriter-reveal
              data-typewriter-delay="400"
            >
              <div className="flex items-center gap-2 text-text mb-3">
                <span className="text-primary">❯</span>
                <span>{t("projects.cta_prompt") || "Ready to start a conversation?"}</span>
              </div>
              <Button
                data-contact-cta-btn
                type="button"
                variant="orange"
                size="md"
                onClick={goToContact}
              >
                {t("projects.cta_contact") || "Get in touch"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        data-portfolio-3d-container
        data-3d-container="portfolio-hex"
        ref={sceneRef}
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none inset-0 lg:top-0 lg:bottom-0 lg:left-[45%] lg:right-0"
        style={{ zIndex: 55 }}
      />

      {portalTarget &&
        createPortal(
          projects.map((project, index) => (
            <ProjectPanel key={project.id} project={project} index={index} t={t} />
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
  );
}
