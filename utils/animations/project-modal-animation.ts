// utils/animations/project-modal-animation.ts
import { gsap } from "@/lib/animations";

export function openProjectModal(onComplete?: () => void) {
  const overlayRef = document.querySelector('[data-modal-overlay]') as HTMLElement;
  const morphRef = document.querySelector('[data-modal-morph]') as HTMLElement;
  const contentRef = document.querySelector('[data-modal-content]') as HTMLElement;
  const portfolioScene = (window as any).__portfolioScene;

  if (!morphRef || !overlayRef || !contentRef) return;

  if (portfolioScene) {
    portfolioScene.modalOpen = true;
  }

  // Get click position from global variable (set by blob or button click)
  const clickPos = (window as any).__modalClickPosition;
  const startX = clickPos?.x ?? window.innerWidth / 2;
  const startY = clickPos?.y ?? window.innerHeight / 2;

  // Clear the global position after using it
  delete (window as any).__modalClickPosition;

  const isMobile = window.innerWidth < 640;

  const tl = gsap.timeline({ onComplete });

  gsap.set(morphRef, {
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

  gsap.set(overlayRef, { opacity: 0 });

  tl.to(morphRef, { scale: 1.2, duration: 0.2, ease: "power2.out" }, 0);
  tl.to(overlayRef, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0.1);
  tl.to(
    morphRef,
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
  tl.fromTo(
    contentRef,
    { opacity: 0 },
    { opacity: 1, duration: 0.4, ease: "power2.out" },
    0.6
  );
}

export function closeProjectModal(centerX: number, centerY: number, onComplete?: () => void) {
  const overlayRef = document.querySelector('[data-modal-overlay]') as HTMLElement;
  const morphRef = document.querySelector('[data-modal-morph]') as HTMLElement;
  const contentRef = document.querySelector('[data-modal-content]') as HTMLElement;
  const portfolioScene = (window as any).__portfolioScene;

  if (!morphRef || !overlayRef || !contentRef) return;

  const tl = gsap.timeline({
    onComplete: () => {
      if (portfolioScene) {
        portfolioScene.modalOpen = false;
      }
      if (onComplete) onComplete();
    },
  });

  tl.to(contentRef, { opacity: 0, duration: 0.25, ease: "power2.in" }, 0);
  tl.to(
    morphRef,
    {
      left: centerX,
      top: centerY,
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
  tl.to(morphRef, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0.7);
  tl.to(overlayRef, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0.6);
}

export function animateMockupChange(direction: 'next' | 'prev', currentIndex: number) {
  const desktopMockup = document.querySelector('[data-mockup="desktop"]') as HTMLElement;
  const mobileMockup = document.querySelector('[data-mockup="mobile"]') as HTMLElement;

  if (!desktopMockup) return;

  const tl = gsap.timeline();

  // Define different animation patterns based on index
  const animationPatterns = [
    // Pattern 0: Desktop from left, mobile from right
    { desktop: { x: -60, rotation: -5 }, mobile: { x: 60, rotation: 5, scale: 0.9 } },
    // Pattern 1: Desktop from right, mobile from left
    { desktop: { x: 60, rotation: 5 }, mobile: { x: -60, rotation: -5, scale: 0.9 } },
    // Pattern 2: Desktop from bottom, mobile from top
    { desktop: { y: 40, x: -20, rotation: 3 }, mobile: { y: -40, x: 20, rotation: -3, scale: 0.92 } },
    // Pattern 3: Desktop scale up, mobile scale down
    { desktop: { scale: 0.85, rotation: -3 }, mobile: { scale: 1.15, rotation: 3, x: 20 } },
    // Pattern 4: Desktop from top, mobile from bottom
    { desktop: { y: -40, x: 20, rotation: -3 }, mobile: { y: 40, x: -20, rotation: 3, scale: 0.9 } },
  ];

  const pattern = animationPatterns[currentIndex % animationPatterns.length];
  const isNext = direction === 'next';

  // Animate OUT - Different animations for desktop and mobile
  tl.to(desktopMockup, {
    opacity: 0,
    x: isNext ? (pattern.desktop.x || 0) * -1 : (pattern.desktop.x || 0),
    y: isNext ? (pattern.desktop.y || 0) * -1 : (pattern.desktop.y || 0),
    rotation: (pattern.desktop.rotation || 0) * -1,
    scale: pattern.desktop.scale || 0.95,
    duration: 0.3,
    ease: "power2.in",
  }, 0);

  tl.to(mobileMockup, {
    opacity: 0,
    x: isNext ? (pattern.mobile.x || 0) * -1 : (pattern.mobile.x || 0),
    y: isNext ? (pattern.mobile.y || 0) * -1 : (pattern.mobile.y || 0),
    rotation: (pattern.mobile.rotation || 0) * -1,
    scale: pattern.mobile.scale || 0.9,
    duration: 0.3,
    ease: "power2.in",
  }, 0.05); // Slight delay for mobile

  // Animate IN - From opposite directions with different timings
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
    0.35 // Mobile enters slightly after desktop
  );
}
