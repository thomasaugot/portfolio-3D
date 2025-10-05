import { gsap, ScrollTrigger } from "@/lib/animations";

let skillsScrollTrigger: ScrollTrigger | null = null;

export function initSkillsScrollAnimation() {
  const skillsSection = document.querySelector("[data-skills-section]");
  if (!skillsSection) return;

  const serviceCards = skillsSection.querySelectorAll('[data-service-card]');
  if (serviceCards.length === 0) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: skillsSection,
      start: "top 80%",
      once: true,
      id: "skills-scroll",
      onRefresh: (self) => {
        skillsScrollTrigger = self;
      },
    },
  });

  tl.fromTo(skillsSection, 
    { opacity: 0, y: 100 }, 
    { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
  );

  serviceCards.forEach((card, index) => {
    const glowElement = card.querySelector('[data-card-glow]') as HTMLElement;
    
    if (glowElement) {
      tl.to(glowElement, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out"
      }, 0.5 + index * 0.6);
      
      tl.to(glowElement, {
        opacity: 0,
        duration: 1.2,
        ease: "power2.in"
      }, 1.5 + index * 0.6);
    }
  });

  return () => {
    if (skillsScrollTrigger) {
      skillsScrollTrigger.kill();
      skillsScrollTrigger = null;
    }
  };
}