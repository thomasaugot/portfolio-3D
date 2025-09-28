"use client";

import { gsap } from "./gsap-init";

let closeMenuFn: (() => gsap.core.Timeline | void) | null = null;
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
    const isLight = !root.classList.contains('dark');
    return { isLight, isDark: !isLight };
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
    gsap.set(menuLines, { scaleX: 0, opacity: 0 });
    gsap.set([line1, line3], { rotation: 0, y: 0 });
    gsap.set(line2, { opacity: 1 });
  }

  function openMenu() {
    if (isAnimating) return;
    
    isAnimating = true;
    killCurrentAnimation();

    const { isLight } = getThemeState();
    const menuItems = document.querySelectorAll('[data-animate="menu-item"]');
    const menuLines = document.querySelectorAll('[data-animate="menu-line"]');
    const line1 = document.querySelector('[data-animate="burger-line-1"]');
    const line2 = document.querySelector('[data-animate="burger-line-2"]');
    const line3 = document.querySelector('[data-animate="burger-line-3"]');

    menuContainer?.setAttribute("style", "pointer-events:auto");

    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;

    let blobScale, lineOffset;
    
    if (isMobile) {
      blobScale = 15;
      lineOffset = 6;
    } else if (isTablet) {
      blobScale = 20;
      lineOffset = 6;
    } else {
      blobScale = 26;
      lineOffset = 8;
    }

    currentTimeline = gsap.timeline({
      onComplete: () => {
        isAnimating = false;
        currentTimeline = null;
        if (!isMobile) {
          setTimeout(() => {
            initMenuItemHovers();
          }, isLight ? 900 : 800);
        }
      },
      onInterrupt: () => {
        isAnimating = false;
        currentTimeline = null;
      }
    });

    let yOffset;
    
    if (screenWidth < 640) {
      yOffset = 6;
    } else if (screenWidth < 1024) {
      yOffset = 8;
    } else {
      yOffset = 8;
    }

    currentTimeline.to(line1, { 
        y: yOffset, 
        rotation: 45, 
        duration: 0.3, 
        ease: "power2.inOut" 
      }, 0.2)
      .to(line3, { 
        y: -yOffset, 
        rotation: -45, 
        duration: 0.3, 
        ease: "power2.inOut" 
      }, 0.2)
      .to(line2, { opacity: 0, duration: 0.2 }, 0)
      .to(
        menuBlob,
        {
          scale: blobScale,
          duration: isLight ? 0.7 : 0.6,
          rotate: isLight ? 12 : 6,
          ease: isLight ? "power3.out" : "power3.inOut",
          transformOrigin: "center center",
        },
        0.2
      )
      .to(menuOverlay, { 
        opacity: 1, 
        pointerEvents: "auto", 
        duration: isLight ? 0.4 : 0.3,
        ease: "power2.out"
      }, "-=0.4")
      .fromTo(
        menuItems,
        { 
          y: isLight ? 50 : 40, 
          opacity: 0,
          scale: isLight ? 0.9 : 1
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: isLight ? 0.6 : 0.5, 
          stagger: isLight ? 0.1 : 0.08, 
          ease: isLight ? "back.out(1.2)" : "power2.out" 
        },
        "-=0.2"
      )
      .fromTo(
        menuLines,
        { scaleX: 0, opacity: 0 },
        { 
          scaleX: 1, 
          opacity: 1,
          duration: isLight ? 0.5 : 0.4, 
          stagger: isLight ? 0.1 : 0.08, 
          ease: isLight ? "power3.out" : "power2.out" 
        },
        "-=0.1"
      );
  }

  function closeMenu() {
    if (isAnimating) return;
    
    isAnimating = true;
    killCurrentAnimation();

    const { isLight } = getThemeState();
    const menuItems = document.querySelectorAll('[data-animate="menu-item"]');
    const menuLines = document.querySelectorAll('[data-animate="menu-line"]');
    const line1 = document.querySelector('[data-animate="burger-line-1"]');
    const line2 = document.querySelector('[data-animate="burger-line-2"]');
    const line3 = document.querySelector('[data-animate="burger-line-3"]');

    currentTimeline = gsap.timeline({
      onComplete: () => {
        menuContainer?.setAttribute("style", "pointer-events:none");
        isAnimating = false;
        currentTimeline = null;
        resetMenuToClosedState();
      },
      onInterrupt: () => {
        isAnimating = false;
        currentTimeline = null;
        resetMenuToClosedState();
      }
    });

    currentTimeline.to(menuLines, { 
        scaleX: 0, 
        opacity: 0,
        duration: isLight ? 0.4 : 0.3, 
        stagger: 0.04,
        ease: "power2.in"
      })
      .to(menuItems, { 
        y: isLight ? -40 : -30, 
        opacity: 0, 
        scale: isLight ? 0.9 : 1,
        duration: isLight ? 0.5 : 0.4, 
        stagger: 0.04,
        ease: "power2.in"
      }, "-=0.2")
      .to(menuOverlay, { 
        opacity: 0, 
        pointerEvents: "none", 
        duration: isLight ? 0.4 : 0.3,
        ease: "power2.in"
      }, "-=0.2")
      .to(menuBlob, { 
        scale: 1, 
        duration: isLight ? 0.6 : 0.5, 
        rotate: 0, 
        ease: isLight ? "back.out(1.7)" : "back.out(1.4)" 
      }, "-=0.3")
      .to([line1, line3], { 
        rotation: 0, 
        y: 0, 
        duration: 0.3, 
        ease: "power2.inOut" 
      }, "-=0.3")
      .to(line2, { opacity: 1, duration: 0.2 }, "-=0.2");

    return currentTimeline;
  }

  closeMenuFn = closeMenu;

  return () => {
    menuTrigger.removeEventListener("click", handleClick);
    killCurrentAnimation();
    resetMenuToClosedState();
  };
}

function initMenuItemHovers() {
  const { isLight } = getThemeState();
  const menuTexts = document.querySelectorAll('[data-animate="menu-text"]');

  function getThemeState() {
    const root = document.documentElement;
    const isLight = !root.classList.contains('dark');
    return { isLight, isDark: !isLight };
  }

  menuTexts.forEach((text) => {
    const link = text.closest('a');
    if (!link) return;

    link.addEventListener('mouseenter', () => {
      const { isLight } = getThemeState();
      
      gsap.to(text, {
        scale: isLight ? 1.05 : 1.02,
        x: isLight ? -8 : -6,
        duration: isLight ? 0.4 : 0.3,
        ease: isLight ? "power3.out" : "power2.out"
      });

      if (isLight) {
        gsap.to(text, {
          textShadow: "0 0 20px rgba(204, 255, 2, 0.3)",
          duration: 0.4,
          ease: "power2.out"
        });
      }
    });

    link.addEventListener('mouseleave', () => {
      const { isLight } = getThemeState();
      
      gsap.to(text, {
        scale: 1,
        x: 0,
        textShadow: isLight ? "none" : undefined,
        duration: isLight ? 0.4 : 0.3,
        ease: isLight ? "power3.out" : "power2.out"
      });
    });
  });
}

export function closeMenuWithAnimation() {
  if (closeMenuFn && !isAnimating) {
    return closeMenuFn();
  }
}