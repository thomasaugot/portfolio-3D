/**
 * Terminal Morphing System
 * Single file handling all terminal position/size transitions
 * The terminal is ONE element that smoothly morphs between states
 */

import { gsap } from "@/lib/gsap";
import { animateLaptopOut, animateLaptopIn, animateHexFloorEntrance } from "@/utils/animations/scenes/hero-3d-scene";

/**
 * Reset portfolio visual state (inlined to avoid circular dependency)
 * Dispatches event so scroll animation can reset its internal state
 */
function resetPortfolioVisuals() {
  // Dispatch event so portfolio-scroll-animation can reset isExpanded
  window.dispatchEvent(new CustomEvent("portfolioReset"));

  const portfolioTerminal = document.querySelector("[data-portfolio-terminal]") as HTMLElement | null;
  const introPanel = portfolioTerminal?.querySelector("[data-intro-panel]") as HTMLElement;
  const projectPanels = portfolioTerminal?.querySelectorAll("[data-project-panel]") || [];
  const portfolio3DContainer = document.querySelector("[data-portfolio-3d-container]") as HTMLElement;
  const scrollIndicator = document.querySelector("[data-scroll-indicator]") as HTMLElement;
  const projectCounter = portfolioTerminal?.querySelector("[data-project-counter]") as HTMLElement | null;
  const scroller = document.querySelector("[data-portfolio-scroller]") as HTMLElement | null;

  // Reset terminal to centered intro position
  if (portfolioTerminal) {
    gsap.set(portfolioTerminal, {
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      width: "min(640px, 88vw)",
      height: "min(450px, 58vh)",
    });
  }

  // Show intro panel
  if (introPanel) {
    gsap.set(introPanel, { opacity: 1, pointerEvents: "auto" });
  }

  // Hide all project panels
  projectPanels.forEach((panel: Element, index: number) => {
    if (index === 0) return;
    gsap.set(panel, { opacity: 0, pointerEvents: "none", y: 0 });
  });

  // Hide 3D container and reset mobile positioning
  if (portfolio3DContainer) {
    gsap.set(portfolio3DContainer, {
      opacity: 0,
      pointerEvents: "none",
      clearProps: "left,right,top,bottom,height,width,zIndex,overflow",
    });
  }

  // Reset 3D zone to default state (in case it was collapsed for CTA)
  const threeDZone = document.querySelector("[data-portfolio-3d-zone]") as HTMLElement | null;
  if (threeDZone) {
    gsap.set(threeDZone, { height: "50%", display: "block" });
  }

  // Hide scroll indicator
  if (scrollIndicator) {
    gsap.set(scrollIndicator, { opacity: 0, pointerEvents: "none" });
  }

  // Hide counter
  if (projectCounter) {
    gsap.set(projectCounter, { opacity: 0 });
  }

  // Reset scroller
  if (scroller) {
    scroller.style.pointerEvents = "none";
    scroller.scrollTop = 0;
  }

  // Reset 3D models
  const portfolioScene = (window as any).__portfolioScene;
  if (portfolioScene?.projectModels) {
    portfolioScene.projectModels.forEach((modelData: any) => {
      gsap.set(modelData.wrapper.scale, { x: 0.01, y: 0.01, z: 0.01 });
      modelData.wrapper.visible = false;
      modelData.wrapper.position.z = -5000;
    });
  }
}

type TerminalState = "loader" | "hero" | "about" | "projects" | "contact";

// Selectors
const getTerminal = () => document.querySelector("[data-terminal-wrapper]") as HTMLElement | null;
const getTerminalShell = () => document.querySelector("[data-terminal-shell]") as HTMLElement | null;
const getHeroBackdrop = () => document.querySelector("[data-hero-backdrop]") as HTMLElement | null;
const getHero3D = () => document.querySelector("[data-hero-3d]") as HTMLElement | null;
const getAbout = () => document.querySelector("[data-about-section]") as HTMLElement | null;
const getProjects = () => document.querySelector("[data-canvas-projects]") as HTMLElement | null;
const getContact = () => document.querySelector("[data-contact-section]") as HTMLElement | null;

// Get viewport config
const getConfig = () => {
  const width = typeof window !== "undefined" ? window.innerWidth : 375;
  const height = typeof window !== "undefined" ? window.innerHeight : 812;
  const isPortrait = height > width;
  const isTabletSize = width >= 768 && width < 1024;
  return {
    width,
    height,
    // Portrait tablets use mobile layout; landscape tablets use desktop layout
    isMobile: width < 768 || (isTabletSize && isPortrait),
    isTablet: isTabletSize && !isPortrait,
    isDesktop: width >= 1024 || (isTabletSize && !isPortrait),
  };
};

const toPx = (value: number) => `${Math.round(value)}px`;

const baseConfig = (
  config: ReturnType<typeof getConfig>,
  widthValue: number,
  heightValue: number
) => ({
  left: "50%",
  top: "50%",
  xPercent: -50,
  yPercent: -50,
  x: 0,
  width: widthValue,
  height: heightValue,
  widthCss: toPx(widthValue),
  heightCss: toPx(heightValue),
  scale: 1,
});

// Terminal position configurations for each state (includes height so terminal doesn't grow with content)
export const getTerminalConfig = (state: TerminalState) => {
  const config = getConfig();
  const viewWidth = config.width;
  const viewHeight = config.height;

  const loaderWidth = Math.min(
    config.isMobile ? 320 : 360,
    viewWidth * (config.isMobile ? 0.88 : 0.32)
  );
  const loaderHeight = config.isMobile ? 220 : 250;

  // Mobile: use viewport-percentage sizing but cap max height so tall phones
  // don't end up with huge gaps between content and terminal bottom
  const heroWidth = config.isMobile
    ? Math.round(viewWidth * 0.92)
    : Math.min(config.isTablet ? Math.min(640, viewWidth * 0.8) : Math.min(600, viewWidth * 0.52), viewWidth);
  const heroHeight = config.isMobile
    ? Math.min(Math.round(viewHeight * 0.78), 520)
    : Math.min(config.isTablet ? Math.min(520, viewHeight * 0.7) : Math.min(560, viewHeight * 0.62), viewHeight);

  const aboutBaseWidth = config.isMobile
    ? Math.round(viewWidth * 0.92)
    : Math.min(config.isTablet ? Math.min(820, viewWidth * 0.8) : Math.min(1040, viewWidth * 0.5), viewWidth);
  const aboutBaseHeight = config.isMobile
    ? Math.min(Math.round(viewHeight * 0.78), 580)
    : Math.min(config.isTablet ? Math.min(520, viewHeight * 0.75) : Math.min(670, viewHeight * 0.74), viewHeight);
  const aboutWidth = Math.min(
    Math.max(aboutBaseWidth, config.isDesktop ? 820 : config.isMobile ? aboutBaseWidth : 600),
    viewWidth
  );
  const aboutHeight = Math.min(
    Math.max(aboutBaseHeight, config.isMobile ? aboutBaseHeight : heroHeight + 40),
    viewHeight
  );

  // Projects intro state (centered, compact for intro content)
  const projectsWidth = config.isMobile
    ? Math.round(viewWidth * 0.92)
    : Math.min(config.isTablet ? Math.min(620, viewWidth * 0.75) : Math.min(640, viewWidth * 0.42), viewWidth);
  const projectsHeight = config.isMobile
    ? Math.min(Math.round(viewHeight * 0.8), 500)
    : Math.min(config.isTablet ? Math.min(420, viewHeight * 0.55) : Math.min(450, viewHeight * 0.52), viewHeight);

  const contactWidth = config.isMobile
    ? Math.round(viewWidth * 0.92)
    : Math.min(config.isTablet ? Math.min(620, viewWidth * 0.8) : Math.min(680, viewWidth * 0.45), viewWidth);
  const contactHeight = config.isMobile
    ? Math.min(Math.round(viewHeight * 0.78), 580)
    : Math.min(config.isTablet ? Math.min(560, viewHeight * 0.72) : Math.min(620, viewHeight * 0.72), viewHeight);

  switch (state) {
    case "loader":
      return {
        ...baseConfig(config, loaderWidth, loaderHeight),
        widthCss: config.isMobile ? "min(320px, 88vw)" : toPx(loaderWidth),
        heightCss: toPx(loaderHeight),
        scale: 1,
      };
    case "hero":
      return {
        ...baseConfig(config, heroWidth, heroHeight),
        widthCss: toPx(heroWidth),
        heightCss: toPx(heroHeight),
        left: config.isDesktop ? "35%" : "50%",
        top: "50%",
      };
    case "about":
      return {
        ...baseConfig(config, aboutWidth, aboutHeight),
        widthCss: toPx(aboutWidth),
        heightCss: toPx(aboutHeight),
        left: config.isDesktop ? "65%" : "50%",
        top: "50%",
      };
    case "projects":
      return {
        ...baseConfig(config, projectsWidth, projectsHeight),
        widthCss: toPx(projectsWidth),
        heightCss: toPx(projectsHeight),
        left: config.isDesktop ? "35%" : "50%",
      };
    case "contact":
      return {
        ...baseConfig(config, contactWidth, contactHeight),
        widthCss: toPx(contactWidth),
        heightCss: toPx(contactHeight),
        left: config.isDesktop ? "62%" : "50%",
      };
  }
};

// Fade helper for sections
const fadeSection = (section: HTMLElement | null, show: boolean, delay = 0) => {
  if (!section) return;

  if (show) {
    gsap.set(section, { visibility: "visible", pointerEvents: "auto" });
    gsap.to(section, { opacity: 1, duration: 0.4, delay, ease: "power2.out" });
  } else {
    gsap.to(section, {
      opacity: 0,
      duration: 0.3,
      delay,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(section, { visibility: "hidden", pointerEvents: "none" });
      }
    });
  }
};

/**
 * Initialize terminal in loader state
 */
export function initTerminal() {
  const terminal = getTerminal();
  if (!terminal) return;

  const config = getTerminalConfig("loader");

  // GSAP handles ALL positioning - no CSS transforms to conflict with
  gsap.set(terminal, {
    position: "fixed",
    zIndex: 100,
    top: "50%",
    left: "50%",
    xPercent: -50,
    yPercent: -50,
    x: 0,
    width: config.widthCss,
    height: config.heightCss,
    scale: 1,
    opacity: 1,
  });

  // Hide all sections initially
  const about = getAbout();
  const projects = getProjects();
  const contact = getContact();

  [about, projects, contact].forEach(section => {
    if (section) {
      gsap.set(section, { visibility: "hidden", opacity: 0, pointerEvents: "none" });
    }
  });

  document.body.style.overflow = "hidden";
}

/**
 * Morph terminal from loader to hero state
 */
export function morphToHero(onComplete?: () => void) {
  const terminal = getTerminal();
  if (!terminal) {
    onComplete?.();
    return;
  }

  const config = getTerminalConfig("hero");

  // Animate terminal morph
  gsap.to(terminal, {
    left: config.left,
    top: config.top,
    xPercent: config.xPercent,
    yPercent: config.yPercent,
    x: config.x,
    width: config.width,
    height: config.height,
    scale: config.scale,
    duration: 0.8,
    ease: "power3.out",
    onComplete,
  });

  // Animate laptop in with tornado effect (slightly delayed)
  setTimeout(() => {
    animateLaptopIn();
  }, 200);

  // Ripple reveal hex floor from center outward
  animateHexFloorEntrance();
}

/**
 * Morph terminal to about state
 * First animates the 3D laptop out beautifully, then morphs the terminal
 */
export async function morphToAbout(onComplete?: () => void) {
  const terminal = getTerminal();
  const heroBackdrop = getHeroBackdrop();
  const about = getAbout();
  const projects = getProjects();
  const contact = getContact();

  if (!terminal) {
    onComplete?.();
    return gsap.timeline();
  }

  // Reset portfolio state if coming from expanded projects view
  resetPortfolioVisuals();

  // Fade out other sections immediately
  fadeSection(projects, false);
  fadeSection(contact, false);

  // Restore main terminal visibility (may have been hidden when in projects)
  gsap.set(terminal, { visibility: "visible", pointerEvents: "auto", opacity: 1 });

  // First: Animate the 3D laptop out beautifully
  // This runs the elegant float-up, rotate, scale-down animation
  await animateLaptopOut();

  // Rotate hex floor platform
  window.dispatchEvent(new CustomEvent("sectionTransition", { detail: { direction: 1 } }));

  // After laptop exits: Create the terminal morph timeline
  const config = getTerminalConfig("about");
  const tl = gsap.timeline();
  if (onComplete) {
    tl.eventCallback("onComplete", onComplete);
  }

  // Fade out hero backdrop
  if (heroBackdrop) {
    tl.to(heroBackdrop, { opacity: 0, duration: 0.4 }, 0);
  }

  // Morph terminal to right side
  tl.to(terminal, {
    left: config.left,
    top: config.top,
    xPercent: config.xPercent,
    yPercent: config.yPercent,
    x: config.x,
    width: config.width,
    height: config.height,
    scale: config.scale,
    duration: 0.7,
    ease: "power2.inOut",
  }, 0);

  // Fade in about section background elements
  tl.call(() => fadeSection(about, true), [], 0.3);

  // Portrait entrance - cinematic reveal with rotation and scale
  tl.fromTo("[data-about-portrait]",
    { scale: 0.6, opacity: 0, y: 80, rotateY: -25, rotateX: 10 },
    {
      scale: 1,
      opacity: 1,
      y: 0,
      rotateY: 0,
      rotateX: 0,
      duration: 1.2,
      ease: "back.out(1.4)"
    },
    0.3
  );

  // Glow orbs fade in with slight delay and float effect
  tl.fromTo("[data-about-glow]",
    { scale: 0.5, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" },
    0.35
  );

  return tl;
}

/**
 * Morph terminal to projects state
 * First animates the 3D laptop out, then morphs terminal and crossfades to portfolio
 */
export async function morphToProjects(onComplete?: () => void) {
  const terminal = getTerminal();
  const heroBackdrop = getHeroBackdrop();
  const about = getAbout();
  const projects = getProjects();
  const contact = getContact();

  if (!terminal) {
    onComplete?.();
    return gsap.timeline();
  }

  // Animate portrait exit with flair before fading section
  gsap.to("[data-about-portrait]", {
    scale: 0.7,
    opacity: 0,
    x: -100,
    rotateY: 25,
    duration: 0.5,
    ease: "power2.in"
  });
  gsap.to("[data-about-glow]", {
    scale: 0.5,
    opacity: 0,
    duration: 0.4,
    ease: "power2.in"
  });

  // Fade out other sections
  fadeSection(about, false);
  fadeSection(contact, false);

  // Reset portfolio state when re-entering projects section
  resetPortfolioVisuals();

  // First: Animate the 3D laptop out beautifully (if visible)
  await animateLaptopOut();

  // Rotate hex floor platform
  window.dispatchEvent(new CustomEvent("sectionTransition", { detail: { direction: 1 } }));

  const config = getTerminalConfig("projects");
  const tl = gsap.timeline();
  if (onComplete) {
    tl.eventCallback("onComplete", onComplete);
  }

  // Fade out hero backdrop
  if (heroBackdrop) {
    tl.to(heroBackdrop, { opacity: 0, duration: 0.4 }, 0);
  }

  // Morph terminal to projects intro position (centered)
  tl.to(terminal, {
    left: "50%",
    top: "50%",
    xPercent: -50,
    yPercent: -50,
    x: 0,
    width: config.width,
    height: config.height,
    scale: 1,
    duration: 0.7,
    ease: "power2.inOut",
  }, 0);

  // After morph completes, crossfade to portfolio terminal
  tl.call(() => {
    // Show projects section (portfolio terminal starts at same position)
    fadeSection(projects, true);
    document.body.style.overflow = "auto";

    // Fade out main terminal
    gsap.to(terminal, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(terminal, { visibility: "hidden", pointerEvents: "none" });
        // Trigger intro typewriter after section is visible
        window.dispatchEvent(new CustomEvent("portfolioVisible"));
      }
    });

    // Refresh ScrollTrigger
    requestAnimationFrame(() => {
      const { ScrollTrigger } = require("@/lib/gsap");
      ScrollTrigger.refresh();
    });
  }, [], 0.65);

  return tl;
}

/**
 * Morph terminal to contact state
 */
export async function morphToContact(onComplete?: () => void) {
  const terminal = getTerminal();
  const heroBackdrop = getHeroBackdrop();
  const about = getAbout();
  const projects = getProjects();
  const contact = getContact();

  if (!terminal) {
    onComplete?.();
    return gsap.timeline();
  }

  // Reset portfolio state if coming from expanded projects view
  resetPortfolioVisuals();

  // Animate portrait exit with flair before fading section
  gsap.to("[data-about-portrait]", {
    scale: 0.7,
    opacity: 0,
    x: -100,
    rotateY: 25,
    duration: 0.5,
    ease: "power2.in"
  });
  gsap.to("[data-about-glow]", {
    scale: 0.5,
    opacity: 0,
    duration: 0.4,
    ease: "power2.in"
  });

  // Fade out other sections
  fadeSection(about, false);
  fadeSection(projects, false);

  // Restore main terminal visibility (may have been hidden when in projects)
  gsap.set(terminal, { visibility: "visible", pointerEvents: "auto", opacity: 1 });

  // Animate the 3D laptop out (if visible)
  await animateLaptopOut();

  // Rotate hex floor platform
  window.dispatchEvent(new CustomEvent("sectionTransition", { detail: { direction: 1 } }));

  const config = getTerminalConfig("contact");
  const tl = gsap.timeline();
  if (onComplete) {
    tl.eventCallback("onComplete", onComplete);
  }

  document.body.style.overflow = "hidden";

  // Fade out hero backdrop
  if (heroBackdrop) {
    tl.to(heroBackdrop, { opacity: 0, duration: 0.4 }, 0);
  }

  // Morph terminal
  tl.to(terminal, {
    left: config.left,
    top: config.top,
    xPercent: config.xPercent,
    yPercent: config.yPercent,
    x: config.x,
    width: config.width,
    height: config.height,
    scale: config.scale,
    duration: 0.7,
    ease: "power2.inOut",
  }, 0);

  // Show contact
  tl.call(() => fadeSection(contact, true), [], 0.4);

  return tl;
}

/**
 * Morph terminal back to hero state
 */
export function morphToHeroFromAny(onComplete?: () => void) {
  const terminal = getTerminal();
  const heroBackdrop = getHeroBackdrop();
  const about = getAbout();
  const projects = getProjects();
  const contact = getContact();

  if (!terminal) return gsap.timeline();

  const config = getTerminalConfig("hero");
  const tl = gsap.timeline();
  if (onComplete) {
    tl.eventCallback("onComplete", onComplete);
  }

  document.body.style.overflow = "hidden";

  // Animate portrait exit with flair before fading section
  gsap.to("[data-about-portrait]", {
    scale: 0.7,
    opacity: 0,
    y: 50,
    rotateX: -15,
    duration: 0.5,
    ease: "power2.in"
  });
  gsap.to("[data-about-glow]", {
    scale: 0.5,
    opacity: 0,
    duration: 0.4,
    ease: "power2.in"
  });

  // Fade out all sections
  fadeSection(about, false);
  fadeSection(projects, false);
  fadeSection(contact, false);

  // Rotate hex floor platform (reverse direction going back to hero)
  window.dispatchEvent(new CustomEvent("sectionTransition", { detail: { direction: -1 } }));

  // Restore hero backdrop
  if (heroBackdrop) {
    tl.to(heroBackdrop, { opacity: 1, duration: 0.4 }, 0.2);
  }

  // Animate laptop back in with tornado effect
  animateLaptopIn();

  // Make terminal visible again (may have been hidden when in projects)
  gsap.set(terminal, { visibility: "visible", pointerEvents: "auto" });

  // Morph terminal back to hero with fade in
  tl.to(terminal, {
    left: config.left,
    top: config.top,
    xPercent: config.xPercent,
    yPercent: config.yPercent,
    x: config.x,
    width: config.width,
    height: config.height,
    scale: config.scale,
    opacity: 1,
    duration: 0.7,
    ease: "power2.inOut",
  }, 0);

  return tl;
}

/**
 * Center terminal (for prompts between sections)
 */
export function centerTerminal() {
  const terminal = getTerminal();
  if (!terminal) return;

  gsap.to(terminal, {
    left: "50%",
    top: "50%",
    xPercent: -50,
    yPercent: -50,
    x: 0,
    width: "min(560px, 88vw)",
    scale: 1,
    duration: 0.5,
    ease: "power3.out",
  });
}

/**
 * Get expanded projects terminal config (left side, taller for project content)
 * Used after user clicks CTA to start viewing projects
 */
export function getExpandedProjectsConfig() {
  const config = getConfig();
  const viewWidth = config.width;
  const viewHeight = config.height;

  const navbarHeight = 80;
  const padding = config.isMobile ? 16 : config.isTablet ? 24 : 32;

  // On mobile/tablet: full width, on desktop: generous width for content
  const expandedWidth = config.isDesktop
    ? Math.min(680, viewWidth * 0.45)
    : viewWidth - (padding * 2);

  // Terminal height - use most of available space for comfortable reading
  const availableHeight = viewHeight - navbarHeight - (padding * 2);
  const expandedHeight = config.isDesktop
    ? Math.min(640, availableHeight * 0.9)
    : config.isMobile
      ? Math.min(availableHeight * 0.93, availableHeight - 20)
      : Math.min(540, availableHeight * 0.92);

  // Position: left side on desktop (28% from left edge), centered on mobile/tablet
  const leftPosition = config.isDesktop
    ? viewWidth * 0.28
    : viewWidth / 2;

  // Vertically center in the available space below navbar
  const topPosition = navbarHeight + (availableHeight / 2);

  return {
    width: expandedWidth,
    height: expandedHeight,
    top: topPosition,
    left: leftPosition,
    xPercent: -50,
    yPercent: -50,
    scale: 1,
  };
}

/**
 * Morph portfolio terminal from centered intro to left side expanded state
 * Called when user clicks the "Start exploring" CTA button
 */
export function morphPortfolioToExpanded(onComplete?: () => void) {
  const portfolioTerminal = document.querySelector("[data-portfolio-terminal]") as HTMLElement | null;
  const portfolio3DContainer = document.querySelector("[data-portfolio-3d-container]") as HTMLElement | null;
  const scrollIndicator = document.querySelector("[data-scroll-indicator]") as HTMLElement | null;
  const introPanel = document.querySelector("[data-intro-panel]") as HTMLElement | null;

  if (!portfolioTerminal) {
    onComplete?.();
    return gsap.timeline();
  }

  const config = getExpandedProjectsConfig();
  const viewportConfig = getConfig();
  const tl = gsap.timeline();

  if (onComplete) {
    tl.eventCallback("onComplete", onComplete);
  }

  // Fade out intro panel content
  if (introPanel) {
    tl.to(introPanel, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(introPanel, { pointerEvents: "none" });
      }
    }, 0);
  }

  // Morph terminal to left side and make taller
  tl.to(portfolioTerminal, {
    left: config.left,
    top: config.top,
    xPercent: config.xPercent,
    yPercent: config.yPercent,
    width: config.width,
    height: config.height,
    duration: 0.7,
    ease: "power2.inOut",
  }, 0.2);

  // Fade in 3D container
  // Keep pointer-events: none so scroll events pass through to the scroller
  if (portfolio3DContainer) {
    if (viewportConfig.isMobile) {
      // On mobile: position 3D container to match the 3D zone (top half of terminal body)
      const terminalLeft = config.left - config.width / 2;
      const terminalTop = config.top - config.height / 2;
      const headerHeight = 44;
      const bodyHeight = config.height - headerHeight;
      const zoneHeight = bodyHeight / 2; // top half of terminal body
      tl.set(portfolio3DContainer, {
        left: `${terminalLeft}px`,
        right: "auto",
        top: `${terminalTop + headerHeight}px`,
        bottom: "auto",
        height: `${zoneHeight}px`,
        width: `${config.width}px`,
        zIndex: 51,
        overflow: "hidden",
      }, 0);
      // Trigger Three.js canvas resize to match new container dimensions
      tl.call(() => {
        requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
      }, [], 0.1);
    }
    tl.to(portfolio3DContainer, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    }, 0.5);
  }

  // Restore 3D zone visibility on mobile (in case it was collapsed for CTA)
  if (viewportConfig.isMobile) {
    const threeDZone = document.querySelector("[data-portfolio-3d-zone]") as HTMLElement | null;
    if (threeDZone) {
      tl.set(threeDZone, { height: "50%", display: "block" }, 0);
    }
  }

  // Fade in scroll indicator
  if (scrollIndicator) {
    tl.to(scrollIndicator, {
      opacity: 1,
      pointerEvents: "auto",
      duration: 0.4,
      ease: "power2.out",
    }, 0.7);
  }

  return tl;
}

/**
 * Hide terminal (fade out) - used when scrolling into expanded project view
 */
export function hideTerminal() {
  const terminal = getTerminal();
  if (!terminal) return;

  gsap.to(terminal, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      gsap.set(terminal, { visibility: "hidden", pointerEvents: "none" });
    }
  });
}

/**
 * Show terminal (fade in) - used when scrolling back to intro
 */
export function showTerminal() {
  const terminal = getTerminal();
  if (!terminal) return;

  gsap.set(terminal, { visibility: "visible", pointerEvents: "auto" });
  gsap.to(terminal, {
    opacity: 1,
    duration: 0.3,
    ease: "power2.out",
  });
}

/**
 * Get centered CTA config - used for final portfolio CTA slide
 */
export function getCtaConfig() {
  const config = getConfig();
  const viewWidth = config.width;
  const viewHeight = config.height;

  const navbarHeight = 80;
  const padding = config.isMobile ? 16 : config.isTablet ? 24 : 32;

  // Centered, slightly larger terminal for CTA
  const ctaWidth = config.isDesktop
    ? Math.min(600, viewWidth * 0.5)
    : viewWidth - (padding * 2);

  const availableHeight = viewHeight - navbarHeight - (padding * 2);
  const ctaHeight = config.isDesktop
    ? Math.min(420, availableHeight * 0.65)
    : config.isMobile
      ? Math.min(availableHeight * 0.93, availableHeight - 20)
      : Math.min(540, availableHeight * 0.92);

  return {
    width: ctaWidth,
    height: ctaHeight,
    top: viewHeight / 2,
    left: viewWidth / 2,
    xPercent: -50,
    yPercent: -50,
    scale: 1,
  };
}

/**
 * Morph portfolio terminal from left side to centered CTA position
 */
export function morphPortfolioToCta(onComplete?: () => void) {
  const portfolioTerminal = document.querySelector("[data-portfolio-terminal]") as HTMLElement | null;
  const portfolio3DContainer = document.querySelector("[data-portfolio-3d-container]") as HTMLElement | null;

  if (!portfolioTerminal) {
    onComplete?.();
    return gsap.timeline();
  }

  const config = getCtaConfig();
  const tl = gsap.timeline();

  if (onComplete) {
    tl.eventCallback("onComplete", onComplete);
  }

  const viewportConfig = getConfig();

  // Fade out 3D container
  if (portfolio3DContainer) {
    tl.to(portfolio3DContainer, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    }, 0);
  }

  // On mobile: collapse the 3D zone so CTA panel gets the full terminal body
  if (viewportConfig.isMobile) {
    const threeDZone = document.querySelector("[data-portfolio-3d-zone]") as HTMLElement | null;
    if (threeDZone) {
      tl.set(threeDZone, { height: "0%", display: "none" }, 0);
    }
  }

  // Morph terminal to center
  tl.to(portfolioTerminal, {
    left: config.left,
    top: config.top,
    xPercent: config.xPercent,
    yPercent: config.yPercent,
    width: config.width,
    height: config.height,
    duration: 0.5,
    ease: "power2.inOut",
  }, 0.1);

  return tl;
}

/**
 * Morph portfolio terminal from centered CTA back to left side for projects
 */
export function morphPortfolioToProjects(onComplete?: () => void) {
  const portfolioTerminal = document.querySelector("[data-portfolio-terminal]") as HTMLElement | null;
  const portfolio3DContainer = document.querySelector("[data-portfolio-3d-container]") as HTMLElement | null;
  const viewportConfig = getConfig();

  if (!portfolioTerminal) {
    onComplete?.();
    return gsap.timeline();
  }

  const config = getExpandedProjectsConfig();
  const tl = gsap.timeline();

  if (onComplete) {
    tl.eventCallback("onComplete", onComplete);
  }

  // Morph terminal back to left
  tl.to(portfolioTerminal, {
    left: config.left,
    top: config.top,
    xPercent: config.xPercent,
    yPercent: config.yPercent,
    width: config.width,
    height: config.height,
    duration: 0.5,
    ease: "power2.inOut",
  }, 0);

  // Fade in 3D container
  if (portfolio3DContainer) {
    if (viewportConfig.isMobile) {
      // On mobile: position 3D container to match the 3D zone (top half of terminal body)
      const terminalLeft = config.left - config.width / 2;
      const terminalTop = config.top - config.height / 2;
      const headerHeight = 44;
      const bodyHeight = config.height - headerHeight;
      const zoneHeight = bodyHeight / 2; // top half of terminal body
      tl.set(portfolio3DContainer, {
        left: `${terminalLeft}px`,
        right: "auto",
        top: `${terminalTop + headerHeight}px`,
        bottom: "auto",
        height: `${zoneHeight}px`,
        width: `${config.width}px`,
        zIndex: 51,
        overflow: "hidden",
      }, 0);
      // Trigger Three.js canvas resize to match new container dimensions
      tl.call(() => {
        requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
      }, [], 0.1);
    }
    tl.to(portfolio3DContainer, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    }, 0.2);
  }

  // Restore 3D zone visibility on mobile (in case it was collapsed for CTA)
  if (viewportConfig.isMobile) {
    const threeDZone = document.querySelector("[data-portfolio-3d-zone]") as HTMLElement | null;
    if (threeDZone) {
      tl.set(threeDZone, { height: "50%", display: "block" }, 0);
    }
  }

  return tl;
}
