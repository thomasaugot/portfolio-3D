// ProjectModal.tsx - FIXED VERSION
"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/animations";
import { Mockup } from "@/components/ui/Mockup";
import type { Project } from "@/types/project";
import { useTranslation } from "@/lib/providers/TranslationProvider";

interface ProjectModalProps { project: Project; onClose: () => void; }

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (modalRef.current && contentRef.current) {
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(contentRef.current, { scale: 0.8, opacity: 0, rotateX: 20 }, { scale: 1, opacity: 1, rotateX: 0, duration: 0.6, ease: "back.out(1.5)" });
    }
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    if (modalRef.current && contentRef.current) {
      gsap.to(contentRef.current, { scale: 0.8, opacity: 0, rotateX: -20, duration: 0.4, ease: "back.in(1.5)" });
      gsap.to(modalRef.current, { opacity: 0, duration: 0.3, ease: "power2.in", delay: 0.1, onComplete: onClose });
    }
  };

  const gallery = project.media?.gallery || [];
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);

  return (
    <div ref={modalRef} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8" style={{ background: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(20px)" }} onClick={handleClose}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ background: "radial-gradient(circle, rgba(2,188,204,0.3), transparent 70%)", top: "10%", left: "15%", animation: "float 8s ease-in-out infinite" }} />
        <div className="absolute w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ background: "radial-gradient(circle, rgba(204,255,2,0.3), transparent 70%)", bottom: "10%", right: "15%", animation: "float 10s ease-in-out infinite reverse" }} />
      </div>

      <div ref={contentRef} className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-surface/95 backdrop-blur-2xl rounded-3xl border-2 border-primary/30 shadow-2xl" style={{ background: "linear-gradient(135deg, rgba(26,26,26,0.95), rgba(42,42,42,0.95))", boxShadow: "0 0 60px rgba(2,188,204,0.3), 0 0 120px rgba(204,255,2,0.2)" }} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-surface/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 group">
          <svg className="w-6 h-6 text-text/70 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-8 md:p-12 space-y-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/30">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-mono text-primary tracking-wide uppercase">{project.year} • {project.client}</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black gradient-primary bg-clip-text text-transparent leading-tight">{t(project.title)}</h2>
            <p className="text-xl text-text/80 leading-relaxed max-w-3xl">{t(project.preview.description)}</p>
          </div>

          {project.technologies && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-text">Technologies</h3>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="px-4 py-2 text-sm font-mono bg-primary/10 text-primary rounded-lg border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300">{tech}</span>
                ))}
              </div>
            </div>
          )}

          {gallery.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-text">Gallery</h3>
              <div className="relative">
                <div className="relative w-full">
                  {gallery[currentImageIndex]?.includes("laptop") || gallery[currentImageIndex]?.includes("desktop") ? (
                    <Mockup variant="laptop" src={gallery[currentImageIndex]} alt={`${t(project.title)} - Screenshot ${currentImageIndex + 1}`} />
                  ) : gallery[currentImageIndex]?.includes("mobile") || gallery[currentImageIndex]?.includes("phone") ? (
                    <div className="max-w-md mx-auto"><Mockup variant="mobile" src={gallery[currentImageIndex]} alt={`${t(project.title)} - Screenshot ${currentImageIndex + 1}`} /></div>
                  ) : (
                    <Mockup variant="browser" src={gallery[currentImageIndex]} alt={`${t(project.title)} - Screenshot ${currentImageIndex + 1}`} />
                  )}
                </div>

                {gallery.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-surface/90 backdrop-blur-sm border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-surface/90 backdrop-blur-sm border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-surface/90 backdrop-blur-sm rounded-full border border-primary/30">
                      <span className="text-sm font-mono text-primary">{currentImageIndex + 1} / {gallery.length}</span>
                    </div>
                  </>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {gallery.map((image, index) => (
                    <button key={index} onClick={() => setCurrentImageIndex(index)} className={`relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${index === currentImageIndex ? "border-primary shadow-lg shadow-primary/30 scale-105" : "border-border/30 hover:border-primary/50 opacity-60 hover:opacity-100"}`}>
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 p-6 bg-surface/30 rounded-2xl border border-border/30">
              <h3 className="text-2xl font-bold text-text">Challenge</h3>
              <p className="text-text/80 leading-relaxed">{t(project.details.challenge)}</p>
            </div>
            <div className="space-y-4 p-6 bg-surface/30 rounded-2xl border border-border/30">
              <h3 className="text-2xl font-bold text-text">Solution</h3>
              <p className="text-text/80 leading-relaxed">{t(project.details.solution)}</p>
            </div>
          </div>

          <div className="space-y-4 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/20">
            <h3 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">Technical Approach</h3>
            <p className="text-text/80 leading-relaxed">{t(project.details.technicalApproach)}</p>
          </div>

          {project.details?.impact && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-text">Impact</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {project.details.impact.map((impact, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-surface/30 rounded-xl border border-border/30 hover:border-primary/30 transition-all duration-300">
                    <div className="w-6 h-6 flex-shrink-0 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-text/80 leading-relaxed">{t(impact)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 p-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 rounded-2xl border-2 border-primary/30">
            <h3 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">Results</h3>
            <p className="text-xl text-text/90 leading-relaxed">{t(project.details.results)}</p>
          </div>
        </div>
      </div>

      <style jsx>{`@keyframes float { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-30px) translateX(20px); }}`}</style>
    </div>
  );
}