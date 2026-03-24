import { gsap } from "@/lib/gsap";
import { getAllProjects } from "@/data/projects";
import {
  morphPortfolioToExpanded,
  morphPortfolioToCta,
  morphPortfolioToProjects,
} from "@/utils/animations/terminal-morph";
import {
  getProjectsIntroSize,
  waitForStablePortfolioProjectMeasurement,
} from "@/utils/terminal-sizes";
import {
  typewriteIntroPanel,
  typewriteProjectPanel,
  typewriteCtaPanel,
  preparePanel,
} from "@/utils/animations/typewriter";
import { motionDuration, prefersReducedMotion } from "@/utils/motion";

let wheelHandler: ((e: WheelEvent) => void) | null = null;
let introWheelHandlerRef: ((e: WheelEvent) => void) | null = null;
let touchHandler: { start: (e: TouchEvent) => void; end: (e: TouchEvent) => void } | null = null;
let introTouchHandlerRef: { start: (e: TouchEvent) => void; end: (e: TouchEvent) => void } | null = null;
let isExpanded = false;
let isStartingExpansion = false;
let isPortfolioActive = false; // Track if portfolio section is currently active
let currentSlideIndex = 0;
let isAnimating = false;
let wheelAccumulator = 0;
let lastSlideChangeTime = 0;
let pendingStartRequest = false; // Track if start was requested before scene ready
const WHEEL_THRESHOLD = 150; // Minimum wheel delta to trigger slide change
const SLIDE_COOLDOWN = 600; // Minimum ms between slide changes (wheel)
const TOUCH_SLIDE_COOLDOWN = 900; // Minimum ms between slide changes (touch)

function canScrollPortfolioContent(contentZone: HTMLElement | null, deltaY: number) {
  if (!contentZone) return false;
  if (contentZone.scrollHeight <= contentZone.clientHeight + 1) return false;

  if (deltaY > 0) {
    return contentZone.scrollTop + contentZone.clientHeight < contentZone.scrollHeight - 1;
  }

  if (deltaY < 0) {
    return contentZone.scrollTop > 1;
  }

  return false;
}

function setPanelAccessibilityState(panel: HTMLElement, isActive: boolean) {
  panel.setAttribute("aria-hidden", isActive ? "false" : "true");

  if (isActive) {
    panel.removeAttribute("inert");
  } else {
    panel.setAttribute("inert", "");
  }
}

function focusPanelTarget(panel: HTMLElement) {
  window.setTimeout(() => {
    const preferredTarget =
      panel.querySelector<HTMLElement>("[data-contact-cta-btn]") ||
      panel.querySelector<HTMLElement>("[data-next-project-btn]") ||
      panel;

    preferredTarget.focus();
  }, 120);
}

function getPanelTransitionFrom(isForward: boolean) {
  if (prefersReducedMotion()) {
    return { opacity: 0, y: 0, scale: 1 };
  }

  return { opacity: 0, y: isForward ? 30 : -30, scale: 1 };
}

// Listen for reset event from terminal-morph (avoids circular dependency)
if (typeof window !== "undefined") {
  window.addEventListener("portfolioReset", () => {
    isExpanded = false;
    isStartingExpansion = false;
    currentSlideIndex = 0;
    isAnimating = false;
    wheelAccumulator = 0;
    lastSlideChangeTime = 0;
    pendingStartRequest = false;
    if (wheelHandler) {
      document.removeEventListener("wheel", wheelHandler);
      wheelHandler = null;
    }
    if (introWheelHandlerRef) {
      document.removeEventListener("wheel", introWheelHandlerRef);
      introWheelHandlerRef = null;
    }
    if (touchHandler) {
      document.removeEventListener("touchstart", touchHandler.start);
      document.removeEventListener("touchend", touchHandler.end);
      touchHandler = null;
    }
    if (introTouchHandlerRef) {
      document.removeEventListener("touchstart", introTouchHandlerRef.start);
      document.removeEventListener("touchend", introTouchHandlerRef.end);
      introTouchHandlerRef = null;
    }
  });

  // Listen for when portfolio section becomes visible to start intro typewriter
  window.addEventListener("portfolioVisible", () => {
    typewriteIntroPanel();
  });
}

/**
 * Reset portfolio state when re-entering the section
 */
export function resetPortfolioState() {
  if (wheelHandler) {
    document.removeEventListener("wheel", wheelHandler);
    wheelHandler = null;
  }
  if (introWheelHandlerRef) {
    document.removeEventListener("wheel", introWheelHandlerRef);
    introWheelHandlerRef = null;
  }
  if (touchHandler) {
    document.removeEventListener("touchstart", touchHandler.start);
    document.removeEventListener("touchend", touchHandler.end);
    touchHandler = null;
  }
  if (introTouchHandlerRef) {
    document.removeEventListener("touchstart", introTouchHandlerRef.start);
    document.removeEventListener("touchend", introTouchHandlerRef.end);
    introTouchHandlerRef = null;
  }
  isExpanded = false;
  isStartingExpansion = false;
  currentSlideIndex = 0;
  isAnimating = false;
  wheelAccumulator = 0;
  lastSlideChangeTime = 0;
  pendingStartRequest = false;

  const portfolioSection = document.querySelector("[data-portfolio-section]") as HTMLElement | null;
  const portfolioTerminal = document.querySelector("[data-portfolio-terminal]") as HTMLElement | null;
  const introPanel = document.querySelector("[data-intro-panel]") as HTMLElement | null;
  const projectPanels = portfolioSection?.querySelectorAll("[data-project-panel]") || [];
  const portfolio3DContainer = document.querySelector("[data-portfolio-3d-container]") as HTMLElement;
  const scrollIndicator = document.querySelector("[data-scroll-indicator]") as HTMLElement;
  const projectCounter = portfolioTerminal?.querySelector("[data-project-counter]") as HTMLElement | null;
  const contentZone = document.querySelector("[data-portfolio-content-zone]") as HTMLElement | null;

  if (portfolioTerminal) {
    const introSize = getProjectsIntroSize();
    gsap.set(portfolioTerminal, {
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      width: introSize.width,
      height: introSize.height,
    });
  }

  if (introPanel) {
    gsap.set(introPanel, { opacity: 1, pointerEvents: "auto" });
    setPanelAccessibilityState(introPanel, true);
  }

  projectPanels.forEach((panel: Element) => {
    const panelValue = parseInt((panel as HTMLElement).dataset.projectPanel || "0", 10);
    if (panelValue === 0) return; // skip intro
    gsap.set(panel, { opacity: 0, pointerEvents: "none", y: 0 });
    setPanelAccessibilityState(panel as HTMLElement, false);
  });

  if (portfolio3DContainer) {
    gsap.set(portfolio3DContainer, { opacity: 0, pointerEvents: "none" });
  }

  if (scrollIndicator) {
    gsap.set(scrollIndicator, { opacity: 0, pointerEvents: "none" });
  }

  if (projectCounter) {
    gsap.set(projectCounter, { opacity: 0 });
  }

  if (contentZone) {
    contentZone.style.pointerEvents = "none";
  }

  const portfolioScene = (window as any).__portfolioScene;
  if (portfolioScene?.projectModels) {
    portfolioScene.projectModels.forEach((modelData: any) => {
      gsap.set(modelData.wrapper.scale, { x: 0.01, y: 0.01, z: 0.01 });
      modelData.wrapper.visible = false;
      modelData.wrapper.position.z = -5000;
    });
  }
}

export function initPortfolioScroll() {
  if (wheelHandler) {
    document.removeEventListener("wheel", wheelHandler);
    wheelHandler = null;
  }
  let startRequestHandlerRef: ((event: Event) => void) | null = null;
  let keyboardNavigateHandlerRef: ((event: Event) => void) | null = null;
  isExpanded = false;
  isStartingExpansion = false;
  currentSlideIndex = 0;
  isAnimating = false;
  wheelAccumulator = 0;

  // Setup intro panel scroll handler IMMEDIATELY (before scene loads)
  let introWheelAccumulator = 0;
  let introWheelTimeout: ReturnType<typeof setTimeout> | null = null;
  const INTRO_WHEEL_THRESHOLD = 150;

  const introWheelHandler = (e: WheelEvent) => {
    const portfolioSection = document.querySelector("[data-portfolio-section]") as HTMLElement | null;
    if (!portfolioSection) {
      console.log("intro scroll: no portfolio section");
      return;
    }

    // Check if portfolio section is visible
    const style = window.getComputedStyle(portfolioSection);
    const isHidden = style.visibility === "hidden";
    const isTransparent = parseFloat(style.opacity) < 0.1;

    console.log("intro scroll: visibility=", style.visibility, "opacity=", style.opacity, "isExpanded=", isExpanded, "deltaY=", e.deltaY);

    if (isHidden || isTransparent) {
      console.log("intro scroll: section not visible");
      return;
    }

    if (isExpanded || isStartingExpansion) {
      console.log("intro scroll: already expanded");
      return;
    }

    // Only respond to scroll down
    if (e.deltaY <= 0) {
      console.log("intro scroll: scrolling up, ignoring");
      return;
    }

    introWheelAccumulator += e.deltaY;
    console.log("intro scroll: accumulator=", introWheelAccumulator, "threshold=", INTRO_WHEEL_THRESHOLD);

    if (introWheelTimeout) {
      clearTimeout(introWheelTimeout);
    }

    introWheelTimeout = setTimeout(() => {
      introWheelAccumulator = 0;
    }, 200);

    if (introWheelAccumulator >= INTRO_WHEEL_THRESHOLD) {
      console.log("intro scroll: THRESHOLD REACHED, triggering start");
      introWheelAccumulator = 0;
      if (introWheelTimeout) {
        clearTimeout(introWheelTimeout);
        introWheelTimeout = null;
      }
      // Set flag and dispatch event to trigger start
      pendingStartRequest = true;
      window.dispatchEvent(new CustomEvent("portfolioStartRequested"));
    }
  };

  // Remove old handler if exists
  if (introWheelHandlerRef) {
    document.removeEventListener("wheel", introWheelHandlerRef);
  }
  introWheelHandlerRef = introWheelHandler;
  document.addEventListener("wheel", introWheelHandler, { passive: true });

  // Touch handler for intro panel (mobile swipe up to start exploring)
  let introTouchStart: { y: number; time: number } | null = null;
  const INTRO_TOUCH_THRESHOLD = 50; // px - lowered for easier detection
  const INTRO_TOUCH_MAX_TIME = 800; // ms - increased for easier detection

  const introTouchStartHandler = (e: TouchEvent) => {
    introTouchStart = { y: e.touches[0].clientY, time: Date.now() };
    console.log("intro touch START:", introTouchStart.y);
  };

  const introTouchEndHandler = (e: TouchEvent) => {
    if (!introTouchStart) {
      console.log("intro touch END: no start recorded");
      return;
    }

    const portfolioSection = document.querySelector("[data-portfolio-section]") as HTMLElement | null;
    if (!portfolioSection) {
      console.log("intro touch END: no portfolio section found");
      introTouchStart = null;
      return;
    }

    const style = window.getComputedStyle(portfolioSection);
    const isHidden = style.visibility === "hidden";
    const opacity = parseFloat(style.opacity);
    console.log("intro touch END: visibility=", style.visibility, "opacity=", opacity, "isExpanded=", isExpanded);

    if (isHidden || opacity < 0.1) {
      console.log("intro touch END: section not visible");
      introTouchStart = null;
      return;
    }
    if (isExpanded || isStartingExpansion) {
      console.log("intro touch END: already expanded");
      introTouchStart = null;
      return;
    }

    const deltaY = introTouchStart.y - e.changedTouches[0].clientY; // positive = swipe up
    const elapsed = Date.now() - introTouchStart.time;
    console.log("intro touch END: deltaY=", deltaY, "elapsed=", elapsed, "threshold=", INTRO_TOUCH_THRESHOLD, "maxTime=", INTRO_TOUCH_MAX_TIME);
    introTouchStart = null;

    if (deltaY > INTRO_TOUCH_THRESHOLD && elapsed < INTRO_TOUCH_MAX_TIME) {
      console.log("intro touch END: TRIGGERING START!");
      pendingStartRequest = true;
      window.dispatchEvent(new CustomEvent("portfolioStartRequested"));
    } else {
      console.log("intro touch END: swipe not strong/fast enough");
    }
  };

  if (introTouchHandlerRef) {
    document.removeEventListener("touchstart", introTouchHandlerRef.start);
    document.removeEventListener("touchend", introTouchHandlerRef.end);
  }
  introTouchHandlerRef = { start: introTouchStartHandler, end: introTouchEndHandler };
  document.addEventListener("touchstart", introTouchStartHandler, { passive: true });
  document.addEventListener("touchend", introTouchEndHandler, { passive: true });

  // Set up button click handler IMMEDIATELY (before scene loads)
  // This dispatches portfolioStartRequested which will be handled when scene is ready
  const portfolioSection = document.querySelector("[data-portfolio-section]") as HTMLElement | null;
  const startBtnEarly = document.querySelector("[data-start-projects-btn]") as HTMLElement | null;

  if (startBtnEarly) {
    startBtnEarly.addEventListener("click", () => {
      if (isExpanded) return;
      pendingStartRequest = true;
      window.dispatchEvent(new CustomEvent("portfolioStartRequested"));
    });
  }

  const waitForScene = () => {
    const portfolioScene = (window as any).__portfolioScene;
    if (!portfolioScene || !portfolioScene.isReady) {
      requestAnimationFrame(waitForScene);
      return;
    }

    const portfolioSection = document.querySelector("[data-portfolio-section]") as HTMLElement | null;
    if (!portfolioSection) return;

    const projects = getAllProjects().slice(0, 5);
    const portfolioTerminal = portfolioSection.querySelector("[data-portfolio-terminal]") as HTMLElement | null;
    const projectPanels = portfolioSection.querySelectorAll("[data-project-panel]") || [];
    const { projectModels } = portfolioScene;

    const introPanel = document.querySelector("[data-intro-panel]") as HTMLElement | null;
    const portfolio3DContainer = portfolioSection.querySelector("[data-portfolio-3d-container]") as HTMLElement;
    const scrollIndicator = document.querySelector("[data-scroll-indicator]") as HTMLElement;
    const projectCounter = portfolioTerminal?.querySelector("[data-project-counter]") as HTMLElement | null;
    const counterNumber = projectCounter?.querySelector("[data-counter-number]");
    const counterName = projectCounter?.querySelector("[data-counter-name]");
    const contentZone = document.querySelector("[data-portfolio-content-zone]") as HTMLElement | null;

    const totalProjects = projects.length;
    const totalSlides = totalProjects + 1; // projects + CTA

    // Initialize
    gsap.set(introPanel, { opacity: 1, pointerEvents: "auto" });
    if (introPanel) {
      setPanelAccessibilityState(introPanel, true);
    }
    if (portfolio3DContainer) {
      gsap.set(portfolio3DContainer, { opacity: 0, pointerEvents: "none" });
    }
    if (scrollIndicator) {
      gsap.set(scrollIndicator, { opacity: 0, pointerEvents: "none" });
    }

    projectPanels.forEach((panel: Element) => {
      const panelValue = parseInt((panel as HTMLElement).dataset.projectPanel || "0", 10);
      if (panelValue === 0) return; // skip intro
      gsap.set(panel, { opacity: 0, pointerEvents: "none" });
      setPanelAccessibilityState(panel as HTMLElement, false);
    });

    projectModels.forEach((modelData: any) => {
      gsap.set(modelData.wrapper.scale, { x: 0.01, y: 0.01, z: 0.01 });
      modelData.wrapper.visible = false;
    });

    // Navigate to a specific slide
    const goToSlide = (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= totalSlides) return;
      if (targetIndex === currentSlideIndex) return;
      if (isAnimating) return;

      isAnimating = true;
      const fromIndex = currentSlideIndex;
      currentSlideIndex = targetIndex;

      // Hide all panels except target (use data attribute, not NodeList index, since DOM order varies with portal)
      projectPanels.forEach((panel: Element) => {
        const panelValue = parseInt((panel as HTMLElement).dataset.projectPanel || "0", 10);
        if (panelValue === 0) return; // skip intro
        const panelSlideIndex = panelValue - 1;
        if (panelSlideIndex !== targetIndex) {
          gsap.set(panel, { opacity: 0, y: 0, pointerEvents: "none" });
          setPanelAccessibilityState(panel as HTMLElement, false);
        }
      });

      // Hide previous 3D model
      if (fromIndex < totalProjects && fromIndex !== targetIndex) {
        const prevModel = projectModels[fromIndex];
        if (prevModel) {
          gsap.killTweensOf(prevModel.wrapper.scale);
          gsap.killTweensOf(prevModel.wrapper.rotation);
          gsap.set(prevModel.wrapper.scale, { x: 0.01, y: 0.01, z: 0.01 });
          prevModel.wrapper.visible = false;
          prevModel.wrapper.position.z = -5000;
        }
      }

      // Show new panel
      const newPanelIndex = targetIndex + 1;
      const newPanel = portfolioSection.querySelector(`[data-project-panel="${newPanelIndex}"]`) as HTMLElement | null;
      if (newPanel) {
        preparePanel(`[data-project-panel="${newPanelIndex}"]`);
        setPanelAccessibilityState(newPanel, true);

        gsap.fromTo(
          newPanel,
          getPanelTransitionFrom(fromIndex < targetIndex),
          {
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: "auto",
            duration: motionDuration(0.4),
            ease: "power3.out",
            onComplete: () => {
              isAnimating = false;
              if (targetIndex < totalProjects) {
                typewriteProjectPanel(targetIndex);
                focusPanelTarget(newPanel);
              } else if (targetIndex === totalProjects) {
                typewriteCtaPanel(totalProjects);
                focusPanelTarget(newPanel);
              }
            },
          }
        );
      } else {
        isAnimating = false;
      }

      // Show new 3D model
      if (targetIndex < totalProjects) {
        const newModel = projectModels[targetIndex];
        if (newModel) {
          newModel.wrapper.visible = true;
          newModel.wrapper.position.z = 0;
          gsap.fromTo(
            newModel.wrapper.scale,
            { x: 0.3, y: 0.3, z: 0.3 },
            { x: 1, y: 1, z: 1, duration: 0.5, delay: 0.1, ease: "expo.out" }
          );
          gsap.fromTo(
            newModel.wrapper.rotation,
            { y: fromIndex < targetIndex ? -0.3 : 0.3 },
            { y: 0, duration: 0.5, delay: 0.1, ease: "power3.out" }
          );
        }
      }

      // Update counter
      const safeProjectIndex = Math.min(targetIndex, totalProjects - 1);
      if (counterNumber && counterName && targetIndex < totalProjects) {
        counterNumber.textContent = (safeProjectIndex + 1).toString().padStart(2, "0");
        counterName.textContent = projects[safeProjectIndex]?.client || "";
      }
      if (projectCounter) {
        projectCounter.style.opacity = targetIndex < totalProjects ? "1" : "0";
      }
      if (scrollIndicator) {
        scrollIndicator.style.opacity = targetIndex < totalSlides - 1 ? "1" : "0";
      }
      if (contentZone) {
        contentZone.style.pointerEvents = targetIndex < totalProjects ? "auto" : "none";
      }

      // Handle CTA slide - morph terminal to center
      if (targetIndex === totalProjects) {
        morphPortfolioToCta();
      } else if (fromIndex === totalProjects) {
        // Coming back from CTA, morph terminal back to left
        morphPortfolioToProjects(targetIndex);
      }

      // Dispatch event
      portfolioScene.currentProject = safeProjectIndex;
      window.dispatchEvent(new CustomEvent("portfolioIndexChange", { detail: { index: targetIndex } }));
    };

    // Wheel handler for slide navigation
    const setupWheelNavigation = () => {
      wheelHandler = (e: WheelEvent) => {
        // Only handle when portfolio section is visible
        const rect = portfolioSection.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.5 || rect.bottom < window.innerHeight * 0.5) {
          return; // Portfolio not in view
        }

        if (!isExpanded) return;

        const eventTarget = e.target as Node | null;
        const isInsideContentZone =
          !!contentZone && !!eventTarget && contentZone.contains(eventTarget);
        if (isInsideContentZone && canScrollPortfolioContent(contentZone, e.deltaY)) {
          return;
        }

        e.preventDefault();

        if (isAnimating) return;

        // Check cooldown
        const now = Date.now();
        if (now - lastSlideChangeTime < SLIDE_COOLDOWN) {
          return;
        }

        wheelAccumulator += e.deltaY;

        if (Math.abs(wheelAccumulator) >= WHEEL_THRESHOLD) {
          const direction = wheelAccumulator > 0 ? 1 : -1;
          wheelAccumulator = 0;
          lastSlideChangeTime = now;

          const nextIndex = currentSlideIndex + direction;

          // If on CTA slide (last slide) and scrolling down, go to contact section
          if (currentSlideIndex === totalSlides - 1 && direction === 1) {
            window.dispatchEvent(new CustomEvent("goToContact"));
            return;
          }

          if (nextIndex >= 0 && nextIndex < totalSlides) {
            goToSlide(nextIndex);
          }
        }
      };

      document.addEventListener("wheel", wheelHandler, { passive: false });

      // Touch handler for slide navigation (mobile swipe between projects)
      let slideTouchStart: { y: number; time: number; startedInContentZone: boolean } | null = null;

      const slideTouchStartHandler = (e: TouchEvent) => {
        const touchTarget = e.target as Node | null;
        slideTouchStart = {
          y: e.touches[0].clientY,
          time: Date.now(),
          startedInContentZone:
            !!contentZone && !!touchTarget && contentZone.contains(touchTarget),
        };
      };

      const slideTouchEndHandler = (e: TouchEvent) => {
        if (!slideTouchStart) return;
        if (!isExpanded || isAnimating) return;

        const now = Date.now();
        if (now - lastSlideChangeTime < TOUCH_SLIDE_COOLDOWN) {
          slideTouchStart = null;
          return;
        }

        const deltaY = slideTouchStart.y - e.changedTouches[0].clientY;
        const elapsed = now - slideTouchStart.time;
        const startedInContentZone = slideTouchStart.startedInContentZone;
        slideTouchStart = null;

        if (Math.abs(deltaY) < 80 || elapsed > 500) return;
        if (startedInContentZone && canScrollPortfolioContent(contentZone, deltaY)) return;

        const direction = deltaY > 0 ? 1 : -1; // swipe up = next, swipe down = prev
        lastSlideChangeTime = now;

        // If on CTA slide and swiping up, go to contact
        if (currentSlideIndex === totalSlides - 1 && direction === 1) {
          window.dispatchEvent(new CustomEvent("goToContact"));
          return;
        }

        const nextIndex = currentSlideIndex + direction;
        if (nextIndex >= 0 && nextIndex < totalSlides) {
          goToSlide(nextIndex);
        }
      };

      if (touchHandler) {
        document.removeEventListener("touchstart", touchHandler.start);
        document.removeEventListener("touchend", touchHandler.end);
      }
      touchHandler = { start: slideTouchStartHandler, end: slideTouchEndHandler };
      document.addEventListener("touchstart", slideTouchStartHandler, { passive: true });
      document.addEventListener("touchend", slideTouchEndHandler, { passive: true });
    };

    // Handle Start button click
    const handleStartClick = async () => {
      if (isExpanded || isStartingExpansion) return;
      isStartingExpansion = true;

      const measuredHeight = await waitForStablePortfolioProjectMeasurement(0);
      if (measuredHeight === null || measuredHeight <= 0) {
        isStartingExpansion = false;
        return;
      }

      isExpanded = true;
      isStartingExpansion = false;
      if (introPanel) {
        setPanelAccessibilityState(introPanel, false);
      }

      morphPortfolioToExpanded(0, () => {
        if (contentZone) {
          contentZone.style.pointerEvents = "auto";
        }
        setupWheelNavigation();

        // Show first project panel
        const firstProjectPanel = portfolioSection.querySelector('[data-project-panel="1"]') as HTMLElement | null;
        if (firstProjectPanel) {
          preparePanel('[data-project-panel="1"]');
          setPanelAccessibilityState(firstProjectPanel, true);
          gsap.set(firstProjectPanel, getPanelTransitionFrom(true));

          gsap.to(firstProjectPanel, {
            opacity: 1,
            y: 0,
            pointerEvents: "auto",
            scale: 1,
            duration: motionDuration(0.4),
            ease: "power2.out",
            onComplete: () => {
              typewriteProjectPanel(0);
              focusPanelTarget(firstProjectPanel);
            },
          });
        }

        // Show first 3D model
        if (projectModels[0]) {
          projectModels[0].wrapper.visible = true;
          projectModels[0].wrapper.position.z = 0;
          gsap.to(projectModels[0].wrapper.scale, {
            x: 1, y: 1, z: 1,
            duration: motionDuration(0.6),
            ease: "back.out(1.5)",
          });
        }

        // Show counter
        if (projectCounter) {
          gsap.to(projectCounter, { opacity: 1, duration: 0.3 });
          if (counterNumber) counterNumber.textContent = "01";
          if (counterName) counterName.textContent = projects[0]?.client || "";
        }

        // Show scroll indicator
        if (scrollIndicator) {
          gsap.to(scrollIndicator, { opacity: 1, duration: 0.4 });
        }
      });
    };

    // Listen for scroll-triggered start request (also handles early button clicks)
    const handleStartRequest = () => {
      pendingStartRequest = false;
      (window as any).__portfolioPendingStart = false;
      handleStartClick();
    };
    startRequestHandlerRef = handleStartRequest;
    window.addEventListener("portfolioStartRequested", handleStartRequest);

    const handleKeyboardNavigate = (event: Event) => {
      const direction = (event as CustomEvent).detail?.direction;
      if (direction !== 1 && direction !== -1) return;

      if (!isExpanded) {
        if (direction === 1) {
          handleStartClick();
        }
        return;
      }

      if (isAnimating) return;

      const nextIndex = currentSlideIndex + direction;

      if (currentSlideIndex === totalSlides - 1 && direction === 1) {
        window.dispatchEvent(new CustomEvent("goToContact"));
        return;
      }

      if (nextIndex >= 0 && nextIndex < totalSlides) {
        goToSlide(nextIndex);
      }
    };
    keyboardNavigateHandlerRef = handleKeyboardNavigate;
    window.addEventListener("portfolioNavigate", handleKeyboardNavigate);

    // Check if start was requested before scene was ready (check both flags)
    if (pendingStartRequest || (window as any).__portfolioPendingStart) {
      pendingStartRequest = false;
      (window as any).__portfolioPendingStart = false;
      handleStartClick();
    }

    // Handle Next Project button clicks (panels are portaled, query from section)
    const nextProjectBtns = portfolioSection.querySelectorAll("[data-next-project-btn]") || [];
    nextProjectBtns.forEach((btn) => {
      btn.addEventListener("click", (e: Event) => {
        const button = e.currentTarget as HTMLElement;
        const currentIndex = parseInt(button.dataset.currentIndex || "0", 10);
        goToSlide(currentIndex + 1);
      });
    });

    // Handle Contact CTA button click
    const contactCtaBtn = portfolioSection.querySelector("[data-contact-cta-btn]") as HTMLElement | null;
    if (contactCtaBtn && contactCtaBtn.dataset.contactBound !== "true") {
      const handleContactActivate = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        window.dispatchEvent(new CustomEvent("goToContact"));
      };

      contactCtaBtn.dataset.contactBound = "true";
      contactCtaBtn.addEventListener("click", handleContactActivate);
      contactCtaBtn.addEventListener("touchend", handleContactActivate, { passive: false });
      contactCtaBtn.addEventListener("pointerup", handleContactActivate);
    }
  };

  waitForScene();

  return () => {
    if (keyboardNavigateHandlerRef) {
      window.removeEventListener("portfolioNavigate", keyboardNavigateHandlerRef);
      keyboardNavigateHandlerRef = null;
    }
    if (startRequestHandlerRef) {
      window.removeEventListener("portfolioStartRequested", startRequestHandlerRef);
      startRequestHandlerRef = null;
    }
    if (wheelHandler) {
      document.removeEventListener("wheel", wheelHandler);
      wheelHandler = null;
    }
    if (introWheelHandlerRef) {
      document.removeEventListener("wheel", introWheelHandlerRef);
      introWheelHandlerRef = null;
    }
    if (touchHandler) {
      document.removeEventListener("touchstart", touchHandler.start);
      document.removeEventListener("touchend", touchHandler.end);
      touchHandler = null;
    }
    if (introTouchHandlerRef) {
      document.removeEventListener("touchstart", introTouchHandlerRef.start);
      document.removeEventListener("touchend", introTouchHandlerRef.end);
      introTouchHandlerRef = null;
    }
    isExpanded = false;
    isStartingExpansion = false;
    currentSlideIndex = 0;
    isAnimating = false;
    wheelAccumulator = 0;
  };
}
