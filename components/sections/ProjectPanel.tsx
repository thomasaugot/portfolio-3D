"use client";

import { Button } from "@/components/ui/Button";
import { ExternalLink, Check, ChevronRight } from "lucide-react";
import type { Project } from "@/types/project";
import {
  PORTFOLIO_PANEL_CTA_CLASS,
  PORTFOLIO_PANEL_FRAME_CLASS,
} from "@/components/sections/portfolio-panel-styles";

type ProjectPanelProps = {
  project: Project;
  index: number;
  t: (key: string) => string | undefined;
};

export default function ProjectPanel({ project, index, t }: ProjectPanelProps) {
  return (
    <div
      data-project-panel={index + 1}
      className={`${PORTFOLIO_PANEL_FRAME_CLASS} no-scrollbar opacity-0 pointer-events-none`}
    >
      {/* Spacer - pushes content to bottom portion on mobile, 3D visible at top */}
      <div className="flex-1 lg:hidden" />
      {/* Command line */}
      <div data-typewriter-line className="flex items-center gap-2 mb-2">
        <span className="text-primary">❯</span>
        <span data-typewriter data-typewriter-delay="30" data-typewriter-speed="25" className="text-primary">
          cat ./projects/{project.id}.md
        </span>
      </div>

      {/* Project year, client & category */}
      <div data-typewriter-line className="text-text pl-4 flex items-center gap-2 mb-3">
        <Check className="w-4 h-4 text-primary" />
        <span data-typewriter data-typewriter-delay="50" data-typewriter-speed="18">
          {project.year} • {project.client} • {t(project.category) || project.category}
        </span>
      </div>

      {/* Project title command - desktop only */}
      <div data-typewriter-line className="hidden lg:flex items-center gap-2 mb-2 mt-2">
        <span className="text-primary">❯</span>
        <span data-typewriter data-typewriter-delay="60" data-typewriter-speed="25" className="text-primary">
          echo $PROJECT_NAME
        </span>
      </div>

      {/* Title */}
      <h2
        data-typewriter-line
        data-project-title
        className="pl-4 text-base lg:text-2xl font-bold text-text leading-tight mb-3 lg:mb-4"
      >
        <span data-typewriter data-typewriter-delay="50" data-typewriter-speed="22">
          {t(project.title) || project.title}
        </span>
      </h2>

      {/* Description command - desktop only */}
      <div data-typewriter-line className="hidden lg:flex items-center gap-2 mb-2">
        <span className="text-primary">❯</span>
        <span data-typewriter data-typewriter-delay="60" data-typewriter-speed="25" className="text-primary">
          cat description.txt
        </span>
      </div>

      {/* Description - desktop only */}
      <div data-typewriter-line data-project-description className="hidden lg:block text-text/82 pl-4 mb-4">
        <span data-typewriter data-typewriter-delay="50" data-typewriter-speed="8">
          {t(project.preview.tagline) || project.preview.tagline}
        </span>
      </div>

      {/* Tech stack command + badges */}
      <div data-typewriter-line className="mb-4">
        <div className="hidden lg:flex items-center gap-2 mb-2">
          <span className="text-primary">❯</span>
          <span data-typewriter data-typewriter-delay="60" data-typewriter-speed="25" className="text-primary">
            ls ./tech-stack/
          </span>
        </div>
        <div data-project-techs className="pl-4 flex flex-wrap gap-1.5 lg:gap-2">
          {project.technologies.map((tech, techIndex) => (
            <span
              key={`${project.id}-${techIndex}`}
              className="text-xs px-2 py-0.5 lg:px-3 lg:py-1.5 rounded-md bg-text/7 border border-border text-text/88"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Live URL as terminal line */}
      {project.media.link && (
        <div className="mb-4">
          <div data-typewriter-line className="hidden lg:flex items-center gap-2 mb-2">
            <span className="text-primary">❯</span>
            <span data-typewriter data-typewriter-delay="60" data-typewriter-speed="25" className="text-primary">
              echo $LIVE_URL
            </span>
          </div>
          <a
            data-typewriter-line
            href={project.media.link}
            target="_blank"
            rel="noopener noreferrer"
            className="pl-4 text-primary hover:text-secondary transition-colors inline-flex items-center gap-2 underline underline-offset-2 text-sm"
          >
            <span data-typewriter data-typewriter-delay="40" data-typewriter-speed="12">
              {project.media.link}
            </span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Next Project CTA */}
      <div
        data-project-cta
        className={PORTFOLIO_PANEL_CTA_CLASS}
        data-typewriter-reveal
        data-typewriter-delay="80"
      >
        <div className="hidden lg:flex items-center gap-2 text-text mb-3">
          <span className="text-primary">❯</span>
          <span>{t("projects.terminal.next_prompt") || "Continue exploring?"}</span>
        </div>
        <Button
          type="button"
          data-next-project-btn
          data-current-index={index}
          variant="green"
          size="sm"
          className="md:px-5 md:py-2.5 md:text-base"
        >
          {t("projects.terminal.next_project") || "Next Project"}
          <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
        </Button>
      </div>
    </div>
  );
}
