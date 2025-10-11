import { gsap, ScrollTrigger } from "@/lib/animations";

let ctaScrollTrigger: ScrollTrigger | null = null;

export function initCTAScrollAnimation() {
  setTimeout(() => {
    const ctaSection = document.querySelector("[data-cta-section]");
    if (!ctaSection) return;

    const header = ctaSection.querySelector("[data-cta-header]");
    const cards = ctaSection.querySelectorAll("[data-cta-card]");

    gsap.set(header, { opacity: 0, y: 50 });
    cards.forEach((card) => {
      gsap.set(card, { opacity: 0, y: 80, rotationX: -15 });
      const glow = card.querySelector("[data-card-glow]");
      if (glow) gsap.set(glow, { opacity: 0 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ctaSection,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(header, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
    });

    cards.forEach((card, index) => {
      const glow = card.querySelector("[data-card-glow]");

      tl.to(
        card,
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        `-=${0.8 - index * 0.15}`
      );

      if (glow) {
        tl.to(
          glow,
          {
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
          },
          `-=${1.0 - index * 0.15}`
        );
      }
    });

    const ctaScene = (window as any).__ctaScene;
    if (ctaScene) {
      const { hexFloor, camera } = ctaScene;

      tl.from(
        hexFloor.rotation,
        {
          x: Math.PI * 0.15,
          y: Math.PI * 0.2,
          z: Math.PI * 0.05,
          duration: 2.5,
          ease: "power4.out",
        },
        0
      );

      tl.from(
        hexFloor.position,
        {
          y: hexFloor.position.y - 200,
          z: hexFloor.position.z - 400,
          x: -150,
          duration: 2.5,
          ease: "power4.out",
        },
        0
      );

      tl.from(
        camera.position,
        {
          y: camera.position.y + 100,
          z: camera.position.z + 200,
          duration: 2.5,
          ease: "power4.out",
        },
        0
      );

      tl.from(
        hexFloor,
        {
          opacity: 0,
          duration: 1.5,
          ease: "power2.out",
        },
        0.3
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