import { gsap } from "@/lib/animations";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initTechConstellation() {
  const section = document.querySelector("[data-tech-section]");
  const viewport = document.querySelector("[data-tech-viewport]");
  const space = document.querySelector("[data-tech-space]");
  const scrollHint = document.querySelector("[data-scroll-hint]");

  if (!section || !viewport || !space) return;

  const layers = gsap.utils.toArray("[data-tech-layer]") as HTMLElement[];
  const particles = gsap.utils.toArray("[data-particle]") as HTMLElement[];
  const allLogos = gsap.utils.toArray("[data-tech-logo]") as HTMLElement[];

  // Floating particles
  particles.forEach((particle) => {
    gsap.to(particle, {
      y: -20 + Math.random() * 40,
      x: -15 + Math.random() * 30,
      duration: 2 + Math.random() * 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  // Floating logos
  allLogos.forEach((logo) => {
    gsap.to(logo, {
      y: "+=10",
      duration: 2 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random(),
    });
  });

  // Main timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      pin: viewport,
    },
  });

  // Fade scroll hint
  tl.to(scrollHint, { opacity: 0, duration: 0.05 }, 0);

  // Fly through space - move forward to pass through all categories
  // Categories are at z: 0, -1000, -2000 so we need to travel ~3000px
  tl.to(space, {
    z: 3000,
    duration: 1,
    ease: "none",
  }, 0);

  // Set initial states for all logos - scaled down
  allLogos.forEach((logo) => {
    gsap.set(logo, { opacity: 1, scale: 0 });
  });

  // Animate each layer - title first, then logos with random pop-in
  layers.forEach((layer, i) => {
    const label = layer.querySelector(`[data-category-label="${i}"]`);
    const logos = gsap.utils.toArray(layer.querySelectorAll(`[data-tech-logo^="${i}-"]`)) as HTMLElement[];

    const start = i / layers.length;
    const dur = 1 / layers.length;

    // Initially hide label and logos
    gsap.set(label, { opacity: 0, scale: 0.8 });

    // Fade in - label first
    const fadeInStart = start + dur * 0.05;
    const labelDur = dur * 0.15;
    const logosDur = dur * 0.08;

    if (label) {
      tl.to(label,
        { opacity: 1, scale: 1, duration: labelDur, ease: "power2.out" },
        fadeInStart
      );
    }

    // Logos scale in with random delays, slightly after label
    if (logos.length) {
      logos.forEach((logo) => {
        const randomDelay = Math.random() * dur * 0.15;
        tl.to(logo, {
          scale: 1,
          duration: dur * 0.12,
          ease: "back.out(1.7)",
        }, fadeInStart + labelDur * 0.2 + randomDelay);
      });
    }

    // Fade out - both together
    const fadeOutStart = start + dur * 0.8;
    const fadeOutDur = dur * 0.15;

    if (label) {
      tl.to(label,
        { opacity: 0, scale: 0.8, duration: fadeOutDur, ease: "power2.in" },
        fadeOutStart
      );
    }

    if (logos.length) {
      tl.to(logos, {
        opacity: 0,
        scale: 0.5,
        duration: fadeOutDur,
        stagger: 0.003,
        ease: "power2.in",
      }, fadeOutStart);
    }
  });

  return () => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
    gsap.killTweensOf([particles, allLogos]);
  };
}
