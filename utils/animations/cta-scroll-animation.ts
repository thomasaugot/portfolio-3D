import { gsap, ScrollTrigger } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

let ctaScrollTrigger: ScrollTrigger | null = null;

export function initCTAScrollAnimation() {
  if (ctaScrollTrigger) {
    ctaScrollTrigger.kill();
    ctaScrollTrigger = null;
  }

  setTimeout(() => {
    const ctaSection = document.querySelector("[data-cta-section]");
    if (!ctaSection) return;

    const header = ctaSection.querySelector("[data-cta-header]");
    const cards = ctaSection.querySelectorAll("[data-cta-card]");

    // Initial states - lighter transforms for smoother feel
    gsap.set(header, { opacity: 0, y: 30, scale: 0.95 });
    cards.forEach((card) => {
      gsap.set(card, { 
        opacity: 0, 
        y: 40, 
        scale: 0.92,
        rotationX: -8,
        transformPerspective: 1000
      });
      const glow = card.querySelector("[data-card-glow]");
      if (glow) gsap.set(glow, { opacity: 0, scale: 0.8 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ctaSection,
        start: "top 75%",
        end: "top 30%",
        scrub: false, // Remove scrub for snappier feel
        toggleActions: "play none none reverse",
      },
    });

    // Header animation - faster and bouncier
    tl.to(header, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
    });

    // Cards with tighter stagger and better easing
    cards.forEach((card, index) => {
      const glow = card.querySelector("[data-card-glow]");

      // Card entrance - much smoother timing
      tl.to(
        card,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.9,
          ease: "back.out(1.2)", // Bouncy exit makes it feel lively
        },
        `-=${0.75 - index * 0.1}` // Tighter stagger (was 0.15, now 0.1)
      );

      // Glow appears faster with the card
      if (glow) {
        tl.to(
          glow,
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          `<+0.1` // Starts 0.1s after card animation begins
        );
      }
    });

    // 3D scene animation - smoother and faster
    const ctaScene = (window as any).__ctaScene;
    if (ctaScene) {
      const { hexFloor, camera } = ctaScene;

      // Hex floor entrance - less dramatic, more elegant
      tl.from(
        hexFloor.rotation,
        {
          x: Math.PI * 0.08,
          y: Math.PI * 0.12,
          z: Math.PI * 0.03,
          duration: 1.8,
          ease: "power3.out",
        },
        0
      );

      tl.from(
        hexFloor.position,
        {
          y: hexFloor.position.y - 120,
          z: hexFloor.position.z - 250,
          x: -80,
          duration: 1.8,
          ease: "power3.out",
        },
        0
      );

      // Camera movement - gentler
      tl.from(
        camera.position,
        {
          y: camera.position.y + 60,
          z: camera.position.z + 120,
          duration: 1.8,
          ease: "power3.out",
        },
        0
      );

      // Hex floor fade in - quicker
      tl.from(
        hexFloor,
        {
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        0.2
      );
    }

    if (tl.scrollTrigger) {
      ctaScrollTrigger = tl.scrollTrigger as ScrollTrigger;
    }
  }, 500);

  return () => {
    if (ctaScrollTrigger) {
      ctaScrollTrigger.kill();
      ctaScrollTrigger = null;
    }
  };
}