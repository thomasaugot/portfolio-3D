import { gsap } from "@/lib/gsap";

const getTerminal = () => document.querySelector("[data-terminal-wrapper]") as HTMLElement | null;
const getTerminalShell = () => document.querySelector("[data-terminal-shell]") as HTMLElement | null;
const getTerminalHeader = () => document.querySelector("[data-terminal-header]") as HTMLElement | null;
const getTerminalBody = () => document.querySelector("[data-terminal-body]") as HTMLElement | null;
const getTerminalMorphLayer = () => document.querySelector("[data-terminal-morph-layer]") as HTMLElement | null;
const getLaptop = () => document.querySelector("[data-laptop]") as HTMLElement | null;
const getHeroContent = () => document.querySelector("[data-hero-content]") as HTMLElement | null;
const getHeroBg = () => document.querySelector("[data-hero-bg]") as HTMLElement | null;
const getHeroBackdrop = () => document.querySelector("[data-hero-backdrop]") as HTMLElement | null;
const getHeroBranding = () => document.querySelector("[data-hero-branding]") as HTMLElement | null;
const getAbout = () => document.querySelector("[data-about-section]") as HTMLElement | null;
const getProjects = () => document.querySelector("[data-canvas-projects]") as HTMLElement | null;
const getContact = () => document.querySelector("[data-contact-section]") as HTMLElement | null;
const getAboutTerminalCard = () => document.querySelector("[data-about-terminal-card]") as HTMLElement | null;
const getContactTerminal = () => document.querySelector("[data-contact-terminal]") as HTMLElement | null;

const fadeOutSection = (tl: gsap.core.Timeline, section: HTMLElement | null, startTime = 0) => {
  if (!section) return;
  tl.to(section, { opacity: 0, scale: 0.99, duration: 0.4, ease: "power2.out" }, startTime);
  tl.set(section, { visibility: "hidden", pointerEvents: "none" }, startTime + 0.4);
};

export function centerTerminal() {
  const terminal = getTerminal();
  if (!terminal) return;

  gsap.to(terminal, {
    left: "50%",
    top: "50%",
    bottom: "auto",
    right: "auto",
    xPercent: -50,
    yPercent: -50,
    width: "min(580px, 88vw)",
    scale: 1,
    opacity: 1,
    duration: 0.6,
    ease: "power3.out",
  });
}

export function expandTerminalToHero(onComplete?: () => void) {
  const terminal = getTerminal();
  if (!terminal) return;

  const isDesktop = window.innerWidth >= 1024;

  // Terminal with title inside - centered but offset left
  gsap.to(terminal, {
    width: isDesktop ? "min(520px, 38vw)" : "min(520px, 92vw)",
    left: "50%",
    right: "auto",
    top: "50%",
    bottom: "auto",
    x: isDesktop ? -280 : 0,
    xPercent: -50,
    yPercent: -50,
    scale: 1,
    duration: 0.8,
    ease: "power3.out",
    onComplete,
  });
}

export function transitionToAbout() {
  const terminal = getTerminal();
  const terminalShell = getTerminalShell();
  const heroBackdrop = getHeroBackdrop();
  const about = getAbout();
  const aboutTerminalCard = getAboutTerminalCard();
  const contactTerminal = getContactTerminal();
  const projects = getProjects();
  const contact = getContact();

  if (!terminal || !about) {
    console.warn("transitionToAbout: missing elements", { terminal: !!terminal, about: !!about });
    return gsap.timeline();
  }

  const tl = gsap.timeline();

  tl.call(() => {
    document.body.style.overflow = "hidden";
  }, [], 0);

  // Reset hero terminal to visible state first
  tl.set(terminal, { opacity: 1, scale: 1, pointerEvents: "auto" }, 0);

  // Hide other section terminals
  if (contactTerminal) {
    tl.set(contactTerminal, { opacity: 0 }, 0);
  }

  fadeOutSection(tl, projects, 0);
  fadeOutSection(tl, contact, 0);

  // Make about section visible to calculate layout
  gsap.set(about, { visibility: "visible", opacity: 0, pointerEvents: "none" });
  about.offsetHeight;

  const aboutTerminalRect = aboutTerminalCard?.getBoundingClientRect();

  // Hide about terminal card - hero terminal morphs into its place
  if (aboutTerminalCard) {
    gsap.set(aboutTerminalCard, { opacity: 0 });
  }

  // Morph terminal shell to about position
  if (aboutTerminalRect && aboutTerminalRect.width > 0) {
    const currentRect = terminal.getBoundingClientRect();

    if (terminalShell) {
      gsap.set(terminalShell, { height: currentRect.height, maxHeight: "none" });
    }

    // Fluid morphing - position and size
    tl.to(terminal, {
      left: aboutTerminalRect.left + aboutTerminalRect.width / 2,
      top: aboutTerminalRect.top + aboutTerminalRect.height / 2,
      width: aboutTerminalRect.width,
      x: 0,
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      duration: 0.8,
      ease: "power2.inOut",
    }, 0);

    if (terminalShell) {
      tl.to(terminalShell, {
        height: aboutTerminalRect.height,
        duration: 0.8,
        ease: "power2.inOut",
      }, 0);
    }
  }

  // Fade out hero backdrop
  if (heroBackdrop) {
    tl.to(heroBackdrop, { opacity: 0, duration: 0.5 }, 0);
  }

  // Fade in about section elements (portrait, glow)
  tl.to(about, { opacity: 1, duration: 0.4 }, 0.3);

  // Swap terminals at morph end
  tl.to(terminal, { opacity: 0, duration: 0.1 }, 0.75);
  if (aboutTerminalCard) {
    tl.to(aboutTerminalCard, { opacity: 1, duration: 0.1 }, 0.75);
  }

  tl.set(about, { pointerEvents: "auto" }, 0.7);

  // Portrait and glow entrance
  tl.fromTo("[data-about-glow]",
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" },
    0.3
  );

  tl.fromTo("[data-about-portrait]",
    { scale: 0.95, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
    0.4
  );

  tl.set("[data-about-cta]", { pointerEvents: "auto" }, 0.9);

  return tl;
}

export function transitionToProjects() {
  const terminal = getTerminal();
  const terminalShell = getTerminalShell();
  const terminalHeader = getTerminalHeader();
  const terminalBody = getTerminalBody();
  const terminalMorphLayer = getTerminalMorphLayer();
  const aboutTerminalCard = getAboutTerminalCard();
  const contactTerminal = getContactTerminal();
  const about = getAbout();
  const projects = getProjects();
  const contact = getContact();

  const isDesktop = window.innerWidth >= 1024;
  const tl = gsap.timeline();

  fadeOutSection(tl, about, 0);
  fadeOutSection(tl, contact, 0);

  tl.call(() => {
    document.body.style.overflow = "auto";
  }, [], 0);

  // Hide other section terminals
  if (aboutTerminalCard) {
    tl.set(aboutTerminalCard, { opacity: 0 }, 0);
  }
  if (contactTerminal) {
    tl.set(contactTerminal, { opacity: 0 }, 0);
  }

  // Reset terminal properties
  if (terminalHeader) {
    tl.set(terminalHeader, { clearProps: "height,opacity,paddingTop,paddingBottom" }, 0);
  }
  if (terminalShell) {
    tl.set(terminalShell, { clearProps: "height,width,maxHeight" }, 0);
    tl.set(terminalShell, { opacity: 1 }, 0);
  }
  if (terminalBody) {
    tl.set(terminalBody, { clearProps: "height,paddingTop,paddingBottom,paddingLeft,paddingRight,opacity,overflow" }, 0);
    tl.set(terminalBody, { opacity: 1 }, 0);
  }
  const heroTerminalContent = terminal?.querySelector("[data-terminal-content]");
  if (heroTerminalContent) {
    tl.set(heroTerminalContent, { opacity: 1 }, 0);
  }
  if (terminalMorphLayer) {
    tl.set(terminalMorphLayer, { opacity: 0 }, 0);
  }
  tl.set(terminal, {
    clearProps: "height",
    opacity: 1,
    scale: 1,
    y: 0,
    pointerEvents: "auto",
  }, 0);

  // Morph terminal to center-left position, shrink it
  tl.to(terminal, {
    left: "50%",
    top: "50%",
    x: isDesktop ? -150 : 0,
    xPercent: -50,
    yPercent: -50,
    width: isDesktop ? "min(450px, 38vw)" : "min(520px, 92vw)",
    scale: 0.9,
    opacity: 1,
    duration: 0.7,
    ease: "power2.inOut",
  }, 0);

  // Bring in projects section
  tl.set(projects, { visibility: "visible", pointerEvents: "auto" }, 0.25);
  tl.fromTo(projects,
    { opacity: 0 },
    { opacity: 1, duration: 0.5, ease: "power2.out" },
    0.3
  );

  tl.call(() => {
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        const { ScrollTrigger } = require("@/lib/gsap");
        ScrollTrigger.refresh();
      });
    }
  }, [], 0.5);

  return tl;
}

export function transitionToContact() {
  const projects = getProjects();
  const contact = getContact();
  const terminal = getTerminal();
  const terminalShell = getTerminalShell();
  const about = getAbout();
  const heroBackdrop = getHeroBackdrop();
  const heroBranding = getHeroBranding();

  const tl = gsap.timeline();

  fadeOutSection(tl, projects);
  fadeOutSection(tl, about);
  fadeOutSection(tl, heroBackdrop);
  fadeOutSection(tl, heroBranding);

  tl.call(() => {
    document.body.style.overflow = "hidden";
  }, [], 0);

  // Make contact visible to get target position
  gsap.set(contact, { visibility: "visible", opacity: 0, pointerEvents: "none" });
  contact?.offsetHeight;

  const contactTerminal = document.querySelector("[data-contact-terminal]") as HTMLElement | null;
  const contactTerminalRect = contactTerminal?.getBoundingClientRect();

  // Hide the contact terminal - hero terminal will morph into its place
  if (contactTerminal) {
    gsap.set(contactTerminal, { opacity: 0 });
  }

  // Morph hero terminal to contact terminal position
  if (contactTerminalRect && contactTerminalRect.width > 0 && terminal) {
    const currentRect = terminal.getBoundingClientRect();

    if (terminalShell) {
      gsap.set(terminalShell, { height: currentRect.height, maxHeight: "none" });
    }

    tl.to(terminal, {
      left: contactTerminalRect.left + contactTerminalRect.width / 2,
      top: contactTerminalRect.top + contactTerminalRect.height / 2,
      width: contactTerminalRect.width,
      x: 0,
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      duration: 0.7,
      ease: "power2.inOut",
    }, 0);

    if (terminalShell) {
      tl.to(terminalShell, {
        height: contactTerminalRect.height,
        duration: 0.7,
        ease: "power2.inOut",
      }, 0);
    }
  } else {
    // Fallback: fade out terminal if no target rect
    tl.to(terminal, {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: "power2.in",
    }, 0);
  }

  // Fade in contact section (not the terminal, just the surrounding content)
  tl.to(contact, { opacity: 1, duration: 0.4 }, 0.3);

  // Swap terminals at morph end
  tl.to(terminal, { opacity: 0, duration: 0.1 }, 0.65);
  if (contactTerminal) {
    tl.to(contactTerminal, { opacity: 1, duration: 0.1 }, 0.65);
  }

  tl.set(contact, { pointerEvents: "auto" }, 0.7);

  return tl;
}

export function transitionToHero() {
  const terminal = getTerminal();
  const terminalShell = getTerminalShell();
  const terminalHeader = getTerminalHeader();
  const terminalBody = getTerminalBody();
  const terminalMorphLayer = getTerminalMorphLayer();
  const laptop = getLaptop();
  const heroContent = getHeroContent();
  const heroBg = getHeroBg();
  const heroBackdrop = getHeroBackdrop();
  const heroBranding = getHeroBranding();
  const about = getAbout();
  const aboutTerminalCard = getAboutTerminalCard();
  const projects = getProjects();
  const contact = getContact();
  const contactTerminal = getContactTerminal();

  const tl = gsap.timeline();
  const isDesktop = window.innerWidth >= 1024;

  tl.call(() => {
    document.body.style.overflow = "hidden";
  }, [], 0);

  // Reset terminal shell properties
  if (terminalHeader) {
    tl.set(terminalHeader, { clearProps: "height,opacity,paddingTop,paddingBottom" }, 0);
  }
  if (terminalShell) {
    tl.set(terminalShell, { clearProps: "height,width,maxHeight" }, 0);
    tl.set(terminalShell, { opacity: 1 }, 0);
  }
  if (terminalBody) {
    tl.set(terminalBody, { clearProps: "height,paddingTop,paddingBottom,paddingLeft,paddingRight,opacity,overflow" }, 0);
    tl.set(terminalBody, { opacity: 1 }, 0);
  }
  const heroTerminalContent = terminal?.querySelector("[data-terminal-content]");
  if (heroTerminalContent) {
    tl.set(heroTerminalContent, { opacity: 1 }, 0);
  }
  if (terminalMorphLayer) {
    tl.set(terminalMorphLayer, { opacity: 0 }, 0);
    tl.call(() => {
      terminalMorphLayer.innerHTML = "";
    }, [], 0);
  }

  // Restore hero terminal to visible, reset transforms
  tl.set(terminal, {
    clearProps: "height",
    rotation: 0,
    boxShadow: "none",
    skewX: 0,
    skewY: 0,
    filter: "none",
    opacity: 1,
    scale: 1,
    y: 0,
    pointerEvents: "auto",
  }, 0);

  // Hide other section terminals
  if (aboutTerminalCard) {
    tl.set(aboutTerminalCard, { opacity: 0 }, 0);
  }
  if (contactTerminal) {
    tl.set(contactTerminal, { opacity: 0 }, 0);
  }

  // Fade out other sections
  fadeOutSection(tl, contact, 0);
  fadeOutSection(tl, about, 0);
  fadeOutSection(tl, projects, 0);

  // Restore hero elements
  if (heroContent) {
    tl.to(heroContent, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.2);
  }
  if (heroBg) {
    tl.to(heroBg, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.1);
  }
  if (heroBackdrop) {
    tl.to(heroBackdrop, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.1);
  }
  if (heroBranding) {
    tl.to(heroBranding, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0.2);
  }
  if (laptop) {
    tl.to(laptop, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }, 0.1);
  }

  // Morph terminal back to hero position
  tl.to(terminal, {
    left: "50%",
    right: "auto",
    top: "50%",
    bottom: "auto",
    x: isDesktop ? -280 : 0,
    xPercent: -50,
    yPercent: -50,
    width: isDesktop ? "min(520px, 38vw)" : "min(520px, 92vw)",
    scale: 1,
    opacity: 1,
    pointerEvents: "auto",
    duration: 0.7,
    ease: "power2.inOut",
  }, 0);

  return tl;
}

function setupEventDelegation() {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    if (target.closest("[data-cta-about]")) {
      transitionToAbout();
    }

    if (target.closest("[data-cta-projects]")) {
      transitionToProjects();
    }

    if (target.closest("[data-cta-contact]")) {
      transitionToContact();
    }
  });
}

export function initCanvas() {
  const terminal = getTerminal();
  if (!terminal) {
    if (typeof window !== "undefined") {
      const attempts = (window as any).__canvasInitAttempts ?? 0;
      if (attempts < 6) {
        (window as any).__canvasInitAttempts = attempts + 1;
        requestAnimationFrame(() => initCanvas());
      }
    }
    return;
  }

  // Clear any existing transforms first
  gsap.set(terminal, { clearProps: "transform" });

  const isDesktop = window.innerWidth >= 1024;

  // Start centered during loading, stays centered
  gsap.set(terminal, {
    top: "50%",
    left: "50%",
    xPercent: -50,
    yPercent: -50,
    bottom: "auto",
    right: "auto",
    width: isDesktop ? "min(480px, 34vw)" : "min(520px, 92vw)",
    opacity: 1,
    scale: 0.95,
    pointerEvents: "auto",
  });

  const about = getAbout();
  const projects = getProjects();
  const contact = getContact();

  if (about)
    gsap.set(about, {
      visibility: "hidden",
      opacity: 0,
      pointerEvents: "none",
    });
  if (projects)
    gsap.set(projects, {
      visibility: "hidden",
      opacity: 0,
      pointerEvents: "none",
    });
  if (contact)
    gsap.set(contact, {
      visibility: "hidden",
      opacity: 0,
      pointerEvents: "none",
    });

  document.body.style.overflow = "hidden";

  if (typeof window !== "undefined") {
    if (!(window as any).__canvasDelegationBound) {
      setupEventDelegation();
      (window as any).__canvasDelegationBound = true;
    }
  } else {
    setupEventDelegation();
  }

  return () => {
    document.body.style.overflow = "";
  };
}
