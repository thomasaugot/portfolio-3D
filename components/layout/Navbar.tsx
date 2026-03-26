"use client";

import { useCallback } from "react";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useCanva } from "@/components/ui/Canva";
import SocialLinks from "@/components/sections/contact/SocialLinks";
import { useTheme } from "@/contexts/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { useScrollDetection } from "@/hooks/useScrollDetection";
import { useViewportDetection } from "@/hooks/useViewportDetection";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import MobileToggleButton from "@/components/layout/MobileToggleButton";

const brandText = "~/helloimtom.dev";

export default function Navbar() {
  const { stage, goToHero, goToAbout, goToProjects, goToContact } = useCanva();
  const { isDark, toggleTheme } = useTheme();
  const isScrolled = useScrollDetection(50);
  const isDesktop = useViewportDetection();
  const {
    isMobileMenuOpen,
    menuRef,
    toggleButtonRef,
    itemsRef,
    ignoreNextToggleClickRef,
    closeMenu,
    handleTogglePress,
  } = useMobileMenu(isDesktop);

  const handleNavClick = useCallback(
    (action: () => void) => { action(); closeMenu(); },
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
        aria-label="Primary"
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${isMobileMenuOpen ? "pointer-events-none" : ""} ${
          isScrolled
            ? "bg-bg/92 backdrop-blur-md border-b border-border [html[data-theme='light']_&]:bg-[#eee6d8]/88 [html[data-theme='light']_&]:border-b-[#cdbca0]"
            : "bg-transparent"
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

            <div className={`items-center gap-8 ${isDesktop ? "flex" : "hidden"}`}>
              {navItems.map((item) => {
                const isActive = stage === item.stage;
                return (
                  <button
                    key={item.label}
                    onClick={() => item.onClick()}
                    aria-current={isActive ? "page" : undefined}
                    className={`keyboard-focus-ring font-mono text-sm transition-colors relative group rounded-lg px-1.5 py-1 ${
                      isActive
                        ? "text-text [html[data-theme='light']_&]:text-[#1f1b15]"
                        : "text-text/78 hover:text-text [html[data-theme='light']_&]:text-[#4f473d] [html[data-theme='light']_&]:hover:text-[#1f1b15]"
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

      {!isDesktop && (
        <MobileToggleButton
          toggleButtonRef={toggleButtonRef}
          ignoreNextToggleClickRef={ignoreNextToggleClickRef}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggle={handleTogglePress}
          className="fixed top-2 right-3 z-[1000100] flex"
          style={{ zIndex: 1000100 }}
        />
      )}

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

          <div data-menu-glow-1 aria-hidden="true" className="absolute w-[100px] h-[100px] bg-primary/25 rounded-full blur-[40px] top-[20%] left-[10%] animate-[float_6s_ease-in-out_infinite] pointer-events-none" />
          <div data-menu-glow-2 aria-hidden="true" className="absolute w-[80px] h-[80px] bg-secondary/20 rounded-full blur-[30px] bottom-[25%] right-[10%] animate-[float_8s_ease-in-out_infinite_1s] pointer-events-none" />

          <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[520px] pointer-events-none">
            <div data-ring-outer className="absolute -inset-6 border-2 border-dashed border-primary/30 rounded-full animate-[spin_30s_linear_infinite]" />
            <div data-ring-middle className="absolute inset-0 border border-secondary/30 rounded-full animate-[spin_45s_linear_infinite_reverse]" />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-2 h-2 bg-secondary rounded-full animate-pulse" />
          </div>

          <div className="flex-1 flex flex-col justify-center px-8 md:px-0 md:items-center relative z-10 pointer-events-auto">
            <div className="w-full md:max-w-sm space-y-3">
              {mobileNavItems.map((item, i) => {
                const isActive = stage === item.stage;
                return (
                  <button
                    type="button"
                    key={item.label}
                    ref={(el) => { if (el) itemsRef.current[i] = el; }}
                    onClick={() => handleNavClick(item.onClick)}
                    aria-current={isActive ? "page" : undefined}
                    className={`keyboard-focus-ring w-full text-left py-2.5 font-mono text-3xl transition-colors relative group rounded-lg ${isActive ? "text-text" : "text-text/78"}`}
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

          <div
            ref={(el) => { if (el) itemsRef.current[mobileNavItems.length] = el as unknown as HTMLButtonElement; }}
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
