import { gsap, ScrollTrigger } from "@/lib/animations";
import { perfMonitor } from "@/utils/performance-monitor";

gsap.registerPlugin(ScrollTrigger);

let projectsScrollTrigger: ScrollTrigger | null = null;
let lastProgress = -1;
let pendingUpdate: number | null = null;
let isUpdating = false;

const waitForProjectScenes = (totalProjects: number): Promise<void> => {
  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 200;
    const isMobile = window.innerWidth < 1024; // Mobile or tablet

    const checkScenes = () => {
      attempts++;
      let allReady = true;
      const readyScenes: number[] = [];

      for (let i = 0; i < totalProjects; i++) {
        // Check for mobile or desktop scene based on viewport
        const sceneKey = isMobile ? `__projectScene_mobile_${i}` : `__projectScene_${i}`;
        const scene = (window as any)[sceneKey];
        if (scene) {
          readyScenes.push(i);
        } else {
          allReady = false;
        }
      }

      if (allReady) {
        // console.log(`✅ All ${totalProjects} ${isMobile ? 'MOBILE' : 'DESKTOP'} scenes ready!`, readyScenes);
        resolve();
      } else if (attempts >= maxAttempts) {
        console.log(`⚠️ Timeout waiting for scenes. Proceeding with ${readyScenes.length}/${totalProjects} ready.`);
        resolve();
      } else {
        if (attempts % 20 === 0) {
          // console.log(`⏳ Still waiting for ${isMobile ? 'MOBILE' : 'DESKTOP'} scenes... Ready: ${readyScenes.length}/${totalProjects}`, readyScenes);
        }
        requestAnimationFrame(checkScenes);
      }
    };
    checkScenes();
  });
};

const randomAnimations = [
  {
    enter: { rotation: 12, scale: 0.88, x: 80, y: 40, rotationY: 10 },
    exit: { rotation: -8, scale: 0.92, x: -60, y: -30, rotationY: -8 },
  },
  {
    enter: { rotation: -15, scale: 0.85, x: -100, y: 50, rotationY: -12 },
    exit: { rotation: 12, scale: 0.88, x: 80, y: -40, rotationY: 10 },
  },
  {
    enter: { rotationY: 35, scale: 0.82, x: 60, y: -35, rotation: 8 },
    exit: { rotationY: -25, scale: 0.86, x: -50, y: 50, rotation: -6 },
  },
];

const throttledScrollUpdate = (totalPanels: number, progress: number) => {
  // Skip if already updating or change is too small
  if (isUpdating || Math.abs(progress - lastProgress) < 0.005) {
    return;
  }

  isUpdating = true;
  lastProgress = progress;

  // Use requestAnimationFrame for better performance
  pendingUpdate = requestAnimationFrame(() => {
    const measure = perfMonitor.startMeasure('scrollUpdate');

    for (let i = 0; i < totalPanels; i++) {
      const sceneData = (window as any)[`__projectScene_${i}`];
      if (!sceneData) continue;

      const panelProgress = Math.max(
        0,
        Math.min(1, progress * totalPanels - i)
      );

      if (Math.abs(sceneData.scrollProgress - panelProgress) < 0.01) {
        continue;
      }

      sceneData.scrollProgress = panelProgress;

      if (sceneData.laptop && sceneData.laptopOriginal) {
        const progressPI = panelProgress * Math.PI;
        const progressPI2 = progressPI * 2;

        const floatOffset = Math.sin(progressPI2) * 10;
        const rotateX = Math.sin(progressPI) * 0.02;
        const rotateY = Math.cos(progressPI * 0.8) * 0.015;
        const rotateZ = Math.sin(progressPI * 1.2) * 0.01;

        sceneData.laptop.position.y = sceneData.laptopOriginal.pos.y + floatOffset;
        sceneData.laptop.rotation.x = sceneData.laptopOriginal.rot.x + rotateX;
        sceneData.laptop.rotation.y = sceneData.laptopOriginal.rot.y + rotateY;
        sceneData.laptop.rotation.z = sceneData.laptopOriginal.rot.z + rotateZ;
      }

      if (sceneData.iphone && sceneData.iphoneOriginal) {
        const progressPI = panelProgress * Math.PI;
        const progressPI2 = progressPI * 2;

        const floatOffset = Math.cos(progressPI2 + 1) * 12;
        const rotateX = Math.cos(progressPI * 1.1) * 0.025;
        const rotateY = Math.sin(progressPI * 0.9) * 0.02;
        const rotateZ = Math.cos(progressPI * 1.3) * 0.015;

        sceneData.iphone.position.y = sceneData.iphoneOriginal.pos.y + floatOffset;
        sceneData.iphone.rotation.x = sceneData.iphoneOriginal.rot.x + rotateX;
        sceneData.iphone.rotation.y = sceneData.iphoneOriginal.rot.y + rotateY;
        sceneData.iphone.rotation.z = sceneData.iphoneOriginal.rot.z + rotateZ;
      }
    }

    measure();
    pendingUpdate = null;
    isUpdating = false;
  });
};

export function initProjectsScrollAnimation() {
  // console.log("🚀 initProjectsScrollAnimation called");

  if (projectsScrollTrigger) {
    // console.log("🧹 Cleaning up existing ScrollTrigger");
    projectsScrollTrigger.kill();
    projectsScrollTrigger = null;
    lastProgress = -1;
    isUpdating = false;

    if (pendingUpdate !== null) {
      cancelAnimationFrame(pendingUpdate);
      pendingUpdate = null;
    }
  }

  const initAnimation = async () => {
    // console.log("🔍 Looking for projects section...");
    const projectsSection = document.querySelector("[data-projects-section]");

    if (!projectsSection) {
      console.error("❌ Projects section not found!");
      return;
    }
    // console.log("✅ Projects section found:", projectsSection);

    const allPanels = projectsSection.querySelectorAll("[data-project-panel]");
    // console.log(`📋 Found ${allPanels.length} total panels`);

    const panels = Array.from(allPanels).filter(
      (p: any) => window.getComputedStyle(p).display !== "none"
    );
    // console.log(`👁️ Found ${panels.length} visible panels`);

    if (panels.length === 0) {
      console.error("❌ No visible panels found");
      return;
    }

    await waitForProjectScenes(panels.length);

    const totalPanels = panels.length;
    // console.log(`🎬 Initializing scroll animation for ${totalPanels} panels`);

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
    
    const stickyContainer = projectsSection.querySelector(".sticky");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: projectsSection,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        pin: stickyContainer || true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        preventOverlaps: true,
        snap: {
          snapTo: 1 / (totalPanels - 1),
          duration: { min: 0.2, max: 0.6 },
          delay: 0.05,
          ease: "power2.inOut",
        },
        id: "projects-scroll",
        onUpdate: (self) => {
          throttledScrollUpdate(totalPanels, self.progress);
        },
      },
    });

    panels.forEach((panel: any, index) => {
      const image = panel.querySelector("[data-project-image]");
      const content = panel.querySelector("[data-project-content]");
      const sceneData = (window as any)[`__projectScene_${index}`];
      const anim = randomAnimations[index % randomAnimations.length];

      const duration = 2.5;
      const transitionDuration = 1.2;

      if (index === 0) {
        const exitStart = duration - transitionDuration;

        tl.to(panel, { opacity: 0, duration: transitionDuration, ease: "power2.inOut" }, exitStart);
        if (image) {
          tl.to(image, { opacity: 0, ...anim.exit, duration: transitionDuration, ease: "power2.inOut" }, exitStart);
        }
        if (content) {
          tl.to(content, {
            opacity: 0,
            x: anim.exit.x ? -anim.exit.x : 0,
            y: anim.exit.y ? -anim.exit.y : 0,
            rotation: anim.exit.rotation ? -anim.exit.rotation : 0,
            rotationY: anim.exit.rotationY ? -anim.exit.rotationY : 0,
            duration: transitionDuration,
            ease: "power2.inOut",
          }, exitStart);
        }

        if (sceneData?.laptop && sceneData?.laptopOriginal) {
          tl.to(sceneData.laptop.rotation, {
            x: sceneData.laptopOriginal.rot.x + 0.4,
            y: sceneData.laptopOriginal.rot.y - 0.6,
            z: sceneData.laptopOriginal.rot.z + 0.3,
            duration: transitionDuration,
            ease: "power2.in",
          }, exitStart);
          tl.to(sceneData.laptop.position, {
            x: sceneData.laptopOriginal.pos.x,
            y: sceneData.laptopOriginal.pos.y - 80,
            z: sceneData.laptopOriginal.pos.z - 40,
            duration: transitionDuration,
            ease: "power2.in",
          }, exitStart);
        }
        if (sceneData?.iphone && sceneData?.iphoneOriginal) {
          tl.to(sceneData.iphone.rotation, {
            x: sceneData.iphoneOriginal.rot.x - 0.5,
            y: sceneData.iphoneOriginal.rot.y + 0.7,
            z: sceneData.iphoneOriginal.rot.z - 0.4,
            duration: transitionDuration,
            ease: "power2.in",
          }, exitStart);
          tl.to(sceneData.iphone.position, {
            x: sceneData.iphoneOriginal.pos.x,
            y: sceneData.iphoneOriginal.pos.y + 60,
            z: sceneData.iphoneOriginal.pos.z + 30,
            duration: transitionDuration,
            ease: "power2.in",
          }, exitStart);
        }
      } else {
        const enterStart = index * duration;
        const exitStart = enterStart + duration - transitionDuration;

        tl.to(panel, {
          opacity: 1,
          zIndex: 2000,
          duration: transitionDuration,
          ease: "power2.inOut",
        }, enterStart);

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
            ease: "back.out(1.4)",
          }, enterStart + 0.05);
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
            ease: "back.out(1.2)",
          }, enterStart + 0.1);
        }

        if (sceneData?.laptop && sceneData?.laptopOriginal) {
          tl.fromTo(sceneData.laptop.rotation, {
            x: sceneData.laptopOriginal.rot.x - 0.5,
            y: sceneData.laptopOriginal.rot.y + 0.8,
            z: sceneData.laptopOriginal.rot.z - 0.4,
          }, {
            x: sceneData.laptopOriginal.rot.x,
            y: sceneData.laptopOriginal.rot.y,
            z: sceneData.laptopOriginal.rot.z,
            duration: transitionDuration * 0.9,
            ease: "back.out(1.2)",
          }, enterStart + 0.3);
          
          tl.fromTo(sceneData.laptop.position, {
            x: sceneData.laptopOriginal.pos.x,
            y: sceneData.laptopOriginal.pos.y - 90,
            z: sceneData.laptopOriginal.pos.z - 50,
          }, {
            x: sceneData.laptopOriginal.pos.x,
            y: sceneData.laptopOriginal.pos.y,
            z: sceneData.laptopOriginal.pos.z,
            duration: transitionDuration * 0.9,
            ease: "back.out(1.2)",
          }, enterStart + 0.3);
        }
        
        if (sceneData?.iphone && sceneData?.iphoneOriginal) {
          tl.fromTo(sceneData.iphone.rotation, {
            x: sceneData.iphoneOriginal.rot.x + 0.6,
            y: sceneData.iphoneOriginal.rot.y - 0.9,
            z: sceneData.iphoneOriginal.rot.z + 0.5,
          }, {
            x: sceneData.iphoneOriginal.rot.x,
            y: sceneData.iphoneOriginal.rot.y,
            z: sceneData.iphoneOriginal.rot.z,
            duration: transitionDuration * 0.9,
            ease: "back.out(1.3)",
          }, enterStart + 0.4);
          
          tl.fromTo(sceneData.iphone.position, {
            x: sceneData.iphoneOriginal.pos.x,
            y: sceneData.iphoneOriginal.pos.y - 80,
            z: sceneData.iphoneOriginal.pos.z + 40,
          }, {
            x: sceneData.iphoneOriginal.pos.x,
            y: sceneData.iphoneOriginal.pos.y,
            z: sceneData.iphoneOriginal.pos.z,
            duration: transitionDuration * 0.9,
            ease: "back.out(1.3)",
          }, enterStart + 0.4);
        }

        if (index < totalPanels - 1) {
          tl.to(panel, {
            opacity: 0,
            duration: transitionDuration,
            ease: "power2.inOut"
          }, exitStart);

          if (image) {
            tl.to(image, {
              opacity: 0,
              ...anim.exit,
              duration: transitionDuration,
              ease: "power2.inOut",
            }, exitStart);
          }

          if (content) {
            tl.to(content, {
              opacity: 0,
              x: anim.exit.x ? -anim.exit.x : 0,
              y: anim.exit.y ? -anim.exit.y : 0,
              rotation: anim.exit.rotation ? -anim.exit.rotation : 0,
              rotationY: anim.exit.rotationY ? -anim.exit.rotationY : 0,
              duration: transitionDuration,
              ease: "power2.inOut",
            }, exitStart);
          }

          if (sceneData?.laptop && sceneData?.laptopOriginal) {
            tl.to(sceneData.laptop.rotation, {
              x: sceneData.laptopOriginal.rot.x + 0.3,
              y: sceneData.laptopOriginal.rot.y - 0.7,
              z: sceneData.laptopOriginal.rot.z + 0.4,
              duration: transitionDuration,
              ease: "power2.in",
            }, exitStart);
            
            tl.to(sceneData.laptop.position, {
              x: sceneData.laptopOriginal.pos.x,
              y: sceneData.laptopOriginal.pos.y - 80,
              z: sceneData.laptopOriginal.pos.z - 45,
              duration: transitionDuration,
              ease: "power2.in",
            }, exitStart);
          }
          
          if (sceneData?.iphone && sceneData?.iphoneOriginal) {
            tl.to(sceneData.iphone.rotation, {
              x: sceneData.iphoneOriginal.rot.x - 0.4,
              y: sceneData.iphoneOriginal.rot.y + 0.8,
              z: sceneData.iphoneOriginal.rot.z - 0.5,
              duration: transitionDuration,
              ease: "power2.in",
            }, exitStart);
            
            tl.to(sceneData.iphone.position, {
              x: sceneData.iphoneOriginal.pos.x,
              y: sceneData.iphoneOriginal.pos.y - 70,
              z: sceneData.iphoneOriginal.pos.z + 35,
              duration: transitionDuration,
              ease: "power2.in",
            }, exitStart);
          }
        }
      }
    });

    if (tl.scrollTrigger) {
      projectsScrollTrigger = tl.scrollTrigger as ScrollTrigger;
      // console.log("✅ ScrollTrigger initialized successfully!");
      // console.log("ScrollTrigger info:", {
      //   start: tl.scrollTrigger.start,
      //   end: tl.scrollTrigger.end,
      //   pin: tl.scrollTrigger.pin,
      // });
    } else {
      console.error("❌ ScrollTrigger was not created!");
    }
  };

  initAnimation();

  return () => {
    // console.log("🧹 Cleanup function called");
    if (projectsScrollTrigger) {
      projectsScrollTrigger.kill();
      projectsScrollTrigger = null;
      lastProgress = -1;
      isUpdating = false;
      // console.log("✅ ScrollTrigger cleaned up");
    }

    if (pendingUpdate !== null) {
      cancelAnimationFrame(pendingUpdate);
      pendingUpdate = null;
    }
  };
}