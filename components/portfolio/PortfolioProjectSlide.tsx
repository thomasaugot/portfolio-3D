"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import type { Project } from "@/types/project";

interface PortfolioProjectSlideProps {
  project: Project;
  index: number;
  onViewDetails: (project: Project) => void;
}

export default function PortfolioProjectSlide({
  project,
  index,
  onViewDetails,
}: PortfolioProjectSlideProps) {
  const { t } = useTranslation();

  return (
    <div
      key={project.id}
      data-project-panel={index}
      className="absolute w-full h-full pointer-events-auto"
      style={{ opacity: 0 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-12 justify-items-center">
        <div className="hidden lg:block" />

        <div className="space-y-2 sm:space-y-3 lg:space-y-8 relative z-10 bg-bg/98 lg:bg-transparent p-5 sm:p-6 lg:p-0 rounded-2xl lg:rounded-none backdrop-blur-xl lg:backdrop-blur-none border border-border/50 lg:border-0 w-full max-w-sm sm:max-w-md lg:max-w-none shadow-2xl lg:shadow-none">
          {/* Badge */}
          <div
            data-project-badge
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-surface/50 backdrop-blur-sm rounded-full border border-border/50"
            style={{ opacity: 0 }}
          >
            <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono text-text/70 tracking-wide uppercase">
              {project.year} • {project.client}
            </span>
          </div>

          {/* Title */}
          <h2
            data-project-title
            className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl xl:text-8xl font-black gradient-primary bg-clip-text text-transparent leading-tight"
            style={{ opacity: 0 }}
          >
            {t(project.title)}
          </h2>

          {/* Description */}
          <div
            data-project-description
            className="lg:bg-surface/30 lg:backdrop-blur-sm lg:p-4 sm:lg:p-5 lg:p-6 lg:rounded-lg sm:lg:rounded-xl lg:border lg:border-border/30"
            style={{ opacity: 0 }}
          >
            <p className="text-xs sm:text-sm lg:text-lg xl:text-xl text-text/90 leading-relaxed">
              {t(project.preview.tagline)}
            </p>
          </div>

          {/* Technologies */}
          {project.technologies && (
            <div data-project-techs className="flex flex-wrap gap-1 sm:gap-2" style={{ opacity: 0 }}>
              {project.technologies
                .slice(0, window.innerWidth < 768 ? 4 : 6)
                .map((tech: string, techIndex: number) => (
                  <span
                    key={techIndex}
                    className="px-2 sm:px-3 py-0.5 sm:py-1.5 text-[9px] sm:text-xs font-mono bg-primary/10 text-primary rounded-md sm:rounded-lg border border-primary/20"
                  >
                    {tech}
                  </span>
                ))}
            </div>
          )}

          {/* CTA Button */}
          <div data-project-button className="relative" style={{ opacity: 0 }}>
            <div className="hidden lg:block relative">
              <button
                onClick={() => onViewDetails(project)}
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
              onClick={() => onViewDetails(project)}
              className="lg:hidden w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-secondary text-bg text-xs sm:text-base font-mono rounded-lg sm:rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {t(project.preview.cta)}
              <svg
                className="w-3 h-3 sm:w-5 sm:h-5"
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
  );
}
