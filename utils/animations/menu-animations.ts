"use client";

import { gsap } from "./gsap-init";
import { initContactBlockAnimations, resetContactBlockToClosedState } from "./contact-block-animations";

let closeMenuFn: (() => void) | null = null;
let isAnimating = false;
let currentTimeline: gsap.core.Timeline | null = null;

export function initMenuAnimations() {
  const menuTrigger = document.querySelector('[data-animate="menu-trigger"]');
  const menuOverlay = document.querySelector('[data-animate="menu-overlay"]');
  const menuBlob = document.querySelector('[data-animate="menu-blob"]');
  const menuContainer = document.querySelector('[data-animate="menu-container"]');

  if (!menuTrigger || !menuOverlay || !menuBlob || !menuContainer) return;

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
    const menuLines = document.querySelectorAll('[data-animate="menu-line"]');
    const line1 = document.querySelector('[data-animate="burger-line-1"]');
    const line2 = document.querySelector('[data-animate="burger-line-2"]');
    const line3 = document.querySelector('[data-animate="burger-line-3"]');

    gsap.set(menuContainer, { pointerEvents: "none" });
    gsap.set(menuOverlay, { opacity: 0, pointerEvents: "none" });
    gsap.set(menuBlob, { scale: 1, rotate: 0 });
    gsap.set(menuItems, { opacity: 0, y: 0, scale: 1 });
    gsap.set(menuLines, { scaleX: 0 });
    gsap.set([line1, line3], { rotation: 0, y: 0 });
    gsap.set(line2, { opacity: 1 });
  }

  function openMenu() {
    isAnimating = true;
    killCurrentAnimation();

    const { isLight } = getThemeState();
    const menuItems = document.querySelectorAll('[data-animate="menu-item"]');
    const menuLines = document.querySelectorAll('[data-animate="menu-line"]');
    const line1 = document.querySelector('[data-animate="burger-line-1"]');
    const line2 = document.querySelector('[data-animate="burger-line-2"]');
    const line3 = document.querySelector('[data-animate="burger-line-3"]');

    gsap.set(menuContainer, { pointerEvents: "auto" });

    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;
    const isDesktop = screenWidth >= 1024;

    let blobScale, yOffset;

    if (isMobile) {
      blobScale = 15;
      yOffset = 6;
    } else if (isTablet) {
      blobScale = 14;
      yOffset = 8;
    } else {
      blobScale = 26;
      yOffset = 8;
    }

    if (isDesktop) {
      initContactBlockAnimations();
    }

    currentTimeline = gsap.timeline({
      onComplete: () => {
        isAnimating = false;
        currentTimeline = null;
      },
    });

    currentTimeline
      .to([line1, line3], { y: yOffset, duration: 0.15, ease: "power2.out" }, 0)
      .to(line1, { rotation: 45, duration: 0.15, ease: "power2.out" }, 0.15)
      .to(line3, { rotation: -45, y: -yOffset, duration: 0.15, ease: "power2.out" }, 0.15)
      .to(line2, { opacity: 0, duration: 0.1 }, 0)
      .to(menuBlob, {
        scale: blobScale,
        duration: 0.5,
        rotate: isLight ? 12 : 6,
        ease: "power3.out",
        transformOrigin: "center center",
      }, 0.1)
      .to(menuOverlay, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.3,
        ease: "power2.out",
      }, "-=0.3")
      .fromTo(menuItems, {
        y: isLight ? 50 : 40,
        opacity: 0,
        scale: isLight ? 0.9 : 1,
      }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: isLight ? 0.5 : 0.4,
        stagger: 0.08,
        ease: isLight ? "back.out(1.2)" : "power2.out",
      }, "-=0.15")
      .fromTo(menuLines, {
        scaleX: 0,
        opacity: 0
      }, {
        scaleX: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.08,
        ease: "power3.out",
      }, "-=0.35");
  }

  function closeMenu() {
    isAnimating = true;
    killCurrentAnimation();
    resetContactBlockToClosedState();

    const { isLight } = getThemeState();
    const menuItems = document.querySelectorAll('[data-animate="menu-item"]');
    const menuLines = document.querySelectorAll('[data-animate="menu-line"]');
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
      .to(menuLines, { scaleX: 0, opacity: 0, duration: 0.2, stagger: 0.03, ease: "power2.in" }, 0)
      .to(menuItems, {
        y: isLight ? -40 : -30,
        opacity: 0,
        scale: isLight ? 0.9 : 1,
        duration: 0.3,
        stagger: 0.04,
        ease: "power2.in",
      }, 0.05)
      .to(menuOverlay, { opacity: 0, pointerEvents: "none", duration: 0.25, ease: "power2.in" }, "-=0.15")
      .to(menuBlob, { scale: 1, duration: 0.4, rotate: 0, ease: "back.out(1.4)" }, "-=0.2")
      .to([line1, line3], { rotation: 0, y: 0, duration: 0.2, ease: "power2.inOut" }, "-=0.2")
      .to(line2, { opacity: 1, duration: 0.15 }, "-=0.15");
  }

  closeMenuFn = closeMenu;

  return () => {
    menuTrigger.removeEventListener("click", handleClick);
    killCurrentAnimation();
    resetMenuToClosedState();
    resetContactBlockToClosedState();
  };
}

export function closeMenuWithAnimation() {
  if (closeMenuFn) {
    closeMenuFn();
  }
}