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

    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;
    const isDesktop = screenWidth >= 1024;

    // Calculate proper offset based on actual line width and gap
    let blobScale, lineOffset;
    
    if (isMobile) {
      // Mobile: w-5 (20px) lines with gap-1 (4px) = need ~6px offset
      blobScale = 15;
      lineOffset = 6;
    } else if (isTablet) {
      // Tablet: w-5 (20px) lines with gap-1 (4px) = same as mobile
      blobScale = 20;
      lineOffset = 6; // Same as mobile since tablet uses same w-5 lines
    } else {
      // Desktop: w-8 (32px) lines with gap-1.5 (6px) = need ~8px offset  
      blobScale = 26;
      lineOffset = 8;
    }

    const tl = gsap.timeline();

    // Responsive offset based on actual screen width
    let yOffset;
    
    if (screenWidth < 640) {
      yOffset = 6; // Mobile phones
    } else if (screenWidth < 1024) {
      yOffset = 8; // Tablets  
    } else {
      yOffset = 8; // Desktop
    }

    // Cross animation with responsive offset
    tl.to(line1, { 
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
      
      // Blob expansion
      .to(
        menuBlob,
        {
          scale: blobScale,
          duration: 0.6,
          rotate: 6,
          ease: "power3.inOut",
          transformOrigin: "center center",
        },
        0.2
      )
      
      // Overlay animation
      .to(menuOverlay, { opacity: 1, pointerEvents: "auto", duration: 0.3 }, "-=0.4")
      
      // Menu items stagger animation
      .fromTo(
        menuItems,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
        "-=0.2"
      )
      
      // Lines animation
      .fromTo(
        menuLines,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" },
        "-=0.1"
      );

    // Desktop hover effects
    if (!isMobile) {
      setTimeout(() => {
        initMenuItemHovers();
      }, 800);
    }
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

    tl.to(menuLines, { scaleX: 0, duration: 0.3, stagger: 0.04 })
      .to(menuItems, { y: -30, opacity: 0, duration: 0.4, stagger: 0.04 }, "-=0.2")
      .to(menuOverlay, { opacity: 0, pointerEvents: "none", duration: 0.3 }, "-=0.2")
      .to(menuBlob, { scale: 1, duration: 0.5, rotate: 0, ease: "back.out(1.4)" }, "-=0.3")
      .to([line1, line3], { rotation: 0, y: 0, duration: 0.3, ease: "power2.inOut" }, "-=0.3")
      .to(line2, { opacity: 1, duration: 0.2 }, "-=0.2");

    return tl;
  }

  closeMenuFn = closeMenu;
}

function initMenuItemHovers() {
  const menuTexts = document.querySelectorAll('[data-animate="menu-text"]');

  menuTexts.forEach((text) => {
    const link = text.closest('a');
    if (!link) return;

    link.addEventListener('mouseenter', () => {
      gsap.to(text, {
        scale: 1.02,
        x: -6,
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