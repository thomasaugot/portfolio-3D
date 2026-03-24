export function prefersReducedMotion() {
  if (typeof document !== "undefined") {
    return document.documentElement.dataset.motionPreference === "reduced";
  }

  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  return false;
}

export function motionDuration(duration: number, reducedDuration = 0.42) {
  return prefersReducedMotion() ? reducedDuration : duration;
}

export function motionDelay(delay: number, reducedDelay = 0.08) {
  return prefersReducedMotion() ? reducedDelay : delay;
}
