"use client";

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
import Footer from "@/components/layout/Footer";
import TechnologyMarquee from "@/components/ui/TechnologyMarquee";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import CTASection from "@/components/homepage/CTASection";

export default function Home() {
  useGSAPAnimations(() => {
    initMenuAnimations();
    initHeroScrollAnimation();
    initFadeAnimations();
    initSkillsScrollAnimation();
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
