import { gsap, ScrollTrigger } from "@/lib/animations";

let heroScrollTrigger: ScrollTrigger | null = null;

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

    const { camera, hexFloor, codeWrapper, laptopWrapper } = heroScene;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "+=280%",
        scrub: 2.2,
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

    // Elegant content fade with subtle blur
    if (heroContent) {
      tl.to(
        heroContent,
        { 
          opacity: 0, 
          scale: 0.88, 
          y: -70,
          filter: "blur(3px)",
          duration: 0.45, 
          ease: "power2.out" 
        },
        0
      );
    }

    // Scroll indicator soft fade
    if (scrollIndicator) {
      tl.to(
        scrollIndicator,
        { 
          opacity: 0, 
          y: 15, 
          scale: 0.85,
          duration: 0.2, 
          ease: "power1.in" 
        },
        0
      );
    }

    // Camera graceful orbital movement - the star of the show
    const startX = camera.position.x;
    const startZ = camera.position.z;
    const startY = camera.position.y;
    const radius = Math.sqrt(startX * startX + startZ * startZ);
    
    // First phase: gentle rise and orbit start
    tl.to(
      camera.position,
      { 
        x: radius * Math.cos(Math.PI / 10),
        z: radius * Math.sin(Math.PI / 10) + 50,
        y: startY + 60, 
        duration: 0.5, 
        ease: "sine.inOut",
        onUpdate: function() {
          camera.lookAt(0, 0, 0);
        }
      },
      0.12
    );

    // Second phase: continue orbit with pullback
    tl.to(
      camera.position,
      { 
        x: radius * Math.cos(Math.PI / 5) * 1.2,
        z: radius * Math.sin(Math.PI / 5) * 1.2 + 180,
        y: startY + 180, 
        duration: 0.7, 
        ease: "sine.inOut",
        onUpdate: function() {
          camera.lookAt(0, 0, 0);
        }
      },
      0.5
    );

    // Hex floor graceful multi-axis rotation
    tl.to(
      hexFloor.rotation,
      { 
        x: Math.PI / 3.2, 
        y: Math.PI / 6,
        z: Math.PI / 32,
        duration: 1.3, 
        ease: "sine.inOut" 
      },
      0.18
    );

    // Hex floor synchronized drift
    tl.to(
      hexFloor.position,
      { 
        y: -68, 
        z: -85,
        x: -15,
        duration: 1.3, 
        ease: "sine.inOut" 
      },
      0.18
    );

    // Hexagons elegant wave with vertical motion
    hexFloor.children.forEach((hex: any, index: number) => {
      const distanceFactor = (hex as any).pulseOffset;
      const wave = Math.sin(distanceFactor * 0.4);
      
      // Subtle vertical wave motion
      tl.to(
        hex.position,
        { 
          y: `+=${wave * 10}`,
          duration: 0.9, 
          ease: "sine.inOut" 
        },
        0.28 + distanceFactor * 0.008
      );

      // Opacity fade with wave pattern
      tl.to(
        hex.material,
        { 
          opacity: 0.12 + Math.abs(wave) * 0.08, 
          duration: 0.7, 
          ease: "sine.inOut" 
        },
        0.32 + distanceFactor * 0.008
      );

      // Subtle scale pulse
      tl.to(
        hex.scale,
        { 
          x: 0.95 + wave * 0.05,
          y: 0.95 + wave * 0.05,
          z: 0.95 + wave * 0.05,
          duration: 0.7, 
          ease: "sine.inOut" 
        },
        0.32 + distanceFactor * 0.008
      );
    });

    // Code wrapper elegant choreographed exit
    if (codeWrapper) {
      // Position arc movement
      tl.to(
        codeWrapper.position,
        { 
          x: -145,
          y: 170, 
          z: -190, 
          duration: 1.1, 
          ease: "power1.inOut" 
        },
        0.22
      );

      // Graceful rotation
      tl.to(
        codeWrapper.rotation,
        { 
          x: Math.PI / 7,
          y: Math.PI * 1.35, 
          z: Math.PI / 11,
          duration: 1.1, 
          ease: "sine.inOut" 
        },
        0.22
      );

      // Smooth opacity fade with material traversal
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

    // Laptop wrapper mirrored elegant exit
    if (laptopWrapper) {
      // Position arc movement (mirrored)
      tl.to(
        laptopWrapper.position,
        { 
          x: 125,
          y: 155, 
          z: -270, 
          duration: 1.1, 
          ease: "power1.inOut" 
        },
        0.27
      );

      // Graceful rotation (mirrored)
      tl.to(
        laptopWrapper.rotation,
        { 
          x: -Math.PI / 9,
          y: Math.PI * 1.48, 
          z: -Math.PI / 13,
          duration: 1.1, 
          ease: "sine.inOut" 
        },
        0.27
      );

      // Smooth opacity fade with material traversal
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

    // Final scene fade with gentle blur
    tl.to(
      heroContainer,
      { 
        opacity: 0,
        filter: "blur(4px)", 
        duration: 0.45, 
        ease: "sine.inOut" 
      },
      0.88
    );
  };

  waitForScene();

  return () => {
    if (heroScrollTrigger) heroScrollTrigger.kill();
    heroScrollTrigger = null;
  };
}