import { gsap, ScrollTrigger } from "@/lib/animations";

let heroScrollTrigger: ScrollTrigger | null = null;
let projectsScrollTrigger: ScrollTrigger | null = null;

export function initHeroScrollAnimation() {
  const waitForScene = () => {
    const heroScene = (window as any).__heroScene;
    if (!heroScene) {
      requestAnimationFrame(waitForScene);
      return;
    }

    const heroContainer = document.querySelector(
      '[data-3d-container="hero"]'
    ) as HTMLElement;
    const heroSection = heroContainer?.parentElement?.parentElement;
    const heroContent = heroSection?.querySelector('[data-animate="slide-up"]');
    const scrollIndicator = heroSection?.querySelector(".absolute.bottom-12");

    if (!heroContainer || !heroSection) {
      requestAnimationFrame(waitForScene);
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
        id: "hero-scroll",
        onRefresh: (self) => {
          heroScrollTrigger = self;
        },
      },
    });

    if (heroContent) {
      tl.to(
        heroContent,
        { opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.in" },
        0
      );
    }

    if (scrollIndicator) {
      tl.to(
        scrollIndicator,
        { opacity: 0, duration: 0.2, ease: "power2.in" },
        0
      );
    }

    tl.to(
      hexFloor.rotation,
      { x: Math.PI / 2, duration: 0.8, ease: "power2.inOut" },
      0.2
    );
    tl.to(
      hexFloor.position,
      { y: 0, z: 0, duration: 0.8, ease: "power2.inOut" },
      0.2
    );

    hexFloor.children.forEach((hex: any, index: number) => {
      tl.to(
        hex.material,
        { opacity: 0.5, duration: 0.4, ease: "power2.in" },
        0.3 + index * 0.001
      );
    });

    if (codeWrapper) {
      tl.to(
        codeWrapper.position,
        { y: -400, z: -500, duration: 0.5, ease: "power2.in" },
        0.1
      );
      tl.to(
        codeWrapper.rotation,
        { y: Math.PI * 2, duration: 0.5, ease: "power2.inOut" },
        0.1
      );
    }

    if (laptopWrapper) {
      tl.to(
        laptopWrapper.position,
        { y: -400, z: -500, duration: 0.5, ease: "power2.in" },
        0.1
      );
      tl.to(
        laptopWrapper.rotation,
        { y: Math.PI * 2, duration: 0.5, ease: "power2.inOut" },
        0.1
      );
    }

    tl.to(
      heroContainer,
      { opacity: 0, duration: 0.3, ease: "power2.inOut" },
      0.7
    );
  };

  waitForScene();

  return () => {
    if (heroScrollTrigger) heroScrollTrigger.kill();
    if (projectsScrollTrigger) projectsScrollTrigger.kill();
    heroScrollTrigger = null;
    projectsScrollTrigger = null;
  };
}