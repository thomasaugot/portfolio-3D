"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import Image from "next/image";

export default function AboutHero() {
  const { t } = useTranslation();

  return (
    <section data-about-hero className="relative min-h-screen flex items-center justify-center py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Photo */}
          <div className="relative order-2 lg:order-1" data-photo-container>
            <div className="relative w-full max-w-lg mx-auto">
              {/* Glow effect */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl blur-3xl opacity-60"
                data-photo-glow
              />

              {/* Photo container */}
              <div
                className="relative aspect-square w-full bg-bg rounded-3xl overflow-hidden border border-border/30"
                style={{
                  clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)"
                }}
              >
                <Image
                  src="/assets/images/portrait/portrait-nobg.png"
                  alt="Thomas Augot"
                  fill
                  className="object-contain scale-110"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-8 order-1 lg:order-2" data-text-content>
            <div data-tetris-title>
              <h1 className="title-hero gradient-text mb-4">
                {t("about.hero.title")}
              </h1>
              <p className="text-xl md:text-2xl text-text/70 font-mono">
                {t("about.hero.subtitle")}
              </p>
            </div>

            <div className="space-y-6" data-intro-paragraphs>
              <p data-intro-paragraph className="text-lg md:text-xl text-text/90 leading-relaxed">
                {t("about.intro.paragraph_1")}
              </p>
              <p data-intro-paragraph className="text-lg md:text-xl text-text/90 leading-relaxed">
                {t("about.intro.paragraph_2")}
              </p>
              <p data-intro-paragraph className="text-lg md:text-xl text-text/90 leading-relaxed">
                {t("about.intro.paragraph_3")}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8" data-quick-stats>
              <div className="text-center p-4 bg-surface/30 backdrop-blur-sm rounded-xl border border-border/30">
                <div className="text-3xl font-bold gradient-text">3+</div>
                <div className="text-sm text-text/60 mt-1">Years</div>
              </div>
              <div className="text-center p-4 bg-surface/30 backdrop-blur-sm rounded-xl border border-border/30">
                <div className="text-3xl font-bold gradient-text">20+</div>
                <div className="text-sm text-text/60 mt-1">Projects</div>
              </div>
              <div className="text-center p-4 bg-surface/30 backdrop-blur-sm rounded-xl border border-border/30">
                <div className="text-2xl font-bold gradient-text">3</div>
                <div className="text-sm text-text/60 mt-1">Languages</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
