import { gsap } from "@/lib/gsap";

const getTerminal = () => document.querySelector("[data-terminal-wrapper]") as HTMLElement | null;
const getLaptop = () => document.querySelector("[data-laptop]") as HTMLElement | null;
const getAbout = () => document.querySelector("[data-about-section]") as HTMLElement | null;

export const initTerminalPosition = () => {
  const terminal = getTerminal();
  if (!terminal) return;
  gsap.set(terminal, {
    top: "50%",
    left: "50%",
    xPercent: -50,
    yPercent: -50,
    bottom: "auto",
    right: "auto",
    scale: 1,
    width: "min(580px, 88vw)",
    opacity: 1,
  });
};

export const transitionToAbout = (onComplete: () => void) => {
  const terminal = getTerminal();
  const laptop = getLaptop();
  const about = getAbout();

  const tl = gsap.timeline();

  tl.to(terminal, {
    top: "auto",
    bottom: 24,
    left: 24,
    xPercent: 0,
    yPercent: 0,
    width: 300,
    scale: 0.85,
    duration: 0.8,
    ease: "power3.inOut",
  }, 0);

  tl.to(laptop, {
    opacity: 0,
    scale: 0.9,
    duration: 0.6,
    ease: "power2.out",
  }, 0);

  tl.call(onComplete, [], 0.5);
  tl.set(about, { visibility: "visible" }, 0.5);
  tl.fromTo(about, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.55);

  tl.fromTo("[data-about-left]",
    { x: -60, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
    0.7
  );

  tl.fromTo("[data-about-right]",
    { x: 60, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
    0.75
  );

  tl.fromTo("[data-about-stat]",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "back.out(2)" },
    1.0
  );

  tl.fromTo("[data-about-tech]",
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.3, stagger: 0.03, ease: "power2.out" },
    1.2
  );

  tl.fromTo("[data-about-cta]",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" },
    1.4
  );

  return tl;
};

export const transitionToPortfolio = (onComplete: () => void) => {
  const terminal = getTerminal();
  const about = getAbout();

  const tl = gsap.timeline();

  tl.to(about, {
    opacity: 0,
    scale: 0.95,
    duration: 0.5,
    ease: "power2.in",
  }, 0);

  tl.to(terminal, {
    left: "50%",
    bottom: "auto",
    top: "50%",
    xPercent: -50,
    yPercent: -50,
    width: "min(500px, 80vw)",
    scale: 1,
    duration: 0.6,
    ease: "power3.out",
  }, 0.3);

  tl.call(onComplete, [], 0.6);

  return tl;
};
