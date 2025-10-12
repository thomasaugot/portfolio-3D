import { gsap, ScrollTrigger } from "@/lib/animations";

let projectsScrollTrigger: ScrollTrigger | null = null;

const waitForProjectScenes = (totalProjects: number): Promise<void> => {
  return new Promise((resolve) => {
    const checkScenes = () => {
      let allReady = true;
      for (let i = 0; i < totalProjects; i++) {
        if (!(window as any)[`__projectScene_${i}`]) {
          allReady = false;
          break;
        }
      }
      if (allReady) resolve();
      else requestAnimationFrame(checkScenes);
    };
    checkScenes();
  });
};

const randomAnimations = [
  {
    enter: { rotation: 15, scale: 0.85, x: 100, y: 50 },
    exit: { rotation: -10, scale: 0.9, x: -80, y: -40 },
  },
  {
    enter: { rotation: -20, scale: 0.8, x: -120, y: 60 },
    exit: { rotation: 15, scale: 0.85, x: 100, y: -50 },
  },
  {
    enter: { rotationY: 45, scale: 0.75, x: 80, y: -40 },
    exit: { rotationY: -30, scale: 0.8, x: -60, y: 60 },
  },
];

export function initProjectsScrollAnimation() {
  setTimeout(async () => {
    const projectsSection = document.querySelector("[data-projects-section]");
    if (!projectsSection) return;

    const allPanels = projectsSection.querySelectorAll("[data-project-panel]");
    const panels = Array.from(allPanels).filter(
      (p: any) => window.getComputedStyle(p).display !== "none"
    );

    if (panels.length === 0) return;

    await waitForProjectScenes(panels.length);

    const totalPanels = panels.length;

    // Initial states
    panels.forEach((panel: any, index) => {
      const image = panel.querySelector("[data-project-image]");
      const content = panel.querySelector("[data-project-content]");

      if (index === 0) {
        gsap.set(panel, { opacity: 1, zIndex: 1000 });
        gsap.set([image, content], { opacity: 1, x: 0, y: 0 });
      } else {
        const anim = randomAnimations[index % randomAnimations.length];
        gsap.set(panel, { opacity: 0, zIndex: 1000 - index });
        if (image) {
          gsap.set(image, { opacity: 0, ...anim.enter });
        }
        if (content) {
          gsap.set(content, {
            opacity: 0,
            x: anim.enter.x ? -anim.enter.x : 0,
            y: anim.enter.y ? -anim.enter.y : 0,
            rotation: anim.enter.rotation ? -anim.enter.rotation : 0,
          });
        }
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: projectsSection,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    panels.forEach((panel: any, index) => {
      const image = panel.querySelector("[data-project-image]");
      const content = panel.querySelector("[data-project-content]");
      const sceneData = (window as any)[`__projectScene_${index}`];
      const anim = randomAnimations[index % randomAnimations.length];

      const duration = 3;
      const transitionDuration = 1.5;

      if (index === 0) {
        const exitStart = duration - transitionDuration;

        tl.to(panel, { opacity: 0, duration: transitionDuration, ease: "power2.in" }, exitStart);
        if (image) {
          tl.to(image, { opacity: 0, ...anim.exit, duration: transitionDuration, ease: "power2.in" }, exitStart);
        }
        if (content) {
          tl.to(content, {
            opacity: 0,
            x: anim.exit.x ? -anim.exit.x : 0,
            y: anim.exit.y ? -anim.exit.y : 0,
            rotation: anim.exit.rotation ? -anim.exit.rotation : 0,
            duration: transitionDuration,
            ease: "power2.in",
          }, exitStart);
        }

        // 3D objects exit - BIGGER MOVEMENTS, NO COLLISION
        if (sceneData?.laptop) {
          tl.to(sceneData.laptop.rotation, { 
            x: 0.4, 
            y: -0.6, 
            z: 0.3, 
            duration: transitionDuration, 
            ease: "power2.in" 
          }, exitStart);
          tl.to(sceneData.laptop.position, { 
            x: -70, 
            y: -100,  // Laptop goes DOWN
            z: -50, 
            duration: transitionDuration, 
            ease: "power2.in" 
          }, exitStart);
        }
        if (sceneData?.iphone) {
          tl.to(sceneData.iphone.rotation, { 
            x: -0.5, 
            y: 0.7, 
            z: -0.4, 
            duration: transitionDuration, 
            ease: "power2.in" 
          }, exitStart);
          tl.to(sceneData.iphone.position, { 
            x: 60, 
            y: 80,  // iPhone goes UP (positive Y)
            z: 40, 
            duration: transitionDuration, 
            ease: "power2.in" 
          }, exitStart);
        }
      } else {
        const enterStart = index * duration;
        const exitStart = enterStart + duration - transitionDuration;

        // Panel enter
        tl.to(panel, { opacity: 1, zIndex: 2000, duration: transitionDuration, ease: "power2.out" }, enterStart);

        if (image) {
          tl.to(image, {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: transitionDuration,
            ease: "power2.out",
          }, enterStart + 0.1);
        }

        if (content) {
          tl.to(content, {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: transitionDuration,
            ease: "power2.out",
          }, enterStart + 0.2);
        }

        // 3D objects enter - BIGGER MOVEMENTS, MORE DRAMATIC
        if (sceneData?.laptop) {
          tl.fromTo(
            sceneData.laptop.rotation,
            { x: -0.5, y: 0.8, z: -0.4 },
            { x: 0, y: 0, z: 0, duration: transitionDuration * 0.9, ease: "back.out(1.2)" },
            enterStart + 0.3
          );
          tl.fromTo(
            sceneData.laptop.position,
            { x: 80, y: -120, z: -60 },
            { x: 0, y: 0, z: 0, duration: transitionDuration * 0.9, ease: "back.out(1.2)" },
            enterStart + 0.3
          );
        }
        if (sceneData?.iphone) {
          tl.fromTo(
            sceneData.iphone.rotation,
            { x: 0.6, y: -0.9, z: 0.5 },
            { x: 0, y: 0, z: 0, duration: transitionDuration * 0.9, ease: "back.out(1.3)" },
            enterStart + 0.4
          );
          tl.fromTo(
            sceneData.iphone.position,
            { x: -70, y: -100, z: 50 },
            { x: 0, y: 0, z: 0, duration: transitionDuration * 0.9, ease: "back.out(1.3)" },
            enterStart + 0.4
          );
        }

        // Exit animations for non-last panels
        if (index < totalPanels - 1) {
          tl.to(panel, { opacity: 0, duration: transitionDuration, ease: "power2.in" }, exitStart);

          if (image) {
            tl.to(image, { opacity: 0, ...anim.exit, duration: transitionDuration, ease: "power2.in" }, exitStart);
          }

          if (content) {
            tl.to(content, {
              opacity: 0,
              x: anim.exit.x ? -anim.exit.x : 0,
              y: anim.exit.y ? -anim.exit.y : 0,
              rotation: anim.exit.rotation ? -anim.exit.rotation : 0,
              duration: transitionDuration,
              ease: "power2.in",
            }, exitStart);
          }

          // 3D objects exit - BIGGER MOVEMENTS
          if (sceneData?.laptop) {
            tl.to(sceneData.laptop.rotation, { 
              x: 0.3, 
              y: -0.7, 
              z: 0.4, 
              duration: transitionDuration, 
              ease: "power2.in" 
            }, exitStart);
            tl.to(sceneData.laptop.position, { 
              x: -80, 
              y: -110, 
              z: -55, 
              duration: transitionDuration, 
              ease: "power2.in" 
            }, exitStart);
          }
          if (sceneData?.iphone) {
            tl.to(sceneData.iphone.rotation, { 
              x: -0.4, 
              y: 0.8, 
              z: -0.5, 
              duration: transitionDuration, 
              ease: "power2.in" 
            }, exitStart);
            tl.to(sceneData.iphone.position, { 
              x: 70, 
              y: -90, 
              z: 45, 
              duration: transitionDuration, 
              ease: "power2.in" 
            }, exitStart);
          }
        }
      }
    });

    if (tl.scrollTrigger) {
      projectsScrollTrigger = tl.scrollTrigger as ScrollTrigger;
    }
  }, 500);

  return () => {
    if (projectsScrollTrigger) {
      projectsScrollTrigger.kill();
      projectsScrollTrigger = null;
    }
  };
}