import { gsap, ScrollTrigger } from "@/lib/animations";
import { perfMonitor } from "../performance-monitor";

let aboutScrollTriggers: ScrollTrigger[] = [];

const isLowPerformanceDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const connection = (navigator as any).connection;
  const memory = (performance as any).memory;

  return (
    (connection && connection.saveData) ||
    (memory && memory.jsHeapSizeLimit < 1073741824) ||
    navigator.hardwareConcurrency < 4
  );
};

export function initAboutScroll() {
  console.log("🚀 initAboutScroll called");
  const initMeasure = perfMonitor.startMeasure("about-scroll-init");

  // Kill existing triggers
  aboutScrollTriggers.forEach((st) => st.kill());
  aboutScrollTriggers = [];

  const lowPerf = isLowPerformanceDevice();

  // Hero section animations are now handled directly in the AboutHero component

  // ===== TECH STACK SECTION =====
  const techStackSection = document.querySelector('[data-tech-stack-3d]');
  if (techStackSection) {
    const sectionHeader = techStackSection.querySelector('[data-section-header]');
    if (sectionHeader) {
      gsap.set(sectionHeader, { opacity: 0, y: 40 });
      const st = gsap.to(sectionHeader, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: techStackSection,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });
      if (st.scrollTrigger) aboutScrollTriggers.push(st.scrollTrigger);
    }

    const techCards = techStackSection.querySelectorAll('[data-tech-card]');
    techCards.forEach((card, index) => {
      gsap.set(card, {
        opacity: 0,
        rotateY: -90,
        rotateX: 30,
        scale: 0.5,
      });

      const st = gsap.to(card, {
        opacity: 1,
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        duration: lowPerf ? 0.4 : 0.6,
        delay: lowPerf ? (index * 0.02) : (index * 0.03),
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: techStackSection,
          start: "top 60%",
          toggleActions: "play none none none",
        },
      });
      if (st.scrollTrigger) aboutScrollTriggers.push(st.scrollTrigger);
    });
  }

  // ===== SPECIALTIES SECTION =====
  const specialtiesSection = document.querySelector('[data-specialties]');
  if (specialtiesSection) {
    const sectionHeader = specialtiesSection.querySelector('[data-section-header]');
    if (sectionHeader) {
      gsap.set(sectionHeader, { opacity: 0, y: 40 });
      const st = gsap.to(sectionHeader, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: specialtiesSection,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });
      if (st.scrollTrigger) aboutScrollTriggers.push(st.scrollTrigger);
    }

    const specialtyCards = specialtiesSection.querySelectorAll('[data-specialty-card]');
    specialtyCards.forEach((card, index) => {
      gsap.set(card, { opacity: 0, y: 50, scale: 0.9 });

      const st = gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: index * 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: specialtiesSection,
          start: "top 60%",
          toggleActions: "play none none none",
        },
      });
      if (st.scrollTrigger) aboutScrollTriggers.push(st.scrollTrigger);

      const cardGlow = card.querySelector('[data-card-glow]');
      if (cardGlow && !lowPerf) {
        const glowSt = gsap.to(cardGlow, {
          opacity: 0.6,
          duration: 1,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: card,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 0.5,
          },
        });
        if (glowSt.scrollTrigger) aboutScrollTriggers.push(glowSt.scrollTrigger);
      }
    });
  }

  // ===== TIMELINE SECTION =====
  const timelineSection = document.querySelector('[data-timeline-blobs]');
  if (timelineSection) {
    const sectionHeader = timelineSection.querySelector('[data-section-header]');
    if (sectionHeader) {
      gsap.set(sectionHeader, { opacity: 0, y: 40 });
      const st = gsap.to(sectionHeader, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: timelineSection,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });
      if (st.scrollTrigger) aboutScrollTriggers.push(st.scrollTrigger);
    }

    const timelineBlobs = timelineSection.querySelectorAll('[data-timeline-blob]');
    timelineBlobs.forEach((blob, index) => {
      const isEven = index % 2 === 0;

      gsap.set(blob, {
        opacity: 0,
        x: isEven ? -80 : 80,
        scale: 0.8,
      });

      const st = gsap.to(blob, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: blob,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
      if (st.scrollTrigger) aboutScrollTriggers.push(st.scrollTrigger);
    });
  }

  initMeasure();
  console.log("✅ About scroll animations initialized");

  return () => {
    aboutScrollTriggers.forEach((st) => st.kill());
    aboutScrollTriggers = [];
  };
}
