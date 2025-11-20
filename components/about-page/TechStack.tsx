"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import Image from "next/image";
import { technologies } from "@/data/technologies";

export default function TechStack() {
  const { t } = useTranslation();

  return (
    <section data-tech-stack-3d className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* 3D Background */}
      <div
        data-3d-container="techstack"
        className="absolute inset-0 z-0 pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16" data-section-header>
          <h2 data-tetris-title className="title-section gradient-text mb-4">
            {t("about.tech_stack.title")}
          </h2>
          <p className="text-body text-text/70 max-w-2xl mx-auto">
            {t("about.tech_stack.description")}
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3 md:gap-4">
          {technologies.map((tech, index) => (
            <div
              key={tech.id}
              data-tech-card={index}
              className="group relative aspect-square flex items-center justify-center p-3 md:p-4 rounded-xl bg-bg/80 backdrop-blur-sm border border-border/20 hover:border-primary/40 hover:bg-bg/90 transition-all duration-300 hover:scale-105"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={tech.logo}
                  alt={tech.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Tooltip on hover */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <span className="text-[10px] md:text-xs font-mono text-text/60 whitespace-nowrap bg-bg/90 px-2 py-1 rounded border border-border/30">
                  {tech.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
