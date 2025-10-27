import { gsap, ScrollTrigger } from "@/lib/animations";
import { perfMonitor } from "../performance-monitor";

let contactFormScrollTrigger: ScrollTrigger | null = null;

export function initContactFormScrollAnimation() {
  const waitForScene = () => {
    const formScene = (window as any).__contactFormScene;
    if (!formScene) {
      requestAnimationFrame(waitForScene);
      return;
    }

    const measure = perfMonitor.startMeasure("contact-form-scroll-animation-init");

    const formSection = document.querySelector("[data-contact-form-section]");
    if (!formSection) {
      measure();
      return;
    }

    const { camera, particles } = formScene;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: formSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
        onRefresh: (self) => {
          contactFormScrollTrigger = self;
        },
      },
    });

    // Animate camera position as user scrolls
    tl.to(camera.position, {
      y: 180,
      z: 550,
      duration: 1,
      ease: "none",
    }, 0);

    // Rotate particles
    tl.to(particles.rotation, {
      y: Math.PI * 2,
      duration: 1,
      ease: "none",
    }, 0);

    measure();
  };

  waitForScene();

  return () => {
    if (contactFormScrollTrigger) {
      contactFormScrollTrigger.kill();
      contactFormScrollTrigger = null;
    }
  };
}
