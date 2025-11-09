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

    console.log("✅ Portfolio scene ready, initializing scroll animations...");

    const portfolioSection = document.querySelector("[data-portfolio-section]");
    if (!portfolioSection) {
      console.error("❌ Portfolio section not found");
      return;
    }

    const projects = getAllProjects();
    const projectPanels = portfolioSection.querySelectorAll(
      "[data-project-panel]"
    );
    const { hexFloor, projectModels, camera } = portfolioScene;

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

    // Create explicit snap points
    const snapPoints: number[] = [];
    for (let i = 0; i <= totalProjects; i++) {
      snapPoints.push(i / totalProjects);
    }

    const isMobile = window.innerWidth < 768;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: portfolioSection,
        start: "top top",
        end: "bottom bottom",
        scrub: isMobile ? 0.8 : 0.3,
        snap: {
          snapTo: (progress) => {
            const index = progress * totalProjects;

            // Special handling for hero (first slide at index 0)
            if (index < 0.5) {
              // If in first half of hero section, snap to start
              return 0;
            }

            const rounded = Math.round(index);
            const fraction = Math.abs(index - rounded);

            // Only snap if we're reasonably close to a snap point (within 40%)
            if (fraction < 0.4) {
              return rounded / totalProjects;
            }
            // Otherwise stay where we are
            return progress;
          },
          duration: 0.5,
          delay: 0.3,
          ease: "power2.inOut"
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

      tl.to(
        hexFloor.rotation,
        { y: i * Math.PI * 0.35, duration: duration, ease: "sine.inOut" },
        slideProgress
      );
      tl.to(
        camera.position,
        {
          y: 80 + i * 30,
          duration: duration,
          ease: "sine.inOut",
          onUpdate: () => camera.lookAt(-50, 0, 0),
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
