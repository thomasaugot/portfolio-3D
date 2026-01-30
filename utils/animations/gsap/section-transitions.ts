import gsap from "gsap";

/**
 * Premium section transition animations
 * These replace basic slide-ins with orchestrated, cinematic transitions
 */

// Ensure terminal is in fixed position for animations
export const ensureTerminalFixed = () => {
  const terminal = document.querySelector(
    "[data-terminal-shell]"
  ) as HTMLElement | null;
  if (!terminal) return null;

  const computed = window.getComputedStyle(terminal);
  if (computed.position === "fixed") return terminal;

  const rect = terminal.getBoundingClientRect();
  gsap.set(terminal, {
    position: "fixed",
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    zIndex: 40,
    margin: 0,
    transformOrigin: "bottom left",
    xPercent: 0,
    yPercent: 0,
  });
  return terminal;
};

// Animate terminal to bottom-left corner (for About section)
export const animateTerminalToCorner = () => {
  const terminal = ensureTerminalFixed();
  if (!terminal) return;

  return gsap.to(terminal, {
    top: "auto",
    right: "auto",
    left: 24,
    bottom: 24,
    width: 340,
    height: 220,
    opacity: 1,
    scale: 1,
    pointerEvents: "auto",
    duration: 0.7,
    ease: "power3.out",
  });
};

// Animate terminal to center (for prompts)
export const animateTerminalCenter = () => {
  const terminal = ensureTerminalFixed();
  if (!terminal) return;

  return gsap.to(terminal, {
    left: "50%",
    top: "50%",
    bottom: "auto",
    width: "min(800px, 90vw)",
    height: "min(500px, 65vh)",
    xPercent: -50,
    yPercent: -50,
    opacity: 1,
    scale: 1,
    pointerEvents: "auto",
    zIndex: 80,
    duration: 0.7,
    ease: "power3.out",
  });
};

// Animate terminal to slide left (for Projects section)
export const animateTerminalSlideLeft = () => {
  const terminal = ensureTerminalFixed();
  if (!terminal) return;

  return gsap.to(terminal, {
    left: "-20vw",
    top: "50%",
    bottom: "auto",
    width: "min(680px, 75vw)",
    height: "min(480px, 65vh)",
    xPercent: 0,
    yPercent: -50,
    opacity: 1,
    scale: 1,
    pointerEvents: "auto",
    duration: 0.8,
    ease: "power3.out",
  });
};

// Animate terminal exit (shrink and fade)
export const animateTerminalExit = () => {
  const terminal = ensureTerminalFixed();
  if (!terminal) return;

  return gsap.to(terminal, {
    scale: 0.5,
    opacity: 0,
    rotation: -5,
    duration: 0.6,
    ease: "power2.in",
    onComplete: () => {
      gsap.set(terminal, { pointerEvents: "none" });
    },
  });
};

// Fade hero visual (3D laptop)
export const fadeHeroVisual = () => {
  const heroVisual = document.querySelector(
    "[data-hero-visual]"
  ) as HTMLElement | null;
  if (!heroVisual) return;

  return gsap.to(heroVisual, {
    opacity: 0,
    y: 60,
    scale: 0.95,
    duration: 0.6,
    ease: "power3.out",
    pointerEvents: "none",
  });
};

// Show section overlay with direction
export const showOverlay = (
  target: HTMLElement | null,
  direction: "left" | "right" | "up" | "down" = "right"
) => {
  if (!target) return;

  const from = { x: 0, y: 0 };
  if (direction === "left") from.x = "-100vw";
  if (direction === "right") from.x = "100vw";
  if (direction === "up") from.y = "-100vh";
  if (direction === "down") from.y = "100vh";

  gsap.set(target, { x: from.x, y: from.y, autoAlpha: 1, zIndex: 20 });

  return gsap.to(target, {
    x: 0,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    pointerEvents: "auto",
  });
};

// Hide section overlay with direction
export const hideOverlay = (
  target: HTMLElement | null,
  direction: "left" | "right" | "up" | "down" = "left"
) => {
  if (!target) return;

  const to = { x: 0, y: 0 };
  if (direction === "left") to.x = "-100vw";
  if (direction === "right") to.x = "100vw";
  if (direction === "up") to.y = "-100vh";
  if (direction === "down") to.y = "100vh";

  return gsap.to(target, {
    x: to.x,
    y: to.y,
    duration: 0.7,
    ease: "power3.inOut",
    pointerEvents: "none",
    onComplete: () => gsap.set(target, { autoAlpha: 0 }),
  });
};

// About section premium entry animation
export const aboutEnterAnimation = (container: HTMLElement) => {
  const tl = gsap.timeline();

  // Portrait image - scale up with elastic bounce
  tl.from(
    container.querySelector("[data-about-portrait]"),
    {
      scale: 0.7,
      opacity: 0,
      duration: 0.9,
      ease: "back.out(1.5)",
    }
  );

  // Name - typing effect simulation
  tl.from(
    container.querySelector("[data-about-name]"),
    {
      clipPath: "inset(0 100% 0 0)",
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    },
    "-=0.5"
  );

  // Role
  tl.from(
    container.querySelector("[data-about-role]"),
    {
      x: 30,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out",
    },
    "-=0.3"
  );

  // Location
  tl.from(
    container.querySelector("[data-about-location]"),
    {
      x: 30,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out",
    },
    "-=0.3"
  );

  // Bio - words fade in
  tl.from(
    container.querySelector("[data-about-bio]"),
    {
      y: 25,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
    },
    "-=0.2"
  );

  // Stats - counter-like stagger
  tl.from(
    container.querySelectorAll("[data-about-stat]"),
    {
      y: 30,
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      stagger: 0.12,
      ease: "back.out(1.2)",
    },
    "-=0.4"
  );

  // Tech pills - cascade from left with spring
  tl.from(
    container.querySelectorAll("[data-about-tech]"),
    {
      x: -25,
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      stagger: 0.03,
      ease: "back.out(1.5)",
    },
    "-=0.3"
  );

  // CTA button - bounce in
  tl.from(
    container.querySelector("[data-about-cta]"),
    {
      y: 25,
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: "back.out(1.3)",
    },
    "-=0.2"
  );

  return tl;
};

// About section exit animation
export const aboutExitAnimation = (container: HTMLElement) => {
  const tl = gsap.timeline();

  // All elements shrink toward center
  tl.to(container.querySelectorAll("[data-about-portrait], [data-about-name], [data-about-role], [data-about-location], [data-about-bio], [data-about-stat], [data-about-tech], [data-about-cta]"), {
    scale: 0.9,
    opacity: 0,
    duration: 0.4,
    stagger: 0.02,
    ease: "power2.in",
  });

  return tl;
};

// Projects section entry animation
export const projectsEnterAnimation = (container: HTMLElement) => {
  const tl = gsap.timeline();

  // Title elements
  tl.from(
    container.querySelectorAll("[data-projects-title], [data-projects-subtitle]"),
    {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "power3.out",
    }
  );

  // Intro content if present
  const intro = container.querySelector("[data-projects-intro]");
  if (intro) {
    tl.from(
      intro,
      {
        y: 30,
        opacity: 0,
        scale: 0.98,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.3"
    );
  }

  return tl;
};

// Contact section entry animation (terminal form)
export const contactEnterAnimation = (container: HTMLElement) => {
  const tl = gsap.timeline();

  // Terminal window scales up from center
  const terminal = container.querySelector("[data-contact-terminal]");
  if (terminal) {
    tl.from(terminal, {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.7,
      ease: "back.out(1.3)",
    });
  }

  // Form fields appear with typewriter-like stagger
  tl.from(
    container.querySelectorAll("[data-contact-field]"),
    {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.15,
      ease: "power3.out",
    },
    "-=0.3"
  );

  // Submit button
  tl.from(
    container.querySelector("[data-contact-submit]"),
    {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out",
    },
    "-=0.1"
  );

  return tl;
};

// Loading dots animation for terminal status
export const animateLoadingDots = (element: HTMLElement) => {
  let dots = 0;
  const baseText = element.textContent?.replace(/\.+$/, "") || "";

  const interval = setInterval(() => {
    dots = (dots + 1) % 4;
    element.textContent = baseText + ".".repeat(dots);
  }, 400);

  return () => clearInterval(interval);
};
