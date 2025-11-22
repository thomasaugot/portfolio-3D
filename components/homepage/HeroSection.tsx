"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import { Button } from "@/components/ui/Button";
import { useThreeScene } from "@/hooks/useThreeScene";
import { initHero3DScene } from "@/utils/animations/hero-3d-scene";

export default function HeroSection() {
  const { t } = useTranslation();
  const containerRef = useThreeScene(initHero3DScene, "hero");

  return (
    <section className="relative" data-hero-container>
      <div className="sticky top-0 min-h-screen flex items-center justify-center overflow-visible z-0 py-20 lg:py-0 bg-bg">
        <div
          ref={containerRef}
          data-3d-container="hero"
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20 md:opacity-50 lg:opacity-100"
        />

        <div className="relative z-10 w-full px-6 md:px-12 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center max-w-7xl mx-auto">
            <div data-animate="slide-up" className="space-y-6 md:space-y-10">
              <div
                data-hero-badge
                className="glass inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-2xl border border-border bg-bg/80 backdrop-blur-md"
                style={{ willChange: 'opacity, transform' }}
              >
                <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse" />
                <span className="text-xs md:text-sm font-mono uppercase tracking-wider text-text/60">
                  {t("homepage.hero_title")}
                </span>
              </div>

              <h1 className="space-y-0 md:-space-y-6 lg:-space-y-8 relative pb-2">
                <span
                  data-hero-line
                  className="block title-hero pb-1 text-shadow-soft"
                  style={{ willChange: 'opacity, transform' }}
                >
                  {t("homepage.hero_main_title_1")}
                </span>
                <span
                  data-hero-line
                  className="block title-hero"
                  style={{
                    transform: "translateX(0)",
                    width: "max-content",
                    maxWidth: "none",
                    willChange: 'opacity, transform',
                  }}
                >
                  {t("homepage.hero_main_title_2")}
                </span>
                <span
                  data-hero-line
                  className="block title-hero text-nowrap text-shadow-soft"
                  style={{ willChange: 'opacity, transform' }}
                >
                  {t("homepage.hero_main_title_3")}
                </span>
              </h1>

              <p
                data-hero-subtitle
                className="subtitle max-w-xl md:max-w-2xl bg-bg/40 backdrop-blur-sm p-4 md:p-6 rounded-xl"
                style={{ willChange: 'opacity, transform' }}
              >
                {t("homepage.hero_subtitle")}
              </p>

              <div
                data-hero-buttons
                className="flex flex-col md:flex-row gap-4 md:gap-6 lg:w-3/4"
                style={{ willChange: 'opacity, transform' }}
              >
                <Button variant="filled" size="lg" className="w-auto">
                  {t("homepage.hero_cta")}
                </Button>

                <Button variant="outlined" size="lg" className="w-auto">
                  {t("nav.contact.menu-item")}
                </Button>
              </div>
            </div>
            <div className="hidden lg:block" />
          </div>
        </div>

        <div className="absolute bottom-12 left-0 right-0 mx-auto flex flex-col items-center gap-3 animate-bounce opacity-70 w-fit">
          <span className="text-label">
            {t("homepage.scroll")}
          </span>
          <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center">
            <div
              className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}