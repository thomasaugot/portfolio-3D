"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { useThreeScene } from "@/hooks/useThreeScene";
import { initCTA3DScene } from "@/utils/animations/cta-3d-scene";

export default function CTASection() {
  const { t, language } = useTranslation();
  const ctaContainerRef = useThreeScene(initCTA3DScene, "cta");

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
      title: t("homepage.cta_section.portfolio_title"),
      description: t("homepage.cta_section.portfolio_description"),
      label: t("homepage.cta_section.view_more"),
    },
    {
      href: `/${language}/about`,
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      title: t("homepage.cta_section.about_title"),
      description: t("homepage.cta_section.about_description"),
      label: t("homepage.cta_section.learn_more"),
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
      title: t("homepage.cta_section.contact_title"),
      description: t("homepage.cta_section.contact_description"),
      label: t("homepage.cta_section.get_in_touch"),
    },
  ];

  return (
    <section
      data-cta-section
      className="relative min-h-screen flex items-center justify-center pb-48 overflow-visible"
    >
      <div
        ref={ctaContainerRef}
        data-3d-container="cta"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60"
      />

      <div className="absolute inset-0  pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <div className="text-center mb-20" data-cta-header>
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-text leading-[0.95] mb-6">
            {t("homepage.cta_section.title")}
          </h2>

          <p className="text-xl md:text-2xl text-text/70 max-w-3xl mx-auto leading-relaxed">
            {t("homepage.cta_section.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {ctaCards.map((card, index) => (
            <Link
              key={card.href}
              href={card.href}
              data-cta-card
              data-index={index}
              className="group relative block"
              style={{ perspective: "1000px" }}
            >
              <div
                data-card-glow
                className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-3xl blur-2xl opacity-0"
              />

              <div className="absolute -inset-[1px] bg-gradient-to-br from-primary via-secondary to-primary rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-bg backdrop-blur-xl rounded-3xl p-8 transition-all duration-500 h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>

                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    {card.title}
                  </h3>

                  <p className="text-base text-text-muted mb-8 leading-relaxed flex-grow">
                    {card.description}
                  </p>

                  <div className="relative pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm font-mono text-primary/70 group-hover:text-primary group-hover:gap-3 transition-all duration-300">
                      {card.label}
                      <svg
                        className="w-4 h-4"
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}