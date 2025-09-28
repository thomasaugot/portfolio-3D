import { gsap, ScrollTrigger } from "@/utils/animations/gsap-init";

let animationsInitialized = false;

export function initFadeAnimations() {
  // Prevent double initialization
  if (animationsInitialized) return;
  animationsInitialized = true;

  // Clear any existing ScrollTriggers first
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  // Slide up from bottom with stagger for title lines
  gsap.utils.toArray('[data-animate="slide-up"]').forEach((element) => {
    const titleLines = (element as Element).querySelectorAll('span');
    
    if (titleLines.length > 0) {
      // Stagger each line of the title
      gsap.fromTo(
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
            toggleActions: "play none none none", // Don't reverse to prevent flickering
          },
        }
      );
    } else {
      // Regular slide up for non-title elements
      gsap.fromTo(
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
    }
  });

  // Slide down from top
  gsap.utils.toArray('[data-animate="slide-down"]').forEach((element) => {
    gsap.fromTo(
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
  });

  // Slide in from right
  gsap.utils.toArray('[data-animate="slide-left"]').forEach((element) => {
    gsap.fromTo(
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
  });

  // Slide in from left
  gsap.utils.toArray('[data-animate="slide-right"]').forEach((element) => {
    gsap.fromTo(
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
  });

  // Simple fade in
  gsap.utils.toArray('[data-animate="fade"]').forEach((element) => {
    gsap.fromTo(
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
  });

  // Stagger children
  gsap.utils.toArray('[data-animate="stagger"]').forEach((container) => {
    const items = (container as Element).children;
    gsap.fromTo(
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
  });
}

// Reset function for theme changes
export function resetFadeAnimations() {
  animationsInitialized = false;
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}