"use client";

import { useState, useEffect, useRef, useCallback, type CSSProperties } from "react";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useCanva } from "@/components/ui/Canva";
import SocialLinks from "@/components/ui/SocialLinks";
import { useTheme } from "@/contexts/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import gsap from "gsap";

export default function Navbar() {
  const { stage, goToHero, goToAbout, goToProjects, goToContact } = useCanva();
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);
  const ignoreNextToggleClickRef = useRef(false);
  const itemsRef = useRef<HTMLButtonElement[]>([]);
  const brandText = "~/helloimtom.dev";

  const getMenuFocusableElements = useCallback(() => {
    if (!menuRef.current) return [] as HTMLElement[];
    return Array.from(
      menuRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )
    );
  }, []);

  // Viewport detection: portrait tablets use mobile layout
  useEffect(() => {
    const checkViewport = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isTabletSize = w >= 768 && w < 1024;
      // Desktop: >= 1024px OR landscape tablet (768-1024px with width >= height)
      setIsDesktop(w >= 1024 || (isTabletSize && w >= h));
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    // Menu reveal with staggered wave effect
    if (menuRef.current) {
      // Quick fade in
      gsap.fromTo(
        menuRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" }
      );

      // Rings fade in, then clear inline styles so CSS spin animation works
      const rings = menuRef.current.querySelectorAll('[data-ring-outer], [data-ring-middle]');
      rings.forEach((ring, i) => {
        gsap.fromTo(
          ring,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            delay: 0.1 + i * 0.08,
            ease: "power2.out",
            onComplete: () => { gsap.set(ring, { clearProps: "all" }); },
          }
        );
      });
    }

    // Menu items cascade up from bottom with rotation
    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      gsap.fromTo(
        item,
        {
          y: 60,
          opacity: 0,
          rotateX: -15,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.5,
          delay: 0.15 + i * 0.1,
          ease: "power3.out"
        }
      );
    });
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isDesktop && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isDesktop, isMobileMenuOpen]);

  useEffect(() => {
    if (isDesktop) return;

    const previousOverflow = document.body.style.overflow;

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";

      const focusTarget = getMenuFocusableElements()[0];
      window.setTimeout(() => {
        focusTarget?.focus();
      }, 60);
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen, isDesktop, getMenuFocusableElements]);

  const closeMenu = useCallback((restoreFocus = false) => {
    restoreFocusRef.current = restoreFocus;

    if (menuRef.current) {
      gsap.killTweensOf(menuRef.current);
      const animatedElements = menuRef.current.querySelectorAll(
        '[data-ring-outer], [data-ring-middle], [data-menu-glow-1], [data-menu-glow-2]'
      );
      gsap.killTweensOf(animatedElements);
      itemsRef.current.forEach((item) => {
        if (item) {
          gsap.killTweensOf(item);
        }
      });
    }

    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen || !restoreFocusRef.current) return;

    restoreFocusRef.current = false;
    window.setTimeout(() => {
      toggleButtonRef.current?.focus();
    }, 0);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen || isDesktop) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key !== "Tab") return;

      const focusableItems = getMenuFocusableElements();
      if (focusableItems.length === 0) return;

      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, isDesktop, closeMenu, getMenuFocusableElements]);

  const handleNavClick = useCallback(
    (action: () => void) => {
      action();
      closeMenu();
    },
    [closeMenu]
  );

  const navItems = [
    { label: "About", stage: "about", onClick: goToAbout },
    { label: "Projects", stage: "projects", onClick: goToProjects },
    { label: "Contact", stage: "contact", onClick: goToContact },
  ];

  const mobileNavItems = [
    { label: "Home", stage: "hero", onClick: goToHero },
    ...navItems,
  ];

  const handleTogglePress = useCallback(() => {
    if (isMobileMenuOpen) {
      closeMenu(true);
    } else {
      setIsMobileMenuOpen(true);
    }
  }, [isMobileMenuOpen, closeMenu]);

  const renderMobileToggle = (className: string, style?: CSSProperties) => (
    <button
      ref={toggleButtonRef}
      type="button"
      onClick={() => {
        if (ignoreNextToggleClickRef.current) {
          ignoreNextToggleClickRef.current = false;
          return;
        }
        handleTogglePress();
      }}
      onTouchEnd={(event) => {
        event.preventDefault();
        ignoreNextToggleClickRef.current = true;
        handleTogglePress();
      }}
      className={`keyboard-focus-ring pointer-events-auto h-14 items-center justify-center gap-1 touch-manipulation ${className}`}
      aria-label="Toggle menu"
      aria-expanded={isMobileMenuOpen}
      aria-controls="mobile-menu"
      style={style}
    >
      <span
        className={`font-mono text-3xl font-light transition-all duration-500 ${
          isMobileMenuOpen ? "text-secondary" : "text-primary"
        }`}
      >
        {"{"}
      </span>

      <div className="flex items-center gap-1">
        <span
          className={`rounded-full bg-primary transition-all duration-500 ease-out origin-center ${
            isMobileMenuOpen
              ? "w-4 h-[2px] rotate-45 -mr-3"
              : "w-1.5 h-1.5"
          }`}
        />

        <span
          className={`rounded-full bg-secondary transition-all duration-500 ease-out ${
            isMobileMenuOpen
              ? "w-0 h-0 opacity-0"
              : "w-1.5 h-1.5 opacity-100"
          }`}
        />

        <span
          className={`rounded-full bg-primary transition-all duration-500 ease-out origin-center ${
            isMobileMenuOpen
              ? "w-4 h-[2px] -rotate-45 -ml-3"
              : "w-1.5 h-1.5"
          }`}
        />
      </div>

      <span
        className={`font-mono text-3xl font-light transition-all duration-500 ${
          isMobileMenuOpen ? "text-secondary" : "text-primary"
        }`}
      >
        {"}"}
      </span>
    </button>
  );

  return (
    <>
      <nav
        aria-label="Primary"
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
          isMobileMenuOpen ? "z-[9999] pointer-events-none" : "z-[9999]"
        } ${
          isScrolled ? "bg-bg/92 backdrop-blur-md border-b border-border [html[data-theme='light']_&]:bg-[#eee6d8]/88 [html[data-theme='light']_&]:border-b-[#cdbca0]" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button
              onClick={goToHero}
              aria-current={stage === "hero" ? "page" : undefined}
              className="keyboard-focus-ring flex items-center gap-2 rounded-lg px-1.5 py-1"
            >
              <span className="text-primary font-mono text-lg" data-navbar-typewriter data-text={brandText}>
                {brandText}
              </span>
              <span className="w-2 h-5 bg-primary animate-pulse" />
            </button>

            {/* Desktop */}
            <div className={`items-center gap-8 ${isDesktop ? "flex" : "hidden"}`}>
              {navItems.map((item) => {
                const isActive = stage === item.stage;
                return (
                  <button
                    key={item.label}
                    onClick={() => item.onClick()}
                    aria-current={isActive ? "page" : undefined}
                    className={`keyboard-focus-ring font-mono text-sm transition-colors relative group rounded-lg px-1.5 py-1 ${
                      isActive ? "text-text [html[data-theme='light']_&]:text-[#1f1b15]" : "text-text/78 hover:text-text [html[data-theme='light']_&]:text-[#4f473d] [html[data-theme='light']_&]:hover:text-[#1f1b15]"
                    }`}
                  >
                    <span className={`text-primary transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                      ./
                    </span>
                    {item.label.toLowerCase()}
                  </button>
                );
              })}
              <div className="pl-4 border-l border-border">
                <LanguageToggle />
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile toggle - persistent so the open/close morph can animate */}
      {!isDesktop &&
        renderMobileToggle("fixed top-2 right-3 z-[1000100] flex", { zIndex: 1000100 })}

      {/* Mobile Menu */}
      {isMobileMenuOpen && !isDesktop && (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-[100000] flex flex-col overflow-hidden pointer-events-none"
          style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-bg-surface pointer-events-none" />

          {/* Subtle glow orbs */}
          <div
            data-menu-glow-1
            aria-hidden="true"
            className="absolute w-[100px] h-[100px] bg-primary/25 rounded-full blur-[40px] top-[20%] left-[10%] animate-[float_6s_ease-in-out_infinite] pointer-events-none"
          />
          <div
            data-menu-glow-2
            aria-hidden="true"
            className="absolute w-[80px] h-[80px] bg-secondary/20 rounded-full blur-[30px] bottom-[25%] right-[10%] animate-[float_8s_ease-in-out_infinite_1s] pointer-events-none"
          />

          {/* Rotating rings - green dashed + orange solid, oval shaped */}
          <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[520px] pointer-events-none">
            <div
              data-ring-outer
              className="absolute -inset-6 border-2 border-dashed border-primary/30 rounded-full animate-[spin_30s_linear_infinite]"
            />
            <div
              data-ring-middle
              className="absolute inset-0 border border-secondary/30 rounded-full animate-[spin_45s_linear_infinite_reverse]"
            />

            {/* Accent dots at compass positions */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-2 h-2 bg-secondary rounded-full animate-pulse" />
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center px-8 md:px-0 md:items-center relative z-10 pointer-events-auto">
            <div className="w-full md:max-w-sm">
            {mobileNavItems.map((item, i) => {
              const isActive = stage === item.stage;
              return (
                <button
                  type="button"
                  key={item.label}
                  ref={(el) => {
                    if (el) itemsRef.current[i] = el;
                  }}
                  onClick={() => handleNavClick(item.onClick)}
                  aria-current={isActive ? "page" : undefined}
                  className={`keyboard-focus-ring w-full text-left py-2.5 font-mono text-3xl transition-colors relative group rounded-lg ${
                    isActive ? "text-text" : "text-text/78"
                  }`}
                  style={{ opacity: 0 }}
                >
                  <span className={`text-primary transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-active:opacity-100"}`}>
                    ./
                  </span>
                  {item.label.toLowerCase()}
                </button>
              );
            })}
            </div>
          </div>

          {/* Bottom */}
          <div
            ref={(el) => {
              if (el) itemsRef.current[mobileNavItems.length] = el as unknown as HTMLButtonElement;
            }}
            className="px-8 md:px-0 pb-8 md:pb-12 md:flex md:justify-center relative z-10 shrink-0 pointer-events-auto"
            style={{ opacity: 0 }}
          >
            <div className="border-t border-border pt-6 space-y-5 w-full md:max-w-sm">
              <div className="flex items-center justify-between">
                <LanguageToggle />
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-pressed={isDark}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  className="keyboard-focus-ring flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-sm text-text/60 hover:text-text transition-colors"
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  {isDark ? "dark" : "light"}
                </button>
              </div>
              <SocialLinks className="w-full justify-between [&_a]:p-3 [&_svg]:w-7 [&_svg]:h-7" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
