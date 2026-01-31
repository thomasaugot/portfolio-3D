"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import LanguageToggle from "@/components/ui/LanguageToggle";
import SocialLinks from "@/components/ui/SocialLinks";
import { useCanva } from "@/components/ui/Canva";
import gsap from "gsap";

export default function Navbar() {
  const { stage, goToHero, goToAbout, goToProjects, goToContact } = useCanva();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLButtonElement[]>([]);
  const brandText = "~/helloimtom.dev";

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

  const closeMenu = useCallback(() => {
    if (menuRef.current) {
      // Items slide down and fade
      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        gsap.to(item, {
          y: 50,
          opacity: 0,
          rotateX: 15,
          duration: 0.4,
          delay: i * 0.06,
          ease: "power2.in"
        });
      });

      // Rings scale and rotate out
      const rings = menuRef.current.querySelectorAll('[data-ring-outer], [data-ring-middle]');
      rings.forEach((ring, i) => {
        gsap.to(ring, {
          scale: 0,
          rotation: 90,
          opacity: 0,
          duration: 0.5,
          delay: 0.1 + i * 0.08,
          ease: "power2.in"
        });
      });

      // Glow orbs fade out
      const glows = menuRef.current.querySelectorAll('[data-menu-glow-1], [data-menu-glow-2]');
      glows.forEach((glow, i) => {
        gsap.to(glow, {
          scale: 0.5,
          opacity: 0,
          duration: 0.4,
          delay: i * 0.1,
          ease: "power2.in"
        });
      });

      // Fade out background last
      gsap.to(menuRef.current, {
        opacity: 0,
        duration: 0.3,
        delay: 0.35,
        ease: "power2.in",
        onComplete: () => setIsMobileMenuOpen(false),
      });
    } else {
      setIsMobileMenuOpen(false);
    }
  }, []);

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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
          isMobileMenuOpen ? "z-[100003]" : "z-[9999]"
        } ${
          isScrolled ? "bg-bg/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button onClick={goToHero} className="flex items-center gap-2">
              <span className="text-primary font-mono text-lg" data-navbar-typewriter data-text={brandText}>
                {brandText}
              </span>
              <span className="w-2 h-5 bg-primary animate-pulse" />
            </button>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = stage === item.stage;
                return (
                  <button
                    key={item.label}
                    onClick={() => item.onClick()}
                    className={`font-mono text-sm transition-colors relative group ${
                      isActive ? "text-white" : "text-white/60 hover:text-white"
                    }`}
                  >
                    <span className={`text-primary transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                      ./
                    </span>
                    {item.label.toLowerCase()}
                  </button>
                );
              })}
              <div className="pl-4 border-l border-white/10">
                <LanguageToggle />
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile toggle - OUTSIDE nav for proper z-index */}
      <button
        onClick={() => isMobileMenuOpen ? closeMenu() : setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-2 right-3 z-[100010] h-14 flex items-center justify-center gap-1"
        aria-label="Toggle menu"
      >
        {/* Left brace */}
        <span
          className={`font-mono text-3xl font-light transition-all duration-500 ${
            isMobileMenuOpen ? "text-secondary" : "text-primary"
          }`}
        >
          {"{"}
        </span>

        {/* Center - morphing dots to X cross */}
        <div className="flex items-center gap-1">
          {/* Left dot → becomes one arm of X */}
          <span
            className={`rounded-full bg-primary transition-all duration-500 ease-out origin-center ${
              isMobileMenuOpen
                ? "w-4 h-[2px] rotate-45 -mr-3"
                : "w-1.5 h-1.5"
            }`}
          />

          {/* Center dot → fades out when X forms */}
          <span
            className={`rounded-full bg-secondary transition-all duration-500 ease-out ${
              isMobileMenuOpen
                ? "w-0 h-0 opacity-0"
                : "w-1.5 h-1.5 opacity-100"
            }`}
          />

          {/* Right dot → becomes other arm of X */}
          <span
            className={`rounded-full bg-primary transition-all duration-500 ease-out origin-center ${
              isMobileMenuOpen
                ? "w-4 h-[2px] -rotate-45 -ml-3"
                : "w-1.5 h-1.5"
            }`}
          />
        </div>

        {/* Right brace */}
        <span
          className={`font-mono text-3xl font-light transition-all duration-500 ${
            isMobileMenuOpen ? "text-secondary" : "text-primary"
          }`}
        >
          {"}"}
        </span>
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-[100000] md:hidden bg-bg-surface flex flex-col overflow-hidden"
          style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
        >
          {/* Subtle glow orbs */}
          <div
            data-menu-glow-1
            className="absolute w-[100px] h-[100px] bg-primary/25 rounded-full blur-[40px] top-[20%] left-[10%] animate-[float_6s_ease-in-out_infinite]"
          />
          <div
            data-menu-glow-2
            className="absolute w-[80px] h-[80px] bg-secondary/20 rounded-full blur-[30px] bottom-[25%] right-[10%] animate-[float_8s_ease-in-out_infinite_1s]"
          />

          {/* Rotating rings - green dashed + orange solid, oval shaped */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[520px] pointer-events-none">
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
          <div className="flex-1 flex flex-col justify-center px-8 relative z-10">
            {mobileNavItems.map((item, i) => {
              const isActive = stage === item.stage;
              return (
                <button
                  key={item.label}
                  ref={(el) => {
                    if (el) itemsRef.current[i] = el;
                  }}
                  onClick={() => handleNavClick(item.onClick)}
                  className={`text-left py-4 font-mono text-3xl transition-colors relative group ${
                    isActive ? "text-white" : "text-white/60"
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

          {/* Bottom */}
          <div
            ref={(el) => {
              if (el) itemsRef.current[mobileNavItems.length] = el as unknown as HTMLButtonElement;
            }}
            className="px-8 pb-8 relative z-10 shrink-0"
            style={{ opacity: 0 }}
          >
            <div className="border-t border-white/10 pt-6 flex items-center justify-between">
              <LanguageToggle />
              <SocialLinks />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
