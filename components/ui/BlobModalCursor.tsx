"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/animations";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { Mockup } from "@/components/ui/Mockup";
import type { Project } from "@/types/project";

interface BlobModalCursorProps {
  projects: Project[];
}

export default function BlobModalCursor({ projects }: BlobModalCursorProps) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const blobBgRef = useRef<HTMLDivElement>(null);
  const blobContentRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const openModal = useCallback((startX: number, startY: number) => {
    if (!containerRef.current || !glowRef.current || !bgRef.current || !modalContentRef.current || !blobBgRef.current || !blobContentRef.current || !overlayRef.current) return;

    setIsModalOpen(true);
    document.body.style.overflow = "hidden";

    const container = containerRef.current;
    const glow = glowRef.current;
    const bg = bgRef.current;
    const blobBg = blobBgRef.current;
    const blobContent = blobContentRef.current;
    const modalContent = modalContentRef.current;
    const overlay = overlayRef.current;
    const isMobile = window.innerWidth < 640;
    const finalRadius = isMobile ? "16px" : "24px";

    const tl = gsap.timeline();

    // Set initial state
    gsap.set(container, {
      left: startX,
      top: startY,
      width: 140,
      height: 140,
      opacity: 1,
      pointerEvents: 'auto'
    });
    gsap.set(overlay, { opacity: 0, pointerEvents: 'none' });
    gsap.set(modalContent, { opacity: 0 });
    gsap.set([blobBg, blobContent], { opacity: 1 });

    // Fade out blob layers smoothly and hide them completely
    tl.to([blobContent, blobBg], {
      opacity: 0,
      display: 'none',
      duration: 0.25,
      ease: "power2.inOut"
    }, 0);

    // Pulse scale
    tl.to(container, { scale: 1.15, duration: 0.2, ease: "power2.out" }, 0);

    // Fade in overlay
    tl.to(overlay, { opacity: 1, pointerEvents: 'auto', duration: 0.5, ease: "power2.out" }, 0.15);

    // Morph everything together
    tl.to(
      container,
      {
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        width: isMobile ? "95vw" : "90vw",
        height: isMobile ? "92vh" : "90vh",
        maxWidth: isMobile ? "95vw" : 1600,
        maxHeight: isMobile ? "92vh" : "90vh",
        scale: 1,
        duration: 0.8,
        ease: "expo.out",
      },
      0.25
    );

    // Morph glow border radius and stop animation
    tl.to(
      glow,
      {
        borderRadius: finalRadius,
        duration: 0.8,
        ease: "expo.out",
        onStart: () => {
          glow.style.animation = 'none';
        }
      },
      0.25
    );
    tl.to(
      bg,
      {
        borderRadius: finalRadius,
        duration: 0.8,
        ease: "expo.out",
        onStart: () => {
          bg.style.animation = 'none';
        }
      },
      0.25
    );

    // Fade in modal content
    tl.to(
      modalContent,
      {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.5,
        ease: "power2.out"
      },
      0.7
    );
  }, []);

  const closeModal = useCallback(() => {
    if (!containerRef.current || !glowRef.current || !bgRef.current || !modalContentRef.current || !blobBgRef.current || !blobContentRef.current || !overlayRef.current) return;

    const container = containerRef.current;
    const glow = glowRef.current;
    const bg = bgRef.current;
    const blobBg = blobBgRef.current;
    const blobContent = blobContentRef.current;
    const modalContent = modalContentRef.current;
    const overlay = overlayRef.current;

    // Get last cursor position or fallback to center
    const cursorPos = (window as any).__blobCursorPosition;
    const centerX = cursorPos?.x ?? window.innerWidth / 2;
    const centerY = cursorPos?.y ?? window.innerHeight / 2;

    const tl = gsap.timeline({
      onComplete: () => {
        // Clean up after animation
        document.body.style.overflow = "";
        setSelectedProject(null);
        setIsModalOpen(false);
      },
    });

    // Fade out modal content quickly
    tl.to(modalContent, {
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.2,
      ease: "power2.in"
    }, 0);

    // Morph back to blob
    tl.to(
      container,
      {
        left: centerX,
        top: centerY,
        xPercent: -50,
        yPercent: -50,
        width: 140,
        height: 140,
        maxWidth: 140,
        maxHeight: 140,
        duration: 0.5,
        ease: "expo.inOut",
      },
      0.15
    );

    // Morph border radius
    tl.to(
      [glow, bg],
      {
        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        duration: 0.5,
        ease: "expo.inOut",
      },
      0.15
    );

    // Restart animations
    tl.call(() => {
      glow.style.animation = 'blobMorph 6s ease-in-out infinite';
      bg.style.animation = 'blobMorph 6s ease-in-out infinite';
    }, null, 0.4);

    // Show blob content
    tl.set(blobBg, { display: 'block' }, 0.3);
    tl.set(blobContent, { display: 'flex' }, 0.3);
    tl.to([blobBg, blobContent], {
      opacity: 1,
      duration: 0.2,
      ease: "power2.out"
    }, 0.3);

    // Fade out everything
    tl.to(container, { opacity: 0, duration: 0.25, ease: "power2.in" }, 0.6);
    tl.to(overlay, { opacity: 0, pointerEvents: 'none', duration: 0.3, ease: "power2.in" }, 0.5);
  }, []);

  // Listen for button click events to open modal
  useEffect(() => {
    const handleOpenModal = (e: CustomEvent) => {
      const project = e.detail.project;
      const clickPos = (window as any).__modalClickPosition;

      if (project) {
        setSelectedProject(project);
        setCurrentImageIndex(0);

        if (clickPos) {
          // Also store this as blob cursor position for closing animation
          (window as any).__blobCursorPosition = clickPos;
          openModal(clickPos.x, clickPos.y);
        } else {
          const centerPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
          (window as any).__blobCursorPosition = centerPos;
          openModal(centerPos.x, centerPos.y);
        }
      }
    };

    window.addEventListener("openProjectModal", handleOpenModal as EventListener);

    return () => {
      window.removeEventListener("openProjectModal", handleOpenModal as EventListener);
    };
  }, [openModal]);

  // Blob cursor tracking logic
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice || !containerRef.current) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetOpacity = 0;
    let currentOpacity = 0;
    let rafId: number;
    let currentVisibleProject: number | null = null;

    const container = containerRef.current;
    const projectPanels = Array.from(document.querySelectorAll('[data-project-panel]'));

    // Store current position globally for close animation
    const updateGlobalPosition = () => {
      (window as any).__blobCursorPosition = { x: currentX, y: currentY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isModalOpen) {
        targetOpacity = 0;
        return;
      }

      targetX = e.clientX;
      targetY = e.clientY;

      let isOverProject = false;
      currentVisibleProject = null;

      const viewportHeight = window.innerHeight;
      const centralTop = viewportHeight * 0.25;
      const centralBottom = viewportHeight * 0.75;

      const inCentralZone = e.clientY >= centralTop && e.clientY <= centralBottom;

      if (!inCentralZone) {
        targetOpacity = 0;
        currentVisibleProject = null;
        return;
      }

      // Check if menu is open
      const menuOverlay = document.querySelector('[data-animate="menu-overlay"]');
      if (menuOverlay) {
        const overlayStyle = window.getComputedStyle(menuOverlay);
        if (overlayStyle.pointerEvents === 'auto') {
          targetOpacity = 0;
          currentVisibleProject = null;
          return;
        }
      }

      // Check if hovering over buttons
      const target = e.target as HTMLElement;
      const isOverButton = target.closest('button') || target.closest('a[href]');
      const isOverCTA = target.closest('[data-cta-buttons]') || target.closest('[data-project-button]');

      if (isOverButton || isOverCTA) {
        targetOpacity = 0;
        currentVisibleProject = null;
        return;
      }

      // Check 3D container
      const container3D = document.querySelector('[data-3d-container="portfolio-hex"]');
      if (container3D) {
        const rect3D = container3D.getBoundingClientRect();

        if (
          e.clientX >= rect3D.left &&
          e.clientX <= rect3D.right &&
          e.clientY >= rect3D.top &&
          e.clientY <= rect3D.bottom
        ) {
          for (let i = 0; i < projectPanels.length - 1; i++) {
            const panel = projectPanels[i] as HTMLElement;
            const computedStyle = window.getComputedStyle(panel);

            if (parseFloat(computedStyle.opacity) > 0.1) {
              isOverProject = true;
              currentVisibleProject = i;
              break;
            }
          }
        }
      }

      // Check header visibility
      if (isOverProject) {
        const header = document.querySelector('[data-projects-header]');
        if (header) {
          const headerStyle = window.getComputedStyle(header as HTMLElement);
          if (parseFloat(headerStyle.opacity) > 0.5) {
            isOverProject = false;
            currentVisibleProject = null;
          }
        }
      }

      targetOpacity = isOverProject ? 1 : 0;
    };

    const animate = () => {
      const posEase = 0.15;
      const opacityEase = 0.2;

      currentX += (targetX - currentX) * posEase;
      currentY += (targetY - currentY) * posEase;
      currentOpacity += (targetOpacity - currentOpacity) * opacityEase;

      if (container && !isModalOpen) {
        container.style.left = `${currentX}px`;
        container.style.top = `${currentY}px`;
        container.style.opacity = String(currentOpacity);
        container.style.pointerEvents = currentOpacity > 0.1 ? 'auto' : 'none';
        updateGlobalPosition();
      }

      rafId = requestAnimationFrame(animate);
    };

    const handleBlobClick = () => {
      if (currentOpacity > 0.5 && currentVisibleProject !== null && projects[currentVisibleProject]) {
        const project = projects[currentVisibleProject];
        updateGlobalPosition(); // Store position before opening
        setSelectedProject(project);
        setCurrentImageIndex(0);
        openModal(currentX, currentY);
      }
    };

    container.addEventListener('click', handleBlobClick);
    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener('click', handleBlobClick);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isModalOpen, projects, openModal]);

  const handlePrevious = () => {
    if (!selectedProject) return;
    const desktopSkins = selectedProject.media?.desktopSkins || [];
    const mobileSkins = selectedProject.media?.mobileSkins || [];
    const totalImages = Math.max(desktopSkins.length, mobileSkins.length);
    const nextIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    animateMockupChange('prev', nextIndex);
    setTimeout(() => setCurrentImageIndex(nextIndex), 300);
  };

  const handleNext = () => {
    if (!selectedProject) return;
    const desktopSkins = selectedProject.media?.desktopSkins || [];
    const mobileSkins = selectedProject.media?.mobileSkins || [];
    const totalImages = Math.max(desktopSkins.length, mobileSkins.length);
    const nextIndex = (currentImageIndex + 1) % totalImages;
    animateMockupChange('next', nextIndex);
    setTimeout(() => setCurrentImageIndex(nextIndex), 300);
  };

  const animateMockupChange = (direction: 'next' | 'prev', nextIndex: number) => {
    const desktopMockup = document.querySelector('[data-mockup="desktop"]') as HTMLElement;
    const mobileMockup = document.querySelector('[data-mockup="mobile"]') as HTMLElement;

    if (!desktopMockup) return;

    const tl = gsap.timeline();

    const animationPatterns = [
      { desktop: { x: -60, rotation: -5 }, mobile: { x: 60, rotation: 5, scale: 0.9 } },
      { desktop: { x: 60, rotation: 5 }, mobile: { x: -60, rotation: -5, scale: 0.9 } },
      { desktop: { y: 40, x: -20, rotation: 3 }, mobile: { y: -40, x: 20, rotation: -3, scale: 0.92 } },
      { desktop: { scale: 0.85, rotation: -3 }, mobile: { scale: 1.15, rotation: 3, x: 20 } },
      { desktop: { y: -40, x: 20, rotation: -3 }, mobile: { y: 40, x: -20, rotation: 3, scale: 0.9 } },
    ];

    const pattern = animationPatterns[nextIndex % animationPatterns.length];
    const isNext = direction === 'next';

    tl.to(desktopMockup, {
      opacity: 0,
      x: isNext ? (pattern.desktop.x || 0) * -1 : (pattern.desktop.x || 0),
      y: isNext ? (pattern.desktop.y || 0) * -1 : (pattern.desktop.y || 0),
      rotation: (pattern.desktop.rotation || 0) * -1,
      scale: pattern.desktop.scale || 0.95,
      duration: 0.3,
      ease: "power2.in",
    }, 0);

    if (mobileMockup) {
      tl.to(mobileMockup, {
        opacity: 0,
        x: isNext ? (pattern.mobile.x || 0) * -1 : (pattern.mobile.x || 0),
        y: isNext ? (pattern.mobile.y || 0) * -1 : (pattern.mobile.y || 0),
        rotation: (pattern.mobile.rotation || 0) * -1,
        scale: pattern.mobile.scale || 0.9,
        duration: 0.3,
        ease: "power2.in",
      }, 0.05);
    }

    tl.fromTo(
      desktopMockup,
      {
        opacity: 0,
        x: isNext ? (pattern.desktop.x || 0) : (pattern.desktop.x || 0) * -1,
        y: isNext ? (pattern.desktop.y || 0) : (pattern.desktop.y || 0) * -1,
        rotation: (pattern.desktop.rotation || 0),
        scale: pattern.desktop.scale || 0.95,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      },
      0.3
    );

    if (mobileMockup) {
      tl.fromTo(
        mobileMockup,
        {
          opacity: 0,
          x: isNext ? (pattern.mobile.x || 0) : (pattern.mobile.x || 0) * -1,
          y: isNext ? (pattern.mobile.y || 0) : (pattern.mobile.y || 0) * -1,
          rotation: (pattern.mobile.rotation || 0),
          scale: pattern.mobile.scale || 0.9,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.45,
          ease: "back.out(1.2)",
        },
        0.35
      );
    }
  };

  const desktopSkins = selectedProject?.media?.desktopSkins || [];
  const mobileSkins = selectedProject?.media?.mobileSkins || [];
  const totalImages = Math.max(desktopSkins.length, mobileSkins.length);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[999998]"
        style={{
          background: "rgba(0, 0, 0, 0.95)",
          backdropFilter: "blur(20px)",
          opacity: 0,
          pointerEvents: 'none'
        }}
        onClick={closeModal}
      />

      {/* Morphing Container */}
      <div
        ref={containerRef}
        className="fixed z-[999999] cursor-pointer"
        style={{
          opacity: 0,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          width: 140,
          height: 140,
          overflow: 'visible'
        }}
      >
        {/* Gradient glow - stays behind */}
        <div
          ref={glowRef}
          className="absolute -inset-1 blur-[2px] -z-10"
          style={{
            background: 'linear-gradient(135deg, #02bccc, #ccff02, #02bccc)',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            animation: 'blobMorph 6s ease-in-out infinite'
          }}
        />

        {/* Main background - always visible */}
        <div
          ref={bgRef}
          className="absolute inset-0 bg-bg backdrop-blur-xl z-0 overflow-hidden"
          style={{
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            animation: 'blobMorph 6s ease-in-out infinite'
          }}
        />

        {/* Blob content layer - only in blob mode */}
        <div
          ref={blobBgRef}
          className="absolute inset-0 z-[1]"
          style={{
            pointerEvents: 'none'
          }}
        />

        {/* Blob Content (View Details) */}
        <div
          ref={blobContentRef}
          className="absolute z-[2] flex flex-col items-center justify-center gap-1 pointer-events-none"
          style={{
            width: 140,
            height: 140,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <span className="font-mono text-[12px] font-bold uppercase tracking-wider bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
            {t("portfolio.common.ui.view_details")}
          </span>
          <svg
            className="w-[18px] h-[18px] stroke-primary"
            style={{
              animation: 'arrowBounce 1.5s ease-in-out infinite',
              filter: 'drop-shadow(0 0 4px rgba(2, 188, 204, 0.5))'
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>

        {/* Modal Content */}
        <div
          ref={modalContentRef}
          className="absolute inset-0 flex flex-col overflow-hidden z-20"
          style={{
            opacity: 0,
            pointerEvents: 'none'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {selectedProject && (
            <>
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-xl bg-bg/80 backdrop-blur-sm hover:bg-primary/20 transition-all duration-300 group cursor-pointer border border-border/30"
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

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="mx-auto px-8 lg:px-16 py-12 lg:py-16">
              {/* Header */}
              <div className="mb-12">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="tag">{selectedProject.client}</span>
                  <span className="text-text/40">•</span>
                  <span className="text-label">{selectedProject.year}</span>
                  <span className="text-text/40">•</span>
                  <span className="text-label">{t(selectedProject.category)}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <h2 className="title-section gradient-text">
                    {t(selectedProject.title)}
                  </h2>

                  {selectedProject.media?.link && (
                    <a
                      href={selectedProject.media.link}
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

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                {/* LEFT: Mockups */}
                <div className="lg:col-span-6 space-y-6">
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
                          {currentImageIndex + 1} / {totalImages}
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

                  <div className="relative mx-auto">
                    {desktopSkins[currentImageIndex] && (
                      <div className="w-full" data-mockup="desktop">
                        <Mockup
                          key={`desktop-${currentImageIndex}`}
                          variant="laptop"
                          src={desktopSkins[currentImageIndex]}
                          alt={`${t(selectedProject.title)} - Desktop ${currentImageIndex + 1}`}
                        />
                      </div>
                    )}

                    {mobileSkins[currentImageIndex] && (
                      <div className="absolute -bottom-4 -right-4 w-20 sm:w-24 md:w-36 md:-bottom-6 md:-right-6 lg:-bottom-8 lg:-right-8 lg:w-40 drop-shadow-2xl" data-mockup="mobile">
                        <Mockup
                          key={`mobile-${currentImageIndex}`}
                          variant="mobile"
                          src={mobileSkins[currentImageIndex]}
                          alt={`${t(selectedProject.title)} - Mobile ${currentImageIndex + 1}`}
                        />
                      </div>
                    )}
                  </div>

                  {totalImages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                      {Array.from({ length: totalImages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentImageIndex
                              ? "w-8 bg-primary"
                              : "w-1.5 bg-text/20 hover:bg-text/40"
                          }`}
                          aria-label={`Image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT: Content */}
                <div className="lg:col-span-6 space-y-10">
                  {selectedProject.technologies && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech, index) => (
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

                  {selectedProject.details?.challenge && (
                    <div className="space-y-4">
                      <h3 className="title-item">
                        {t("portfolio.modal.challenge")}
                      </h3>
                      <p className="text-body">
                        {t(selectedProject.details.challenge)}
                      </p>
                    </div>
                  )}

                  {selectedProject.details?.solution && (
                    <div className="space-y-4">
                      <h3 className="title-item">
                        {t("portfolio.modal.solution")}
                      </h3>
                      <p className="text-body">{t(selectedProject.details.solution)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
