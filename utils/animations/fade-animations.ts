import { gsap, ScrollTrigger } from "@/lib/animations";

let animationsInitialized = false;
const fadeScrollTriggers: ScrollTrigger[] = [];

export function initFadeAnimations() {
  if (animationsInitialized) return;

  animationsInitialized = true;

  gsap.utils.toArray('[data-animate="slide-up"]').forEach((element) => {
    const titleLines = (element as Element).querySelectorAll('span');
    
    if (titleLines.length > 0) {
      const tween = gsap.fromTo(
        titleLines,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: element as Element,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      if (tween.scrollTrigger) fadeScrollTriggers.push(tween.scrollTrigger);
    } else {
      const tween = gsap.fromTo(
        element as Element,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element as Element,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      if (tween.scrollTrigger) fadeScrollTriggers.push(tween.scrollTrigger);
    }
  });

  gsap.utils.toArray('[data-animate="slide-down"]').forEach((element) => {
    const tween = gsap.fromTo(
      element as Element,
      {
        opacity: 0,
        y: -60,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element as Element,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
    if (tween.scrollTrigger) fadeScrollTriggers.push(tween.scrollTrigger);
  });

  gsap.utils.toArray('[data-animate="slide-left"]').forEach((element) => {
    const tween = gsap.fromTo(
      element as Element,
      {
        opacity: 0,
        x: 60,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element as Element,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
    if (tween.scrollTrigger) fadeScrollTriggers.push(tween.scrollTrigger);
  });

  gsap.utils.toArray('[data-animate="slide-right"]').forEach((element) => {
    const tween = gsap.fromTo(
      element as Element,
      {
        opacity: 0,
        x: -60,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element as Element,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
    if (tween.scrollTrigger) fadeScrollTriggers.push(tween.scrollTrigger);
  });

  gsap.utils.toArray('[data-animate="fade"]').forEach((element) => {
    const tween = gsap.fromTo(
      element as Element,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element as Element,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
    if (tween.scrollTrigger) fadeScrollTriggers.push(tween.scrollTrigger);
  });

  gsap.utils.toArray('[data-animate="stagger"]').forEach((container) => {
    const items = (container as Element).children;
    const tween = gsap.fromTo(
      items,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: container as Element,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
    if (tween.scrollTrigger) fadeScrollTriggers.push(tween.scrollTrigger);
  });

  return () => {
    animationsInitialized = false;
    fadeScrollTriggers.forEach(trigger => trigger.kill());
    fadeScrollTriggers.length = 0;
  };
}