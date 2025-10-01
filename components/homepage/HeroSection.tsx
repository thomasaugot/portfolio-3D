"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { initHero3DScene } from "@/utils/animations/hero-3d-animations";

let sceneInitialized = false;

export default function HeroSection() {
  const { t } = useTranslation();
  const { isLight } = useTheme();
  const cleanupRef = useRef<(() => void) | null | undefined>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sceneInitialized || !containerRef.current) return;

    const init = async () => {
      sceneInitialized = true;
      cleanupRef.current = await initHero3DScene();
    };

    init();

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        sceneInitialized = false;
      }
    };
  }, []);

  return (
    <section className="relative" data-hero-container>
      <div className="sticky top-0 min-h-screen flex items-center justify-center overflow-visible z-0 py-16 sm:py-20 lg:py-0 bg-bg">
        <div
          ref={containerRef}
          data-3d-container="hero"
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        <div className="relative z-10 w-full md:w-[80vw] lg:w-full px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <div data-animate="slide-up" className="space-y-8">
              <div className="glass inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-border">
                <div className="w-3 h-3 rounded-full bg-text animate-pulse" />
                <span className="text-sm font-mono uppercase tracking-wider font-medium text-muted">
                  {t("homepage.hero_title")}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] space-y-0 md:-space-y-4 lg:-space-y-6 relative pb-2">
                <span className="block text-text pb-1 opacity-0">
                  {t("homepage.hero_main_title_1")}
                </span>
                <span
                  className="block opacity-0 gradient-primary bg-clip-text text-transparent font-fun text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9rem] pb-1 pr-2 relative z-10 font-light tracking-tighter"
                  style={{
                    transform: "translateX(0)",
                    width: "max-content",
                    maxWidth: "none",
                  }}
                >
                  {t("homepage.hero_main_title_2")}
                </span>
                <span className="block text-text opacity-0 text-nowrap">
                  {t("homepage.hero_main_title_3")}
                </span>
              </h1>

              <p className="text-xl max-w-xl leading-relaxed font-inter text-text-muted">
                {t("homepage.hero_subtitle")}
              </p>

              <div className="flex gap-4 lg:w-3/4">
                <Button variant="filled" size="lg">
                  {t("homepage.hero_cta")}
                </Button>

                <Button variant="outlined" size="lg">
                  {t("nav.contact.menu-item")}
                </Button>
              </div>
            </div>
            <div className="hidden lg:block" />
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