"use client";

import { getAllProjects } from "@/data/projects";
import { useState, useEffect } from "react";
import { useThreeScene } from "@/hooks/useThreeScene";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { useTranslation } from "@/lib/providers/TranslationProvider";
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
  const { t } = useTranslation();
  const projects = getAllProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [scrollMultiplier, setScrollMultiplier] = useState(100);
  const containerRef = useThreeScene(initPortfolioScene, "portfolio");

  useEffect(() => {
    window.scrollTo(0, 0);

    // Set scroll multiplier based on screen size
    const updateScrollMultiplier = () => {
      setScrollMultiplier(window.innerWidth < 768 ? 100 : 300);
    };

    updateScrollMultiplier();
    window.addEventListener('resize', updateScrollMultiplier);

    return () => window.removeEventListener('resize', updateScrollMultiplier);
  }, []);

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
        style={{ height: `${(projects.length + 1) * scrollMultiplier}vh` }}
      >
        <Menu />

        <div
          className="sticky top-0 h-screen overflow-visible flex items-center justify-center"
          style={{ zIndex: 10 }}
        >
          {/* 3D Scene Container */}
          <div
            ref={containerRef}
            data-3d-container="portfolio-hex"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          />

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
