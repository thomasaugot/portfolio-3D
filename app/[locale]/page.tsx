"use client";

import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { initTerminal } from "@/utils/animations/terminal-morph";
import { initPortfolioScroll } from "@/utils/animations/portfolio-scroll-animation";
import { initNavbarTypewriter } from "@/utils/animations/navbar-typewriter";
import { initLaptopAnimations, initHexFloorAnimations } from "@/utils/animations/hero-3d-scene";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/hero/HeroSection";
import AboutSection from "@/components/sections/about/AboutSection";
import ProjectsSection from "@/components/sections/projects/ProjectsSection";
import ContactSection from "@/components/sections/contact/ContactSection";
import Canva from "@/components/ui/Canva";

export default function Home() {
  useGSAPAnimations(() => {
    initTerminal();
    initNavbarTypewriter();
    initPortfolioScroll();
    initLaptopAnimations();
    initHexFloorAnimations();
  });

  return (
    <Canva>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </Canva>
  );
}
