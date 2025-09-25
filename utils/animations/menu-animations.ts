import { gsap } from "./gsap-init";

export function initMenuAnimations() {
  const menuTrigger = document.querySelector('[data-animate="menu-trigger"]');
  const menuOverlay = document.querySelector('[data-animate="menu-overlay"]');
  const menuBlob = document.querySelector('[data-animate="menu-blob"]');

  if (!menuTrigger || !menuOverlay || !menuBlob) return;

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

    const tl = gsap.timeline();

    // Burger → Cross
    tl.to(
      line1,
      {
        y: 8,
        rotation: 45,
        transformOrigin: "center",
        duration: 0.3,
        ease: "power2.inOut",
        zIndex: "999"
      },
      0.2
    )
      .to(
        line3,
        {
          y: -8,
          rotation: -45,
          transformOrigin: "center",
          duration: 0.3,
          ease: "power2.inOut",
          zIndex: "999"
        },
        0.2
      )
      .to(line2, { opacity: 0, duration: 0.2, ease: "power2.inOut" }, 0)

      // Expand blob behind
      .to(
        menuBlob,
        {
          scale: 38,
          opacity: 1,
          duration: 0.8,
          zIndex: -10,
          ease: "power3.inOut",
        },
        0.3
      )
      .to(
        menuOverlay,
        { opacity: 1, pointerEvents: "auto", duration: 0.3 },
        "-=0.5"
      )

      // Animate menu items
      .fromTo(
        menuItems,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          zIndex: "999",
          ease: "power3.out",
        },
        "-=0.2"
      )
      .fromTo(
        menuLines,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.6,
          stagger: 0.1,
          zIndex: "999",
          ease: "power2.out",
        },
        "-=0.3"
      );
  }

  function closeMenu() {
    const menuItems = document.querySelectorAll('[data-animate="menu-item"]');
    const menuLines = document.querySelectorAll('[data-animate="menu-line"]');
    const line1 = document.querySelector('[data-animate="burger-line-1"]');
    const line2 = document.querySelector('[data-animate="burger-line-2"]');
    const line3 = document.querySelector('[data-animate="burger-line-3"]');

    const tl = gsap.timeline();

    // Hide items
    tl.to(menuLines, {
      scaleX: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: "power2.in",
    })
      .to(
        menuItems,
        { y: -40, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.in" },
        "-=0.2"
      )
      .to(
        menuOverlay,
        { opacity: 0, pointerEvents: "none", duration: 0.3 },
        "-=0.2"
      )

      // Reset blob
      .to(
        menuBlob,
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.3"
      )

      // Cross → Burger
      .to(
        [line1, line3],
        { rotation: 0, y: 0, duration: 0.3, ease: "power2.inOut" },
        "-=0.4"
      )
      .to(line2, { opacity: 1, duration: 0.2, ease: "power2.inOut" }, "-=0.2");
  }

  // Hover animations for each item
  const menuItems = document.querySelectorAll('[data-animate="menu-item"]');
  menuItems.forEach((item) => {
    const line = item.querySelector('[data-animate="menu-line"]');
    const text = item.querySelector('[data-animate="menu-text"]');
    const desc = item.querySelector('[data-animate="menu-desc"]');

    item.addEventListener("mouseenter", () => {
      if (line)
        gsap.to(line, { scaleX: 1.3, duration: 0.4, ease: "power2.out" });
      if (text) gsap.to(text, { x: 10, duration: 0.4, ease: "power2.out" });
      if (desc)
        gsap.to(desc, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
    });

    item.addEventListener("mouseleave", () => {
      if (line) gsap.to(line, { scaleX: 1, duration: 0.3, ease: "power2.in" });
      if (text) gsap.to(text, { x: 0, duration: 0.3, ease: "power2.in" });
      if (desc)
        gsap.to(desc, { opacity: 0, y: 5, duration: 0.2, ease: "power2.in" });
    });
  });
}
