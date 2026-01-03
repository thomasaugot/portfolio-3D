"use client";

import { useState, useEffect } from "react";
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
      className="absolute w-full h-full pointer-events-none opacity-0"
    >
      {/* Mobile & Tablet Layout: Content at bottom, 3D visible at top */}
      <div className="lg:hidden flex flex-col justify-end h-full px-4 md:px-12 pb-8 md:pb-16 pointer-events-none">
        <div className="space-y-4 md:space-y-8 relative z-10 bg-bg p-5 md:p-10 rounded-2xl backdrop-blur-md border border-border/50 shadow-2xl max-w-md md:max-w-3xl mx-auto w-full pointer-events-auto">
          {/* Badge */}
          <div data-project-badge className="relative inline-flex opacity-0">
            {/* Gradient border */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-secondary to-primary rounded-full opacity-50" />

            {/* Badge content */}
            <div className="relative flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-bg rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse" />
              <span className="text-xs md:text-sm font-mono">
                {project.year} • {project.client}
              </span>
            </div>
          </div>

          {/* Title */}
          <h2
            data-project-title
            className="text-2xl md:text-5xl font-bold gradient-text opacity-0"
          >
            {t(project.title)}
          </h2>

          {/* Description */}
          <div data-project-description className="opacity-0">
            <p className="text-sm md:text-lg text-text/80">
              {t(project.preview.tagline)}
            </p>
          </div>

          {/* Technologies */}
          {project.technologies && (
            <div
              data-project-techs
              className="flex flex-wrap gap-1.5 md:gap-3 opacity-0"
            >
              {project.technologies
                .slice(0, 6)
                .map((tech: string, techIndex: number) => (
                  <span
                    key={techIndex}
                    className="text-xs md:text-base px-2 md:px-4 py-1 md:py-2 rounded-md bg-bg/50 border border-border/30 font-mono"
                  >
                    {tech}
                  </span>
                ))}
            </div>
          )}

          {/* CTA Button */}
          <div data-project-button className="opacity-0 pointer-events-auto">
            <button
              onClick={(e) => {
                // Store click position globally for modal animation
                (window as any).__modalClickPosition = {
                  x: e.clientX,
                  y: e.clientY,
                };
                onViewDetails(project);
              }}
              className="w-full px-5 md:px-8 py-3 md:py-5 gradient-primary text-bg font-mono text-xs md:text-base rounded-xl hover:shadow-xl hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider pointer-events-auto cursor-pointer"
            >
              {t(project.preview.cta)}
              <svg
                className="w-4 md:w-6 h-4 md:h-6"
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

      {/* Desktop Layout: 2-column grid (LG screens and up) */}
      <div className="hidden lg:grid grid-cols-2 gap-12 items-center max-w-7xl mx-auto h-full px-12 justify-items-center pointer-events-auto">
        <div />
        <div className="space-y-8 pointer-events-auto">
          {/* Badge */}
          <div data-project-badge className="relative inline-flex">
            {/* Gradient border */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-secondary to-primary rounded-full opacity-50" />

            {/* Badge content */}
            <div className="relative flex items-center gap-2 px-4 py-2 bg-bg rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse" />
              <span className="text-label">
                {project.year} • {project.client}
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 data-project-title className="title-section gradient-text">
            {t(project.title)}
          </h2>

          {/* Description */}
          <div
            data-project-description
            className="bg-bg/30 backdrop-blur-sm p-6 rounded-xl border border-border/30"
          >
            <p className="text-body">{t(project.preview.tagline)}</p>
          </div>

          {/* Technologies */}
          {project.technologies && (
            <div data-project-techs className="flex flex-wrap gap-2">
              {project.technologies.map((tech: string, techIndex: number) => (
                <span key={techIndex} className="tag">
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Hint text - clicking on 3D area opens modal via blob cursor */}
          <div
            data-project-button
            className="flex items-center gap-2 text-text/40 font-mono text-sm"
          >
            <span>{t("portfolio.common.ui.view_details")}</span>
            <svg
              className="w-4 h-4 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
