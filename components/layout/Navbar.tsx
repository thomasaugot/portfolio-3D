"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import LanguageToggle from "@/components/ui/LanguageToggle";
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

    // Menu slide in
    if (menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { clipPath: "circle(0% at calc(100% - 42px) 42px)" },
        { clipPath: "circle(150% at calc(100% - 42px) 42px)", duration: 0.5, ease: "power3.out" }
      );
    }

    // Stagger items
    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      gsap.fromTo(
        item,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, delay: 0.2 + i * 0.08, ease: "power2.out" }
      );
    });
  }, [isMobileMenuOpen]);

  const closeMenu = useCallback(() => {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        clipPath: "circle(0% at calc(100% - 42px) 42px)",
        duration: 0.4,
        ease: "power3.in",
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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
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

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative z-[100001] w-12 h-12 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-5">
                <span
                  className={`absolute left-0 h-0.5 rounded transition-all duration-300 ${
                    isMobileMenuOpen ? "top-[9px] w-6 rotate-45 bg-primary" : "top-0 w-6 bg-primary"
                  }`}
                />
                <span
                  className={`absolute left-0 top-[9px] h-0.5 rounded transition-all duration-300 ${
                    isMobileMenuOpen ? "w-0 opacity-0" : "w-4 bg-primary"
                  }`}
                />
                <span
                  className={`absolute left-0 h-0.5 rounded transition-all duration-300 ${
                    isMobileMenuOpen ? "bottom-[9px] w-6 -rotate-45 bg-primary" : "bottom-0 w-6 bg-primary"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Circle reveal from button */}
      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-[100000] md:hidden bg-bg-surface flex flex-col"
          style={{ clipPath: "circle(0% at calc(100% - 42px) 42px)" }}
        >
          {/* Main content centered */}
          <div className="flex-1 flex flex-col justify-center px-8">
            {navItems.map((item, i) => {
              const isActive = stage === item.stage;
              return (
                <button
                  key={item.label}
                  ref={(el) => {
                    if (el) itemsRef.current[i] = el;
                  }}
                  onClick={() => handleNavClick(item.onClick)}
                  className="text-left py-6 group"
                  style={{ opacity: 0 }}
                >
                  <span
                    className={`text-6xl font-light tracking-tight transition-colors ${
                      isActive ? "text-primary" : "text-white group-active:text-primary"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="ml-4 inline-block w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom */}
          <div
            ref={(el) => {
              if (el) itemsRef.current[3] = el as unknown as HTMLButtonElement;
            }}
            className="px-8 pb-12"
            style={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between border-t border-white/10 pt-6">
              <LanguageToggle />
              <span className="font-mono text-sm text-primary">
                {brandText}
                <span className="typewriter-cursor">_</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
