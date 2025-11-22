import { gsap } from "@/lib/animations";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initTimelineAnimation() {
  const section = document.querySelector("[data-timeline-section]");
  const track = document.querySelector("[data-timeline-track]");
  const svg = document.querySelector("[data-timeline-svg]") as SVGSVGElement;
  const path = svg?.querySelector("path") as SVGPathElement;
  const dots = gsap.utils.toArray("[data-timeline-dot]") as HTMLElement[];

  if (!section || !track || !svg || !path || !dots.length) return;

  const trackWidth = track.scrollWidth;
  const scrollDistance = trackWidth - window.innerWidth;

  // Get path length for drawing animation
  const pathLength = path.getTotalLength();

  gsap.set(path, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength,
  });

  // Animate BOTH track AND svg together
  gsap.to([track, svg], {
    x: -scrollDistance,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${scrollDistance}`,
      scrub: 1,
      pin: true,
    },
  });

  // Draw the path as we scroll
  gsap.to(path, {
    strokeDashoffset: 0,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${scrollDistance}`,
      scrub: 1,
    },
  });

  // Card scale
  dots.forEach((dot, i) => {
    const card = dot.closest("[data-timeline-card]") as HTMLElement;
    if (!card) return;

    gsap.to(card, {
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        scrub: 1,
        onUpdate: (self) => {
          const cardCenter = i / (dots.length - 1);
          const distance = Math.abs(self.progress - cardCenter);
          const scale = 1 - distance * 0.3;
          gsap.set(card, { scale: Math.max(scale, 0.85) });
        },
      },
    });
  });

  return () => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };
}
