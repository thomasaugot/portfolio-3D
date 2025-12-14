"use client";

import { useEffect, useRef } from "react";
import { Briefcase, GraduationCap, MapPin, X } from "lucide-react";
import { gsap } from "@/lib/animations";
import { useTranslation } from "@/lib/providers/TranslationProvider";

interface ExperienceModalProps {
  index: number;
  type: string;
  period: string;
  title: string;
  organization: string;
  location: string;
  description: string;
  tech: string;
  onClose: () => void;
}

export default function ExperienceModal({
  index,
  type,
  period,
  title,
  organization,
  location,
  description,
  tech,
  onClose,
}: ExperienceModalProps) {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isWork = type === "work";

  useEffect(() => {
    // Get click position from the card
    const clickPosition = (window as any).__experienceClickPosition || {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    if (!modalRef.current || !overlayRef.current || !contentRef.current) return;

    // Set initial state
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(contentRef.current, {
      scale: 0,
      opacity: 0,
      x: clickPosition.x - window.innerWidth / 2,
      y: clickPosition.y - window.innerHeight / 2,
    });

    // Animate in
    const tl = gsap.timeline();

    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    }).to(
      contentRef.current,
      {
        scale: 1,
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
      },
      "-=0.1"
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleClose = () => {
    if (!overlayRef.current || !contentRef.current) return;

    const tl = gsap.timeline({
      onComplete: onClose,
    });

    tl.to(contentRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    }).to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      },
      "-=0.1"
    );
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={handleClose}
      />

      <div
        ref={contentRef}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient glow effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-br from-primary via-secondary to-primary opacity-50 rounded-3xl -z-10" />

        {/* Main background */}
        <div className="absolute inset-0 bg-bg backdrop-blur-xl rounded-3xl -z-5" />

        {/* Content */}
        <div className="relative rounded-3xl p-6 sm:p-8 md:p-12">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl transition-all hover:bg-primary/20"
          >
            <X className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </button>

          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <span
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-mono flex items-center gap-2 ${
                  isWork ? "bg-primary/15 text-primary" : "bg-secondary/15 text-secondary"
                }`}
              >
                {isWork ? (
                  <>
                    <Briefcase className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{t("about.timeline.work")}</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{t("about.timeline.education")}</span>
                  </>
                )}
              </span>
              <span className="text-xs md:text-sm font-mono text-text/60">
                {period}
              </span>
            </div>

            <h2 className="title-item gradient-text">{title}</h2>

            <h3 className="text-lg md:text-xl text-text/80">{organization}</h3>

            <p className="text-sm md:text-base text-text/60 flex items-center gap-2">
              <MapPin className="w-3 h-3 md:w-4 md:h-4" />
              {location}
            </p>

            <div className="pt-3 md:pt-4 border-t border-border/30">
              <p className="text-body leading-relaxed">{description}</p>
            </div>

            {tech && (
              <div className="pt-3 md:pt-4">
                <div className="text-label mb-3">{t("about.timeline.technologies")}</div>
                <div className="flex flex-wrap gap-2">
                  {tech.split(", ").map((techItem) => (
                    <span key={techItem} className="tag">
                      {techItem}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
