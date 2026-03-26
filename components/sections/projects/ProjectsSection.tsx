"use client";

import { useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "@/contexts/TranslationProvider";
import { useThreeScene } from "@/hooks/useThreeScene";
import { usePortfolioSetup } from "@/hooks/usePortfolioSetup";
import { usePortfolioGestures } from "@/hooks/usePortfolioGestures";
import { initPortfolioScene } from "@/utils/animations/portfolio-3d-scene";
import {
  getProjectsIntroSize,
  setMeasuredPortfolioHeight,
} from "@/utils/terminal-sizes";
import { useCanva } from "@/components/ui/Canva";
import ProjectPanel from "./ProjectPanel";
import PortfolioMeasurers from "./PortfolioMeasurers";
import {
  PortfolioCtaPanel,
  PortfolioIntroPanel,
} from "./PortfolioTerminalPanels";
import ScrollIndicator from "./ScrollIndicator";
import TerminalFrame from "@/components/ui/terminal/TerminalFrame";

export default function ProjectsSection() {
  const { t } = useTranslation();
  const { projects, goToContact } = useCanva();
  const sceneRef = useThreeScene(initPortfolioScene, "portfolio");
  const {
    sectionRef,
    viewportConfig,
    introSize,
    setIntroSize,
    portalTarget,
    measurerTarget,
  } = usePortfolioSetup();
  const {
    handleStartButtonClick,
    handleStartButtonTouchEnd,
    handleStartButtonPointerUp,
    handleTouchStart,
    handleTouchEnd,
    handleWheel,
  } = usePortfolioGestures();

  const handleMeasure = useCallback(
    (key: string, height: number) => {
      const changed = setMeasuredPortfolioHeight(key, height);
      if (changed && key === "intro") {
        const size = getProjectsIntroSize();
        if (size.height > 0)
          setIntroSize({ widthCss: size.widthCss, heightCss: size.heightCss });
      }
    },
    [setIntroSize],
  );

  const useCompactLayout =
    viewportConfig.isTablet || viewportConfig.isSmallDesktop;
  const useCompactContent = viewportConfig.isMobile;
  const useCompactDensity =
    viewportConfig.isTablet || viewportConfig.isSmallDesktop;

  return (
    <>
      {measurerTarget && (
        <PortfolioMeasurers
          t={t}
          projects={projects}
          viewportConfig={viewportConfig}
          measurerTarget={measurerTarget}
          onMeasure={handleMeasure}
        />
      )}

      <section
        ref={sectionRef}
        data-canvas-projects
        data-portfolio-section
        aria-labelledby="projects-stage-title"
        className="fixed inset-0 bg-transparent overflow-hidden"
        style={{ visibility: "hidden", opacity: 0 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <TerminalFrame
          data-portfolio-terminal
          shellClassName="absolute z-50"
          title={
            t("projects.terminal.header") || "tom@portfolio ~ % ./projects.sh"
          }
          titleId="projects-stage-title"
          headerAsHeading
          terminalHeader
          liveCounter={{ total: projects.length }}
          style={{
            width: introSize?.widthCss,
            height: introSize?.heightCss,
            maxHeight:
              viewportConfig.isDesktop && !viewportConfig.isSmallDesktop
                ? "80svh"
                : "75svh",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            visibility: introSize ? "visible" : "hidden",
          }}
        >
          <div className="flex-1 min-h-0 relative overflow-hidden">
            <PortfolioIntroPanel
              t={t}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              onStartClick={handleStartButtonClick}
              onStartTouchEnd={handleStartButtonTouchEnd}
              onStartPointerUp={handleStartButtonPointerUp}
            />
            <PortfolioCtaPanel
              t={t}
              projectCount={projects.length}
              onContact={goToContact}
            />
          </div>
        </TerminalFrame>

        <div
          data-portfolio-3d-container
          data-3d-container="portfolio-hex"
          ref={sceneRef}
          aria-hidden="true"
          className={`absolute opacity-0 pointer-events-none inset-0 ${
            useCompactLayout
              ? "top-0 bottom-[2%] left-[47%] right-0"
              : "lg:top-0 lg:bottom-0 lg:left-[45%] lg:right-0"
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
                useCompactContent={useCompactContent}
                useCompactDensity={useCompactDensity}
              />
            )),
            portalTarget,
          )}

        <ScrollIndicator label={t("projects.scroll_explore") || "Scroll to explore"} />
      </section>
    </>
  );
}
