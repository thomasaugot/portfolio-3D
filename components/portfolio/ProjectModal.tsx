// ProjectModal.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/animations";
import { Mockup } from "@/components/ui/Mockup";
import type { Project } from "@/types/project";
import { useTranslation } from "@/lib/providers/TranslationProvider";

interface ProjectModalProps { project: Project; onClose: () => void; }

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t } = useTranslation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const morphRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blobPositionRef = useRef({ x: 0, y: 0 });
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const blobCursor = document.querySelector('[data-blob-cursor]') as HTMLElement;
    const portfolioScene = (window as any).__portfolioScene;

    if (portfolioScene) {
      portfolioScene.modalOpen = true;
    }

    const blobRect = blobCursor?.getBoundingClientRect();
    const startX = blobRect ? blobRect.left + blobRect.width / 2 : window.innerWidth / 2;
    const startY = blobRect ? blobRect.top + blobRect.height / 2 : window.innerHeight / 2;
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
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        opacity: 1,
        scale: 1
      });

      gsap.set(overlayRef.current, { opacity: 0 });

      if (blobCursor) {
        tl.add(() => {
          blobCursor.style.opacity = '0';
          blobCursor.style.pointerEvents = 'none';
          blobCursor.style.display = 'none';
        }, 0);
      }

      tl.to(morphRef.current, { scale: 1.2, duration: 0.2, ease: "power2.out" }, 0);
      tl.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0.1);
      tl.to(morphRef.current, {
        left: '50%',
        top: '50%',
        width: isMobile ? '95vw' : '90vw',
        height: isMobile ? '92vh' : '88vh',
        maxWidth: isMobile ? '95vw' : 1400,
        maxHeight: isMobile ? '92vh' : '88vh',
        scale: 1,
        borderRadius: isMobile ? '16px' : '24px',
        duration: 0.7,
        ease: "expo.out"
      }, 0.2);

      if (contentRef.current) {
        tl.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0.6);
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    const portfolioScene = (window as any).__portfolioScene;
    const blobCursor = document.querySelector('[data-blob-cursor]') as HTMLElement;

    const tl = gsap.timeline({ onComplete: () => {
      if (portfolioScene) {
        portfolioScene.modalOpen = false;
      }
      if (blobCursor) {
        blobCursor.style.display = 'block';
        gsap.set(blobCursor, { scale: 1, opacity: 0 });
        gsap.to(blobCursor, { opacity: 1, duration: 0.2, ease: "power2.out" });
      }
      onClose();
    }});

    if (contentRef.current) {
      tl.to(contentRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" }, 0);
    }

    if (morphRef.current) {
      tl.to(morphRef.current, {
        left: blobPositionRef.current.x,
        top: blobPositionRef.current.y,
        width: 140,
        height: 140,
        maxWidth: 140,
        maxHeight: 140,
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        duration: 0.6,
        ease: "expo.in"
      }, 0.15);

      tl.to(morphRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0.7);
    }

    if (overlayRef.current) {
      tl.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0.6);
    }
  };

  const desktopSkins = project.media?.desktopSkins || [];
  const mobileSkins = project.media?.mobileSkins || [];
  const gallery = project.media?.gallery || [];

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[9999]" style={{ background: "rgba(0, 0, 0, 0.9)", backdropFilter: "blur(20px)" }} onClick={handleClose}>
      <div
        ref={morphRef}
        className="fixed bg-bg/95 backdrop-blur-2xl border border-primary/20 overflow-hidden"
        style={{
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          boxShadow: "0 0 60px rgba(2,188,204,0.4), 0 0 100px rgba(204,255,2,0.2)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={contentRef} className="relative w-full h-full flex flex-col">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-primary/20 backdrop-blur-sm border-2 border-primary hover:border-secondary hover:bg-primary/30 hover:scale-110 active:scale-95 transition-all duration-300 group shadow-lg"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:text-secondary transition-all group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="border-b border-primary/20 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono bg-primary/20 text-primary border border-primary/30 rounded-full">
                {project.client}
              </span>
              <span className="text-[10px] sm:text-xs text-text/50 font-mono">{project.year}</span>
              <span className="text-[10px] sm:text-xs text-text/50">•</span>
              <span className="text-[10px] sm:text-xs text-text/50 font-mono uppercase">{t(project.category)}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black gradient-primary bg-clip-text text-transparent leading-tight">
              {t(project.title)}
            </h2>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8">

              {/* LEFT: Mockups */}
              <div className="space-y-4 sm:space-y-6">
                {/* Main Showcase: Desktop with Mobile Superimposed */}
                <div className="relative">
                  <Mockup
                    variant="laptop"
                    src={desktopSkins[0]}
                    alt={`${t(project.title)} - Desktop`}
                  />
                  {/* Mobile SUPERIMPOSED at bottom right */}
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 lg:bottom-6 lg:right-6 w-20 sm:w-28 md:w-36 lg:w-40 drop-shadow-2xl hover:scale-105 transition-transform duration-300">
                    <Mockup
                      variant="mobile"
                      src={mobileSkins[0]}
                      alt={`${t(project.title)} - Mobile`}
                    />
                  </div>
                </div>

                {/* Gallery Carousel */}
                {gallery.length > 0 && (
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-text/50">{t("portfolio.modal.gallery")}</h3>
                      {gallery.length > 1 && (
                        <div className="flex gap-1.5 sm:gap-2">
                          <button
                            onClick={() => setCurrentGalleryIndex((prev) => (prev - 1 + gallery.length) % gallery.length)}
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 border border-primary/30 hover:bg-primary/20 active:scale-95 transition-all flex items-center justify-center"
                          >
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <span className="text-[10px] sm:text-xs text-text/50 font-mono px-1.5 sm:px-2 flex items-center">{currentGalleryIndex + 1}/{gallery.length}</span>
                          <button
                            onClick={() => setCurrentGalleryIndex((prev) => (prev + 1) % gallery.length)}
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 border border-primary/30 hover:bg-primary/20 active:scale-95 transition-all flex items-center justify-center"
                          >
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="rounded-lg border border-primary/20 overflow-hidden">
                      <Mockup
                        variant="browser"
                        src={gallery[currentGalleryIndex]}
                        alt={`${t(project.title)} - ${currentGalleryIndex + 1}`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: Details */}
              <div className="space-y-4 sm:space-y-6">

                {/* Tech Stack */}
                {project.technologies && (
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-text/50">{t("portfolio.modal.technologies")}</h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-mono bg-primary/10 text-primary/90 border border-primary/20 rounded hover:bg-primary/20 transition-colors">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Challenge */}
                {project.details?.challenge && (
                  <div className="space-y-2 sm:space-y-3 p-4 sm:p-5 bg-surface/30 rounded-lg border border-border/30">
                    <h3 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-primary flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {t("portfolio.modal.challenge")}
                    </h3>
                    <p className="text-xs sm:text-sm text-text/80 leading-relaxed">
                      {t(project.details.challenge)}
                    </p>
                  </div>
                )}

                {/* Solution */}
                {project.details?.solution && (
                  <div className="space-y-2 sm:space-y-3 p-4 sm:p-5 bg-surface/30 rounded-lg border border-border/30">
                    <h3 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-secondary flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t("portfolio.modal.solution")}
                    </h3>
                    <p className="text-xs sm:text-sm text-text/80 leading-relaxed">
                      {t(project.details.solution)}
                    </p>
                  </div>
                )}

                {/* CTA Button */}
                {project.media?.link && (
                  <div className="pt-2 sm:pt-4">
                    <a
                      href={project.media.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-primary to-secondary text-bg font-mono text-xs sm:text-sm rounded-lg hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                    >
                      <span>{t("portfolio.modal.view_live")}</span>
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
