import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/utils/motion";

let typewriterTween: gsap.core.Tween | null = null;
let retryTimeout: ReturnType<typeof setTimeout> | null = null;

export function initNavbarTypewriter() {
  if (typewriterTween) {
    typewriterTween.kill();
    typewriterTween = null;
  }
  if (retryTimeout) {
    clearTimeout(retryTimeout);
    retryTimeout = null;
  }

  let target: HTMLSpanElement | null = null;
  let fullText = "";
  let attempts = 0;
  const maxAttempts = 60;

  const tryInit = () => {
    target = document.querySelector(
      "[data-navbar-typewriter]"
    ) as HTMLSpanElement | null;
    if (!target) {
      if (attempts < maxAttempts) {
        attempts += 1;
        retryTimeout = setTimeout(tryInit, 50);
      }
      return;
    }

    fullText = target.dataset.text || target.textContent || "";
    if (!fullText) return;

    if (prefersReducedMotion()) {
      target.textContent = fullText;
      return;
    }

    target.textContent = "";

    const state = { index: 0 };
    typewriterTween = gsap.to(state, {
      index: fullText.length,
      duration: 1.8,
      ease: "none",
      onUpdate: () => {
        const current = Math.floor(state.index);
        if (target) {
          target.textContent = fullText.slice(0, current);
        }
      },
      onComplete: () => {
        if (target) {
          target.textContent = fullText;
        }
      },
    });
  };

  tryInit();

  return () => {
    if (typewriterTween) {
      typewriterTween.kill();
      typewriterTween = null;
    }
    if (retryTimeout) {
      clearTimeout(retryTimeout);
      retryTimeout = null;
    }
    if (target) {
      target.textContent = fullText;
    }
  };
}
