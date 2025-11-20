"use client";

import { useEffect } from "react";
import { useThreeScene } from "@/hooks/useThreeScene";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { initMenuAnimations } from "@/utils/animations/menu-animations";
import { initAbout3DScene } from "@/utils/animations/about-3d-scene";
import { initAboutScroll } from "@/utils/animations/about-scroll-animation";
import { initAboutHeroAnimation } from "@/utils/animations/about-hero-animation";
import { initTechStack3DScene } from "@/utils/animations/techstack-3d-scene";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/about-page/AboutHero";
import TechStack from "@/components/about-page/TechStack";
import Specialties from "@/components/about-page/Specialties";
import Timeline from "@/components/about-page/Timeline";

export default function AboutPage() {
  const containerRef = useThreeScene(initAbout3DScene, "about");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useGSAPAnimations(() => {
    initMenuAnimations();
    initAboutScroll();
    initAboutHeroAnimation();
  });

  // Initialize TechStack 3D scene
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    initTechStack3DScene().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <>
      <Menu />
      <section className="relative bg-bg overflow-x-clip min-h-screen">
        {/* Fixed 3D Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div
            ref={containerRef}
            data-3d-container="about"
            className="w-full h-full"
          />
        </div>

        {/* Scrollable Content */}
        <div className="relative z-10 overflow-x-hidden">
          <AboutHero />
          <TechStack />
          <Specialties />
          <Timeline />
        </div>
      </section>

      <Footer />
    </>
  );
}
