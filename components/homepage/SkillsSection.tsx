"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import Stats from "@/components/ui/Stats";

export default function SkillsSection() {
  const { t } = useTranslation();

  const services = [
    {
      title: t("homepage.services.web_development.title"),
      description: t("homepage.services.web_development.description"),
      skills: t("homepage.services.web_development.skills"),
    },
    {
      title: t("homepage.services.ui_ux.title"),
      description: t("homepage.services.ui_ux.description"),
      skills: t("homepage.services.ui_ux.skills"),
    },
    {
      title: t("homepage.services.interactive.title"),
      description: t("homepage.services.interactive.description"),
      skills: t("homepage.services.interactive.skills"),
    },
    {
      title: t("homepage.services.mobile.title"),
      description: t("homepage.services.mobile.description"),
      skills: t("homepage.services.mobile.skills"),
    },
  ];

  const stats = [
    { value: "3+", label: t("homepage.stats.years_label") },
    {
      value: "FR - EN - ES",
      label: t("homepage.stats.languages_label"),
      isSmall: true,
    },
    { value: "20+", label: t("homepage.stats.projects_label") },
  ];

  return (
    <section
      data-skills-section
      className="xl:min-h-screen flex items-center justify-center relative z-20 -mt-[100vh] opacity-0 xl:py-32 overflow-visible"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/50 to-bg pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <div className="text-center mb-24" data-header>
          <h2 className="title-section mb-6">
            {t("homepage.services.section_title_1")}
          </h2>

          <h3 className="subtitle gradient-primary bg-clip-text text-transparent">
            {t("homepage.services.section_title_2")}
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {services.map((service, index) => (
            <div
              key={service.title}
              data-service-card
              data-index={index}
              className="group relative"
              style={{ perspective: "1000px" }}
            >
              <div
                data-card-glow
                className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-3xl blur-2xl opacity-0"
              />

              <div className="absolute -inset-[1px] bg-gradient-to-br from-primary via-secondary to-primary rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-bg backdrop-blur-xl rounded-3xl p-8 transition-all duration-500 h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <h4 className="title-item mb-4 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h4>

                  <p className="text-body mb-8">
                    {service.description}
                  </p>

                  <div className="relative pt-6 border-t border-border/50">
                    <div className="text-label text-primary/70">
                      {service.skills}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Stats stats={stats} />
      </div>
    </section>
  );
}