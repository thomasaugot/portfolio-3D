// portfolio-scroll-animation.ts - SMOOTH SCRUB
import { gsap, ScrollTrigger } from "@/lib/animations";
import { getAllProjects } from "@/data/projects";

let portfolioScrollTrigger: ScrollTrigger | null = null;

export function initPortfolioScroll() {
  if (portfolioScrollTrigger) {
    portfolioScrollTrigger.kill();
    portfolioScrollTrigger = null;
  }

  const waitForScene = () => {
    const portfolioScene = (window as any).__portfolioScene;
    if (!portfolioScene || !portfolioScene.isReady) {
      console.log("⏳ Waiting for portfolio scene to be ready...");
      requestAnimationFrame(waitForScene);
      return;
    }

    const portfolioSection = document.querySelector("[data-portfolio-section]");
    if (!portfolioSection) {
      return;
    }

    const projects = getAllProjects();
    const projectPanels = portfolioSection.querySelectorAll(
      "[data-project-panel]"
    );
    const { hexFloor, projectModels, camera } = portfolioScene;

    console.log(`📋 Found ${projectPanels.length} project panels`);
    console.log(`📦 Found ${projectModels.length} project models`);

    const header = portfolioSection.querySelector("[data-projects-header]");
    const scrollHint = portfolioSection.querySelector("[data-scroll-hint]");
    const projectCounter = portfolioSection.querySelector(
      "[data-project-counter]"
    );
    const counterNumber = projectCounter?.querySelector(
      "[data-counter-number]"
    );
    const counterName = projectCounter?.querySelector("[data-counter-name]");

    projectPanels.forEach((panel: any) => {
      gsap.set(panel, { opacity: 0 });
      const badge = panel.querySelector("[data-project-badge]");
      const title = panel.querySelector("[data-project-title]");
      const description = panel.querySelector("[data-project-description]");
      const techs = panel.querySelector("[data-project-techs]");
      const button = panel.querySelector("[data-project-button]");
      if (badge) gsap.set(badge, { opacity: 0, y: 30 });
      if (title) gsap.set(title, { opacity: 0, y: 30 });
      if (description) gsap.set(description, { opacity: 0, y: 30 });
      if (techs) gsap.set(techs, { opacity: 0, y: 30 });
      if (button) gsap.set(button, { opacity: 0, y: 30 });
    });

    projectModels.forEach((modelData: any) => {
      gsap.set(modelData.wrapper.scale, { x: 0.01, y: 0.01, z: 0.01 });
      modelData.wrapper.visible = false;
    });

    const totalProjects = projects.length;
    const totalSlides = totalProjects + 1;
    const isMobile = window.innerWidth < 768;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: portfolioSection,
        start: "top top",
        end: "bottom bottom",
        scrub: isMobile ? 0.8 : 0.3,
        snap: {
          snapTo: (progress) => {
            const currentSlide = progress * totalProjects;
            const nearest = Math.round(currentSlide);
            const distanceFromNearest = Math.abs(currentSlide - nearest);

            // Only snap if we're VERY close to a snap point (within 8%)
            // If you're in the middle, stay there - NO SNAP
            if (distanceFromNearest > 0.08) {
              return progress; // Don't snap - stay exactly where you are
            }

            // SPECIAL RULE: If between hero (0) and first project (1)
            if (currentSlide >= 0 && currentSlide <= 1) {
              // If you're more than 30% into first project, snap to first project
              if (currentSlide >= 0.3) {
                return 1 / totalProjects; // First project
              } else if (currentSlide <= 0.08) {
                return 0; // Hero only if very close
              } else {
                return progress; // Stay in middle, don't snap
              }
            }

            // For all other slides, snap to nearest
            return Math.max(0, Math.min(totalProjects, nearest)) / totalProjects;
          },
          duration: 0.3,
          delay: 0,
          ease: "power2.out",
          inertia: false
        },
        pin: portfolioSection.querySelector(".sticky"),
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const currentIndex = Math.round(progress * totalProjects);
          const safeIndex = Math.min(currentIndex, projects.length - 1);

          projectModels.forEach((modelData: any, index: number) => {
            if (index === safeIndex && currentIndex < totalProjects) {
              modelData.wrapper.visible = true;
              modelData.wrapper.position.z = 0;
            } else {
              modelData.wrapper.visible = false;
              modelData.wrapper.position.z = -5000;
            }
          });

          if (counterNumber && counterName && currentIndex < totalProjects) {
            const project = projects[safeIndex];
            counterNumber.textContent = (safeIndex + 1)
              .toString()
              .padStart(2, "0");
            counterName.textContent = project.client;
          }

          portfolioScene.currentProject = safeIndex;
        },
      },
    });

    if (header) {
      tl.to(
        header,
        { opacity: 0, y: -50, duration: 0.02, ease: "power2.in" },
        0
      );
    }

    if (scrollHint) {
      tl.to(
        scrollHint,
        { opacity: 0, y: 20, duration: 0.02, ease: "power2.in" },
        0
      );
    }

    if (projectCounter) {
      tl.to(
        projectCounter,
        { opacity: 1, duration: 0.05, ease: "power2.out" },
        0.01
      );
    }

    for (let i = 0; i < totalSlides; i++) {
      const panel = projectPanels[i];
      const badge = panel?.querySelector("[data-project-badge]");
      const title = panel?.querySelector("[data-project-title]");
      const description = panel?.querySelector("[data-project-description]");
      const techs = panel?.querySelector("[data-project-techs]");
      const button = panel?.querySelector("[data-project-button]");

      if (i < totalProjects) {
        console.log(`Panel ${i}: badge=${!!badge}, title=${!!title}, desc=${!!description}, techs=${!!techs}, button=${!!button}`);
      }

      const slideProgress = i / totalProjects;
      const nextSlideProgress = (i + 1) / totalProjects;
      const duration = nextSlideProgress - slideProgress;

      if (i < totalProjects) {
        const modelData = projectModels[i];

        const startTime = slideProgress;

        tl.to(
          modelData.wrapper.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            duration: duration * 0.35,
            ease: "back.out(1.5)",
          },
          startTime
        );
        tl.to(
          panel,
          { opacity: 1, duration: duration * 0.25, ease: "power2.out" },
          startTime
        );

        if (badge)
          tl.to(
            badge,
            {
              opacity: 1,
              y: 0,
              duration: duration * 0.3,
              ease: "back.out(1.7)",
            },
            startTime + duration * 0.1
          );
        if (title)
          tl.to(
            title,
            {
              opacity: 1,
              y: 0,
              duration: duration * 0.3,
              ease: "back.out(1.7)",
            },
            startTime + duration * 0.15
          );
        if (description)
          tl.to(
            description,
            {
              opacity: 1,
              y: 0,
              duration: duration * 0.3,
              ease: "back.out(1.7)",
            },
            startTime + duration * 0.2
          );
        if (techs)
          tl.to(
            techs,
            {
              opacity: 1,
              y: 0,
              duration: duration * 0.3,
              ease: "back.out(1.7)",
            },
            startTime + duration * 0.25
          );
        if (button)
          tl.to(
            button,
            {
              opacity: 1,
              y: 0,
              duration: duration * 0.3,
              ease: "back.out(1.7)",
            },
            startTime + duration * 0.3
          );

        const exitStart = slideProgress + duration * 0.65;

        if (button)
          tl.to(
            button,
            {
              opacity: 0,
              y: -30,
              duration: duration * 0.25,
              ease: "power2.in",
            },
            exitStart
          );
        if (techs)
          tl.to(
            techs,
            {
              opacity: 0,
              y: -30,
              duration: duration * 0.25,
              ease: "power2.in",
            },
            exitStart
          );
        if (description)
          tl.to(
            description,
            {
              opacity: 0,
              y: -30,
              duration: duration * 0.25,
              ease: "power2.in",
            },
            exitStart
          );
        if (title)
          tl.to(
            title,
            {
              opacity: 0,
              y: -30,
              duration: duration * 0.25,
              ease: "power2.in",
            },
            exitStart
          );
        if (badge)
          tl.to(
            badge,
            {
              opacity: 0,
              y: -30,
              duration: duration * 0.25,
              ease: "power2.in",
            },
            exitStart
          );

        tl.to(
          panel,
          { opacity: 0, duration: duration * 0.2, ease: "power2.in" },
          exitStart
        );
        tl.to(
          modelData.wrapper.scale,
          {
            x: 0.01,
            y: 0.01,
            z: 0.01,
            duration: duration * 0.25,
            ease: "back.in(1.5)",
          },
          exitStart
        );
      } else {
        if (projectCounter)
          tl.to(
            projectCounter,
            { opacity: 0, duration: duration * 0.2, ease: "power2.in" },
            slideProgress
          );
        tl.to(
          panel,
          { opacity: 1, duration: duration * 0.5, ease: "power2.out" },
          slideProgress
        );

        const ctaTitle = panel?.querySelector("[data-cta-title]");
        const ctaDescription = panel?.querySelector("[data-cta-description]");
        const ctaButtons = panel?.querySelector("[data-cta-buttons]");

        if (ctaTitle)
          tl.to(
            ctaTitle,
            {
              opacity: 1,
              y: 0,
              duration: duration * 0.4,
              ease: "back.out(1.7)",
            },
            slideProgress + duration * 0.2
          );
        if (ctaDescription)
          tl.to(
            ctaDescription,
            {
              opacity: 1,
              y: 0,
              duration: duration * 0.4,
              ease: "back.out(1.7)",
            },
            slideProgress + duration * 0.32
          );
        if (ctaButtons)
          tl.to(
            ctaButtons,
            {
              opacity: 1,
              y: 0,
              duration: duration * 0.4,
              ease: "back.out(1.7)",
            },
            slideProgress + duration * 0.44
          );
      }

      // Start rotation from first project (i=0), not second
      tl.to(
        hexFloor.rotation,
        { y: (i + 1) * Math.PI * 0.35, duration: duration, ease: "sine.inOut" },
        slideProgress
      );

      // Camera lookAt matches hex grid position
      const lookAtY = isMobile ? -40 : -120;
      const lookAtX = isMobile ? -30 : -50;
      tl.to(
        camera.position,
        {
          y: 80 + i * 30,
          duration: duration,
          ease: "sine.inOut",
          onUpdate: () => camera.lookAt(lookAtX, lookAtY, 0),
        },
        slideProgress
      );
    }

    if (tl.scrollTrigger)
      portfolioScrollTrigger = tl.scrollTrigger as ScrollTrigger;
  };

  waitForScene();
  return () => {
    if (portfolioScrollTrigger) {
      portfolioScrollTrigger.kill();
      portfolioScrollTrigger = null;
    }
  };
}
