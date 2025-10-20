import { gsap } from "@/lib/animations";
import { perfMonitor } from "../performance-monitor";

export function initContactHeroAnimation() {
  const waitForScene = () => {
    const heroScene = (window as any).__contactHeroScene;
    if (!heroScene) {
      requestAnimationFrame(waitForScene);
      return;
    }

    const measure = perfMonitor.startMeasure("contact-hero-animation-init");

    const heroContent = document.querySelector('[data-contact-hero-content]');
    if (!heroContent) {
      measure();
      return;
    }

    gsap.set(heroContent.children, { opacity: 0 });

    setTimeout(() => {
      gsap.to(heroContent.children, {
        opacity: 1,
        duration: 0.6,
        stagger: 0.3,
        ease: "none",
      });
    }, 800);

    measure();
  };

  waitForScene();

  return { kill: () => {} };
}