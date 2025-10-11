"use client";

import { gsap } from "@/lib/animations";

let closeMenuFn: (() => void) | null = null;
let isAnimating = false;
let currentTimeline: gsap.core.Timeline | null = null;

export function initMenuAnimations() {
  const menuTrigger = document.querySelector('[data-animate="menu-trigger"]');
  const menuOverlay = document.querySelector('[data-animate="menu-overlay"]');
  const menuBlob = document.querySelector('[data-animate="menu-blob"]');
  const menuContainer = document.querySelector('[data-animate="menu-container"]');
  const menuContent = document.querySelector('[data-animate="menu-content"]');

  if (!menuTrigger || !menuOverlay || !menuBlob || !menuContainer || !menuContent) return;

  let isOpen = false;

  const handleClick = () => {
    if (isAnimating) return;

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
    isOpen = !isOpen;
  };

  menuTrigger.addEventListener("click", handleClick);

  function getThemeState() {
    const root = document.documentElement;
    const isLight = !root.classList.contains("dark");
    return { isLight };
  }

  function killCurrentAnimation() {
    if (currentTimeline) {
      currentTimeline.kill();
      currentTimeline = null;
    }
  }

  function resetMenuToClosedState() {
    const menuItems = document.querySelectorAll('[data-animate="menu-item"]');
    const line1 = document.querySelector('[data-animate="burger-line-1"]');
    const line2 = document.querySelector('[data-animate="burger-line-2"]');
    const line3 = document.querySelector('[data-animate="burger-line-3"]');

    gsap.set(menuContainer, { pointerEvents: "none" });
    gsap.set(menuOverlay, { opacity: 0, pointerEvents: "none" });
    gsap.set(menuContent, { opacity: 0 });
    gsap.set(menuBlob, { scale: 1, rotate: 0 });
    gsap.set(menuItems, { opacity: 0, x: -30 });
    gsap.set([line1, line3], { rotation: 0, y: 0 });
    gsap.set(line2, { opacity: 1 });
  }

  async function openMenu() {
    isAnimating = true;
    killCurrentAnimation();

    const { isLight } = getThemeState();
    const menuItems = document.querySelectorAll('[data-animate="menu-item"]');
    const line1 = document.querySelector('[data-animate="burger-line-1"]');
    const line2 = document.querySelector('[data-animate="burger-line-2"]');
    const line3 = document.querySelector('[data-animate="burger-line-3"]');

    gsap.set(menuContainer, { pointerEvents: "auto" });

    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 768;
    const blobScale = isMobile ? 12 : 18;
    const yOffset = isMobile ? 6 : 8;

    currentTimeline = gsap.timeline({
      onComplete: () => {
        isAnimating = false;
        currentTimeline = null;
      },
    });

    currentTimeline
      .to([line1, line3], { 
        y: yOffset, 
        duration: 0.2, 
        ease: "power2.out" 
      }, 0)
      .to(line1, { 
        rotation: 45, 
        duration: 0.2, 
        ease: "power2.out" 
      }, 0.2)
      .to(line3, { 
        rotation: -45, 
        y: -yOffset, 
        duration: 0.2, 
        ease: "power2.out" 
      }, 0.2)
      .to(line2, { 
        opacity: 0, 
        duration: 0.15 
      }, 0)
      .to(menuBlob, {
        scale: blobScale,
        duration: 0.7,
        rotate: isLight ? 8 : 5,
        ease: "power3.out",
      }, 0.1)
      .to(menuOverlay, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.5,
        ease: "power2.out",
      }, 0.3)
      .to(menuContent, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      }, 0.4)
      .fromTo(menuItems, {
        x: -30,
        opacity: 0,
      }, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      }, 0.5);
  }

  function closeMenu() {
    isAnimating = true;
    killCurrentAnimation();

    const menuItems = document.querySelectorAll('[data-animate="menu-item"]');
    const line1 = document.querySelector('[data-animate="burger-line-1"]');
    const line2 = document.querySelector('[data-animate="burger-line-2"]');
    const line3 = document.querySelector('[data-animate="burger-line-3"]');

    currentTimeline = gsap.timeline({
      onComplete: () => {
        isAnimating = false;
        currentTimeline = null;
        resetMenuToClosedState();
      },
    });

    currentTimeline
      .to(menuItems, {
        x: -30,
        opacity: 0,
        duration: 0.3,
        stagger: 0.04,
        ease: "power2.in",
      }, 0)
      .to(menuContent, { 
        opacity: 0, 
        duration: 0.3, 
        ease: "power2.in" 
      }, 0.1)
      .to(menuOverlay, { 
        opacity: 0, 
        pointerEvents: "none", 
        duration: 0.4, 
        ease: "power2.in" 
      }, 0.2)
      .to(menuBlob, { 
        scale: 1, 
        duration: 0.5, 
        rotate: 0, 
        ease: "power3.out" 
      }, 0.2)
      .to([line1, line3], { 
        rotation: 0, 
        y: 0, 
        duration: 0.2, 
        ease: "power2.inOut" 
      }, 0.3)
      .to(line2, { 
        opacity: 1, 
        duration: 0.15 
      }, 0.4);
  }

  closeMenuFn = closeMenu;

  return () => {
    menuTrigger.removeEventListener("click", handleClick);
    killCurrentAnimation();
    resetMenuToClosedState();
  };
}

export function closeMenuWithAnimation() {
  if (closeMenuFn) {
    closeMenuFn();
  }
}