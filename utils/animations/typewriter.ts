import { gsap } from "@/lib/gsap";

// Single source of truth for typewriter speed across the entire app
// higer value = slower typing
export const CHAR_SPEED = 5;

let activeTimers: ReturnType<typeof setTimeout>[] = [];
let currentPanelIndex = -1;

function clearAll() {
  activeTimers.forEach((t) => clearTimeout(t));
  activeTimers = [];
}

/**
 * Type text character by character using setTimeout — identical to hero terminal
 */
function typeChars(
  element: HTMLElement,
  fullText: string,
  onDone: () => void
) {
  let i = 0;
  const tick = () => {
    i++;
    if (i >= fullText.length) {
      element.textContent = fullText;
      onDone();
    } else {
      element.textContent = fullText.slice(0, i);
      const id = setTimeout(tick, CHAR_SPEED);
      activeTimers.push(id);
    }
  };
  const id = setTimeout(tick, CHAR_SPEED);
  activeTimers.push(id);
}

/**
 * Typewrite all visible [data-typewriter] elements in a panel sequentially
 */
async function typewritePanel(panel: HTMLElement) {
  const allElements = panel.querySelectorAll("[data-typewriter]") as NodeListOf<HTMLElement>;
  // Only visible elements (skip hidden-on-mobile ones)
  const elements = Array.from(allElements).filter((el) => el.offsetParent !== null);

  for (const element of elements) {
    const fullText = element.dataset.typewriterText || element.textContent || "";
    if (!fullText) continue;

    // Save text & clear
    if (!element.dataset.typewriterText) {
      element.dataset.typewriterText = fullText;
    }
    element.textContent = "";

    // Delay before this line starts
    const lineDelay = parseInt(element.dataset.typewriterDelay || "80", 10);
    await new Promise<void>((r) => {
      const id = setTimeout(r, lineDelay);
      activeTimers.push(id);
    });

    // Show parent line (icon/prompt)
    const parentLine = element.closest("[data-typewriter-line]") as HTMLElement | null;
    if (parentLine) gsap.set(parentLine, { opacity: 1 });

    // Type it character by character
    await new Promise<void>((resolve) => typeChars(element, fullText, resolve));
  }

  // Reveal orphan lines (no visible typewriter children, e.g. tech badges on mobile)
  const allLines = panel.querySelectorAll("[data-typewriter-line]") as NodeListOf<HTMLElement>;
  allLines.forEach((line) => {
    if (line.offsetParent === null) return;
    const hasVisibleTW = Array.from(line.querySelectorAll("[data-typewriter]")).some(
      (el) => (el as HTMLElement).offsetParent !== null
    );
    if (!hasVisibleTW) gsap.set(line, { opacity: 1 });
  });

  // Reveal [data-typewriter-reveal] elements (CTA buttons etc)
  const reveals = panel.querySelectorAll("[data-typewriter-reveal]") as NodeListOf<HTMLElement>;
  reveals.forEach((el) => {
    const delay = parseInt((el as HTMLElement).dataset.typewriterDelay || "200", 10);
    const id = setTimeout(() => {
      gsap.to(el, { opacity: 1, duration: 0.4, ease: "power2.out" });
    }, delay);
    activeTimers.push(id);
  });
}

function resetPanel(panel: HTMLElement) {
  const elements = panel.querySelectorAll("[data-typewriter]") as NodeListOf<HTMLElement>;
  elements.forEach((el) => {
    if (el.dataset.typewriterText) el.textContent = "";
  });
  const reveals = panel.querySelectorAll("[data-typewriter-reveal]") as NodeListOf<HTMLElement>;
  reveals.forEach((el) => gsap.set(el, { opacity: 0 }));
  const lines = panel.querySelectorAll("[data-typewriter-line]") as NodeListOf<HTMLElement>;
  lines.forEach((line) => gsap.set(line, { opacity: 0 }));
}

function preparePanel_internal(panel: HTMLElement) {
  const lines = panel.querySelectorAll("[data-typewriter-line]") as NodeListOf<HTMLElement>;
  lines.forEach((line) => gsap.set(line, { opacity: 0 }));

  const elements = panel.querySelectorAll("[data-typewriter]") as NodeListOf<HTMLElement>;
  elements.forEach((el) => {
    if (!el.dataset.typewriterText && el.textContent) {
      el.dataset.typewriterText = el.textContent;
    }
    el.textContent = "";
  });

  const reveals = panel.querySelectorAll("[data-typewriter-reveal]") as NodeListOf<HTMLElement>;
  reveals.forEach((el) => gsap.set(el, { opacity: 0 }));
}

// ── Public API ──

export function typewriteIntroPanel() {
  clearAll();
  currentPanelIndex = -1;

  const introPanel = document.querySelector("[data-intro-panel]") as HTMLElement | null;
  if (!introPanel) return;

  preparePanel_internal(introPanel);

  const introCta = introPanel.querySelector("[data-intro-cta]") as HTMLElement | null;
  if (introCta) gsap.set(introCta, { opacity: 0 });

  typewritePanel(introPanel).then(() => {
    if (introCta) {
      gsap.to(introCta, { opacity: 1, duration: 0.4, delay: 0.2, ease: "power2.out" });
    }
  });
}

export function preparePanel(panelSelector: string) {
  const panel = document.querySelector(panelSelector) as HTMLElement | null;
  if (!panel) return;
  preparePanel_internal(panel);
}

export function typewriteProjectPanel(index: number) {
  if (index === currentPanelIndex) return;
  clearAll();

  if (currentPanelIndex >= 0) {
    const prev = document.querySelector(`[data-project-panel="${currentPanelIndex + 1}"]`) as HTMLElement | null;
    if (prev) resetPanel(prev);
  }

  currentPanelIndex = index;
  const target = document.querySelector(`[data-project-panel="${index + 1}"]`) as HTMLElement | null;
  if (target) typewritePanel(target);
}

export function typewriteCtaPanel(totalProjects: number) {
  clearAll();
  const ctaPanel = document.querySelector("[data-cta-panel]") as HTMLElement | null;
  if (!ctaPanel) return;
  currentPanelIndex = totalProjects;
  typewritePanel(ctaPanel);
}

export function resetPortfolioTypewriter() {
  clearAll();
  currentPanelIndex = -1;

  const allPanels = document.querySelectorAll("[data-project-panel]") as NodeListOf<HTMLElement>;
  allPanels.forEach((panel) => {
    const idx = parseInt(panel.dataset.projectPanel || "-1", 10);
    if (idx > 0) {
      const reveals = panel.querySelectorAll("[data-typewriter-reveal]") as NodeListOf<HTMLElement>;
      reveals.forEach((el) => gsap.set(el, { opacity: 0 }));
      const twElements = panel.querySelectorAll("[data-typewriter]") as NodeListOf<HTMLElement>;
      twElements.forEach((el) => {
        if (el.dataset.typewriterText) el.textContent = el.dataset.typewriterText;
        delete el.dataset.typewriterText;
      });
    }
  });

  const introPanel = document.querySelector("[data-intro-panel]") as HTMLElement | null;
  if (introPanel) {
    preparePanel_internal(introPanel);
    const introCta = introPanel.querySelector("[data-intro-cta]") as HTMLElement | null;
    if (introCta) gsap.set(introCta, { opacity: 0 });
  }

  const ctaPanel = document.querySelector("[data-cta-panel]") as HTMLElement | null;
  if (ctaPanel) {
    const reveals = ctaPanel.querySelectorAll("[data-typewriter-reveal]") as NodeListOf<HTMLElement>;
    reveals.forEach((el) => gsap.set(el, { opacity: 0 }));
    const twElements = ctaPanel.querySelectorAll("[data-typewriter]") as NodeListOf<HTMLElement>;
    twElements.forEach((el) => {
      if (el.dataset.typewriterText) el.textContent = el.dataset.typewriterText;
      delete el.dataset.typewriterText;
    });
  }
}

export function getCurrentPanelIndex(): number {
  return currentPanelIndex;
}

// Reset on portfolio exit
if (typeof window !== "undefined") {
  window.addEventListener("portfolioReset", () => {
    resetPortfolioTypewriter();
  });
}
