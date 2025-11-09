// ProjectModal.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/animations";
import { Mockup } from "@/components/ui/Mockup";
import type { Project } from "@/types/project";
import { useTranslation } from "@/lib/providers/TranslationProvider";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t } = useTranslation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const morphRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blobPositionRef = useRef({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const blobCursor = document.querySelector(
      "[data-blob-cursor]"
    ) as HTMLElement;
    const portfolioScene = (window as any).__portfolioScene;

    if (portfolioScene) {
      portfolioScene.modalOpen = true;
    }

    const blobRect = blobCursor?.getBoundingClientRect();
    const startX = blobRect
      ? blobRect.left + blobRect.width / 2
      : window.innerWidth / 2;
    const startY = blobRect
      ? blobRect.top + blobRect.height / 2
      : window.innerHeight / 2;
    blobPositionRef.current = { x: startX, y: startY };

    const tl = gsap.timeline();

    if (morphRef.current && overlayRef.current) {
      const isMobile = window.innerWidth < 640;

      gsap.set(morphRef.current, {
        left: startX,
        top: startY,
        width: 140,
        height: 140,
        xPercent: -50,
        yPercent: -50,
        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        opacity: 1,
        scale: 1,
      });

      gsap.set(overlayRef.current, { opacity: 0 });

      if (blobCursor) {
        tl.add(() => {
          blobCursor.style.opacity = "0";
          blobCursor.style.pointerEvents = "none";
          blobCursor.style.display = "none";
        }, 0);
      }

      tl.to(
        morphRef.current,
        { scale: 1.2, duration: 0.2, ease: "power2.out" },
        0
      );
      tl.to(
        overlayRef.current,
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        0.1
      );
      tl.to(
        morphRef.current,
        {
          left: "50%",
          top: "50%",
          width: isMobile ? "95vw" : "90vw",
          height: isMobile ? "92vh" : "90vh",
          maxWidth: isMobile ? "95vw" : 1600,
          maxHeight: isMobile ? "92vh" : "90vh",
          scale: 1,
          borderRadius: isMobile ? "16px" : "24px",
          duration: 0.7,
          ease: "expo.out",
        },
        0.2
      );

      if (contentRef.current) {
        tl.fromTo(
          contentRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power2.out" },
          0.6
        );
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    const portfolioScene = (window as any).__portfolioScene;
    const blobCursor = document.querySelector(
      "[data-blob-cursor]"
    ) as HTMLElement;

    const tl = gsap.timeline({
      onComplete: () => {
        if (portfolioScene) {
          portfolioScene.modalOpen = false;
        }
        if (blobCursor) {
          blobCursor.style.display = "block";
          gsap.set(blobCursor, { scale: 1, opacity: 0 });
          gsap.to(blobCursor, {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out",
          });
        }
        onClose();
      },
    });

    if (contentRef.current) {
      tl.to(
        contentRef.current,
        { opacity: 0, duration: 0.25, ease: "power2.in" },
        0
      );
    }

    if (morphRef.current) {
      tl.to(
        morphRef.current,
        {
          left: blobPositionRef.current.x,
          top: blobPositionRef.current.y,
          width: 140,
          height: 140,
          maxWidth: 140,
          maxHeight: 140,
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          duration: 0.6,
          ease: "expo.in",
        },
        0.15
      );

      tl.to(
        morphRef.current,
        { opacity: 0, duration: 0.2, ease: "power2.in" },
        0.7
      );
    }

    if (overlayRef.current) {
      tl.to(
        overlayRef.current,
        { opacity: 0, duration: 0.3, ease: "power2.in" },
        0.6
      );
    }
  };

  const desktopSkins = project.media?.desktopSkins || [];
  const mobileSkins = project.media?.mobileSkins || [];
  const totalImages = Math.max(desktopSkins.length, mobileSkins.length);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999]"
      style={{
        background: "rgba(0, 0, 0, 0.95)",
        backdropFilter: "blur(20px)",
      }}
      onClick={handleClose}
    >
      <div
        ref={morphRef}
        className="fixed bg-bg backdrop-blur-xl overflow-hidden"
        style={{
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          boxShadow: "0 0 0 1px rgba(204,255,2,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={contentRef} className="relative w-full h-full flex flex-col">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-xl bg-bg/50 backdrop-blur-sm hover:bg-primary/10 transition-all duration-300 group"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 text-primary group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mx-auto px-8 lg:px-16 py-12 lg:py-16">
              {/* Header */}
              <div className="mb-12">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="tag">{project.client}</span>
                  <span className="text-text/40">•</span>
                  <span className="text-label">{project.year}</span>
                  <span className="text-text/40">•</span>
                  <span className="text-label">{t(project.category)}</span>
                </div>

                {/* Title + Live Link */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <h2 className="title-section gradient-text">
                    {t(project.title)}
                  </h2>

                  {/* Live Project Button */}
                  {project.media?.link && (
                    <a
                      href={project.media.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary overflow-hidden hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-110 active:scale-95 flex-shrink-0"
                      aria-label="View live project"
                    >
                      <div className="absolute inset-0 gradient-primary-hover opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <svg
                        className="relative z-10 w-5 h-5 text-bg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Main Grid - Better proportions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                {/* LEFT: Mockups - Takes less space (6 columns) */}
                <div className="lg:col-span-6 space-y-6">
                  {/* Carousel Controls */}
                  {totalImages > 1 && (
                    <div className="flex items-center justify-between">
                      <h3 className="text-label">
                        {t("portfolio.modal.gallery")}
                      </h3>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={handlePrevious}
                          className="w-9 h-9 rounded-xl bg-surface hover:bg-primary/10 transition-colors flex items-center justify-center"
                          aria-label="Previous"
                        >
                          <svg
                            className="w-4 h-4 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>

                        <span className="text-xs font-mono text-text/60">
                          {currentIndex + 1} / {totalImages}
                        </span>

                        <button
                          onClick={handleNext}
                          className="w-9 h-9 rounded-xl bg-surface hover:bg-primary/10 transition-colors flex items-center justify-center"
                          aria-label="Next"
                        >
                          <svg
                            className="w-4 h-4 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mockups Container - Smaller desktop */}
                  <div className="relative max-w-xl mx-auto">
                    {desktopSkins[currentIndex] && (
                      <div className="w-full">
                        <Mockup
                          key={`desktop-${currentIndex}`}
                          variant="laptop"
                          src={desktopSkins[currentIndex]}
                          alt={`${t(project.title)} - Desktop ${
                            currentIndex + 1
                          }`}
                        />
                      </div>
                    )}

                    {/* Mobile Overlay - Better sized */}
                    {mobileSkins[currentIndex] && (
                      <div className="absolute -bottom-6 -right-6 lg:-bottom-8 lg:-right-8 w-32 lg:w-40 drop-shadow-2xl">
                        <Mockup
                          key={`mobile-${currentIndex}`}
                          variant="mobile"
                          src={mobileSkins[currentIndex]}
                          alt={`${t(project.title)} - Mobile ${
                            currentIndex + 1
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Dots */}
                  {totalImages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                      {Array.from({ length: totalImages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentIndex
                              ? "w-8 bg-primary"
                              : "w-1.5 bg-text/20 hover:bg-text/40"
                          }`}
                          aria-label={`Image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT: Content - More space (6 columns) */}
                <div className="lg:col-span-6 space-y-10">
                  {/* Tech Stack */}
                  {project.technologies && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 text-xs font-mono bg-primary/5 text-primary/80 rounded-full hover:bg-primary/10 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Challenge */}
                  {project.details?.challenge && (
                    <div className="space-y-4">
                      <h3 className="title-item">
                        {t("portfolio.modal.challenge")}
                      </h3>
                      <p className="text-body">
                        {t(project.details.challenge)}
                      </p>
                    </div>
                  )}

                  {/* Solution */}
                  {project.details?.solution && (
                    <div className="space-y-4">
                      <h3 className="title-item">
                        {t("portfolio.modal.solution")}
                      </h3>
                      <p className="text-body">{t(project.details.solution)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
