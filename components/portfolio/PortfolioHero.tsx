"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";

export default function PortfolioHero() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero Title */}
      <div
        data-projects-header
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full px-6 max-w-4xl"
      >
        <h1
          data-projects-title
          data-two-part-title="true"
          className="title-hero mb-4 md:mb-6 flex flex-col items-center"
        >
          <span data-hero-line>{t("portfolio.hero.title_part1")}</span>
          <span
            data-hero-line
            className="gradient-primary bg-clip-text text-transparent"
          >
            {t("portfolio.hero.title_part2")}
          </span>
        </h1>
        <p
          data-projects-subtitle
          className="text-lg md:text-xl lg:text-2xl text-text/70"
        >
          {t("portfolio.hero.subtitle")}
        </p>
      </div>

      {/* Scroll hint indicator */}
      <div
        data-scroll-hint
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
      >
        <span className="text-label">{t("portfolio.hero.scroll_hint")}</span>
        <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center">
          <div
            className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
      </div>
    </>
  );
}
