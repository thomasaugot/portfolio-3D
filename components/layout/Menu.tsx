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
import ContactBlock from "../ui/ContactBlock";
import MobileContactBlock from "../ui/MobileContactBlock";
import { ThemeToggle } from "../theme/ThemeToggle";

export default function Menu() {
  const { t, language } = useTranslation();
  const { isDark, isLight } = useTheme();
  const localizedMenuItems = getLocalizedMenuItems(language);
  const menuTriggerRef = useRef<HTMLDivElement>(null);

  useMenuAnimations(menuTriggerRef as any);

  return (
    <>
      <div
        data-animate="menu-overlay"
        className={`fixed inset-0 z-30 backdrop-blur-sm opacity-0 pointer-events-none bg-bg`}
      />

      <div
        data-animate="menu-blob"
        className={`fixed top-6 right-6 md:top-8 md:right-8 w-10 h-10 md:w-16 md:h-16 z-40 rounded-xl gradient-primary pointer-events-none ${
          isLight ? "shadow-theme-medium" : "shadow-lg shadow-primary/30"
        }`}
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      />

      <div
        ref={menuTriggerRef}
        data-animate="menu-trigger"
        className="fixed top-6 right-6 md:top-8 md:right-8 z-[99999] cursor-pointer group p-4 -m-4"
        style={{ pointerEvents: "auto" }}
      >
        <div className="flex items-center justify-center w-10 h-10 md:w-16 md:h-16 relative transition-transform duration-300 ease-out group-hover:scale-110">
          <div className="flex flex-col items-center justify-center gap-1 md:gap-1.5">
            <div
              data-animate="burger-line-1"
              className={`w-5 md:w-8 h-0.5 rounded-full transition-all duration-300 ease-out ${
                isLight
                  ? "bg-text group-hover:scale-110"
                  : "bg-black group-hover:scale-110 "
              }`}
            />
            <div
              data-animate="burger-line-2"
              className={`w-5 md:w-8 h-0.5 rounded-full transition-all duration-300 ease-out ${
                isLight
                  ? "bg-text group-hover:scale-110 "
                  : "bg-black group-hover:scale-110 "
              }`}
            />
            <div
              data-animate="burger-line-3"
              className={`w-5 md:w-8 h-0.5 rounded-full transition-all duration-300 ease-out ${
                isLight
                  ? "bg-text group-hover:scale-110 "
                  : "bg-black group-hover:scale-110 "
              }`}
            />
          </div>
        </div>
      </div>

      <div
        data-animate="menu-container"
        className="fixed inset-0 z-[9999] pointer-events-none"
      >
        <div
          data-animate="menu-hex-background"
          className="absolute inset-0 -z-10"
        />
        <div className="hidden lg:flex h-full w-full">
          <div className="flex-1 flex flex-col justify-between p-12">
            <div
              data-animate="menu-item"
              className="opacity-0 absolute top-12 left-12 z-[99999]"
            >
              <LanguageToggle />
            </div>

            <div data-animate="menu-item" className="opacity-0">
              <ContactBlock />
            </div>
          </div>

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
                      className="inline-block text-right"
                      onClick={(e) => {
                        e.preventDefault();
                        closeMenuWithAnimation();
                        setTimeout(() => {
                          window.location.href = item.localizedHref;
                        }, 600);
                      }}
                    >
                      <div
                        data-animate="menu-text"
                        className={`text-4xl md:text-6xl font-bold mb-1 relative overflow-hidden transition-all duration-500 ease-out ${
                          isLight
                            ? "text-text drop-shadow-sm group-hover:scale-[1.02] group-hover:-translate-x-2 group-hover:drop-shadow-[0_0_20px_rgba(204,255,2,0.3)]"
                            : "text-text drop-shadow-lg group-hover:scale-[1.01] group-hover:-translate-x-1.5"
                        }`}
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {t(item.labelKey)}
                      </div>

                      <div
                        data-animate="menu-desc"
                        className="text-sm font-mono opacity-0 translate-y-1 mb-2 text-text transition-all duration-400 ease-out group-hover:opacity-100 group-hover:translate-y-0"
                      >
                        {t(item.descriptionKey)}
                      </div>

                      <div
                        data-animate="menu-line"
                        className="h-0.5 gradient-primary rounded-full ml-auto origin-right transition-all duration-500 ease-out group-hover:scale-x-100"
                        style={{ width: "60px", transform: "scaleX(0)" }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:hidden h-full w-full flex flex-col p-4 md:p-12 pt-16">
          <div className="flex justify-between items-center mb-8">
            <div
              data-animate="menu-item"
              className="opacity-0"
              style={{ pointerEvents: "auto" }}
            >
              <LanguageToggle />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-h-[60vh] overflow-y-auto">
            <nav className="text-center">
              <ul className="space-y-4">
                {localizedMenuItems.map((item) => (
                  <li
                    key={item.labelKey}
                    data-animate="menu-item"
                    className="opacity-0 group relative"
                  >
                    <Link
                      href={item.localizedHref}
                      className="inline-block text-center w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        closeMenuWithAnimation();
                        setTimeout(() => {
                          window.location.href = item.localizedHref;
                        }, 600);
                      }}
                    >
                      <div
                        data-animate="menu-text"
                        className="text-2xl sm:text-3xl font-bold mb-1 relative overflow-hidden text-text"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {t(item.labelKey)}
                      </div>

                      <div
                        data-animate="menu-desc"
                        className="text-xs mb-2 text-text-muted"
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

          <div data-animate="menu-item" className="opacity-0 mt-6">
            <MobileContactBlock />
          </div>
        </div>
      </div>
    </>
  );
}
