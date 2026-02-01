"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "@/contexts/TranslationProvider";
import { useThreeScene } from "@/hooks/useThreeScene";
import { initPortfolioScene } from "@/utils/animations/portfolio-3d-scene";
import { useCanva } from "@/components/ui/Canva";
import { Button } from "@/components/ui/Button";
import { Check, Play } from "lucide-react";
import ProjectPanel from "@/components/sections/ProjectPanel";
import { getProjectsIntroSize } from "@/utils/terminal-sizes";

const INTRO_SIZE_FALLBACK = {
  width: "min(640px, 88vw)",
  height: "min(92vh, 75vh)",
};

export default function ProjectsSection() {
  const { t } = useTranslation();
  const { projects } = useCanva();
  const sceneRef = useThreeScene(initPortfolioScene, "portfolio");
  const [introSize, setIntroSize] = useState(INTRO_SIZE_FALLBACK);

  useEffect(() => {
    setIntroSize(getProjectsIntroSize());
  }, []);

  return (
    <section
      data-canvas-projects
      data-portfolio-section
      className="fixed inset-0 bg-transparent overflow-hidden"
      style={{
        visibility: "hidden",
        opacity: 0,
      }}
    >
      {/* 3D Scene Container - positioned on the RIGHT half of the screen */}
      <div
        data-portfolio-3d-container
        data-3d-container="portfolio-hex"
        ref={sceneRef}
        className="absolute opacity-0 pointer-events-none inset-0 lg:top-0 lg:bottom-0 lg:left-[45%] lg:right-0"
        style={{ zIndex: 1 }}
      />

      {/* Scroll indicator - bottom center, shown when viewing projects */}
      <div
        data-scroll-indicator
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 pointer-events-none z-20"
      >
        <span className="text-xs text-white/50 font-mono">
          {t("projects.scroll_explore") || "Scroll to explore"}
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
        </div>
      </div>

      {/* Portfolio Terminal - ABOVE scroller (z-50) so buttons work, pointer-events-none lets scroll through */}
      <div
        data-portfolio-terminal
        className="absolute flex flex-col bg-bg-surface/95 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50 pointer-events-none"
        style={{
          width: introSize.width,
          height: introSize.height,
          left: "50%",
          top: "50%",
        }}
      >
        {/* Terminal header */}
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
          {/* Project counter - hidden initially, shown when viewing projects */}
          <div data-project-counter className="ml-auto flex items-center gap-3 opacity-0">
            <span data-counter-number className="text-lg font-bold text-primary font-mono">
              01
            </span>
            <span className="text-white/30">/</span>
            <span className="text-sm text-white/50 font-mono">
              {projects.length.toString().padStart(2, "0")}
            </span>
            <span data-counter-name className="text-xs text-white/40 font-mono hidden md:block">
              {projects[0]?.client || ""}
            </span>
          </div>
        </div>

        {/* Terminal body — flex column on mobile for two-zone layout, relative block on desktop */}
        <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col lg:block">
          {/* Intro content - visible initially (uses full terminal body) */}
          <div
            data-project-panel="0"
            data-intro-panel
            className="absolute inset-0 flex flex-col justify-start p-4 md:p-6 font-mono text-sm leading-relaxed overflow-hidden pointer-events-auto"
          >
            {/* Command line */}
            <div data-typewriter-line className="flex items-center gap-2 mb-2">
              <span className="text-primary">❯</span>
              <span data-typewriter data-typewriter-delay="100" data-typewriter-speed="30" className="text-white">./projects.sh</span>
            </div>

            {/* Output line */}
            <div data-typewriter-line className="text-primary pl-4 mb-2">
              <span data-typewriter data-typewriter-delay="300" data-typewriter-speed="18">{t("projects.terminal.intro_line1") || "Initializing project showcase..."}</span>
            </div>

            {/* Success line with icon */}
            <div data-typewriter-line className="text-primary pl-4 flex items-center gap-2 mb-3">
              <Check className="w-4 h-4" />
              <span data-typewriter data-typewriter-delay="200" data-typewriter-speed="20">{t("projects.terminal.project_count") || "5 featured projects loaded"}</span>
            </div>

            {/* Second command - shown on taller mobiles (h >= 700px) and desktop */}
            <div data-typewriter-line className="flex items-center gap-2 mb-2 mt-2">
              <span className="text-primary">❯</span>
              <span data-typewriter data-typewriter-delay="300" data-typewriter-speed="30" className="text-white">cat README.md</span>
            </div>

            {/* Info paragraphs - shown on taller mobiles (h >= 700px) and desktop */}
            <div data-typewriter-line className="block text-secondary/80 pl-4 mb-2">
              <span data-typewriter data-typewriter-delay="200" data-typewriter-speed="12">{t("projects.terminal.intro_line2") || "This is a curated selection of my best work."}</span>
            </div>
            <div data-typewriter-line className="block text-secondary/80 pl-4 mb-4">
              <span data-typewriter data-typewriter-delay="100" data-typewriter-speed="8">{t("projects.terminal.intro_line3") || "Each project demonstrates my skills in modern web development, from interactive 3D experiences to full-stack platforms."}</span>
            </div>

            {/* CTA Button to start viewing projects */}
            <div data-intro-cta className="mt-auto pt-3 border-t border-white/10 opacity-0">
              <div className="flex items-center gap-2 text-white mb-3">
                <span className="text-primary">❯</span>
                <span>{t("projects.terminal.scroll_cta") || "Ready to explore?"}</span>
              </div>
              <Button
                data-start-projects-btn
                type="button"
                variant="orange"
                size="md"
                className="pointer-events-auto"
              >
                <Play className="w-4 h-4" />
                {t("projects.start_exploring") || "Start exploring"}
              </Button>
            </div>
          </div>

          {/* ===== MOBILE TWO-ZONE LAYOUT for project panels ===== */}
          {/* Top zone: 3D model area — visible on mobile only */}
          <div
            data-portfolio-3d-zone
            className="h-[50%] flex-shrink-0 lg:hidden"
          />

          {/* Bottom zone: project content — takes bottom half on mobile, full area on desktop */}
          <div
            data-portfolio-content-zone
            className="flex-1 min-h-0 relative overflow-hidden lg:absolute lg:inset-0"
          >
            {/* Project panels - shown after terminal morphs to left */}
            {projects.map((project, index) => (
              <ProjectPanel key={project.id} project={project} index={index} t={t} />
            ))}
          </div>

          {/* CTA panel - last slide (uses full terminal body, no 3D zone) */}
          <div
            data-project-panel={projects.length + 1}
            data-cta-panel
            className="absolute inset-0 flex flex-col justify-start p-4 md:p-6 font-mono text-sm leading-relaxed overflow-hidden opacity-0 pointer-events-none"
          >
            {/* Command line */}
            <div data-typewriter-line className="flex items-center gap-2 mb-2">
              <span className="text-primary">❯</span>
              <span data-typewriter data-typewriter-delay="100" data-typewriter-speed="25" className="text-white">./wrap-up.sh</span>
            </div>

            {/* Success line */}
            <div data-typewriter-line className="text-primary pl-4 flex items-center gap-2 mb-3">
              <Check className="w-4 h-4" />
              <span data-typewriter data-typewriter-delay="300" data-typewriter-speed="18">{t("projects.cta_complete") || "All projects explored!"}</span>
            </div>

            {/* Question command */}
            <div data-typewriter-line className="flex items-center gap-2 mb-2 mt-2">
              <span className="text-primary">❯</span>
              <span data-typewriter data-typewriter-delay="350" data-typewriter-speed="25" className="text-white">echo $NEXT_STEP</span>
            </div>

            {/* CTA Title */}
            <h3
              data-typewriter-line
              data-cta-title
              className="pl-4 text-xl md:text-2xl font-bold text-white leading-tight mb-4"
            >
              <span data-typewriter data-typewriter-delay="300" data-typewriter-speed="22">{t("projects.cta_title") || "Let's build something together"}</span>
            </h3>

            {/* CTA Description */}
            <div data-typewriter-line className="text-secondary/80 pl-4 mb-4">
              <span data-typewriter data-typewriter-delay="250" data-typewriter-speed="10">{t("projects.cta_description") || "I'm always excited to take on new challenges and bring ideas to life."}</span>
            </div>

            {/* CTA Button */}
            <div data-cta-buttons-wrapper className="mt-auto pt-3 border-t border-white/10 opacity-0" data-typewriter-reveal data-typewriter-delay="400">
              <div className="flex items-center gap-2 text-white mb-3">
                <span className="text-primary">❯</span>
                <span>{t("projects.cta_prompt") || "Ready to start a conversation?"}</span>
              </div>
              <Button
                data-contact-cta-btn
                type="button"
                variant="orange"
                size="md"
              >
                {t("projects.cta_contact") || "Get in touch"}
              </Button>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
