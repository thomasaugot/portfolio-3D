import { gsap } from "@/lib/animations";
import { perfMonitor } from "../performance-monitor";

interface ScrollAnimationCleanup {
  kill: () => void;
}

export function initSkillsScrollAnimation(): ScrollAnimationCleanup {
  const endMeasure = perfMonitor.startMeasure("skills-scroll-init");
   
  const skillsSection = document.querySelector("[data-skills-section]") as HTMLElement;
  if (!skillsSection) {
    endMeasure();
    return { kill: () => {} };
  }

  const header = skillsSection.querySelector("[data-header]");
  const serviceCards = skillsSection.querySelectorAll("[data-service-card]");
  const statsWrapper = skillsSection.querySelector("[data-stats-wrapper]");
  const statsGlow = skillsSection.querySelector("[data-stats-glow]");
  const stats = skillsSection.querySelectorAll("[data-stat]");
  const gridBg = skillsSection.querySelector("[data-grid-bg]");

  gsap.set(skillsSection, { opacity: 0 });
  if (gridBg) gsap.set(gridBg, { opacity: 0, scale: 1.1 });
  if (header) gsap.set(header.querySelectorAll("h2, h3"), { opacity: 0, y: 30 });
  serviceCards.forEach((card) => {
    gsap.set(card, { opacity: 0, y: 50, rotateX: -15 });
    const glow = card.querySelector("[data-card-glow]");
    if (glow) gsap.set(glow, { opacity: 0 });
  });
  if (statsWrapper) gsap.set(statsWrapper, { opacity: 0, y: 60, scale: 0.9 });
  if (statsGlow) gsap.set(statsGlow, { opacity: 0, scale: 0.8 });
  stats.forEach((stat) => gsap.set(stat, { opacity: 0, scale: 0.8, y: 20 }));

  const sectionTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: skillsSection,
      start: "top 80%",
      end: "bottom bottom",
      scrub: 0.5,
      id: "skills-section",
    },
  });

  sectionTimeline
    .to(skillsSection, { opacity: 1, duration: 0.1, ease: "none" }, 0)
    .to(gridBg, { opacity: 0.2, scale: 1, duration: 0.2, ease: "power2.out" }, 0.05)
    .to(header?.querySelectorAll("h2, h3") || [], { 
      opacity: 1, 
      y: 0, 
      duration: 0.3, 
      stagger: 0.08, 
      ease: "power2.out"
    }, 0.1);

  const cardsContainer = skillsSection.querySelector(".grid");
   
  const cardsTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: cardsContainer || serviceCards[0],
      start: "top 70%",
      end: "bottom 40%",
      scrub: 2,
      id: "skills-cards-stagger",
    },
  });

  serviceCards.forEach((card, index) => {
    const glow = card.querySelector("[data-card-glow]");
    const startOffset = index * 0.35;
    
    cardsTimeline
      .to(card, { 
        opacity: 1, 
        y: 0, 
        rotateX: 0, 
        duration: 0.6, 
        ease: "power2.out"
      }, startOffset)
      .to(glow, { 
        opacity: 0.6, 
        duration: 0.25, 
        ease: "power2.out"
      }, startOffset + 0.25)
      .to(glow, { 
        opacity: 0, 
        duration: 0.3, 
        ease: "power2.inOut"
      }, startOffset + 0.6);
  });

  const statsTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: statsWrapper,
      start: "top 90%",
      end: "top 50%",
      scrub: 0.6,
      id: "skills-stats",
    },
  });

  statsTimeline
    .to(statsWrapper, { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      duration: 0.3, 
      ease: "power2.out"
    }, 0)
    .to(statsGlow, { 
      opacity: 1, 
      scale: 1, 
      duration: 0.4, 
      ease: "power2.out"
    }, 0.1)
    .to(stats, { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      duration: 0.35, 
      stagger: 0.08, 
      ease: "back.out(1.2)"
    }, 0.15);

  endMeasure();

  return {
    kill: () => {
      const killMeasure = perfMonitor.startMeasure("skills-scroll-kill");
      sectionTimeline.scrollTrigger?.kill();
      sectionTimeline.kill();
      cardsTimeline.scrollTrigger?.kill();
      cardsTimeline.kill();
      statsTimeline.scrollTrigger?.kill();
      statsTimeline.kill();
      killMeasure();
    },
  };
}