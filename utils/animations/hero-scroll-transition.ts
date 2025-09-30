// utils/animations/hero-scroll-transition.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initHeroScrollTransition() {
  const heroContainer = document.querySelector('[data-3d-container="hero"]') as HTMLElement;
  const heroSection = heroContainer?.parentElement?.parentElement;
  const heroContent = heroSection?.querySelector('[data-animate="slide-up"]');
  const scrollIndicator = heroSection?.querySelector('.absolute.bottom-12');
  const skillsSection = document.querySelector('[data-skills-section]');
  
  if (!heroContainer || !heroSection) return;

  const heroScene = (window as any).__heroScene;
  if (!heroScene) {
    console.warn('Hero scene not found');
    return;
  }

  const { camera, hexFloor, codeWrapper, laptopWrapper, renderer } = heroScene;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroSection,
      start: "top top",
      end: "bottom top",
      scrub: 1.5,
      pin: true,
    }
  });

  if (heroContent) {
    tl.to(heroContent, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: "power2.in"
    }, 0);
  }

  if (scrollIndicator) {
    tl.to(scrollIndicator, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in"
    }, 0);
  }

  tl.to(hexFloor.rotation, {
    x: Math.PI / 2,
    duration: 0.8,
    ease: "power2.inOut"
  }, 0.2);

  tl.to(hexFloor.position, {
    y: -400,
    z: -300,
    duration: 0.8,
    ease: "power2.inOut"
  }, 0.2);

  hexFloor.children.forEach((hex: any, index: number) => {
    tl.to(hex.material, {
      opacity: 0.1,
      duration: 0.4,
      ease: "power2.in"
    }, 0.3 + (index * 0.001));
  });

  if (codeWrapper) {
    tl.to(codeWrapper.position, {
      y: -400,
      z: -500,
      duration: 0.5,
      ease: "power2.in"
    }, 0.1);
    
    tl.to(codeWrapper.rotation, {
      y: Math.PI * 2,
      duration: 0.5,
      ease: "power2.inOut"
    }, 0.1);
  }

  if (laptopWrapper) {
    tl.to(laptopWrapper.position, {
      y: -400,
      z: -500,
      duration: 0.5,
      ease: "power2.in"
    }, 0.1);
    
    tl.to(laptopWrapper.rotation, {
      y: Math.PI * 2,
      duration: 0.5,
      ease: "power2.inOut"
    }, 0.1);
  }

  if (skillsSection) {
    tl.fromTo(skillsSection, 
      {
        opacity: 0,
        y: 100
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, 0.4);
  }

  tl.to(heroContainer, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.inOut"
  }, 0.7);

  return () => {
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.trigger === heroSection) {
        trigger.kill();
      }
    });
  };
}