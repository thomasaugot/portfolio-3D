// ProjectModal.tsx - BLOB MORPH ANIMATION
"use client";
import { useEffect, useRef } from "react";
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

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Get blob cursor and position
    const blobCursor = document.querySelector('[data-blob-cursor]') as HTMLElement;
    const portfolioScene = (window as any).__portfolioScene;

    if (portfolioScene) {
      portfolioScene.modalOpen = true;
    }

    // Store blob position for close animation
    const blobRect = blobCursor?.getBoundingClientRect();
    const startX = blobRect ? blobRect.left + blobRect.width / 2 : window.innerWidth / 2;
    const startY = blobRect ? blobRect.top + blobRect.height / 2 : window.innerHeight / 2;
    blobPositionRef.current = { x: startX, y: startY };

    const tl = gsap.timeline();

    // 1. Set morph element to exact blob position and appearance
    if (morphRef.current && overlayRef.current) {
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

      // 2. Hide blob and show morph at the exact same instant (no gap)
      if (blobCursor) {
        tl.add(() => {
          blobCursor.style.opacity = '0';
          blobCursor.style.pointerEvents = 'none';
          blobCursor.style.display = 'none';
        }, 0);
      }

      // 3. Start expanding the morph immediately
      tl.to(morphRef.current, {
        scale: 1.2,
        duration: 0.2,
        ease: "power2.out"
      }, 0);

      // 4. Fade in overlay
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      }, 0.1);

      // 5. Expand and morph into full modal
      tl.to(morphRef.current, {
        left: '50%',
        top: '50%',
        width: '85vw',
        height: '80vh',
        maxWidth: 800,
        maxHeight: '80vh',
        scale: 1,
        borderRadius: '24px',
        duration: 0.7,
        ease: "expo.out"
      }, 0.2);

      // 6. Fade in content
      if (contentRef.current) {
        tl.fromTo(contentRef.current,
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

    // 1. Fade out content
    if (contentRef.current) {
      tl.to(contentRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in"
      }, 0);
    }

    // 2. Morph back to blob shape at stored position
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

      // 3. Fade out morph and overlay together
      tl.to(morphRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in"
      }, 0.7);
    }

    // 4. Fade out overlay
    if (overlayRef.current) {
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      }, 0.6);
    }
  };

  const gallery = project.media?.gallery || [];

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[9999]" style={{ background: "rgba(0, 0, 0, 0.9)", backdropFilter: "blur(20px)" }} onClick={handleClose}>
      <div
        ref={morphRef}
        className="fixed bg-bg/95 backdrop-blur-2xl border border-primary/20 overflow-y-auto overflow-x-hidden"
        style={{
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          boxShadow: "0 0 60px rgba(2,188,204,0.4), 0 0 100px rgba(204,255,2,0.2)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={contentRef} className="relative w-full min-h-full">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-primary/20 backdrop-blur-sm border-2 border-primary hover:border-secondary hover:bg-primary/30 hover:scale-110 transition-all duration-300 group shadow-lg"
          >
            <svg className="w-7 h-7 text-primary group-hover:text-secondary transition-all group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="overflow-y-auto h-full p-8">
            <div className="max-w-4xl mx-auto space-y-8">

              {/* Header */}
              <div className="space-y-3">
                <div className="text-xs text-text/40 font-mono">
                  {project.client} • {project.year}
                </div>
                <h2 className="text-4xl md:text-5xl font-black gradient-primary bg-clip-text text-transparent">
                  {t(project.title)}
                </h2>
              </div>

              {/* Tech stack */}
              {project.technologies && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 8).map((tech, index) => (
                    <span key={index} className="px-3 py-1.5 text-xs font-mono bg-primary/10 text-primary/90 border border-primary/20 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Challenge */}
              {project.details?.challenge && (
                <div className="space-y-3">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-primary">Challenge</h3>
                  <p className="text-base text-text/80 leading-relaxed">
                    {t(project.details.challenge)}
                  </p>
                </div>
              )}

              {/* Solution */}
              {project.details?.solution && (
                <div className="space-y-3">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-secondary">Solution</h3>
                  <p className="text-base text-text/80 leading-relaxed">
                    {t(project.details.solution)}
                  </p>
                </div>
              )}

              {/* Gallery Grid */}
              {gallery.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {gallery.map((img, idx) => (
                    <div key={idx} className="relative group">
                      {img.includes("laptop") || img.includes("desktop") ? (
                        <Mockup variant="laptop" src={img} alt={`${t(project.title)} - ${idx + 1}`} />
                      ) : img.includes("mobile") || img.includes("phone") ? (
                        <div className="mx-auto max-w-[280px]"><Mockup variant="mobile" src={img} alt={`${t(project.title)} - ${idx + 1}`} /></div>
                      ) : (
                        <Mockup variant="browser" src={img} alt={`${t(project.title)} - ${idx + 1}`} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              {project.media?.link && (
                <div className="pt-4">
                  <a
                    href={project.media.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-bg font-mono text-sm rounded-lg hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105"
                  >
                    <span>View Live Project</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
}