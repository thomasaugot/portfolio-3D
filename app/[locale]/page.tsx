"use client";

import { useGSAP } from "@/lib/animations";
import { initMenuAnimations } from "@/utils/animations/menu-animations";
import { initFadeAnimations } from "@/utils/animations/fade-animations";
import { initProjectsScrollAnimation } from "@/utils/animations/projects-scroll-animation";
import { initSkillsScrollAnimation } from "@/utils/animations/skills-scroll-animation";
import Menu from "@/components/layout/Menu";
import HeroSection from "@/components/homepage/HeroSection";
import SkillsSection from "@/components/homepage/SkillsSection";
import ProjectsShowcase from "@/components/homepage/ProjectsShowcase";
import { initHeroScrollAnimation } from "@/utils/animations/hero-scroll-animation";
import LoadingProvider from "@/lib/providers/LoadingProvider";
import { LanguageDiscovery } from "@/components/ui/LanguageDiscovery";

export default function Home() {
  useGSAP(() => {
    initMenuAnimations();
    initHeroScrollAnimation();
    initFadeAnimations();
    initProjectsScrollAnimation();
    initSkillsScrollAnimation();
  });

  return (
    <LoadingProvider criticalSelectors={['[data-3d-container="hero"]']}>
      <LanguageDiscovery />
      <main className="min-h-screen bg-bg text-text">
        <Menu />
        <HeroSection />
        <SkillsSection />
        <ProjectsShowcase />
      </main>
    </LoadingProvider>
  );
}