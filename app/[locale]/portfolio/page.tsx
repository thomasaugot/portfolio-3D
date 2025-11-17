"use client";

import { getAllProjects } from "@/data/projects";
import { useEffect } from "react";
import { useThreeScene } from "@/hooks/useThreeScene";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { initMenuAnimations } from "@/utils/animations/menu-animations";
import { initPortfolioScene } from "@/utils/animations/portfolio-3d-scene";
import { initPortfolioScroll } from "@/utils/animations/portfolio-scroll-animation";
import { initTetrisTextAnimation } from "@/utils/animations/tetris-text-animation";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import BlobModalCursor from "@/components/ui/BlobModalCursor";
import ProjectCounter from "@/components/portfolio/ProjectCounter";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioProjectSlide from "@/components/portfolio/PortfolioProjectSlide";
import PortfolioCTA from "@/components/portfolio/PortfolioCTA";

export default function PortfolioPage() {
  const projects = getAllProjects();
  const containerRef = useThreeScene(initPortfolioScene, "portfolio");

  useEffect(() => {
    window.scrollTo(0, 0);

    const updateScrollHeight = () => {
      const multiplier = window.innerWidth < 768 ? 100 : 300;
      const section = document.querySelector(
        "[data-portfolio-section]"
      ) as HTMLElement;
      if (section) {
        section.style.setProperty(
          "--portfolio-height",
          `${(projects.length + 1) * multiplier}vh`
        );
      }
    };

    updateScrollHeight();
    window.addEventListener("resize", updateScrollHeight);

    return () => window.removeEventListener("resize", updateScrollHeight);
  }, [projects.length]);

  useGSAPAnimations(() => {
    initMenuAnimations();
    initTetrisTextAnimation();
    initPortfolioScroll();
  });

  return (
    <>
      <section
        data-portfolio-section
        className="relative bg-bg overflow-x-hidden"
      >
        <Menu />

        <div className="sticky top-0 h-screen overflow-visible z-10">
          <div className="absolute inset-0 flex flex-col lg:items-center lg:justify-center items-start justify-start w-full h-full pointer-events-none z-0">
            <div
              ref={containerRef}
              data-3d-container="portfolio-hex"
              className="w-full h-full absolute inset-0 pointer-events-none"
            />
          </div>

          <div className="relative w-full h-full flex items-center justify-center pointer-events-none z-10">
            <PortfolioHero />

            <ProjectCounter total={projects.length} />

            {projects.map((project, index) => (
              <PortfolioProjectSlide
                key={project.id}
                project={project}
                index={index}
                onViewDetails={(project) => {
                  // Store click position for modal animation
                  (window as any).__modalClickPosition = {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2
                  };
                  window.dispatchEvent(
                    new CustomEvent("openProjectModal", {
                      detail: { project },
                    })
                  );
                }}
              />
            ))}

            <PortfolioCTA totalProjects={projects.length} />
          </div>
        </div>
      </section>
      <div className="hidden md:block">
        <Footer />
      </div>

      <BlobModalCursor projects={projects} />
    </>
  );
}
