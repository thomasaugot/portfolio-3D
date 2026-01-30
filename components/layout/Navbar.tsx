"use client";

import { useState, useEffect } from "react";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useCanva } from "@/components/ui/Canva";

export default function Navbar() {
  const { stage, goToHero, goToAbout, goToProjects, goToContact } = useCanva();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const brandText = "~/helloimtom.dev";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "About", stage: "about", onClick: goToAbout },
    { label: "Projects", stage: "projects", onClick: goToProjects },
    { label: "Contact", stage: "contact", onClick: goToContact },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-bg/90 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={goToHero}
              className="flex items-center gap-2 group"
            >
              <span
                className="text-primary font-mono text-lg group-hover:text-primary transition-colors"
                data-navbar-typewriter
                data-text={brandText}
              >
                {brandText}
              </span>
              <span className="w-2 h-5 bg-primary animate-pulse" />
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = stage === item.stage;
                return (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`font-mono text-sm transition-colors relative group ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <span
                    className={`text-primary transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
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

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-5">
                <span
                  className={`absolute left-0 w-full h-0.5 bg-white transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "top-2 rotate-45"
                      : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-2 w-full h-0.5 bg-white transition-opacity duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 w-full h-0.5 bg-white transition-all duration-300 ${
                    isMobileMenuOpen
                      ? "top-2 -rotate-45"
                      : "top-4"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="absolute top-20 left-0 right-0 p-6">
          <div className="bg-bg-surface rounded-xl border border-white/10 overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-bg-panel border-b border-white/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
              </div>
              <span className="ml-4 text-xs text-white/40 font-mono">
                navigation
              </span>
            </div>

            {/* Menu items */}
            <div className="p-4 space-y-2">
              {navItems.map((item, index) => {
                const isActive = stage === item.stage;
                return (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 font-mono ${
                    isActive ? "text-white bg-white/5" : "text-white/80 hover:bg-white/5"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-primary">❯</span>
                  <span>cd {item.label.toLowerCase()}</span>
                </button>
                );
              })}

              <div className="pt-4 mt-4 border-t border-white/10">
                <div className="px-4 py-2 text-xs text-white/40 font-mono mb-2">
                  # Language
                </div>
                <LanguageToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
