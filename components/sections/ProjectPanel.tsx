"use client";

import { Button } from "@/components/ui/Button";
import { ExternalLink, Check, ChevronRight } from "lucide-react";
import type { Project } from "@/types/project";

type ProjectPanelProps = {
  project: Project;
  index: number;
  t: (key: string) => string | undefined;
};

export default function ProjectPanel({ project, index, t }: ProjectPanelProps) {
  return (
    <div
      data-project-panel={index + 1}
      className="absolute bottom-0 md:top-0 flex flex-col justify-start p-2 lg:p-6 font-mono text-xs lg:text-sm leading-snug lg:leading-relaxed overflow-hidden no-scrollbar opacity-0 pointer-events-none gap-3 md:gap-0"
    >
      {/* Command line */}
      <div data-typewriter-line className="flex items-center gap-2 mb-1 lg:mb-2">
        <span className="text-primary">❯</span>
        <span data-typewriter data-typewriter-delay="100" data-typewriter-speed="25" className="text-white">
          cat ./projects/{project.id}.md
        </span>
      </div>

      {/* Project year, client & category */}
      <div data-typewriter-line className="text-primary pl-4 flex items-center gap-2 mb-1 lg:mb-3">
        <Check className="w-3 h-3 lg:w-4 lg:h-4" />
        <span data-typewriter data-typewriter-delay="300" data-typewriter-speed="18">
          {project.year} • {project.client} • {t(project.category) || project.category}
        </span>
      </div>

      {/* Project title command - desktop only */}
      <div data-typewriter-line className="hidden lg:flex items-center gap-2 mb-2 mt-2">
        <span className="text-primary">❯</span>
        <span data-typewriter data-typewriter-delay="350" data-typewriter-speed="25" className="text-white">
          echo $PROJECT_NAME
        </span>
      </div>

      {/* Title */}
      <h2
        data-typewriter-line
        data-project-title
        className="pl-4 text-sm lg:text-2xl font-bold text-white leading-tight mb-1 lg:mb-4"
      >
        <span data-typewriter data-typewriter-delay="300" data-typewriter-speed="22">
          {t(project.title) || project.title}
        </span>
      </h2>

      {/* Description command - desktop only */}
      <div data-typewriter-line className="hidden lg:flex items-center gap-2 mb-2">
        <span className="text-primary">❯</span>
        <span data-typewriter data-typewriter-delay="400" data-typewriter-speed="25" className="text-white">
          cat description.txt
        </span>
      </div>

      {/* Description - desktop only */}
      <div data-typewriter-line data-project-description className="hidden lg:block text-secondary/80 pl-4 mb-4">
        <span data-typewriter data-typewriter-delay="300" data-typewriter-speed="8">
          {t(project.preview.tagline) || project.preview.tagline}
        </span>
      </div>

      {/* Tech stack command + badges */}
      <div data-typewriter-line className="mb-1.5 lg:mb-4">
        <div className="hidden lg:flex items-center gap-2 mb-2">
          <span className="text-primary">❯</span>
          <span data-typewriter data-typewriter-delay="400" data-typewriter-speed="25" className="text-white">
            ls ./tech-stack/
          </span>
        </div>
        <div data-project-techs className="pl-4 flex flex-wrap gap-1 lg:gap-2">
          {project.technologies.map((tech, techIndex) => (
            <span
              key={`${project.id}-${techIndex}`}
              className="text-[0.65rem] px-1.5 py-0.5 lg:text-xs lg:px-3 lg:py-1.5 rounded-md bg-white/5 border border-white/10 text-white/70"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Live URL as terminal line */}
      {project.media.link && (
        <div className="mb-1.5 lg:mb-4">
          <div data-typewriter-line className="hidden lg:flex items-center gap-2 mb-2">
            <span className="text-primary">❯</span>
            <span data-typewriter data-typewriter-delay="350" data-typewriter-speed="25" className="text-white">
              echo $LIVE_URL
            </span>
          </div>
          <a
            data-typewriter-line
            href={project.media.link}
            target="_blank"
            rel="noopener noreferrer"
            className="pl-4 text-primary hover:text-secondary transition-colors inline-flex items-center gap-2 underline underline-offset-2 text-xs lg:text-sm"
          >
            <span data-typewriter data-typewriter-delay="200" data-typewriter-speed="12">
              {project.media.link}
            </span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Next Project CTA */}
      <div data-project-cta className="mt-auto pt-1.5 lg:pt-3 border-t border-white/10 opacity-0" data-typewriter-reveal data-typewriter-delay="300">
        <div className="hidden lg:flex items-center gap-2 text-white mb-3">
          <span className="text-primary">❯</span>
          <span>{t("projects.terminal.next_prompt") || "Continue exploring?"}</span>
        </div>
        <Button
          type="button"
          data-next-project-btn
          data-current-index={index}
          variant="green"
          size="sm"
          className="lg:px-5 lg:py-2.5 lg:text-base"
        >
          {t("projects.terminal.next_project") || "Next Project"}
          <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
        </Button>
      </div>
    </div>
  );
}
