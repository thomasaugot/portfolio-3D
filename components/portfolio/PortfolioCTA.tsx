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
      className="absolute inset-0 flex items-center justify-center px-6 pointer-events-auto"
      style={{ opacity: 0 }}
    >
      <div className="max-w-4xl text-center space-y-10 lg:space-y-12">
        <div className="space-y-5 lg:space-y-6">
          <h2
            data-cta-title
            className="title-section gradient-primary bg-clip-text text-transparent opacity-0 translate-y-8"
          >
            {t("portfolio.cta.title")}
          </h2>

          <p
            data-cta-description
            className="subtitle max-w-2xl mx-auto opacity-0 translate-y-8"
          >
            {t("portfolio.cta.description")}
          </p>
        </div>

        <div
          data-cta-buttons
          className="flex flex-col md:flex-row gap-4 justify-center items-stretch opacity-0 translate-y-8 max-w-md mx-auto"
        >
          <Button
            asLink
            href={`/${language}/contact`}
            variant="filled"
            size="lg"
            className="flex-1"
          >
            {t("portfolio.cta.primaryButton")}
          </Button>
          <Button
            asLink
            href={`/${language}`}
            variant="outlined"
            size="lg"
            className="flex-1"
          >
            {t("portfolio.cta.secondaryButton")}
          </Button>
        </div>
      </div>
    </div>
  );
}
