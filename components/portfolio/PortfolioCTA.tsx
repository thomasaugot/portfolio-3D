"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import { Button } from "@/components/ui/Button";

interface PortfolioCTAProps {
  totalProjects: number;
}

export default function PortfolioCTA({ totalProjects }: PortfolioCTAProps) {
  const { t, language } = useTranslation();

  return (
    <div
      data-project-panel={totalProjects}
      className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 pointer-events-auto"
      style={{ opacity: 0 }}
    >
      <div className="max-w-4xl text-center space-y-8 sm:space-y-10 lg:space-y-12">
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          <h2
            data-cta-title
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black gradient-primary bg-clip-text text-transparent leading-tight opacity-0 translate-y-8"
          >
            {t("portfolio.cta.title")}
          </h2>

          <p
            data-cta-description
            className="text-base sm:text-lg lg:text-xl text-text/70 leading-relaxed max-w-2xl mx-auto opacity-0 translate-y-8 px-2"
          >
            {t("portfolio.cta.description")}
          </p>
        </div>

        <div
          data-cta-buttons
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center opacity-0 translate-y-8"
        >
          <Button
            asLink
            href={`/${language}/contact`}
            variant="filled"
            size="lg"
            className="flex-none"
          >
            {t("portfolio.cta.primaryButton")}
          </Button>
          <Button
            asLink
            href={`/${language}`}
            variant="outlined"
            size="lg"
            className="flex-none"
          >
            {t("portfolio.cta.secondaryButton")}
          </Button>
        </div>
      </div>
    </div>
  );
}
