// portfolio-page.tsx - PASS CLICK HANDLER & TRACK CURRENT PROJECT
"use client";

import { getAllProjects } from "@/data/projects";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useThreeScene } from "@/hooks/useThreeScene";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { initMenuAnimations } from "@/utils/animations/menu-animations";
import { initPortfolioScene } from "@/utils/animations/portfolio-3d-scene";
import { initPortfolioScroll } from "@/utils/animations/portfolio-scroll-animation";
import { initTetrisTextAnimation } from "@/utils/animations/tetris-text-animation";
import { initBlobCursor } from "@/utils/animations/blob-cursor-animation";
import { useState, useEffect } from "react";
import ProjectModal from "@/components/portfolio/ProjectModal";
import BlobCursor from "@/components/ui/BlobCursor";
import ProjectCounter from "@/components/portfolio/ProjectCounter";
import type { Project } from "@/types/project";

export default function PortfolioPage() {
  const { t, language } = useTranslation();
  const projects = getAllProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  const containerRef = useThreeScene(initPortfolioScene, "portfolio");

  useGSAPAnimations(() => {
    initMenuAnimations();
    initTetrisTextAnimation();
    initPortfolioScroll();
    initBlobCursor(() => {
      const portfolioScene = (window as any).__portfolioScene;
      if (portfolioScene && portfolioScene.currentProject !== undefined) {
        const project = projects[portfolioScene.currentProject];
        if (project) {
          setSelectedProject(project);
        }
      }
    });
  });

  return (
    <>
      <div className="relative">
        <section
          data-portfolio-section
          className="relative bg-bg"
          style={{ height: `${(projects.length + 1) * 400}vh` }}
        >
          <Menu />

          <div
            className="sticky top-0 h-screen overflow-visible flex items-center justify-center"
            style={{ zIndex: 10 }}
          >
            <div
              ref={containerRef}
              data-3d-container="portfolio-hex"
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 0 }}
            />

            <div
              data-projects-header
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full px-6 max-w-4xl"
            >
              <p
                data-projects-subtitle
                className="text-sm font-mono text-text/60 tracking-wide mb-3"
              >
                {t("portfolio.hero.subtitle")}
              </p>
              <h1
                data-projects-title
                className="text-5xl md:text-6xl lg:text-7xl"
              >
                {t("portfolio.hero.title")}
              </h1>
            </div>

            {/* Scroll hint indicator */}
            <div
              data-scroll-hint
              className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
              style={{ opacity: 0 }}
            >
              <p className="text-xs font-mono text-text/50 uppercase tracking-widest">
                {t("portfolio.hero.scroll_hint")}
              </p>
              <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
                <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
              </div>
            </div>

            <ProjectCounter total={projects.length} />

            {projects.map((project, index) => (
              <div
                key={project.id}
                data-project-panel={index}
                className="absolute w-full h-full pointer-events-auto"
                style={{ opacity: 0 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto h-full px-6 lg:px-12">
                  <div className="hidden lg:block" />

                  <div className="space-y-6 lg:space-y-8 relative z-10">
                    <div
                      data-project-badge
                      className="inline-flex items-center gap-2 px-4 py-2 bg-surface/50 backdrop-blur-sm rounded-full border border-border/50"
                      style={{ opacity: 0 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-mono text-text/70 tracking-wide uppercase">
                        {project.year} • {project.client}
                      </span>
                    </div>

                    <h2
                      data-project-title
                      className="text-5xl lg:text-7xl xl:text-8xl font-black gradient-primary bg-clip-text text-transparent leading-tight"
                      style={{ opacity: 0 }}
                    >
                      {t(project.title)}
                    </h2>

                    <div
                      data-project-description
                      className="bg-surface/30 backdrop-blur-sm p-6 rounded-xl border border-border/30"
                      style={{ opacity: 0 }}
                    >
                      <p className="text-lg lg:text-xl text-text/90 leading-relaxed">
                        {t(project.preview.tagline)}
                      </p>
                    </div>

                    {project.technologies && (
                      <div data-project-techs className="flex flex-wrap gap-2" style={{ opacity: 0 }}>
                        {project.technologies
                          .slice(0, 6)
                          .map((tech: string, techIndex: number) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1.5 text-xs font-mono bg-primary/10 text-primary rounded-lg border border-primary/20"
                            >
                              {tech}
                            </span>
                          ))}
                      </div>
                    )}

                    <div data-project-button className="relative" style={{ opacity: 0 }}>
                      <div className="hidden lg:block relative">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="relative text-lg font-mono text-text/70 hover:text-text transition-colors z-10"
                        >
                          {t(project.preview.cta)}
                          <svg
                            className="inline-block w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </button>
                      </div>

                      <button
                        onClick={() => setSelectedProject(project)}
                        className="lg:hidden w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-bg font-mono rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {t(project.preview.cta)}
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div
              data-project-panel={projects.length}
              className="absolute inset-0 flex items-center justify-center px-6 pointer-events-auto"
              style={{ opacity: 0 }}
            >
              <div className="max-w-4xl text-center space-y-12">
                <div className="space-y-6">
                  <h2
                    data-cta-title
                    className="text-6xl lg:text-8xl font-black gradient-primary bg-clip-text text-transparent leading-tight opacity-0 translate-y-8"
                  >
                    {t("portfolio.cta.title")}
                  </h2>

                  <p
                    data-cta-description
                    className="text-lg lg:text-xl text-text/70 leading-relaxed max-w-2xl mx-auto opacity-0 translate-y-8"
                  >
                    {t("portfolio.cta.description")}
                  </p>
                </div>

                <div
                  data-cta-buttons
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 translate-y-8"
                >
                  <Button
                    asLink
                    href={`/${language}/contact`}
                    variant="filled"
                    size="lg"
                    className="flex-none"
                  >
                    {t("portfolio.cta.primaryButton")}
                  </Button>
                  <Button
                    asLink
                    href={`/${language}`}
                    variant="outlined"
                    size="lg"
                    className="flex-none"
                  >
                    {t("portfolio.cta.secondaryButton")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <BlobCursor />
    </>
  );
}
