"use client";

import { useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useCanva } from "@/components/ui/Canva";
import { SOCIAL_LINKS } from "@/data/contact";
import { useTheme } from "@/contexts/ThemeProvider";
import { useScrollDetection } from "@/hooks/useScrollDetection";
import { useViewportDetection } from "@/hooks/useViewportDetection";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import MobileToggleButton from "@/components/layout/MobileToggleButton";
import TerminalHeader from "@/components/ui/terminal/TerminalHeader";

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
    { label: "home", stage: "hero", onClick: goToHero, command: "cd /home", note: "boot sequence" },
    { label: "about", stage: "about", onClick: goToAbout, command: "cat about.md", note: "profile + story" },
    { label: "projects", stage: "projects", onClick: goToProjects, command: "ls ./projects", note: "selected work" },
    { label: "contact", stage: "contact", onClick: goToContact, command: "ping tom", note: "open channel" },
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
          className="fixed top-3 right-3 z-[1000100] flex"
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
          className="fixed inset-0 z-[100010] pointer-events-none"
        >
          <button
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm w-full cursor-default pointer-events-auto"
            onClick={() => closeMenu()}
          />

          <div
            data-menu-panel
            className="absolute inset-x-0 bottom-0 flex flex-col overflow-hidden rounded-t-3xl border-t border-x border-border/80 bg-bg-surface/98 shadow-[0_-24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl pointer-events-auto [html[data-theme='light']_&]:bg-[#f6efe2]/98"
            style={{ maxHeight: "88vh" }}
          >
            <div className="flex justify-center pt-3 pb-0.5" aria-hidden="true">
              <div className="h-1 w-10 rounded-full bg-text/20" />
            </div>

            <TerminalHeader title="~/navigation.sh" />

            <div className="min-h-0 overflow-y-auto px-5 py-6 no-scrollbar">
              <div className="mb-7 flex items-center gap-2">
                <span className="text-primary">❯</span>
                <span className="font-mono text-sm text-primary">nav --list</span>
                <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-primary/55" />
              </div>

              <div className="space-y-6">
                {mobileNavItems.map((item, i) => {
                  const isActive = stage === item.stage;
                  return (
                    <button
                      type="button"
                      key={item.label}
                      ref={(el) => { if (el) itemsRef.current[i] = el; }}
                      onClick={() => handleNavClick(item.onClick)}
                      aria-current={isActive ? "page" : undefined}
                      className="keyboard-focus-ring w-full text-left transition-opacity active:opacity-60 touch-manipulation"
                      style={{ opacity: 0 }}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`font-mono text-sm ${isActive ? "text-secondary" : "text-primary/50"}`}
                          style={isActive ? { textShadow: "0 0 12px rgba(245,158,11,0.7)" } : undefined}>❯</span>
                        <span className={`font-mono text-sm ${isActive ? "text-secondary" : "text-primary/50"}`}
                          style={isActive ? { textShadow: "0 0 12px rgba(245,158,11,0.5)" } : undefined}>{item.command}</span>
                      </div>
                      <div className="pl-5">
                        <p className={`text-2xl font-semibold leading-none tracking-[-0.03em] ${isActive ? "text-secondary" : "text-text"}`}
                          style={isActive ? { textShadow: "0 0 28px rgba(245,158,11,0.55)" } : undefined}>
                          {item.label}
                          {isActive && <span className="inline-block w-[3px] h-6 bg-secondary animate-pulse ml-1.5 align-middle rounded-sm" />}
                        </p>
                        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-muted">{item.note}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div
                ref={(el) => { if (el) itemsRef.current[mobileNavItems.length] = el as unknown as HTMLButtonElement; }}
                className="grid grid-cols-4 pt-8 pb-2"
                style={{ opacity: 0 }}
              >
                {SOCIAL_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.label}
                      className="keyboard-focus-ring flex items-center justify-center py-3 text-text/40 transition-colors hover:text-primary active:scale-90"
                    >
                      <Icon size={22} />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border/60 px-5 py-4 flex items-center justify-between gap-3">
              <LanguageToggle />
              <button
                type="button"
                onClick={toggleTheme}
                aria-pressed={isDark}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="keyboard-focus-ring inline-flex items-center gap-2 rounded-xl border border-border/80 bg-bg/35 px-4 py-3 font-mono text-sm text-text/65 transition-colors hover:text-text"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                {isDark ? "dark" : "light"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
