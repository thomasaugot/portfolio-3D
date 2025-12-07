"use client";

import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { initMenuAnimations } from "@/utils/animations/menu-animations";
import { initHeroTitleAnimation } from "@/utils/animations/hero-title-animation";
import { initHeroScrollAnimation } from "@/utils/animations/hero-scroll-animation";
import { initSkillsScrollAnimation } from "@/utils/animations/skills-scroll-animation";
import { initTetrisTextAnimation } from "@/utils/animations/tetris-text-animation";
import { initProjectsScrollAnimation } from "@/utils/animations/projects-scroll-animation";
import { initCTAScrollAnimation } from "@/utils/animations/cta-scroll-animation";
import { initFooterAnimations } from "@/utils/animations/footer-animations";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/homepage/HeroSection";
import SkillsSection from "@/components/homepage/SkillsSection";
import TechnologyMarquee from "@/components/ui/TechnologyMarquee";
import ProjectsShowcase from "@/components/homepage/ProjectsShowcase";
import CTASection from "@/components/homepage/CTASection";

export default function Home() {
  useGSAPAnimations(() => {
    initHeroTitleAnimation();
    initHeroScrollAnimation();
    initMenuAnimations();
    initSkillsScrollAnimation();
    initTetrisTextAnimation();
    initProjectsScrollAnimation();
    initCTAScrollAnimation();
    initFooterAnimations();
  });

  return (
    <main className="text-text bg-bg overflow-x-hidden">
      <Menu />
      <HeroSection />
      <SkillsSection />
      <TechnologyMarquee />
      <ProjectsShowcase />
      <CTASection />
      <Footer />
    </main>
  );
}
