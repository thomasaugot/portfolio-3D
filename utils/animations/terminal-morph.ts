/**
 * Terminal Morphing System
 * Single file handling all terminal position/size transitions
 * The terminal is ONE element that smoothly morphs between states
 */

import { gsap } from "@/lib/gsap";
import { animateLaptopOut, animateLaptopIn, animateHexFloorEntrance } from "@/utils/animations/hero-3d-scene";
import { motionDelay, motionDuration, prefersReducedMotion } from "@/utils/motion";
import {
  CENTERED_TERMINAL,
  getProjectsIntroSize,
  getViewportConfig,
  getLoaderTerminalSize,
  getHeroTerminalSize,
  getAboutTerminalSize,
  getProjectsExpandedSize,
  getProjectsCtaSize,
  getContactTerminalSize,
} from "@/utils/terminal-sizes";

/**
 * Reset portfolio visual state (inlined to avoid circular dependency)
 * Dispatches event so scroll animation can reset its internal state
 */
function resetPortfolioVisuals() {
  // Dispatch event so portfolio-scroll-animation can reset isExpanded
  window.dispatchEvent(new CustomEvent("portfolioReset"));

  const portfolioSection = document.querySelector("[data-portfolio-section]") as HTMLElement | null;
  const portfolioTerminal = document.querySelector("[data-portfolio-terminal]") as HTMLElement | null;
  const introPanel = portfolioTerminal?.querySelector("[data-intro-panel]") as HTMLElement | null;
  const projectPanels = portfolioSection?.querySelectorAll("[data-project-panel]") || [];
  const portfolio3DContainer = document.querySelector("[data-portfolio-3d-container]") as HTMLElement;
  const scrollIndicator = document.querySelector("[data-scroll-indicator]") as HTMLElement;
  const projectCounter = portfolioTerminal?.querySelector("[data-project-counter]") as HTMLElement | null;
  const scroller = document.querySelector("[data-portfolio-scroller]") as HTMLElement | null;

  if (portfolioTerminal) {
    const introSize = getProjectsIntroSize();
    gsap.set(portfolioTerminal, {
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      width: introSize.width,
      height: introSize.height,
    });
  }

  // Show intro panel
  if (introPanel) {
    gsap.set(introPanel, { opacity: 1, pointerEvents: "auto" });
    introPanel.setAttribute("aria-hidden", "false");
    introPanel.removeAttribute("inert");
  }

  // Hide all project panels
  projectPanels.forEach((panel: Element, index: number) => {
    if (index === 0) return;
    gsap.set(panel, { opacity: 0, pointerEvents: "none", y: 0 });
    (panel as HTMLElement).setAttribute("aria-hidden", "true");
    (panel as HTMLElement).setAttribute("inert", "");
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
const getTerminalFrame = () => document.querySelector("[data-terminal-shell]") as HTMLElement | null;
const getHeroBackdrop = () => document.querySelector("[data-hero-backdrop]") as HTMLElement | null;
const getHero3D = () => document.querySelector("[data-hero-3d]") as HTMLElement | null;
const getAbout = () => document.querySelector("[data-about-section]") as HTMLElement | null;
const getProjects = () => document.querySelector("[data-canvas-projects]") as HTMLElement | null;
const getContact = () => document.querySelector("[data-contact-section]") as HTMLElement | null;

// Use centralized viewport config
const getConfig = getViewportConfig;

const toPx = (value: number) => `${Math.round(value)}px`;

const getReducedEntry = (full: Record<string, number>, reduced: Record<string, number>) =>
  prefersReducedMotion() ? reduced : full;

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

// Terminal position configurations for each state (uses centralized size functions)
export const getTerminalConfig = (state: TerminalState) => {
  const config = getConfig();

  switch (state) {
    case "loader": {
      const size = getLoaderTerminalSize();
      return {
        ...baseConfig(config, size.width, size.height),
        widthCss: size.widthCss,
        heightCss: size.heightCss,
        scale: 1,
      };
    }
    case "hero": {
      const size = getHeroTerminalSize();
      return {
        ...baseConfig(config, size.width, size.height),
        widthCss: size.widthCss,
        heightCss: size.heightCss,
        left: size.left,
        top: (size as any).top || "50%",
      };
    }
    case "about": {
      const size = getAboutTerminalSize();
      return {
        ...baseConfig(config, size.width, size.height),
        widthCss: size.widthCss,
        heightCss: size.heightCss,
        left: size.left,
        top: "50%",
      };
    }
    case "projects": {
      const introSize = getProjectsIntroSize();
      return {
        left: config.isDesktop ? "35%" : "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        x: 0,
        width: introSize.width,
        height: introSize.height,
        widthCss: introSize.widthCss,
        heightCss: introSize.heightCss,
        scale: 1,
      };
    }
    case "contact": {
      const size = getContactTerminalSize();
      return {
        ...baseConfig(config, size.width, size.height),
        widthCss: size.widthCss,
        heightCss: size.heightCss,
        left: size.left,
        top: (size as any).top || "50%",
      };
    }
  }
};

// Fade helper for sections
const fadeSection = (section: HTMLElement | null, show: boolean, delay = 0) => {
  if (!section) return;

  if (show) {
    gsap.set(section, { visibility: "visible", pointerEvents: "auto" });
    gsap.to(section, {
      opacity: 1,
      duration: motionDuration(0.4),
      delay: motionDelay(delay),
      ease: "power2.out",
    });
  } else {
    gsap.to(section, {
      opacity: 0,
      duration: motionDuration(0.3),
      delay: motionDelay(delay),
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
    duration: motionDuration(0.8),
    ease: "power3.out",
    onComplete,
  });

  // Animate laptop in with tornado effect (slightly delayed)
  setTimeout(() => {
    animateLaptopIn();
  }, motionDelay(200));

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
    tl.to(heroBackdrop, { opacity: 0, duration: motionDuration(0.4) }, 0);
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
    duration: motionDuration(0.7),
    ease: "power2.inOut",
  }, 0);

  // Fade in about section background elements
  tl.call(() => fadeSection(about, true), [], motionDelay(0.3));

  // Portrait entrance - cinematic reveal with rotation and scale
  tl.fromTo("[data-about-portrait]",
    getReducedEntry(
      { scale: 0.6, opacity: 0, x: 60, y: 80, rotateY: -25, rotateX: 10 },
      { scale: 1, opacity: 0, x: 0, y: 0, rotateY: 0, rotateX: 0 }
    ),
    {
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
      rotateY: 0,
      rotateX: 0,
      duration: motionDuration(1.2),
      ease: "back.out(1.4)"
    },
    0.3
  );

  // Glow orbs fade in with slight delay and float effect
  tl.fromTo("[data-about-glow]",
    { scale: 0.5, opacity: 0 },
    { scale: 1, opacity: 1, duration: motionDuration(0.8), ease: "power3.out" },
    motionDelay(0.35)
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
    scale: prefersReducedMotion() ? 1 : 0.7,
    opacity: 0,
    x: prefersReducedMotion() ? 0 : -100,
    rotateY: prefersReducedMotion() ? 0 : 25,
    duration: motionDuration(0.5),
    ease: "power2.in"
  });
  gsap.to("[data-about-glow]", {
    scale: 0.5,
    opacity: 0,
    duration: motionDuration(0.4),
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
    tl.to(heroBackdrop, { opacity: 0, duration: motionDuration(0.4) }, 0);
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
    duration: motionDuration(0.7),
    ease: "power2.inOut",
  }, 0);

  // After morph completes, crossfade to portfolio terminal
  tl.call(() => {
    fadeSection(projects, true);
    document.body.style.overflow = "auto";

    gsap.to(terminal, {
      opacity: 0,
      duration: motionDuration(0.3),
      ease: "power2.out",
      onComplete: () => {
        gsap.set(terminal, { visibility: "hidden", pointerEvents: "none" });
        window.dispatchEvent(new CustomEvent("portfolioVisible"));
      },
    });

    requestAnimationFrame(() => {
      const { ScrollTrigger } = require("@/lib/gsap");
      ScrollTrigger.refresh();
    });
  }, [], motionDelay(0.65));

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
    scale: prefersReducedMotion() ? 1 : 0.7,
    opacity: 0,
    x: prefersReducedMotion() ? 0 : -100,
    rotateY: prefersReducedMotion() ? 0 : 25,
    duration: motionDuration(0.5),
    ease: "power2.in"
  });
  gsap.to("[data-about-glow]", {
    scale: 0.5,
    opacity: 0,
    duration: motionDuration(0.4),
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
    tl.to(heroBackdrop, { opacity: 0, duration: motionDuration(0.4) }, 0);
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
    duration: motionDuration(0.7),
    ease: "power2.inOut",
  }, 0);

  // Show contact
  tl.call(() => fadeSection(contact, true), [], motionDelay(0.4));

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
    scale: prefersReducedMotion() ? 1 : 0.7,
    opacity: 0,
    y: prefersReducedMotion() ? 0 : 50,
    rotateX: prefersReducedMotion() ? 0 : -15,
    duration: motionDuration(0.5),
    ease: "power2.in"
  });
  gsap.to("[data-about-glow]", {
    scale: 0.5,
    opacity: 0,
    duration: motionDuration(0.4),
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
    tl.to(heroBackdrop, { opacity: 1, duration: motionDuration(0.4) }, motionDelay(0.2));
  }

  // Animate laptop back in with tornado effect
  animateLaptopIn();

  // Ensure terminal is visible (it stays visible through projects now)
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
    duration: motionDuration(0.7),
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
    width: CENTERED_TERMINAL.width,
    scale: 1,
    duration: 0.5,
    ease: "power3.out",
  });
}

/**
 * Get expanded projects terminal config (left side, taller for project content)
 * Uses centralized size function from terminal-sizes.ts
 */
export function getExpandedProjectsConfig(projectIndex = 0) {
  return getProjectsExpandedSize(projectIndex);
}

/**
 * Morph portfolio terminal from centered intro to left side expanded state
 * Called when user clicks the "Start exploring" CTA button
 */
export function morphPortfolioToExpanded(projectIndex = 0, onComplete?: () => void) {
  const portfolioTerminal = document.querySelector("[data-portfolio-terminal]") as HTMLElement | null;
  const portfolio3DContainer = document.querySelector("[data-portfolio-3d-container]") as HTMLElement | null;
  const scrollIndicator = document.querySelector("[data-scroll-indicator]") as HTMLElement | null;
  const introPanel = document.querySelector("[data-intro-panel]") as HTMLElement | null;

  if (!portfolioTerminal) {
    onComplete?.();
    return gsap.timeline();
  }

  const config = getExpandedProjectsConfig(projectIndex);
  const tl = gsap.timeline();

  if (onComplete) {
    tl.eventCallback("onComplete", onComplete);
  }

  // Fade out intro panel content
  if (introPanel) {
    tl.to(introPanel, {
      opacity: 0,
      duration: motionDuration(0.3),
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
    duration: motionDuration(0.7),
    ease: "power2.inOut",
  }, 0.2);

  // Fade in 3D container
  // Fade in 3D container - keep it full-screen so models are never truncated
  if (portfolio3DContainer) {
    tl.set(portfolio3DContainer, {
      zIndex: 55, // Above terminal (z-50), below portaled content (z-60)
      pointerEvents: "auto", // Enable grab-and-rotate interaction
    }, 0);
    tl.to(portfolio3DContainer, {
      opacity: 1,
      duration: motionDuration(0.5),
      ease: "power2.out",
    }, 0.5);
  }

  // Fade in scroll indicator
  if (scrollIndicator) {
    tl.to(scrollIndicator, {
      opacity: 1,
      pointerEvents: "auto",
      duration: motionDuration(0.4),
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
    duration: motionDuration(0.3),
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
    duration: motionDuration(0.3),
    ease: "power2.out",
  });
}

/**
 * Get centered CTA config - uses centralized size function from terminal-sizes.ts
 */
export function getCtaConfig() {
  return getProjectsCtaSize();
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
      pointerEvents: "none",
      duration: motionDuration(0.3),
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
    duration: motionDuration(0.5),
    ease: "power2.inOut",
  }, 0.1);

  return tl;
}

/**
 * Morph portfolio terminal from centered CTA back to left side for projects
 */
export function morphPortfolioToProjects(projectIndex = 0, onComplete?: () => void) {
  const portfolioTerminal = document.querySelector("[data-portfolio-terminal]") as HTMLElement | null;
  const portfolio3DContainer = document.querySelector("[data-portfolio-3d-container]") as HTMLElement | null;

  if (!portfolioTerminal) {
    onComplete?.();
    return gsap.timeline();
  }

  const config = getExpandedProjectsConfig(projectIndex);
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

  // Fade in 3D container - keep it full-screen so models are never truncated
  if (portfolio3DContainer) {
    tl.set(portfolio3DContainer, {
      zIndex: 55, // Above terminal (z-50), below portaled content (z-60)
      pointerEvents: "auto", // Enable grab-and-rotate interaction
    }, 0);
    tl.to(portfolio3DContainer, {
      opacity: 1,
      duration: motionDuration(0.4),
      ease: "power2.out",
    }, 0.2);
  }

  return tl;
}
