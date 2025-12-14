"use client";

import { Briefcase, GraduationCap, MapPin, ChevronRight } from "lucide-react";
import { useTranslation } from "@/lib/providers/TranslationProvider";

interface ExperienceItemProps {
  index: number;
  type: string;
  isCurrent: boolean;
  period: string;
  title: string;
  organization: string;
  location: string;
  tech: string;
  onClick: (e: React.MouseEvent) => void;
  dotRef: (el: HTMLDivElement | null) => void;
}

export default function ExperienceItem({
  index,
  type,
  isCurrent,
  period,
  title,
  organization,
  location,
  tech,
  onClick,
  dotRef,
}: ExperienceItemProps) {
  const { t } = useTranslation();
  const isWork = type === "work";

  const handleClick = (e: React.MouseEvent) => {
    (window as any).__experienceClickPosition = {
      x: e.clientX,
      y: e.clientY,
    };
    onClick(e);
  };

  return (
    <div
      data-timeline-card={index}
      onClick={handleClick}
      className="relative flex-shrink-0 cursor-pointer group"
      style={{
        width: "min(85vw, 450px)",
        marginRight: "min(20vw, 100px)",
      }}
    >
      <div
        ref={dotRef}
        data-timeline-dot={index}
        className={`absolute left-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full z-20 transition-all duration-300 group-hover:scale-150 ${
          isWork
            ? "bg-primary shadow-primary/50"
            : "bg-secondary shadow-secondary/50"
        }`}
        style={{
          boxShadow: `0 0 30px currentColor`,
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div
        className={`relative rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 transition-all duration-300 group-hover:scale-105 bg-bg/90 backdrop-blur-xl border-2 ${
          isWork ? "border-primary/40" : "border-secondary/40"
        }`}
        style={{
          transform: `translateY(${
            index % 2 === 0 ? "min(-120px, -15vh)" : "min(128px, 15vh)"
          }) rotateZ(${index % 2 === 0 ? "-2deg" : "2deg"})`,
        }}
      >
        {isCurrent && (
          <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 px-2 py-1 md:px-3 md:py-1 bg-primary text-bg text-[10px] md:text-xs font-bold rounded-full">
            {t("about.timeline.now")}
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div
            className={`p-1.5 md:p-2 rounded-lg ${
              isWork ? "bg-primary/20" : "bg-secondary/20"
            }`}
          >
            {isWork ? (
              <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            ) : (
              <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
            )}
          </div>
          <span className="text-[10px] md:text-xs font-mono text-text/60">
            {period}
          </span>
        </div>

        <h3 className="text-base sm:text-lg md:text-xl font-bold gradient-text mb-2 line-clamp-2">
          {title}
        </h3>

        <p className="text-sm md:text-base font-semibold text-text mb-2">
          {organization}
        </p>

        <div className="flex items-center gap-2 text-text/60 text-xs md:text-sm mb-3">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>

        {tech && (
          <div className="flex flex-wrap gap-1 md:gap-1.5 mb-4">
            {tech
              .split(", ")
              .slice(0, 3)
              .map((techItem) => (
                <span
                  key={techItem}
                  className={`px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-mono rounded ${
                    isWork
                      ? "bg-primary/15 text-primary"
                      : "bg-secondary/15 text-secondary"
                  }`}
                >
                  {techItem}
                </span>
              ))}
            {tech.split(", ").length > 3 && (
              <span className="px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-mono text-text/60">
                +{tech.split(", ").length - 3}
              </span>
            )}
          </div>
        )}

        <div
          className={`flex items-center gap-2 text-xs md:text-sm font-mono transition-all group-hover:gap-3 ${
            isWork ? "text-primary" : "text-secondary"
          }`}
        >
          <span>{t("about.timeline.view_details")}</span>
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
}
