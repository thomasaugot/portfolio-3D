"use client";

import { useThreeScene } from "@/hooks/useThreeScene";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { initMenuAnimations } from "@/utils/animations/menu-animations";
import { initAbout3DScene } from "@/utils/animations/about-3d-scene";
import { initAboutScroll } from "@/utils/animations/about-scroll-animation";
import { initAboutHeroAnimation } from "@/utils/animations/about-hero-animation";
import { initTechConstellation } from "@/utils/animations/tech-constellation-animation";
import { initTimelineAnimation } from "@/utils/animations/timeline-animation";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import ThreeContainer from "@/components/ui/ThreeContainer";
import AboutHero from "@/components/about-page/AboutHero";
import TechStack from "@/components/about-page/TechStack";
import Specialties from "@/components/about-page/Specialties";
import Timeline from "@/components/about-page/Timeline";
import AboutCTA from "@/components/about-page/AboutCTA";

export default function AboutPage() {
  const containerRef = useThreeScene(initAbout3DScene, "about");

  useGSAPAnimations(() => {
    initMenuAnimations();
    initAboutScroll();
    initAboutHeroAnimation();
    initTechConstellation();
    initTimelineAnimation();
  });

  return (
    <>
      <Menu />
      <section className="relative bg-bg overflow-x-clip min-h-screen">
        <ThreeContainer containerRef={containerRef} name="about" />
        <div className="relative z-10 overflow-x-hidden">
          <AboutHero />
          <TechStack />
          <Specialties />
          <Timeline />
          <AboutCTA />
          <Footer />
        </div>
      </section>
    </>
  );
}
