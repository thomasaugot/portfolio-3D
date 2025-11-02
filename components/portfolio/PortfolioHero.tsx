"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";

export default function PortfolioHero() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero Title */}
      <div
        data-projects-header
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full px-4 sm:px-6 max-w-4xl"
      >
        <p
          data-projects-subtitle
          className="text-xs sm:text-sm font-mono text-text/60 tracking-wide mb-2 sm:mb-3"
        >
          {t("portfolio.hero.subtitle")}
        </p>
        <h1
          data-projects-title
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
        >
          {t("portfolio.hero.title")}
        </h1>
      </div>

      {/* Scroll hint indicator */}
      <div
        data-scroll-hint
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 sm:gap-3"
      >
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-text/50">
          {t("portfolio.hero.scroll_hint")}
        </span>
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-border rounded-full flex justify-center">
          <div
            className="w-1 h-2.5 sm:h-3 bg-primary rounded-full mt-1.5 sm:mt-2 animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
      </div>
    </>
  );
}
