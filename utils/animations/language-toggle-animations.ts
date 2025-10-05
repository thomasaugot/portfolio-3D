import { gsap } from "@/lib/animations";

export function initLanguageToggleAnimations() {
  const globeRef = document.querySelector('[data-animate="globe"]') as HTMLDivElement;
  const continentsRef = document.querySelector('[data-animate="continents"]') as HTMLDivElement;
  const currentFlagRef = document.querySelector('[data-animate="current-flag"]') as HTMLDivElement;
  const nextFlagRef = document.querySelector('[data-animate="next-flag"]') as HTMLDivElement;
  const orbitRef = document.querySelector('[data-animate="language-orbit"]') as HTMLDivElement;
  
  if (!globeRef || !continentsRef || !currentFlagRef || !nextFlagRef || !orbitRef) return;

  gsap.set(continentsRef, { rotation: 0 });
  gsap.set(orbitRef, { rotation: 0 });
  
  const continentsTween = gsap.to(continentsRef, {
    rotation: 360,
    duration: 30,
    ease: "none",
    repeat: -1,
  });
  
  const orbitTween = gsap.to(orbitRef, {
    rotation: 360,
    duration: 20,
    ease: "none",
    repeat: -1,
  });

  return () => {
    continentsTween.kill();
    orbitTween.kill();
  };
}

export function animateLanguageChange(currentLang: string, nextLang: string) {
  const currentFlagRef = document.querySelector('[data-animate="current-flag"]') as HTMLDivElement;
  const nextFlagRef = document.querySelector('[data-animate="next-flag"]') as HTMLDivElement;
  const globeRef = document.querySelector('[data-animate="globe"]') as HTMLDivElement;
  const continentsRef = document.querySelector('[data-animate="continents"]') as HTMLDivElement;
  
  if (!currentFlagRef || !nextFlagRef || !globeRef || !continentsRef) return;

  const tl = gsap.timeline();
  
  tl.to(globeRef, {
    scale: 1.1,
    duration: 0.3,
    ease: "power2.out",
  })
  .to(globeRef, {
    scale: 1,
    duration: 0.3,
    ease: "power2.out",
  })
  .to(continentsRef, {
    rotation: "+=120",
    duration: 0.6,
    ease: "power2.out",
  }, "-=0.4")
  .to(currentFlagRef, {
    scale: 0,
    rotation: 180,
    opacity: 0,
    duration: 0.4,
    ease: "power2.in",
  }, "-=0.5")
  .to(nextFlagRef, {
    scale: 1,
    rotation: 0,
    opacity: 1,
    duration: 0.4,
    ease: "power2.out",
  }, "-=0.2");
  
  return tl;
}