"use client";

import type { Stage } from "@/hooks/useStageNavigation";

interface MobileNavProps {
  currentStage: Stage;
  isMorphing: boolean;
  goToHero: () => void;
  goToAbout: () => void;
  goToProjects: () => void;
  goToContact: () => void;
}

const NAV_SECTIONS: Stage[] = ["hero", "about", "projects", "contact"];

export default function MobileNav({
  currentStage,
  isMorphing,
  goToHero,
  goToAbout,
  goToProjects,
  goToContact,
}: MobileNavProps) {
  const currentIndex = NAV_SECTIONS.indexOf(currentStage);
  const canGoUp = currentIndex > 0;
  const canGoDown = currentIndex < NAV_SECTIONS.length - 1;

  const goToPrev = () => {
    if (isMorphing || !canGoUp) return;
    const prev = NAV_SECTIONS[currentIndex - 1];
    switch (prev) {
      case "hero":
        goToHero();
        break;
      case "about":
        goToAbout();
        break;
      case "projects":
        goToProjects();
        break;
    }
  };

  const goToNext = () => {
    if (isMorphing || !canGoDown) return;
    const next = NAV_SECTIONS[currentIndex + 1];
    switch (next) {
      case "about":
        goToAbout();
        break;
      case "projects":
        goToProjects();
        break;
      case "contact":
        goToContact();
        break;
    }
  };

  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 z-[9999] flex flex-col gap-6 lg:hidden">
      <button
        onClick={goToPrev}
        disabled={!canGoUp || isMorphing}
        className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-200 ${
          canGoUp
            ? "keyboard-focus-ring bg-text/6 border border-border text-text/60 hover:bg-text/12 hover:border-primary/40 active:scale-90"
            : "opacity-0 pointer-events-none"
        }`}
        aria-label="Previous section"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M5 12.5L10 7.5L15 12.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="flex flex-col items-center gap-1 py-1" aria-hidden="true">
        {NAV_SECTIONS.map((_, i) => (
          <div
            key={i}
            className={`w-0.5 transition-all duration-300 rounded-full ${
              i === currentIndex ? "h-4 bg-primary" : "h-1.5 bg-text/35"
            }`}
          />
        ))}
      </div>
      <button
        onClick={goToNext}
        disabled={!canGoDown || isMorphing}
        className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-200 ${
          canGoDown
            ? "keyboard-focus-ring bg-text/6 border border-border text-text/60 hover:bg-text/12 hover:border-primary/40 active:scale-90"
            : "opacity-0 pointer-events-none"
        }`}
        aria-label="Next section"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
