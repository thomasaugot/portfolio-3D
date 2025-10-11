"use client";

import { useGSAP } from "@/lib/animations";
import { initMenuAnimations } from "@/utils/animations/menu-animations";
import { initFadeAnimations } from "@/utils/animations/fade-animations";
import { initProjectsScrollAnimation } from "@/utils/animations/projects-scroll-animation";
import { initSkillsScrollAnimation } from "@/utils/animations/skills-scroll-animation";
import { initHeroScrollAnimation } from "@/utils/animations/hero-scroll-animation";
import { initFooterAnimations } from "@/utils/animations/footer-animations";
import { initCTAScrollAnimation } from "@/utils/animations/cta-scroll-animation";
import Menu from "@/components/layout/Menu";
import HeroSection from "@/components/homepage/HeroSection";
import SkillsSection from "@/components/homepage/SkillsSection";
import ProjectsShowcase from "@/components/homepage/ProjectsShowcase";
import CTASection from "@/components/homepage/CTASection";
import LoadingProvider from "@/lib/providers/LoadingProvider";
import Footer from "@/components/layout/Footer";
import TechnologyMarquee from "@/components/ui/TechnologyMarquee";

export default function Home() {
  useGSAP(() => {
    initMenuAnimations();
    initHeroScrollAnimation();
    initFadeAnimations();
    initSkillsScrollAnimation();
    initProjectsScrollAnimation();
    initCTAScrollAnimation();
    initFooterAnimations();
  });

  return (
    <LoadingProvider criticalSelectors={['[data-3d-container="hero"]']}>
      <main className="min-h-screen bg-bg text-text overflow-visible">
        <Menu />
        <HeroSection />
        <SkillsSection />
        <TechnologyMarquee />
        <ProjectsShowcase />
        <CTASection />
        <Footer />
      </main>
    </LoadingProvider>
  );
}