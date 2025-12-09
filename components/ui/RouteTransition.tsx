"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animations";
import Image from "next/image";

interface RouteTransitionProps {
  isActive: boolean;
  onNavigate?: () => void;
  onComplete?: () => void;
}

export default function RouteTransition({
  isActive,
  onNavigate,
  onComplete,
}: RouteTransitionProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const logoBgRef = useRef<HTMLDivElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<SVGRectElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const overlay = overlayRef.current;
    const logo = logoRef.current;
    const logoBg = logoBgRef.current;
    const lineLeft = lineLeftRef.current;
    const lineRight = lineRightRef.current;
    const square = squareRef.current;
    if (!overlay || !logo || !logoBg || !lineLeft || !lineRight || !square) return;

    if (tlRef.current) tlRef.current.kill();

    const squarePerimeter = 4 * 140; // 4 sides × 140px

    // Reset all elements immediately with no transition
    gsap.set(overlay, { opacity: 0, visibility: "visible" });
    gsap.set(logoBg, { opacity: 0 });
    gsap.set(logo, { opacity: 0, scale: 0.9 });
    gsap.set(lineLeft, { scaleX: 0, transformOrigin: "left center", opacity: 1 });
    gsap.set(lineRight, { scaleX: 0, transformOrigin: "left center", opacity: 1 });
    gsap.set(square, {
      strokeDasharray: squarePerimeter,
      strokeDashoffset: squarePerimeter,
      opacity: 1,
    });

    // Small delay to ensure all resets are applied before animation starts
    const tl = gsap.timeline({ onComplete: () => onComplete?.(), delay: 0.05 });
    tlRef.current = tl;

    // 1. Overlay fades in
    tl.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0);

    // 2. Logo background appears (to mask)
    tl.to(logoBg, { opacity: 1, duration: 0.2, ease: "power2.out" }, 0.2);

    // 3. Left line draws from left edge to center
    tl.to(lineLeft, { scaleX: 1, duration: 0.4, ease: "power2.out" }, 0.25);

    // 4. Square draws around the logo (smooth, all 4 sides)
    tl.to(square, {
      strokeDashoffset: 0,
      duration: 0.8,
      ease: "power2.inOut",
    }, 0.6);

    // 5. Logo fades in while square is drawing
    tl.to(logo, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "back.out(1.4)",
    }, 0.7);

    // 6. Right line draws from center to right edge
    tl.to(lineRight, { scaleX: 1, duration: 0.4, ease: "power2.out" }, 1.3);

    // NAVIGATE
    tl.call(() => onNavigate?.(), [], 1.6);

    // Hold
    tl.to({}, { duration: 0.3 });

    // 7. Logo fades out
    tl.to(logo, { opacity: 0, scale: 0.95, duration: 0.3, ease: "power2.in" }, 2.0);

    // 8. Square undraws
    tl.to(square, {
      strokeDashoffset: -squarePerimeter,
      duration: 0.6,
      ease: "power2.inOut",
    }, 2.1);

    // 9. Lines retract outward
    tl.to(lineLeft, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 0.4,
      ease: "power2.in",
    }, 2.4);

    tl.to(lineRight, {
      scaleX: 0,
      transformOrigin: "right center",
      duration: 0.4,
      ease: "power2.in",
    }, 2.4);

    // 10. Logo bg fades out
    tl.to(logoBg, { opacity: 0, duration: 0.2, ease: "power2.in" }, 2.7);

    // 11. Overlay fades out
    tl.to(overlay, { opacity: 0, duration: 0.3, ease: "power2.in" }, 2.8);

    return () => {
      tl.kill();
    };
  }, [isActive, onNavigate, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none">
      {/* Dark overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0"
        style={{ backgroundColor: "#212121", opacity: 0 }}
      />

      {/* Left line */}
      <div
        ref={lineLeftRef}
        style={{
          position: "fixed",
          top: "50%",
          left: 0,
          width: "calc(50% - 70px)",
          height: "3px",
          marginTop: "-1.5px",
          background: "linear-gradient(90deg, #02bccc 0%, #5de8c4 50%, #ccff02 100%)",
          boxShadow: "0 0 10px #02bccc, 0 0 20px #02bccc, 0 0 30px rgba(2, 188, 204, 0.5)",
          transform: "scaleX(0)",
          transformOrigin: "left center",
        }}
      />

      {/* Right line */}
      <div
        ref={lineRightRef}
        style={{
          position: "fixed",
          top: "50%",
          left: "calc(50% + 70px)",
          width: "calc(50% - 70px)",
          height: "3px",
          marginTop: "-1.5px",
          background: "linear-gradient(90deg, #ccff02 0%, #5de8c4 50%, #02bccc 100%)",
          boxShadow: "0 0 10px #02bccc, 0 0 20px #02bccc, 0 0 30px rgba(2, 188, 204, 0.5)",
          transform: "scaleX(0)",
          transformOrigin: "left center",
        }}
      />

      {/* Center container for logo and square */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }}
      >
        {/* Logo background mask */}
        <div
          ref={logoBgRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "130px",
            height: "130px",
            backgroundColor: "#212121",
            opacity: 0,
          }}
        />

        {/* SVG square */}
        <svg
          width="160"
          height="160"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <defs>
            <linearGradient id="squareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#02bccc" />
              <stop offset="50%" stopColor="#ccff02" />
              <stop offset="100%" stopColor="#02bccc" />
            </linearGradient>
            <filter id="squareGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect
            ref={squareRef}
            x="10"
            y="10"
            width="140"
            height="140"
            fill="none"
            stroke="url(#squareGradient)"
            strokeWidth="3"
            filter="url(#squareGlow)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="560"
            strokeDashoffset="560"
          />
        </svg>

        {/* Logo */}
        <div
          ref={logoRef}
          style={{ opacity: 0, position: "relative", zIndex: 1 }}
        >
          <Image
            src="/assets/images/logo/logo-mobile-gradient.png"
            alt="Logo"
            width={100}
            height={100}
            priority
          />
        </div>
      </div>
    </div>
  );
}
