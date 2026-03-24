"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Check, ChevronsDown } from "lucide-react";
import type { Project } from "@/types/project";
import {
  PORTFOLIO_PANEL_CTA_CLASS,
  PORTFOLIO_PANEL_FRAME_CLASS,
} from "@/components/sections/portfolio-panel-styles";

type ProjectPanelProps = {
  project: Project;
  index: number;
  t: (key: string) => string | undefined;
  measure?: boolean;
  useCompactContent?: boolean;
  useCompactDensity?: boolean;
};

export default function ProjectPanel({
  project,
  index,
  t,
  measure = false,
  useCompactContent = false,
  useCompactDensity = false,
}: ProjectPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);

  useEffect(() => {
    if (measure) return;
    const el = panelRef.current;
    if (!el) return;
    const check = () => {
      setCanScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 8);
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      observer.disconnect();
    };
  }, [measure]);
  const descriptionCommandClass = useCompactContent ? "flex" : "hidden lg:flex";
  const descriptionOnlyClass = useCompactContent ? "hidden" : "hidden lg:block";
  const titleClass = useCompactContent
    ? "pl-4 text-base font-bold text-text leading-tight mb-3"
    : useCompactDensity
      ? "pl-4 text-base lg:text-xl font-bold text-text leading-tight mb-3"
    : "pl-4 text-base lg:text-2xl font-bold text-text leading-tight mb-3 lg:mb-4";
  const techGapClass = useCompactContent ? "pl-4 flex flex-wrap gap-1.5" : "pl-4 flex flex-wrap gap-1.5 lg:gap-2";
  const techBadgeClass = useCompactContent
    ? "text-xs px-2 py-0.5 rounded-md bg-text/7 border border-border text-text/88"
    : useCompactDensity
      ? "text-xs px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-md bg-text/7 border border-border text-text/88"
    : "text-xs px-2 py-0.5 lg:px-3 lg:py-1.5 rounded-md bg-text/7 border border-border text-text/88";
  const nextButtonClass = "";
  const shellClass = measure
    ? useCompactDensity
      ? "relative flex flex-col justify-start p-4 md:p-5 font-mono text-sm leading-relaxed overflow-visible bg-bg-surface"
      : "relative flex flex-col justify-start p-4 md:p-6 font-mono text-sm leading-relaxed overflow-visible bg-bg-surface"
    : `${PORTFOLIO_PANEL_FRAME_CLASS} no-scrollbar opacity-0 pointer-events-none`;
  const metaClass = useCompactDensity
    ? "text-text pl-4 flex items-center gap-2 mb-2"
    : "text-text pl-4 flex items-center gap-2 mb-3";
  const titleCommandClass = `${useCompactContent ? "hidden" : "hidden lg:flex"} items-center gap-2 ${useCompactDensity ? "mb-1 mt-1" : "mb-2 mt-2"}`;
  const descriptionCommandSpacingClass = `${descriptionCommandClass} items-center gap-2 ${useCompactDensity ? "mb-1" : "mb-2"}`;
  const descriptionBlockClass = `${descriptionOnlyClass} text-text/82 pl-4 ${useCompactDensity ? "mb-3 text-sm" : "mb-4"}`;
  const techSectionClass = useCompactDensity ? "mb-3" : "mb-4";
  const linkWrapperClass = useCompactDensity ? "mb-3" : "mb-4";
  const nextPromptClass = `${useCompactContent ? "hidden" : "hidden lg:flex"} items-center gap-2 text-text ${useCompactDensity ? "mb-2" : "mb-3"}`;

  return (
    <div
      ref={measure ? undefined : panelRef}
      data-project-panel={measure ? undefined : index + 1}
      className={shellClass}
    >
      {/* Spacer - pushes content to bottom portion on mobile only */}
      {useCompactContent && <div className="flex-1" />}
      {/* Command line */}
      <div data-typewriter-line={measure ? undefined : true} className="flex items-center gap-2 mb-2">
        <span className="text-primary">❯</span>
        <span
          data-typewriter={measure ? undefined : true}
          data-typewriter-delay={measure ? undefined : "30"}
          data-typewriter-speed={measure ? undefined : "25"}
          className="text-primary"
        >
          cat ./projects/{project.id}.md
        </span>
      </div>

      {/* Project year, client & category */}
      <div data-typewriter-line={measure ? undefined : true} className={metaClass}>
        <Check className="w-4 h-4 text-primary" />
        <span
          data-typewriter={measure ? undefined : true}
          data-typewriter-delay={measure ? undefined : "50"}
          data-typewriter-speed={measure ? undefined : "18"}
        >
          {project.year} • {project.client} • {t(project.category) || project.category}
        </span>
      </div>

      {/* Project title command - desktop only */}
      <div data-typewriter-line={measure ? undefined : true} className={titleCommandClass}>
        <span className="text-primary">❯</span>
        <span
          data-typewriter={measure ? undefined : true}
          data-typewriter-delay={measure ? undefined : "60"}
          data-typewriter-speed={measure ? undefined : "25"}
          className="text-primary"
        >
          echo $PROJECT_NAME
        </span>
      </div>

      {/* Title */}
      <h2
        data-typewriter-line={measure ? undefined : true}
        data-project-title={measure ? undefined : true}
        className={titleClass}
      >
        <span
          data-typewriter={measure ? undefined : true}
          data-typewriter-delay={measure ? undefined : "50"}
          data-typewriter-speed={measure ? undefined : "22"}
        >
          {t(project.title) || project.title}
        </span>
      </h2>

      {/* Description command - desktop only */}
      <div data-typewriter-line={measure ? undefined : true} className={descriptionCommandSpacingClass}>
        <span className="text-primary">❯</span>
        <span
          data-typewriter={measure ? undefined : true}
          data-typewriter-delay={measure ? undefined : "60"}
          data-typewriter-speed={measure ? undefined : "25"}
          className="text-primary"
        >
          cat description.txt
        </span>
      </div>

      {/* Description - desktop only */}
      <div
        data-typewriter-line={measure ? undefined : true}
        data-project-description={measure ? undefined : true}
        className={descriptionBlockClass}
      >
        <span
          data-typewriter={measure ? undefined : true}
          data-typewriter-delay={measure ? undefined : "50"}
          data-typewriter-speed={measure ? undefined : "8"}
        >
          {t(project.preview.tagline) || project.preview.tagline}
        </span>
      </div>

      {/* Tech stack command + badges */}
      <div data-typewriter-line={measure ? undefined : true} className={techSectionClass}>
        <div className={`${useCompactContent ? "hidden" : "hidden lg:flex"} items-center gap-2 mb-2`}>
          <span className="text-primary">❯</span>
          <span
            data-typewriter={measure ? undefined : true}
            data-typewriter-delay={measure ? undefined : "60"}
            data-typewriter-speed={measure ? undefined : "25"}
            className="text-primary"
          >
            ls ./tech-stack/
          </span>
        </div>
        <div data-project-techs={measure ? undefined : true} className={techGapClass}>
          {project.technologies.map((tech, techIndex) => (
            <span
              key={`${project.id}-${techIndex}`}
              className={techBadgeClass}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Live URL as terminal line */}
      {project.media.link && (
        <div className={linkWrapperClass}>
          <div data-typewriter-line={measure ? undefined : true} className={`${useCompactContent ? "hidden" : "hidden lg:flex"} items-center gap-2 mb-2`}>
            <span className="text-primary">❯</span>
            <span
              data-typewriter={measure ? undefined : true}
              data-typewriter-delay={measure ? undefined : "60"}
              data-typewriter-speed={measure ? undefined : "25"}
              className="text-primary"
            >
              echo $LIVE_URL
            </span>
          </div>
          <a
            data-typewriter-line={measure ? undefined : true}
            href={project.media.link}
            target="_blank"
            rel="noopener noreferrer"
            className="pl-4 text-white hover:text-white/70 transition-colors inline-flex items-center gap-2 underline underline-offset-2 text-sm"
          >
            <span
              data-typewriter={measure ? undefined : true}
              data-typewriter-delay={measure ? undefined : "40"}
              data-typewriter-speed={measure ? undefined : "12"}
            >
              {t("projects.terminal.view_live") || "View Live"}
            </span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Next Project CTA */}
      <div
        data-project-cta={measure ? undefined : true}
        className={PORTFOLIO_PANEL_CTA_CLASS}
        data-typewriter-reveal={measure ? undefined : true}
        data-typewriter-delay={measure ? undefined : "80"}
      >
        <div className={nextPromptClass}>
          <span className="text-primary">❯</span>
          <span>{t("projects.terminal.next_prompt") || "Continue exploring?"}</span>
        </div>
        <Button
          type="button"
          data-next-project-btn={measure ? undefined : true}
          data-current-index={measure ? undefined : index}
          variant="orange"
          size="sm"
          className={nextButtonClass}
        >
          {t("projects.terminal.next_project") || "Next Project"}
        </Button>
      </div>

      {!measure && canScrollDown && (
        <div className="sticky bottom-0 left-0 right-0 flex justify-center pointer-events-none pt-4 xl:hidden">
          <div className="bg-bg-surface/92 backdrop-blur-sm rounded-full px-3 py-1 border border-border">
            <ChevronsDown className="w-4 h-4 text-primary animate-bounce" />
          </div>
        </div>
      )}
    </div>
  );
}
