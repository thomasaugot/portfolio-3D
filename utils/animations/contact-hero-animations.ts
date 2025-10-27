import { perfMonitor } from "../performance-monitor";
import { initContactHeroTitleAnimation } from "./contact-hero-title-animation";

let heroTitleTimeline: gsap.core.Timeline | null = null;

export function initContactHeroAnimation() {
  const waitForScene = () => {
    const heroScene = (window as any).__contactHeroScene;
    if (!heroScene) {
      requestAnimationFrame(waitForScene);
      return;
    }

    const measure = perfMonitor.startMeasure("contact-hero-animation-init");

    const titleAnimation = initContactHeroTitleAnimation();
    if (titleAnimation) {
      heroTitleTimeline = titleAnimation;
    }

    measure();
  };

  waitForScene();

  return () => {
    if (heroTitleTimeline) heroTitleTimeline.kill();
    heroTitleTimeline = null;
  };
}