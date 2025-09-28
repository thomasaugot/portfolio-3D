"use client";

import { useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useMenuAnimations } from "@/hooks/useMenuAnimations";
import { getLocalizedMenuItems } from "@/data/menu";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Link from "next/link";
import Image from "next/image";
import { closeMenuWithAnimation } from "@/utils/animations/menu-animations";
import ContactSection from "../ui/ContactSection";
import { ThemeToggle } from "../theme/ThemeToggle";

export default function Menu() {
  const { t, language } = useTranslation();
  const { isDark, isLight } = useTheme();
  const localizedMenuItems = getLocalizedMenuItems(language);
  const menuTriggerRef = useRef<HTMLDivElement>(null);

  useMenuAnimations(menuTriggerRef);

  return (
    <>
      {/* === Overlay === */}
      <div
        data-animate="menu-overlay"
        className={`fixed inset-0 z-30 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300 ${
          isLight 
            ? 'bg-white/90' 
            : 'bg-black/90'
        }`}
      />

      {/* === Blob === */}
      <div
        data-animate="menu-blob"
        className={`fixed top-6 right-6 md:top-8 md:right-8 w-10 h-10 md:w-16 md:h-16 z-40 rounded-xl gradient-primary pointer-events-none transition-all duration-300 ${
          isLight 
            ? 'shadow-theme-medium' 
            : 'shadow-lg shadow-[var(--primary-color)]/30'
        }`}
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      />

      {/* === Trigger === */}
      <div
        ref={menuTriggerRef}
        data-animate="menu-trigger"
        className="fixed top-6 right-6 md:top-8 md:right-8 z-[99999] cursor-pointer"
      >
        <div className="flex items-center justify-center w-10 h-10 md:w-16 md:h-16 relative">
          <div className="flex flex-col items-center justify-center gap-1 md:gap-1.5">
            <div
              data-animate="burger-line-1"
              className={`w-5 md:w-8 h-0.5 rounded-full transition-colors duration-300 ${
                isLight ? 'bg-[var(--color-text)]' : 'bg-black'
              }`}
            />
            <div
              data-animate="burger-line-2"
              className={`w-5 md:w-8 h-0.5 rounded-full transition-colors duration-300 ${
                isLight ? 'bg-[var(--color-text)]' : 'bg-black'
              }`}
            />
            <div
              data-animate="burger-line-3"
              className={`w-5 md:w-8 h-0.5 rounded-full transition-colors duration-300 ${
                isLight ? 'bg-[var(--color-text)]' : 'bg-black'
              }`}
            />
          </div>
        </div>
      </div>

      {/* === Menu Content === */}
      <div
        data-animate="menu-container"
        className="fixed inset-0 z-[9999] pointer-events-none"
      >
        {/* Desktop Layout */}
        <div className="hidden lg:flex h-full w-full">
          {/* Left Side - Language & Contact */}
          <div className="flex-1 flex flex-col justify-between p-12">
            {/* Language Toggle */}
            <div data-animate="menu-item" className="opacity-0">
              <LanguageToggle />
            </div>

            {/* Theme Toggle */}
            {/* <div data-animate="menu-item" className="opacity-0 flex justify-center mb-6">
              <ThemeToggle size={60} />
            </div> */}

            {/* Logo */}
            {/* <div data-animate="menu-item" className="opacity-0 flex justify-center">
              <Image 
                src="/assets/images/logo/logo-full-gradient-nobg.png" 
                alt="Logo" 
                width={280}
                height={120}
                className="w-80 h-auto"
              />
            </div> */}

            {/* Contact Section */}
            <div data-animate="menu-item" className="opacity-0">
              <ContactSection />
            </div>
          </div>

          {/* Right Side - Navigation */}
          <div className="flex-1 flex items-center justify-center pr-[8vw]">
            <nav className="text-right">
              <ul className="space-y-3">
                {localizedMenuItems.map((item) => (
                  <li
                    key={item.labelKey}
                    data-animate="menu-item"
                    className="opacity-0 group relative"
                  >
                    <Link
                      href={item.localizedHref}
                      className="inline-block text-right group"
                      onClick={(e) => {
                        e.preventDefault();
                        const tl = closeMenuWithAnimation();
                        if (tl) {
                          tl.eventCallback("onComplete", () => {
                            window.location.href = item.localizedHref;
                          });
                        } else {
                          window.location.href = item.localizedHref;
                        }
                      }}
                    >
                      <div
                        data-animate="menu-text"
                        className={`text-4xl md:text-6xl font-bold mb-1 relative overflow-hidden transition-colors duration-300 ${
                          isLight 
                            ? 'text-[var(--color-text)] drop-shadow-sm' 
                            : 'text-[var(--color-text)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)]'
                        }`}
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {t(item.labelKey)}
                      </div>

                      <div
                        data-animate="menu-desc"
                        className={`text-sm font-mono opacity-0 translate-y-1 mb-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 text-text`}
                      >
                        {t(item.descriptionKey)}
                      </div>

                      <div
                        data-animate="menu-line"
                        className="h-0.5 gradient-primary rounded-full ml-auto"
                        style={{ width: "60px", transform: "scaleX(0)" }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden h-full w-full flex flex-col p-6 pt-16">
          {/* Mobile Header */}
          <div className="flex justify-between items-center mb-6">
            {/* Language Toggle */}
            <div data-animate="menu-item" className="opacity-0 scale-75">
              <LanguageToggle />
            </div>
            
            {/* Theme Toggle */}
            {/* <div data-animate="menu-item" className="opacity-0 scale-75">
              <ThemeToggle size={40} />
            </div> */}
          </div>

          {/* Mobile Navigation - Compact */}
          <div className="flex-1 flex flex-col justify-center">
            <nav className="text-center">
              <ul className="space-y-5">
                {localizedMenuItems.map((item) => (
                  <li
                    key={item.labelKey}
                    data-animate="menu-item"
                    className="opacity-0 group relative"
                  >
                    <Link
                      href={item.localizedHref}
                      className="inline-block text-center group"
                      onClick={(e) => {
                        e.preventDefault();
                        const tl = closeMenuWithAnimation();
                        if (tl) {
                          tl.eventCallback("onComplete", () => {
                            window.location.href = item.localizedHref;
                          });
                        } else {
                          window.location.href = item.localizedHref;
                        }
                      }}
                    >
                      <div
                        data-animate="menu-text"
                        className={`text-2xl sm:text-3xl font-bold mb-1 relative overflow-hidden transition-colors duration-300 text-text`}
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {t(item.labelKey)}
                      </div>

                      <div
                        data-animate="menu-desc"
                        className={`text-xs mb-1 transition-colors duration-300 text-text-muted`}
                      >
                        {t(item.descriptionKey)}
                      </div>

                      <div
                        data-animate="menu-line"
                        className="h-0.5 gradient-primary rounded-full mx-auto"
                        style={{ width: "30px", transform: "scaleX(0)" }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Mobile Contact Section */}
          <div data-animate="menu-item" className="opacity-0 mt-4">
            <div className="flex justify-center">
              <ContactSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}