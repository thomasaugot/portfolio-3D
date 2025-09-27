"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button";
import { initHero3DScene } from "@/utils/animations/hero-3d-animations";

let sceneInitialized = false;

export default function HeroSection() {
  const { t } = useTranslation();
  const cleanupRef = useRef<(() => void) | null | undefined>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent double initialization
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
    <section className="min-h-screen flex items-center justify-center relative overflow-visible z-0 py-16 sm:py-20 lg:py-0">
      <div
        ref={containerRef}
        data-3d-container="hero"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      <div className="relative z-10 w-full px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <div data-animate="slide-up" className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-mono text-white uppercase">
                {t("homepage.hero_title")}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.2] -space-y-2 sm:-space-y-3 md:-space-y-4 lg:-space-y-6 relative pb-2">
              <span className="block text-[var(--color-text)]">
                {t("homepage.hero_main_title_1")}
              </span>
              <span className="block text-transparent bg-clip-text gradient-primary font-fun text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9rem] pb-2 pr-2 relative z-10 font-light tracking-tighter" style={{ 
                transform: 'translateX(0)', 
                width: 'max-content',
                maxWidth: 'none'
              }}>
                {t("homepage.hero_main_title_2")}
              </span>
              <span className="block text-[var(--color-text)]">
                {t("homepage.hero_main_title_3")}
              </span>
            </h1>

            <p className="text-xl text-[var(--color-text-muted)] max-w-xl leading-relaxed font-inter">
              {t("homepage.hero_subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="filled"
                size="lg"
                className="transform hover:scale-105 transition-transform duration-300"
              >
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

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce">
        <span className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
          {t("homepage.scroll")}
        </span>
        <svg
          className="w-6 h-6 text-[var(--primary-color)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}