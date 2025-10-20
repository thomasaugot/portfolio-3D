import { gsap, ScrollTrigger } from "@/lib/animations";
import { perfMonitor } from "../performance-monitor";

let animationsInitialized = false;
const fadeScrollTriggers: ScrollTrigger[] = [];
let heroTitleTimeline: gsap.core.Timeline | null = null;

export function initFadeAnimations() {
  if (animationsInitialized) return;

  animationsInitialized = true;

  const heroContent = document.querySelector('[data-hero-container] [data-animate="slide-up"]');
  
  if (heroContent) {
    const measure = perfMonitor.startMeasure("hero-title-init");
    
    const badge = heroContent.querySelector(".glass");
    const titleSpans = heroContent.querySelectorAll("h1 span");
    const subtitle = heroContent.querySelector("p");
    const buttons = heroContent.querySelectorAll("button");

    gsap.set([badge, ...titleSpans, subtitle, ...buttons], {
      opacity: 0,
      willChange: "transform, opacity",
    });

    gsap.set(titleSpans[0], { y: 30, rotateX: -15 });
    gsap.set(titleSpans[1], { scale: 0.85, rotateY: -8 });
    gsap.set(titleSpans[2], { y: 30, rotateX: 15 });
    gsap.set(badge, { y: -20, scale: 0.9 });
    gsap.set(subtitle, { y: 20 });
    gsap.set(buttons, { y: 15, scale: 0.98 });

    heroTitleTimeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      delay: 0.2,
    });

    heroTitleTimeline
      .to(badge, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.4)",
      })
      .to(
        titleSpans[0],
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          ease: "power3.out",
        },
        0.3
      )
      .to(
        titleSpans[1],
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 1.2,
          ease: "back.out(1.2)",
        },
        0.5
      )
      .to(
        titleSpans[2],
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          ease: "power3.out",
        },
        0.7
      )
      .to(
        subtitle,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
        },
        0.9
      )
      .to(
        buttons,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.3)",
        },
        1.1
      )
      .add(() => {
        gsap.set([badge, ...titleSpans, subtitle, ...buttons], {
          clearProps: "willChange",
        });
      });

    measure();
  }

  gsap.utils.toArray('[data-animate="slide-up"]').forEach((element) => {
    if (element === heroContent) return;
    
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
    if (heroTitleTimeline) {
      heroTitleTimeline.kill();
      heroTitleTimeline = null;
    }
    fadeScrollTriggers.forEach(trigger => trigger.kill());
    fadeScrollTriggers.length = 0;
  };
}