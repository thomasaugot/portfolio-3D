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

  // Floating logos with depth-based parallax
  allLogos.forEach((logo) => {
    // Extract logo index from data attribute (format: "categoryIndex-logoIndex")
    const logoAttr = logo.getAttribute("data-tech-logo") || "0-0";
    const logoIndex = parseInt(logoAttr.split("-")[1]) || 0;

    // Calculate ring (8 items per ring) - higher ring = further from center
    const ring = Math.floor(logoIndex / 8);

    // Depth factor: closer logos (ring 0) move faster/more, distant ones slower/less
    // Ring 0: factor 1.0, Ring 1: 0.6, Ring 2: 0.4, etc.
    const depthFactor = 1 / (1 + ring * 0.7);

    // Vertical float - closer logos float more (8-15px), distant ones less (3-6px)
    const floatAmount = 5 + 10 * depthFactor;
    const floatDuration = 2.5 + (1 - depthFactor) * 3; // Slower for distant logos

    gsap.to(logo, {
      y: `+=${floatAmount}`,
      duration: floatDuration + Math.random() * 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random() * 0.5,
    });

    // Subtle horizontal drift only for inner rings (doesn't conflict with scroll)
    if (ring === 0) {
      gsap.to(logo, {
        x: `+=4`,
        duration: 5 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2,
      });
    }
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

  // Animate each layer - title first, then logos with random pop-in
  layers.forEach((layer, i) => {
    const label = layer.querySelector(`[data-category-label="${i}"]`);
    const logos = gsap.utils.toArray(layer.querySelectorAll(`[data-tech-logo^="${i}-"]`)) as HTMLElement[];

    const start = i / layers.length;
    const dur = 1 / layers.length;

    // All start hidden
    gsap.set(label, { opacity: 0, scale: 0.8 });
    logos.forEach((logo) => {
      gsap.set(logo, { opacity: 1, scale: 0 });
    });

    // First category animates on viewport enter
    if (i === 0) {
      const sortedLogos = logos.slice().sort((a, b) => {
        const aIndex = parseInt(a.getAttribute("data-tech-logo")?.split("-")[1] || "0");
        const bIndex = parseInt(b.getAttribute("data-tech-logo")?.split("-")[1] || "0");
        return aIndex - bIndex;
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        once: true,
        onEnter: () => {
          // Label first
          gsap.to(label, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "power2.out"
          });

          // Then logos with stagger
          sortedLogos.forEach((logo, logoIndex) => {
            gsap.to(logo, {
              scale: 1,
              duration: 0.4,
              delay: 0.2 + logoIndex * 0.02,
              ease: "back.out(1.7)",
            });
          });
        }
      });
    }

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

    // Logos scale in - first category already visible, others animate in spiral pattern
    if (logos.length && i > 0) {
      // Sort logos by their ring position for spiral effect
      const sortedLogos = logos.slice().sort((a, b) => {
        const aIndex = parseInt(a.getAttribute("data-tech-logo")?.split("-")[1] || "0");
        const bIndex = parseInt(b.getAttribute("data-tech-logo")?.split("-")[1] || "0");
        return aIndex - bIndex;
      });

      sortedLogos.forEach((logo, logoIndex) => {
        const delay = logoIndex * 0.008; // Fast sequential stagger
        tl.to(logo, {
          scale: 1,
          duration: dur * 0.1,
          ease: "back.out(1.7)",
        }, fadeInStart + labelDur * 0.2 + delay);
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
