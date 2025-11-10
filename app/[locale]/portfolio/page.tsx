"use client";

import { getAllProjects } from "@/data/projects";
import { useState, useEffect } from "react";
import { useThreeScene } from "@/hooks/useThreeScene";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { initMenuAnimations } from "@/utils/animations/menu-animations";
import { initPortfolioScene } from "@/utils/animations/portfolio-3d-scene";
import { initPortfolioScroll } from "@/utils/animations/portfolio-scroll-animation";
import { initTetrisTextAnimation } from "@/utils/animations/tetris-text-animation";
import { initBlobCursor } from "@/utils/animations/blob-cursor-animation";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import BlobCursor from "@/components/ui/BlobCursor";
import ProjectModal from "@/components/portfolio/ProjectModal";
import ProjectCounter from "@/components/portfolio/ProjectCounter";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioProjectSlide from "@/components/portfolio/PortfolioProjectSlide";
import PortfolioCTA from "@/components/portfolio/PortfolioCTA";
import type { Project } from "@/types/project";

export default function PortfolioPage() {
  const projects = getAllProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const containerRef = useThreeScene(initPortfolioScene, "portfolio");

  useEffect(() => {
    window.scrollTo(0, 0);

    // Set scroll height via CSS variable
    const updateScrollHeight = () => {
      const multiplier = window.innerWidth < 768 ? 100 : 300;
      const section = document.querySelector('[data-portfolio-section]') as HTMLElement;
      if (section) {
        section.style.setProperty('--portfolio-height', `${(projects.length + 1) * multiplier}vh`);
      }
    };

    updateScrollHeight();
    window.addEventListener('resize', updateScrollHeight);

    return () => window.removeEventListener('resize', updateScrollHeight);
  }, [projects.length]);

  useGSAPAnimations(() => {
    initMenuAnimations();
    initTetrisTextAnimation();
    initPortfolioScroll();
    initBlobCursor();
  });

  useEffect(() => {
    const handleBlobClick = (e: CustomEvent) => {
      const projectIndex = e.detail.projectIndex;
      if (projectIndex !== undefined && projects[projectIndex]) {
        setSelectedProject(projects[projectIndex]);
      }
    };

    window.addEventListener('blobProjectClick', handleBlobClick as EventListener);

    return () => {
      window.removeEventListener('blobProjectClick', handleBlobClick as EventListener);
    };
  }, [projects]);

  return (
    <>
      <section
        data-portfolio-section
        className="relative bg-bg overflow-x-hidden"
      >
        <Menu />

        <div className="sticky top-0 h-screen overflow-visible z-10">
          {/* 3D Canvas Wrapper - MOBILE: 70% height at top, DESKTOP: centered full */}
          <div className="absolute inset-0 flex flex-col lg:items-center lg:justify-center items-start justify-start w-full h-full pointer-events-none z-0">
            <div
              ref={containerRef}
              data-3d-container="portfolio-hex"
              className="w-full h-[70vh] lg:h-full lg:absolute lg:inset-0 pointer-events-none"
            />
          </div>

          {/* Content Container */}
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none z-10">

          {/* Hero Section */}
          <PortfolioHero />

          {/* Project Counter */}
          <ProjectCounter total={projects.length} />

          {/* Project Slides */}
          {projects.map((project, index) => (
            <PortfolioProjectSlide
              key={project.id}
              project={project}
              index={index}
              onViewDetails={setSelectedProject}
            />
          ))}

          {/* CTA Section */}
          <PortfolioCTA totalProjects={projects.length} />
          </div>
        </div>
      </section>
      <div className="hidden md:block">
        <Footer />
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <BlobCursor />
    </>
  );
}
