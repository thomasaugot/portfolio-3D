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

const INTRO_SIZE_FALLBACK = {
  widthCss: "min(640px, 88vw)",
  heightCss: "min(92vh, 75vh)",
};

export default function ProjectsSection() {
  const { t } = useTranslation();
  const { projects } = useCanva();
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

  // Create portal target and start position sync
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Create the floating content zone
    const contentZone = document.createElement("div");
    contentZone.setAttribute("data-portfolio-content-zone", "");
    contentZone.style.position = "absolute";
    contentZone.style.zIndex = "60";
    contentZone.style.overflow = "hidden";
    contentZone.style.pointerEvents = "none";
    section.appendChild(contentZone);
    setPortalTarget(contentZone);

    // Sync position with terminal body on every frame
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
        contentZone.style.height = `${rect.height - headerHeight}px`;
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
    const startBtn = document.querySelector("[data-start-projects-btn]") as HTMLElement;
    if (startBtn) startBtn.click();
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
    wheelTimeoutRef.current = setTimeout(() => { wheelAccRef.current = 0; }, 300);
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
      className="fixed inset-0 bg-transparent overflow-hidden"
      style={{ visibility: "hidden", opacity: 0 }}
    >
      {/* LAYER 1 (z-50): Terminal */}
      <div
        data-portfolio-terminal
        className="absolute flex flex-col bg-bg-surface/95 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50 pointer-events-none"
        style={{
          width: introSize.widthCss,
          height: introSize.heightCss,
          left: "50%",
          top: "50%",
        }}
      >
        <div
          data-portfolio-terminal-header
          className="flex items-center gap-2 px-4 py-3 bg-bg-panel border-b border-white/10 flex-shrink-0"
        >
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
          </div>
          <span className="ml-4 text-xs text-white/40 font-mono text-nowrap">
            {t("projects.terminal.header") || "tom@portfolio ~ % ./projects.sh"}
          </span>
          <div data-project-counter className="ml-auto flex items-center gap-3 opacity-0">
            <span data-counter-number className="text-lg font-bold text-primary font-mono">01</span>
            <span className="text-white/30">/</span>
            <span className="text-sm text-white/50 font-mono">{projects.length.toString().padStart(2, "0")}</span>
            <span data-counter-name className="text-xs text-white/40 font-mono hidden md:block">{projects[0]?.client || ""}</span>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative overflow-hidden">
          {/* Intro panel */}
          <div
            data-project-panel="0"
            data-intro-panel
            className="absolute inset-0 flex flex-col justify-start p-4 md:p-6 font-mono text-sm leading-relaxed overflow-hidden pointer-events-auto bg-bg-surface"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            <div data-typewriter-line className="flex items-center gap-2 mb-2">
              <span className="text-primary">❯</span>
              <span data-typewriter data-typewriter-delay="100" data-typewriter-speed="30" className="text-white">./projects.sh</span>
            </div>
            <div data-typewriter-line className="text-primary pl-4 mb-2">
              <span data-typewriter data-typewriter-delay="300" data-typewriter-speed="18">{t("projects.terminal.intro_line1") || "Initializing project showcase..."}</span>
            </div>
            <div data-typewriter-line className="text-primary pl-4 flex items-center gap-2 mb-3">
              <Check className="w-4 h-4" />
              <span data-typewriter data-typewriter-delay="200" data-typewriter-speed="20">{t("projects.terminal.project_count") || "5 featured projects loaded"}</span>
            </div>
            <div data-typewriter-line className="flex items-center gap-2 mb-2 mt-2">
              <span className="text-primary">❯</span>
              <span data-typewriter data-typewriter-delay="300" data-typewriter-speed="30" className="text-white">cat README.md</span>
            </div>
            <div data-typewriter-line className="block text-secondary/80 pl-4 mb-2">
              <span data-typewriter data-typewriter-delay="200" data-typewriter-speed="12">{t("projects.terminal.intro_line2") || "This is a curated selection of my best work."}</span>
            </div>
            <div data-typewriter-line className="block text-secondary/80 pl-4 mb-4">
              <span data-typewriter data-typewriter-delay="100" data-typewriter-speed="8">{t("projects.terminal.intro_line3") || "Each project demonstrates my skills in modern web development, from interactive 3D experiences to full-stack platforms."}</span>
            </div>
            <div data-intro-cta className="mt-auto pt-3 border-t border-white/10 opacity-0">
              <div className="flex items-center gap-2 text-white mb-3">
                <span className="text-primary">❯</span>
                <span>{t("projects.terminal.scroll_cta") || "Ready to explore?"}</span>
              </div>
              <Button data-start-projects-btn type="button" variant="orange" size="md" className="pointer-events-auto">
                <Play className="w-4 h-4" />
                {t("projects.start_exploring") || "Start exploring"}
              </Button>
            </div>
          </div>

          {/* CTA panel - stays inside terminal */}
          <div
            data-project-panel={projects.length + 1}
            data-cta-panel
            className="absolute inset-0 flex flex-col justify-start p-4 md:p-6 font-mono text-sm leading-relaxed overflow-hidden opacity-0 pointer-events-none bg-bg-surface"
          >
            <div data-typewriter-line className="flex items-center gap-2 mb-2">
              <span className="text-primary">❯</span>
              <span data-typewriter data-typewriter-delay="100" data-typewriter-speed="25" className="text-white">./wrap-up.sh</span>
            </div>
            <div data-typewriter-line className="text-primary pl-4 flex items-center gap-2 mb-3">
              <Check className="w-4 h-4" />
              <span data-typewriter data-typewriter-delay="300" data-typewriter-speed="18">{t("projects.cta_complete") || "All projects explored!"}</span>
            </div>
            <div data-typewriter-line className="flex items-center gap-2 mb-2 mt-2">
              <span className="text-primary">❯</span>
              <span data-typewriter data-typewriter-delay="350" data-typewriter-speed="25" className="text-white">echo $NEXT_STEP</span>
            </div>
            <h3 data-typewriter-line data-cta-title className="pl-4 text-xl md:text-2xl font-bold text-white leading-tight mb-4">
              <span data-typewriter data-typewriter-delay="300" data-typewriter-speed="22">{t("projects.cta_title") || "Let's build something together"}</span>
            </h3>
            <div data-typewriter-line className="text-secondary/80 pl-4 mb-4">
              <span data-typewriter data-typewriter-delay="250" data-typewriter-speed="10">{t("projects.cta_description") || "I'm always excited to take on new challenges and bring ideas to life."}</span>
            </div>
            <div data-cta-buttons-wrapper className="mt-auto pt-3 border-t border-white/10 opacity-0" data-typewriter-reveal data-typewriter-delay="400">
              <div className="flex items-center gap-2 text-white mb-3">
                <span className="text-primary">❯</span>
                <span>{t("projects.cta_prompt") || "Ready to start a conversation?"}</span>
              </div>
              <Button data-contact-cta-btn type="button" variant="orange" size="md">
                {t("projects.cta_contact") || "Get in touch"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 2 (z-55): 3D Scene - above terminal */}
      <div
        data-portfolio-3d-container
        data-3d-container="portfolio-hex"
        ref={sceneRef}
        className="absolute opacity-0 pointer-events-none inset-0 lg:top-0 lg:bottom-0 lg:left-[45%] lg:right-0"
        style={{ zIndex: 55 }}
      />

      {/* LAYER 3 (z-60): Project panels - portaled here, above 3D */}
      {portalTarget && createPortal(
        projects.map((project, index) => (
          <ProjectPanel key={project.id} project={project} index={index} t={t} />
        )),
        portalTarget
      )}

      {/* Scroll indicator - desktop only */}
      <div
        data-scroll-indicator
        className="hidden lg:flex fixed bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 opacity-0 pointer-events-none z-20"
      >
        <span className="text-xs text-white/50 font-mono">
          {t("projects.scroll_explore") || "Scroll to explore"}
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
