"use client";

import { useState, useEffect, useRef } from "react";
import { getFeaturedProjects } from "@/data/projects";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { initProjects3DScene } from "@/utils/animations/projects-3d-scene";
import { markSceneReady } from "@/hooks/useThreeScene";
import { debug } from "@/utils/debug";
import ProjectModal from "@/components/portfolio/ProjectModal";
import type { Project } from "@/types/project";

export default function ProjectsShowcase() {
  const { t } = useTranslation();
  const projects = getFeaturedProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    let cleanupFn: (() => void) | undefined;

    // Initialize immediately without delay
    const initScene = async () => {
      debug.log("🎬 ProjectsShowcase: Initializing 3D scenes...");
      try {
        cleanupFn = await initProjects3DScene();
        markSceneReady("projects");
      } catch (error) {
        debug.error("Failed to init projects scene:", error);
        markSceneReady("projects");
      }
    };

    initScene();

    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, []);

  return (
    <>
      <div className="hidden lg:block relative overflow-visible">
        <section
          data-projects-section
          className="relative overflow-visible bg-gradient-to-b from-bg via-bg to-transparent"
          style={{ height: `${projects.length * 150}vh` }}
        >
          <div
            className="sticky top-0 h-screen overflow-visible flex items-center justify-center"
            style={{
              perspective: "2000px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            <div
              data-projects-header
              className="absolute top-16 left-16 z-50 pointer-events-none"
            >
              <h3
                data-projects-title
                className="title-section mb-4 md:mb-6 flex flex-wrap pb-1 pr-2 relative z-10 max-w-full md:max-w-[40vw]"
                style={{
                  transform: "translateX(0)",
                  width: "max-content",
                  willChange: "opacity, transform",
                }}
              >
                {t("homepage.projects_section.title")}
              </h3>
              <h2 data-projects-subtitle className="subtitle gradient-text">
                {t("homepage.projects_section.subtitle")}
              </h2>
            </div>

            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]" />
              <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[150px]" />
            </div>

            {projects.map((project, index) => (
              <div
                key={project.id}
                data-project-panel={index}
                className="absolute w-full h-[90%] bottom-0 flex items-center justify-center"
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                }}
              >
                <div
                  data-project-image
                  data-3d-container={`project-${index}`}
                  className="absolute left-0 top-0 w-[60vw] h-screen overflow-visible pointer-events-none"
                  style={{
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                    zIndex: 1,
                  }}
                />

                <div className="w-full max-w-[1400px] px-20 grid grid-cols-2 gap-20 items-center relative z-10">
                  <div className="relative w-full h-[500px]" />

                  <div
                    data-project-content
                    className="space-y-6 lg:space-y-8"
                    style={{
                      transformStyle: "preserve-3d",
                      willChange: "transform, opacity",
                    }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-bg/50 backdrop-blur-sm rounded-full border border-border/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-label">
                        {project.year} • {project.client}
                      </span>
                    </div>

                    <h2 className="title-section gradient-text">
                      {t(project.title)}
                    </h2>

                    <div className="lg:bg-bg/30 lg:backdrop-blur-sm lg:p-6 lg:rounded-xl lg:border lg:border-border/30">
                      <p className="text-body">{t(project.preview.tagline)}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="tag">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        (window as any).__modalClickPosition = {
                          x: e.clientX,
                          y: e.clientY,
                        };
                        setSelectedProject(project);
                      }}
                      className="group relative text-body font-mono text-text/70 hover:text-primary transition-colors duration-300"
                    >
                      {t(project.preview.cta)}
                      <svg
                        className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
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
            ))}
          </div>
        </section>
      </div>

      <section className="lg:hidden px-4 md:px-12 py-20 md:py-32 space-y-20 md:space-y-32 bg-gradient-to-b from-bg via-bg to-transparent relative overflow-visible">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-20 left-10 w-64 md:w-96 h-64 md:h-96 bg-primary/20 rounded-full blur-[100px] md:blur-[150px]" />
          <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-secondary/20 rounded-full blur-[100px] md:blur-[150px]" />
        </div>

        <div className="relative z-10 mb-12 md:mb-20 max-w-4xl mx-auto">
          <h2 className="title-section mb-4 md:mb-6">
            {t("homepage.projects_section.title")}
          </h2>
          <p className="subtitle gradient-text">
            {t("homepage.projects_section.subtitle")}
          </p>
        </div>

        {projects.map((project, index) => (
          <div
            key={project.id}
            data-project-panel={index}
            className="relative space-y-6 md:space-y-8 overflow-visible min-h-[350px] md:min-h-[500px] max-w-4xl mx-auto"
          >
            <div
              data-project-image
              data-3d-container={`project-mobile-${index}`}
              className="absolute left-0 top-0 w-full h-[300px] md:h-[400px] overflow-visible pointer-events-none z-20"
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
            />

            <div
              data-project-content
              className="relative pt-[280px] md:pt-[380px] space-y-6 md:space-y-8 z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-bg/50 backdrop-blur-sm rounded-full border border-border/50">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs md:text-sm font-mono uppercase tracking-wider text-text/60">
                  {project.year} • {project.client}
                </span>
              </div>

              <h2 className="title-item gradient-text">{t(project.title)}</h2>

              <div>
                <p className="text-base md:text-xl text-text/80">
                  {t(project.preview.tagline)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-primary/10 text-primary border border-primary/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <button
                onClick={(e) => {
                  (window as any).__modalClickPosition = {
                    x: e.clientX,
                    y: e.clientY,
                  };
                  setSelectedProject(project);
                }}
                className="w-full md:w-auto md:px-10 px-6 py-4 md:py-5 gradient-primary text-bg font-mono text-sm md:text-base rounded-xl hover:shadow-xl hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                {t(project.preview.cta)}
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
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
        ))}
      </section>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
