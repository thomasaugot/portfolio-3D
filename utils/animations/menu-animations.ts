"use client";

import { gsap } from "./gsap-init";

let closeMenuFn: (() => gsap.core.Timeline | void) | null = null;

export function initMenuAnimations() {
  const menuTrigger = document.querySelector('[data-animate="menu-trigger"]');
  const menuOverlay = document.querySelector('[data-animate="menu-overlay"]');
  const menuBlob = document.querySelector('[data-animate="menu-blob"]');
  const menuContainer = document.querySelector('[data-animate="menu-container"]');

  if (!menuTrigger || !menuOverlay || !menuBlob || !menuContainer) return;

  let isOpen = false;

  menuTrigger.addEventListener("click", () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
    isOpen = !isOpen;
  });

  function openMenu() {
    const menuItems = document.querySelectorAll('[data-animate="menu-item"]');
    const menuLines = document.querySelectorAll('[data-animate="menu-line"]');
    const line1 = document.querySelector('[data-animate="burger-line-1"]');
    const line2 = document.querySelector('[data-animate="burger-line-2"]');
    const line3 = document.querySelector('[data-animate="burger-line-3"]');

    menuContainer?.setAttribute("style", "pointer-events:auto");

    const tl = gsap.timeline();

    tl.to(line1, { y: 8, rotation: 45, duration: 0.3, ease: "power2.inOut" }, 0.2)
      .to(line3, { y: -8, rotation: -45, duration: 0.3, ease: "power2.inOut" }, 0.2)
      .to(line2, { opacity: 0, duration: 0.2 }, 0)
      .to(
        menuBlob,
        {
          scale: 26,
          duration: 0.8,
          rotate: 8,
          ease: "power3.inOut",
          transformOrigin: "center center",
        },
        0.3
      )
      .to(menuOverlay, { opacity: 1, pointerEvents: "auto", duration: 0.3 }, "-=0.5")
      .fromTo(
        menuItems,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
        "-=0.2"
      )
      .fromTo(
        menuLines,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.3"
      );

    // ADD HOVER ANIMATIONS AFTER MENU IS OPEN
    setTimeout(() => {
      initMenuItemHovers();
    }, 800);
  }

  function closeMenu() {
    const menuItems = document.querySelectorAll('[data-animate="menu-item"]');
    const menuLines = document.querySelectorAll('[data-animate="menu-line"]');
    const line1 = document.querySelector('[data-animate="burger-line-1"]');
    const line2 = document.querySelector('[data-animate="burger-line-2"]');
    const line3 = document.querySelector('[data-animate="burger-line-3"]');

    const tl = gsap.timeline({
      onComplete: () => {
        menuContainer?.setAttribute("style", "pointer-events:none");
      },
    });

    tl.to(menuLines, { scaleX: 0, duration: 0.3, stagger: 0.05 })
      .to(menuItems, { y: -40, opacity: 0, duration: 0.4, stagger: 0.05 }, "-=0.2")
      .to(menuOverlay, { opacity: 0, pointerEvents: "none", duration: 0.3 }, "-=0.2")
      .to(menuBlob, { scale: 1, duration: 0.6, rotate: 0, ease: "back.out(1.7)" }, "-=0.3")
      .to([line1, line3], { rotation: 0, y: 0, duration: 0.3 }, "-=0.4")
      .to(line2, { opacity: 1, duration: 0.2 }, "-=0.2");

    return tl;
  }

  closeMenuFn = closeMenu;
}

// NEW FUNCTION FOR HOVER EFFECTS
function initMenuItemHovers() {
  const menuTexts = document.querySelectorAll('[data-animate="menu-text"]');
  
  menuTexts.forEach((text) => {
    const link = text.closest('a');
    if (!link) return;

    link.addEventListener('mouseenter', () => {
      gsap.to(text, {
        scale: 1.05,
        x: -8,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    link.addEventListener('mouseleave', () => {
      gsap.to(text, {
        scale: 1,
        x: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });
}

export function closeMenuWithAnimation() {
  if (closeMenuFn) {
    return closeMenuFn();
  }
}