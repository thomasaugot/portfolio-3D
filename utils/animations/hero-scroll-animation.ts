import { gsap, ScrollTrigger } from "@/lib/animations";
import { perfMonitor } from "../performance-monitor";
import { initHeroTitleAnimation } from "./hero-title-animation";

let heroScrollTrigger: ScrollTrigger | null = null;
let heroTitleTimeline: gsap.core.Timeline | null = null;

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

    const initMeasure = perfMonitor.startMeasure("hero-scroll-init");

    const titleAnimation = initHeroTitleAnimation();
    if (titleAnimation) {
      heroTitleTimeline = titleAnimation;
    }

    const { camera, hexFloor, codeWrapper, laptopWrapper } = heroScene;
    const lowPerf = isLowPerformanceDevice();
    const scrubSpeed = lowPerf ? 1.5 : 2.2;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "+=280%",
        scrub: scrubSpeed,
        pin: true,
        id: "hero-scroll",
        anticipatePin: 1,
        snap: {
          snapTo: [0, 1],
          duration: { min: 0.4, max: 0.8 },
          delay: 0.1,
          ease: "power2.inOut"
        },
        onRefresh: (self) => {
          heroScrollTrigger = self;
        },
      },
    });

    if (heroContent) {
      tl.to(
        heroContent,
        { 
          opacity: 0, 
          scale: 0.88, 
          y: -70,
          filter: "blur(3px)",
          duration: 0.45, 
          ease: "power2.out",
          force3D: true,
        },
        0
      );
    }

    if (scrollIndicator) {
      tl.to(
        scrollIndicator,
        { 
          opacity: 0, 
          y: 15, 
          scale: 0.85,
          duration: 0.2, 
          ease: "power1.in",
          force3D: true,
        },
        0
      );
    }

    const startX = camera.position.x;
    const startZ = camera.position.z;
    const startY = camera.position.y;
    const radius = Math.sqrt(startX * startX + startZ * startZ);
    
    tl.to(
      camera.position,
      { 
        x: radius * Math.cos(Math.PI / 10),
        z: radius * Math.sin(Math.PI / 10) + 50,
        y: startY + 60, 
        duration: 0.5, 
        ease: "sine.inOut",
        force3D: true,
        onUpdate: function() {
          camera.lookAt(0, 0, 0);
        }
      },
      0.12
    );

    tl.to(
      camera.position,
      { 
        x: radius * Math.cos(Math.PI / 5) * 1.2,
        z: radius * Math.sin(Math.PI / 5) * 1.2 + 180,
        y: startY + 180, 
        duration: 0.7, 
        ease: "sine.inOut",
        force3D: true,
        onUpdate: function() {
          camera.lookAt(0, 0, 0);
        }
      },
      0.5
    );

    tl.to(
      hexFloor.rotation,
      { 
        x: Math.PI / 3.2, 
        y: Math.PI / 6,
        z: Math.PI / 32,
        duration: 1.3, 
        ease: "sine.inOut",
        force3D: true,
      },
      0.18
    );

    tl.to(
      hexFloor.position,
      { 
        y: -68, 
        z: -85,
        x: -15,
        duration: 1.3, 
        ease: "sine.inOut",
        force3D: true,
      },
      0.18
    );

    const hexChildren = hexFloor.children;
    const hexCount = hexChildren.length;
    // Significantly increased batch size for better performance (was 3-5)
    const batchSize = lowPerf ? 40 : 30;
    
    for (let i = 0; i < hexCount; i += batchSize) {
      const batch = [];
      const batchMaterials = [];
      const batchScales = [];
      
      for (let j = i; j < Math.min(i + batchSize, hexCount); j++) {
        const hex = hexChildren[j];
        batch.push(hex.position);
        batchMaterials.push(hex.material);
        batchScales.push(hex.scale);
      }
      
      const avgDistanceFactor = batch.reduce((sum, _, idx) => 
        sum + (hexChildren[i + idx] as any).pulseOffset, 0) / batch.length;
      const wave = Math.sin(avgDistanceFactor * 0.4);
      
      tl.to(
        batch,
        { 
          y: `+=${wave * 10}`,
          duration: 0.9, 
          ease: "sine.inOut",
          force3D: true,
        },
        0.28 + avgDistanceFactor * 0.008
      );

      tl.to(
        batchMaterials,
        { 
          opacity: 0.12 + Math.abs(wave) * 0.08, 
          duration: 0.7, 
          ease: "sine.inOut",
        },
        0.32 + avgDistanceFactor * 0.008
      );

      tl.to(
        batchScales,
        { 
          x: 0.95 + wave * 0.05,
          y: 0.95 + wave * 0.05,
          z: 0.95 + wave * 0.05,
          duration: 0.7, 
          ease: "sine.inOut",
          force3D: true,
        },
        0.32 + avgDistanceFactor * 0.008
      );
    }

    if (codeWrapper) {
      tl.to(
        codeWrapper.position,
        { 
          x: -145,
          y: 170, 
          z: -190, 
          duration: 1.1, 
          ease: "power1.inOut",
          force3D: true,
        },
        0.22
      );

      tl.to(
        codeWrapper.rotation,
        { 
          x: Math.PI / 7,
          y: Math.PI * 1.35, 
          z: Math.PI / 11,
          duration: 1.1, 
          ease: "sine.inOut",
          force3D: true,
        },
        0.22
      );

      tl.to(
        codeWrapper,
        { 
          opacity: 0, 
          duration: 0.4, 
          ease: "sine.in",
          onUpdate: function() {
            if (codeWrapper.children[0]) {
              const progress = this.progress();
              const fadeStart = 0.3;
              const adjustedProgress = progress < fadeStart ? 0 : (progress - fadeStart) / (1 - fadeStart);
              
              codeWrapper.children[0].traverse((child: any) => {
                if (child.material) {
                  child.material.opacity = 1 - adjustedProgress;
                  child.material.transparent = true;
                }
              });
            }
          }
        },
        0.75
      );
    }

    if (laptopWrapper) {
      tl.to(
        laptopWrapper.position,
        { 
          x: 125,
          y: 155, 
          z: -270, 
          duration: 1.1, 
          ease: "power1.inOut",
          force3D: true,
        },
        0.27
      );

      tl.to(
        laptopWrapper.rotation,
        { 
          x: -Math.PI / 9,
          y: Math.PI * 1.48, 
          z: -Math.PI / 13,
          duration: 1.1, 
          ease: "sine.inOut",
          force3D: true,
        },
        0.27
      );

      tl.to(
        laptopWrapper,
        { 
          opacity: 0, 
          duration: 0.4, 
          ease: "sine.in",
          onUpdate: function() {
            if (laptopWrapper.children[0]) {
              const progress = this.progress();
              const fadeStart = 0.3;
              const adjustedProgress = progress < fadeStart ? 0 : (progress - fadeStart) / (1 - fadeStart);
              
              laptopWrapper.children[0].traverse((child: any) => {
                if (child.material) {
                  child.material.opacity = 1 - adjustedProgress;
                  child.material.transparent = true;
                }
              });
            }
          }
        },
        0.75
      );
    }

    tl.to(
      heroContainer,
      { 
        opacity: 0,
        filter: "blur(4px)", 
        duration: 0.45, 
        ease: "sine.inOut",
        force3D: true,
      },
      0.88
    );

    initMeasure();
  };

  waitForScene();

  return () => {
    if (heroScrollTrigger) heroScrollTrigger.kill();
    heroScrollTrigger = null;
    if (heroTitleTimeline) heroTitleTimeline.kill();
    heroTitleTimeline = null;
  };
}