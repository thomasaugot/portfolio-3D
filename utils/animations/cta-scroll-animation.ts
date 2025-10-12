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

    gsap.set(header, { opacity: 0, y: 30, scale: 0.95 });
    cards.forEach((card) => {
      gsap.set(card, {
        opacity: 0,
        y: 40,
        scale: 0.92,
        rotationX: -8,
        transformPerspective: 1000
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ctaSection,
        start: "top 75%",
        end: "top 30%",
        scrub: false,
        toggleActions: "play none none reverse",
      },
    });

    tl.to(header, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
    });

    cards.forEach((card, index) => {
      tl.to(
        card,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.9,
          ease: "back.out(1.2)",
        },
        `-=${0.75 - index * 0.1}`
      );
    });

    const ctaScene = (window as any).__ctaScene;
    if (ctaScene) {
      const { hexFloor, camera } = ctaScene;

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