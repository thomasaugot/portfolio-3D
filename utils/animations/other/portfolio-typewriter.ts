import { gsap } from "@/lib/gsap";

interface TypewriterElement {
  element: HTMLElement;
  fullText: string;
  tween: gsap.core.Tween | null;
}

let activeTypewriters: TypewriterElement[] = [];
let currentPanelIndex = -1;
let revealTimeouts: ReturnType<typeof setTimeout>[] = [];

/**
 * Clear all active typewriter animations
 */
function clearTypewriters() {
  activeTypewriters.forEach(({ tween }) => {
    if (tween) tween.kill();
  });
  activeTypewriters = [];

  // Clear reveal timeouts
  revealTimeouts.forEach((t) => clearTimeout(t));
  revealTimeouts = [];
}

/**
 * Typewrite a single element
 */
// Cursor element for typewriting
let cursorElement: HTMLSpanElement | null = null;

function createCursor(): HTMLSpanElement {
  const cursor = document.createElement("span");
  cursor.className = "typewriter-cursor";
  // Match the hero/about terminal cursor style: rectangular block
  cursor.style.cssText = `
    display: inline-block;
    width: 0.5rem;
    height: 1.25rem;
    background-color: var(--color-primary, #00ff88);
    vertical-align: middle;
    margin-left: 2px;
  `;
  return cursor;
}

function showCursor(element: HTMLElement) {
  if (cursorElement) {
    cursorElement.remove();
  }
  cursorElement = createCursor();
  element.appendChild(cursorElement);
}

function hideCursor() {
  if (cursorElement) {
    cursorElement.remove();
    cursorElement = null;
  }
}

function typewriteElement(
  element: HTMLElement,
  delay: number = 0,
  _speed: number = 25
): Promise<void> {
  return new Promise((resolve) => {
    const fullText = element.dataset.typewriterText || element.textContent || "";
    if (!fullText) {
      resolve();
      return;
    }

    // Store original text as data attribute if not already stored
    if (!element.dataset.typewriterText) {
      element.dataset.typewriterText = fullText;
    }

    // Clear the element
    element.textContent = "";

    // Find the parent line (for showing icons/prompts when typing starts)
    const parentLine = element.closest("[data-typewriter-line]") as HTMLElement | null;

    const timeout = setTimeout(() => {
      // Show the parent line (with icon/prompt)
      if (parentLine) {
        gsap.set(parentLine, { opacity: 1 });
      }
      // Reveal entire line at once (line-by-line, not character-by-character)
      element.textContent = fullText;
      resolve();
    }, delay);

    activeTypewriters.push({ element, fullText, tween: null });
    revealTimeouts.push(timeout);
  });
}

/**
 * Reveal elements after typewriting completes
 */
function revealElements(panel: HTMLElement, baseDelay: number) {
  const revealElements = panel.querySelectorAll("[data-typewriter-reveal]") as NodeListOf<HTMLElement>;

  revealElements.forEach((element) => {
    const extraDelay = parseInt(element.dataset.typewriterDelay || "0", 10);
    const totalDelay = baseDelay + extraDelay;

    const timeout = setTimeout(() => {
      gsap.to(element, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    }, totalDelay);

    revealTimeouts.push(timeout);
  });
}

/**
 * Typewrite all elements in a panel sequentially
 */
async function typewritePanel(panel: HTMLElement) {
  const allElements = panel.querySelectorAll("[data-typewriter]") as NodeListOf<HTMLElement>;

  // Filter out elements that are not visible (e.g. hidden on mobile via `hidden lg:flex`)
  // This prevents hidden desktop-only elements from adding delay on mobile
  const elements = Array.from(allElements).filter((el) => el.offsetParent !== null);

  let accumulatedDelay = 0;
  const promises: Promise<void>[] = [];

  elements.forEach((element) => {
    const lineDelay = parseInt(element.dataset.typewriterDelay || "100", 10);

    accumulatedDelay += lineDelay;
    promises.push(typewriteElement(element, accumulatedDelay));

    // Line is revealed instantly, no additional duration to accumulate
  });

  // Reveal any data-typewriter-line elements that have no visible data-typewriter children
  // (e.g. tech badges wrapper whose command is hidden on mobile via `hidden lg:flex`)
  const allLines = panel.querySelectorAll("[data-typewriter-line]") as NodeListOf<HTMLElement>;
  allLines.forEach((line) => {
    // Skip lines that are themselves hidden (display:none)
    if (line.offsetParent === null) return;
    // Check if this line has any visible data-typewriter children
    const visibleTypewriters = Array.from(line.querySelectorAll("[data-typewriter]")).filter(
      (el) => (el as HTMLElement).offsetParent !== null
    );
    if (visibleTypewriters.length === 0) {
      // No visible typewriter children — reveal this line with a delay
      const timeout = setTimeout(() => {
        gsap.set(line, { opacity: 1 });
      }, accumulatedDelay);
      revealTimeouts.push(timeout);
    }
  });

  // Start reveal animations after a delay based on total typewriting time
  revealElements(panel, accumulatedDelay + 200);

  await Promise.all(promises);

  // Hide cursor when all typing is done
  hideCursor();
}

/**
 * Reset a panel's text content to original state (hidden)
 * Only clears text if it was previously typed (has data-typewriter-text)
 */
function resetPanel(panel: HTMLElement) {
  const elements = panel.querySelectorAll("[data-typewriter]") as NodeListOf<HTMLElement>;
  elements.forEach((element) => {
    // Only clear if this panel was previously typed (has saved text)
    // Don't clear panels that haven't been typed yet - we'd lose the original text
    if (element.dataset.typewriterText) {
      element.textContent = "";
    }
  });

  // Hide reveal elements
  const reveals = panel.querySelectorAll("[data-typewriter-reveal]") as NodeListOf<HTMLElement>;
  reveals.forEach((element) => {
    gsap.set(element, { opacity: 0 });
  });

  // Hide typewriter lines
  const lines = panel.querySelectorAll("[data-typewriter-line]") as NodeListOf<HTMLElement>;
  lines.forEach((line) => {
    gsap.set(line, { opacity: 0 });
  });
}

/**
 * Initialize typewriter for the intro panel
 */
export function typewriteIntroPanel() {
  clearTypewriters();
  currentPanelIndex = -1; // Use -1 for intro, 0+ for projects

  const introPanel = document.querySelector("[data-intro-panel]") as HTMLElement | null;
  if (!introPanel) return;

  // Prepare the panel - hide lines and save/clear text
  const lines = introPanel.querySelectorAll("[data-typewriter-line]") as NodeListOf<HTMLElement>;
  lines.forEach((line) => {
    gsap.set(line, { opacity: 0 });
  });

  const elements = introPanel.querySelectorAll("[data-typewriter]") as NodeListOf<HTMLElement>;
  elements.forEach((element) => {
    // Save original text if not already saved
    if (!element.dataset.typewriterText && element.textContent) {
      element.dataset.typewriterText = element.textContent;
    }
    // Clear text so typewriter can animate it
    element.textContent = "";
  });

  // Hide intro CTA so it can be revealed after typewriting
  const introCta = introPanel.querySelector("[data-intro-cta]") as HTMLElement | null;
  if (introCta) {
    gsap.set(introCta, { opacity: 0 });
  }

  // Hide reveal elements
  const reveals = introPanel.querySelectorAll("[data-typewriter-reveal]") as NodeListOf<HTMLElement>;
  reveals.forEach((element) => {
    gsap.set(element, { opacity: 0 });
  });

  typewritePanel(introPanel).then(() => {
    if (introCta) {
      gsap.to(introCta, {
        opacity: 1,
        duration: 0.4,
        delay: 0.2,
        ease: "power2.out",
      });
    }
  });
}

/**
 * Prepare a panel for typewriting by clearing text and saving originals
 * Call this BEFORE showing the panel to avoid flicker
 */
export function preparePanel(panelSelector: string) {
  const panel = document.querySelector(panelSelector) as HTMLElement | null;
  if (!panel) return;

  // Hide all typewriter lines (they'll be revealed when typing starts)
  const lines = panel.querySelectorAll("[data-typewriter-line]") as NodeListOf<HTMLElement>;
  lines.forEach((line) => {
    gsap.set(line, { opacity: 0 });
  });

  const elements = panel.querySelectorAll("[data-typewriter]") as NodeListOf<HTMLElement>;
  elements.forEach((element) => {
    // Save original text before clearing
    if (!element.dataset.typewriterText && element.textContent) {
      element.dataset.typewriterText = element.textContent;
    }
    // Clear so there's no flicker when panel fades in
    element.textContent = "";
  });

  // Hide reveal elements
  const reveals = panel.querySelectorAll("[data-typewriter-reveal]") as NodeListOf<HTMLElement>;
  reveals.forEach((element) => {
    gsap.set(element, { opacity: 0 });
  });
}

/**
 * Typewrite a specific project panel by index (0-based)
 */
export function typewriteProjectPanel(index: number) {
  // Don't re-typewrite the same panel
  if (index === currentPanelIndex) return;

  clearTypewriters();

  // Reset only the previous panel (if it was a project panel, not intro)
  if (currentPanelIndex >= 0) {
    const prevPanel = document.querySelector(`[data-project-panel="${currentPanelIndex + 1}"]`) as HTMLElement | null;
    if (prevPanel) {
      resetPanel(prevPanel);
    }
  }

  currentPanelIndex = index;

  // Find and typewrite the target panel
  const targetPanel = document.querySelector(`[data-project-panel="${index + 1}"]`) as HTMLElement | null;
  if (targetPanel) {
    typewritePanel(targetPanel);
  }
}

/**
 * Typewrite the CTA panel (last panel)
 */
export function typewriteCtaPanel(totalProjects: number) {
  clearTypewriters();

  const ctaPanel = document.querySelector("[data-cta-panel]") as HTMLElement | null;
  if (!ctaPanel) return;

  currentPanelIndex = totalProjects; // CTA is after all projects
  typewritePanel(ctaPanel);
}

/**
 * Reset all portfolio typewriter state
 */
export function resetPortfolioTypewriter() {
  clearTypewriters();
  currentPanelIndex = -1;

  // Reset all project panels (but don't touch text - let React handle it)
  const allPanels = document.querySelectorAll("[data-project-panel]") as NodeListOf<HTMLElement>;
  allPanels.forEach((panel) => {
    const panelIndex = parseInt(panel.dataset.projectPanel || "-1", 10);
    if (panelIndex > 0) { // Skip intro panel
      // Only reset reveal elements, don't touch typewriter text
      const reveals = panel.querySelectorAll("[data-typewriter-reveal]") as NodeListOf<HTMLElement>;
      reveals.forEach((element) => {
        gsap.set(element, { opacity: 0 });
      });
      // Restore original text to DOM before clearing saved state
      const typewriterElements = panel.querySelectorAll("[data-typewriter]") as NodeListOf<HTMLElement>;
      typewriterElements.forEach((element) => {
        if (element.dataset.typewriterText) {
          element.textContent = element.dataset.typewriterText;
        }
        delete element.dataset.typewriterText;
      });
    }
  });

  // For intro panel, save text and clear it so typewriter can animate
  const introPanel = document.querySelector("[data-intro-panel]") as HTMLElement | null;
  if (introPanel) {
    // Hide all typewriter lines
    const lines = introPanel.querySelectorAll("[data-typewriter-line]") as NodeListOf<HTMLElement>;
    lines.forEach((line) => {
      gsap.set(line, { opacity: 0 });
    });

    const elements = introPanel.querySelectorAll("[data-typewriter]") as NodeListOf<HTMLElement>;
    elements.forEach((element) => {
      // Save original text before clearing
      if (!element.dataset.typewriterText && element.textContent) {
        element.dataset.typewriterText = element.textContent;
      }
      // Clear so there's no flicker
      element.textContent = "";
    });
    // Hide intro CTA so it can be revealed after typewriting
    const introCta = introPanel.querySelector("[data-intro-cta]") as HTMLElement | null;
    if (introCta) {
      gsap.set(introCta, { opacity: 0 });
    }
  }

  // Reset CTA panel
  const ctaPanel = document.querySelector("[data-cta-panel]") as HTMLElement | null;
  if (ctaPanel) {
    const reveals = ctaPanel.querySelectorAll("[data-typewriter-reveal]") as NodeListOf<HTMLElement>;
    reveals.forEach((element) => {
      gsap.set(element, { opacity: 0 });
    });
    const typewriterElements = ctaPanel.querySelectorAll("[data-typewriter]") as NodeListOf<HTMLElement>;
    typewriterElements.forEach((element) => {
      if (element.dataset.typewriterText) {
        element.textContent = element.dataset.typewriterText;
      }
      delete element.dataset.typewriterText;
    });
  }
}

/**
 * Get current panel index
 */
export function getCurrentPanelIndex(): number {
  return currentPanelIndex;
}

// Listen for portfolio reset to clear typewriters
if (typeof window !== "undefined") {
  window.addEventListener("portfolioReset", () => {
    resetPortfolioTypewriter();
  });
}
