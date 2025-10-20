import { gsap, ScrollTrigger } from "@/lib/animations";
import { perfMonitor } from "../performance-monitor";

let ctaScrollTriggers: ScrollTrigger[] = [];

export function initCTAScrollAnimation() {
  const measure = perfMonitor.startMeasure("cta-scroll-init");
   
  ctaScrollTriggers.forEach(trigger => trigger.kill());
  ctaScrollTriggers = [];

  const ctaSection = document.querySelector("[data-cta-section]");
  if (!ctaSection) {
    measure();
    return { kill: () => {} };
  }

  const header = ctaSection.querySelector("[data-cta-header]");
  const cards = ctaSection.querySelectorAll("[data-cta-card]");

  gsap.set(header, { opacity: 0, y: 30 });
  gsap.set(cards, { opacity: 0, y: 40, scale: 0.95 });

  const headerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: header,
      start: "top 80%",
      end: "top 40%",
      scrub: 0.5,
      id: "cta-header",
    },
  });

  headerTimeline.to(header, {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: "power2.out",
  });

  const cardsTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: cards[0],
      start: "top 70%",
      end: "top 30%",
      scrub: 2,
      id: "cta-cards",
    },
  });

  cards.forEach((card, index) => {
    const startOffset = index * 0.4;
    const glow = card.querySelector("[data-card-glow]");
    
    cardsTimeline
      .to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      }, startOffset)
      .to(glow, {
        opacity: 0.6,
        duration: 0.25,
        ease: "power2.out",
      }, startOffset + 0.25)
      .to(glow, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      }, startOffset + 0.6);
  });

  const ctaScene = (window as any).__ctaScene;
  if (ctaScene) {
    const { hexFloor, camera } = ctaScene;

    const sceneTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ctaSection,
        start: "top 80%",
        end: "top 30%",
        scrub: 1.5,
        id: "cta-scene",
      },
    });

    const startRotX = hexFloor.rotation.x;
    const startRotY = hexFloor.rotation.y;
    const startRotZ = hexFloor.rotation.z;
    const startPosY = hexFloor.position.y;
    const startPosZ = hexFloor.position.z;
    const startPosX = hexFloor.position.x;
    const startCamY = camera.position.y;
    const startCamZ = camera.position.z;

    sceneTimeline
      .fromTo(hexFloor.rotation,
        {
          x: startRotX + Math.PI * 0.08,
          y: startRotY + Math.PI * 0.12,
          z: startRotZ + Math.PI * 0.03
        },
        {
          x: startRotX,
          y: startRotY,
          z: startRotZ,
          duration: 1,
          ease: "power2.out"
        },
        0
      )
      .fromTo(hexFloor.position,
        {
          y: startPosY - 120,
          z: startPosZ - 250,
          x: startPosX - 80
        },
        {
          y: startPosY,
          z: startPosZ,
          x: startPosX,
          duration: 1,
          ease: "power2.out"
        },
        0
      )
      .fromTo(camera.position,
        {
          y: startCamY + 60,
          z: startCamZ + 120
        },
        {
          y: startCamY,
          z: startCamZ,
          duration: 1,
          ease: "power2.out"
        },
        0
      );
  }

  if (headerTimeline.scrollTrigger) ctaScrollTriggers.push(headerTimeline.scrollTrigger);
  if (cardsTimeline.scrollTrigger) ctaScrollTriggers.push(cardsTimeline.scrollTrigger);

  measure();

  return {
    kill: () => {
      const killMeasure = perfMonitor.startMeasure("cta-scroll-kill");
      ctaScrollTriggers.forEach(trigger => trigger.kill());
      ctaScrollTriggers = [];
      killMeasure();
    },
  };
}