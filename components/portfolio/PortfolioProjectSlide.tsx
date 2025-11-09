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
      className="absolute w-full h-full pointer-events-auto"
      style={{ opacity: 0 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto h-full px-6 lg:px-12 justify-items-center">
        <div className="hidden lg:block" />

        <div className="space-y-6 lg:space-y-8 relative z-10 bg-bg/98 lg:bg-transparent p-6 lg:p-0 rounded-2xl lg:rounded-none backdrop-blur-xl lg:backdrop-blur-none border border-border/50 lg:border-0 w-full max-w-md lg:max-w-none shadow-2xl lg:shadow-none">
          
          {/* Badge */}
          <div
            data-project-badge
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface/50 backdrop-blur-sm rounded-full border border-border/50"
            style={{ opacity: 0 }}
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
            style={{ opacity: 0 }}
          >
            {t(project.title)}
          </h2>

          {/* Description */}
          <div
            data-project-description
            className="lg:bg-surface/30 lg:backdrop-blur-sm lg:p-6 lg:rounded-xl lg:border lg:border-border/30"
            style={{ opacity: 0 }}
          >
            <p className="text-body">
              {t(project.preview.tagline)}
            </p>
          </div>

          {/* Technologies */}
          {project.technologies && (
            <div data-project-techs className="flex flex-wrap gap-2" style={{ opacity: 0 }}>
              {project.technologies.map((tech: string, techIndex: number) => (
                <span key={techIndex} className="tag">
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <div data-project-button className="relative" style={{ opacity: 0 }}>
            {/* Desktop CTA - Text link style */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => onViewDetails(project)}
                className="group relative text-body font-mono text-text/70 hover:text-primary transition-colors duration-300 z-10"
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

            {/* Mobile CTA - Button style */}
            <button
              onClick={() => onViewDetails(project)}
              className="lg:hidden w-full px-6 py-4 gradient-primary text-bg font-mono text-sm rounded-xl hover:shadow-xl hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider"
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
  );
}