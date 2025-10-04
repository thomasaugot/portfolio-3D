"use client";

import { useTranslation } from "@/lib/TranslationProvider";

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

  return (
    <section
      data-skills-section
      className="min-h-screen flex items-center justify-center relative z-20 -mt-[100vh] opacity-0 py-32"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/50 to-bg pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-8xl font-bold mb-6">
            {t("homepage.services.section_title_1")}
            <br />
            <span className="gradient-primary bg-clip-text text-transparent font-light">
              {t("homepage.services.section_title_2")}
            </span>
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            {t("homepage.services.section_subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {services.map((service) => (
            <div
              key={service.title}
              data-service-card
              className="group relative"
            >
              <div
                data-card-glow
                className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-3xl blur-2xl opacity-0"
              />

              <div className="relative bg-bg glass border border-border rounded-3xl p-8 hover:border-primary/30 transition-all duration-300 h-full">
                <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
                <p className="text-lg text-text-muted mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="text-sm font-mono text-primary/60">
                  {service.skills}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div data-stat className="text-center">
            <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
              {t("homepage.stats.years")}
            </div>
            <div className="text-sm text-muted uppercase tracking-wider">
              {t("homepage.stats.years_label")}
            </div>
          </div>

          <div className="hidden md:block w-px h-16 bg-border" />

          <div data-stat className="text-center">
            <div className="text-5xl font-bold mb-2">
              <div className="gradient-primary bg-clip-text text-transparent leading-tight">
                {t("homepage.stats.languages")}
              </div>
            </div>
            <div className="text-sm text-muted uppercase tracking-wider">
              {t("homepage.stats.languages_label")}
            </div>
          </div>

          <div className="hidden md:block w-px h-16 bg-border" />

          <div data-stat className="text-center">
            <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
              {t("homepage.stats.projects")}
            </div>
            <div className="text-sm text-muted uppercase tracking-wider">
              {t("homepage.stats.projects_label")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}