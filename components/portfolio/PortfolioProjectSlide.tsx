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
      className="absolute w-full h-full pointer-events-auto opacity-0"
    >
      {/* Mobile & Tablet Layout: Content at bottom, 3D visible at top */}
      <div className="lg:hidden flex flex-col justify-end h-full px-4 md:px-12 pb-8 md:pb-16 pointer-events-none">
        <div className="space-y-4 md:space-y-8 relative z-10 bg-bg/95 p-5 md:p-10 rounded-2xl backdrop-blur-md border border-border/50 shadow-2xl max-w-md md:max-w-3xl mx-auto w-full pointer-events-auto">
          {/* Badge */}
          <div
            data-project-badge
            className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-surface/50 backdrop-blur-sm rounded-full border border-border/50 opacity-0"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs md:text-sm font-mono">
              {project.year} • {project.client}
            </span>
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
            <div data-project-techs className="flex flex-wrap gap-1.5 md:gap-3 opacity-0">
              {project.technologies.slice(0, 6).map((tech: string, techIndex: number) => (
                <span key={techIndex} className="text-xs md:text-base px-2 md:px-4 py-1 md:py-2 rounded-md bg-surface/50 border border-border/30 font-mono">
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
                  y: e.clientY
                };
                onViewDetails(project);
              }}
              className="w-full px-5 md:px-8 py-3 md:py-5 gradient-primary text-bg font-mono text-xs md:text-base rounded-xl hover:shadow-xl hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider pointer-events-auto cursor-pointer"
            >
              {t(project.preview.cta)}
              <svg className="w-4 md:w-6 h-4 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
          <div
            data-project-badge
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface/50 backdrop-blur-sm rounded-full border border-border/50"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-label">
              {project.year} • {project.client}
            </span>
          </div>

          {/* Title */}
          <h2
            data-project-title
            className="title-section gradient-text"
          >
            {t(project.title)}
          </h2>

          {/* Description */}
          <div
            data-project-description
            className="bg-surface/30 backdrop-blur-sm p-6 rounded-xl border border-border/30"
          >
            <p className="text-body">
              {t(project.preview.tagline)}
            </p>
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

          {/* CTA Button */}
          <div data-project-button className="pointer-events-auto">
            <button
              onClick={(e) => {
                // Store click position globally for modal animation
                (window as any).__modalClickPosition = {
                  x: e.clientX,
                  y: e.clientY
                };
                onViewDetails(project);
              }}
              className="group relative text-body font-mono text-text/70 hover:text-primary transition-colors duration-300 pointer-events-auto cursor-pointer"
            >
              {t(project.preview.cta)}
              <svg
                className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}