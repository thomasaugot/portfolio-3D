import { gsap, ScrollTrigger } from "@/lib/animations";

let skillsScrollTrigger: ScrollTrigger | null = null;

export function initSkillsScrollAnimation() {
  const skillsSection = document.querySelector("[data-skills-section]");
  if (!skillsSection) return;

  const header = skillsSection.querySelector("[data-header]");
  const badge = skillsSection.querySelector("[data-badge]");
  const serviceCards = skillsSection.querySelectorAll("[data-service-card]");
  const stats = skillsSection.querySelectorAll("[data-stat]");
  const statsWrapper = skillsSection.querySelector("[data-stats-wrapper]");
  const statsGlow = skillsSection.querySelector("[data-stats-glow]");
  const gridBg = skillsSection.querySelector("[data-grid-bg]");

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

  tl.fromTo(
    skillsSection,
    { opacity: 0 },
    { opacity: 1, duration: 0.3, ease: "power2.out" }
  );

  if (gridBg) {
    tl.fromTo(
      gridBg,
      { opacity: 0, scale: 1.1 },
      { opacity: 0.2, scale: 1, duration: 1, ease: "power2.out" },
      0.1
    );
  }

  if (badge) {
    tl.fromTo(
      badge,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" },
      0.2
    );
  }

  if (header) {
    tl.fromTo(
      header.querySelectorAll("h2, p"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
      0.4
    );
  }

  serviceCards.forEach((card, index) => {
    const glowElement = card.querySelector("[data-card-glow]") as HTMLElement;
    const icon = card.querySelector("[data-icon]") as HTMLElement;

    tl.fromTo(
      card,
      { opacity: 0, y: 50, rotateX: -15 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      0.8 + index * 0.15
    );

    if (icon) {
      tl.fromTo(
        icon,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)" },
        0.9 + index * 0.15
      );
    }

    if (glowElement) {
      tl.to(
        glowElement,
        {
          opacity: 0.6,
          duration: 0.8,
          ease: "power2.out",
        },
        1 + index * 0.15
      );

      tl.to(
        glowElement,
        {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        },
        1.8 + index * 0.15
      );
    }
  });

  if (statsWrapper) {
    tl.fromTo(
      statsWrapper,
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
      },
      1.5
    );
  }

  if (statsGlow) {
    tl.fromTo(
      statsGlow,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
      },
      1.6
    );
  }

  stats.forEach((stat, index) => {
    tl.fromTo(
      stat,
      { opacity: 0, scale: 0.8, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      },
      1.8 + index * 0.1
    );
  });

  return () => {
    if (skillsScrollTrigger) {
      skillsScrollTrigger.kill();
      skillsScrollTrigger = null;
    }
  };
}