"use client";

import SafeLink from "@/components/ui/SafeLink";
import { useTranslation } from "@/lib/providers/TranslationProvider";

export default function AboutCTA() {
  const { t, language } = useTranslation();

  const ctaCards = [
    {
      href: `/${language}/portfolio`,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: t("about.cta.portfolio_title"),
      description: t("about.cta.portfolio_description"),
      label: t("about.cta.view_portfolio"),
    },
    {
      href: `/${language}/contact`,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: t("about.cta.contact_title"),
      description: t("about.cta.contact_description"),
      label: t("about.cta.get_in_touch"),
    },
  ];

  return (
    <section className="relative pb-20 md:pb-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="title-section text-text mb-4">
            {t("about.cta.title")}
          </h2>
          <p className="subtitle gradient-text">{t("about.cta.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {ctaCards.map((card) => (
            <SafeLink
              key={card.href}
              href={card.href}
              className="group relative block transition-all duration-500 hover:scale-105"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl md:rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Gradient border */}
              <div className="absolute -inset-[1px] bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl md:rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-bg backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 transition-all duration-500 h-full overflow-hidden shadow-xl border border-border/30">
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="text-primary mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>

                  <h3 className="text-xl md:text-2xl lg:text-3xl font-normal leading-tight mb-3 md:mb-4 transition-colors duration-300">
                    {card.title}
                  </h3>

                  <p className="text-sm md:text-base text-text/80 mb-6 md:mb-8">
                    {card.description}
                  </p>

                  <div className="relative pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs md:text-sm font-mono uppercase tracking-wider text-primary/70 group-hover:gap-3 transition-all duration-300">
                      {card.label}
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </SafeLink>
          ))}
        </div>
      </div>
    </section>
  );
}
