"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import { Code2, Sparkles, Settings, Globe } from "lucide-react";

export default function Specialties() {
  const { t } = useTranslation();

  const specialties = [
    { key: "frontend_dev", Icon: Code2 },
    { key: "animations", Icon: Sparkles },
    { key: "fullstack", Icon: Settings },
    { key: "multilingual", Icon: Globe }
  ];

  return (
    <section data-specialties className="relative py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" data-section-header>
          <h2 data-tetris-title className="title-section gradient-text">
            {t("about.specialties.title")}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {specialties.map((specialty, index) => (
            <div
              key={specialty.key}
              data-specialty-card={index}
              className="group relative"
            >
              <div
                data-card-glow
                className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-3xl blur-2xl opacity-0"
              />

              <div className="absolute -inset-[1px] bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl md:rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-bg backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 transition-all duration-500 h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <specialty.Icon className="w-12 h-12 mb-4 text-primary" />
                  <h4 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-3 md:mb-4 group-hover:text-primary transition-colors duration-300">
                    {t(`about.specialties.${specialty.key}.title`)}
                  </h4>

                  <p className="text-base md:text-lg text-text/80 mb-6 md:mb-8">
                    {t(`about.specialties.${specialty.key}.description`)}
                  </p>

                  <div className="relative pt-4 md:pt-6 border-t border-border/50">
                    <div className="text-xs md:text-sm font-mono uppercase tracking-wider text-primary/70">
                      {t(`about.specialties.${specialty.key}.skills`)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
