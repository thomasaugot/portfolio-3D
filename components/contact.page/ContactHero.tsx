"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import { useThreeScene } from "@/hooks/useThreeScene";
import { initContactHero3DScene } from "@/utils/animations/contact-hero-3d-scene";

export default function ContactHero() {
  const { t } = useTranslation();
  const containerRef = useThreeScene(initContactHero3DScene, "contact-hero");

  return (
    <section className="relative" data-contact-hero>
      <div className="sticky top-0 min-h-screen flex items-center justify-center overflow-visible z-0 py-16 sm:py-20 lg:py-0 bg-bg">
        <div
          ref={containerRef}
          data-3d-container="contact-hero"
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40 lg:opacity-100"
        />

        <div className="relative z-10 w-full px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div data-contact-hero-content className="space-y-8">
              
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-border bg-bg/80 backdrop-blur-md">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-mono uppercase tracking-wider font-medium text-muted">
                  {t("contact.hero.badge")}
                </span>
              </div>

              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-text leading-[0.95]">
                {t("contact.hero.title_1")}
                <br />
                <span className="gradient-primary bg-clip-text text-transparent font-fun">
                  {t("contact.hero.title_2")}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto leading-relaxed">
                {t("contact.hero.subtitle")}
              </p>

            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce opacity-70">
          <span className="text-xs font-mono uppercase tracking-wider text-subtle">
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