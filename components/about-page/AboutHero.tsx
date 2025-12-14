"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import Image from "next/image";

export default function AboutHero() {
  const { t } = useTranslation();

  return (
    <section
      data-about-hero
      className="relative min-h-screen flex items-center py-20 pt-28 px-6 md:px-12 lg:px-20 lg:py-16 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.5fr_1fr] gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Photo */}
          <div
            className="relative order-2 lg:order-1"
            data-photo-container
            style={{ perspective: "1000px" }}
          >
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-none mx-auto">
              {/* Animated glow effect */}
              <div
                className="absolute -inset-3 md:-inset-4 bg-gradient-to-br from-primary/30 via-secondary/20 to-primary/30 rounded-2xl md:rounded-3xl blur-xl md:blur-2xl"
                data-photo-glow
              />

              {/* Photo frame with clip-path reveal */}
              <div
                data-photo-frame
                className="relative aspect-square w-full bg-bg rounded-xl md:rounded-2xl overflow-hidden border border-border/40 shadow-xl md:shadow-2xl"
              >
                {/* Inner gradient glow behind portrait */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 blur-2xl" />
                <div className="absolute inset-0 bg-gradient-to-tr from-secondary/15 via-transparent to-primary/15" />

                {/* Inner decorative border */}
                <div className="absolute inset-1.5 md:inset-2 border border-primary/20 rounded-lg md:rounded-xl pointer-events-none z-10" />

                <Image
                  src="/assets/images/portrait/portrait.png"
                  alt="Thomas Augot"
                  fill
                  className="object-contain scale-105 relative z-10"
                  priority
                />
              </div>

              {/* Corner accents */}
              <div className="absolute -top-0.5 -left-0.5 md:-top-1 md:-left-1 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 border-t-2 border-l-2 border-primary/60 rounded-tl-md md:rounded-tl-lg" />
              <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 border-t-2 border-r-2 border-secondary/60 rounded-tr-md md:rounded-tr-lg" />
              <div className="absolute -bottom-0.5 -left-0.5 md:-bottom-1 md:-left-1 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 border-b-2 border-l-2 border-secondary/60 rounded-bl-md md:rounded-bl-lg" />
              <div className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 border-b-2 border-r-2 border-primary/60 rounded-br-md md:rounded-br-lg" />
            </div>
          </div>

          {/* Text Content */}
          <div
            className="space-y-4 sm:space-y-5 md:space-y-6 order-1 lg:order-2 min-w-0"
            data-text-content
          >
            {/* Title */}
            <h1 data-hero-title className="space-y-0 md:-space-y-2">
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-text">
                {t("about.hero.title_1")}
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-fun font-extralight gradient-text">
                {t("about.hero.title_2")}
              </span>
            </h1>

            {/* Subtitle - separate glass block */}
            <div className="bg-bg/50 backdrop-blur-md p-3 sm:p-4 md:p-5 rounded-xl border border-border/20">
              <p data-hero-subtitle className="subtitle font-mono">
                {t("about.hero.subtitle")}
              </p>
            </div>

            {/* Paragraphs - separate glass block */}
            <div
              className="bg-bg/50 backdrop-blur-md p-4 sm:p-5 md:p-6 rounded-xl border border-border/20 space-y-2.5 sm:space-y-3 md:space-y-4"
              data-intro-paragraphs
            >
              <p
                data-intro-paragraph
                className="text-xs sm:text-sm md:text-sm lg:text-base text-text/85 leading-relaxed"
              >
                {t("about.intro.paragraph_1")}
              </p>
              <p
                data-intro-paragraph
                className="text-xs sm:text-sm md:text-sm lg:text-base text-text/85 leading-relaxed"
              >
                {t("about.intro.paragraph_2")}
              </p>
              <p
                data-intro-paragraph
                className="text-xs sm:text-sm md:text-sm lg:text-base text-text/85 leading-relaxed"
              >
                {t("about.intro.paragraph_3")}
              </p>
            </div>

            <div
              className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4"
              data-quick-stats
            >
              <div
                data-stat-card
                className="group relative text-center p-2 sm:p-2.5 md:p-3 lg:p-4 bg-bg/40 backdrop-blur-sm rounded-lg md:rounded-xl border border-border/30 hover:border-primary/50 transition-colors duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg md:rounded-xl" />
                <div className="relative">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold gradient-text">
                    3+
                  </div>
                  <div className="text-[10px] sm:text-xs text-text/60 mt-0.5">
                    {t("about.hero.stats.years")}
                  </div>
                </div>
              </div>
              <div
                data-stat-card
                className="group relative text-center p-2 sm:p-2.5 md:p-3 lg:p-4 bg-bg/40 backdrop-blur-sm rounded-lg md:rounded-xl border border-border/30 hover:border-primary/50 transition-colors duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg md:rounded-xl" />
                <div className="relative">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold gradient-text">
                    20+
                  </div>
                  <div className="text-[10px] sm:text-xs text-text/60 mt-0.5">
                    {t("about.hero.stats.projects")}
                  </div>
                </div>
              </div>
              <div
                data-stat-card
                className="group relative text-center p-2 sm:p-2.5 md:p-3 lg:p-4 bg-bg/40 backdrop-blur-sm rounded-lg md:rounded-xl border border-border/30 hover:border-primary/50 transition-colors duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg md:rounded-xl" />
                <div className="relative">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold gradient-text">
                    3
                  </div>
                  <div className="text-[10px] sm:text-xs text-text/60 mt-0.5">
                    {t("about.hero.stats.languages")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
