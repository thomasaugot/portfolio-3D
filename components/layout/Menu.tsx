"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import { useTheme } from "@/lib/providers/ThemeProvider";
import { getLocalizedMenuItems } from "@/data/menu";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Link from "next/link";
import { closeMenuWithAnimation } from "@/utils/animations/menu-animations";
import { FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Menu() {
  const { t, language } = useTranslation();
  const { isDark, isLight } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Wait for client-side hydration to complete
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a stable value during SSR, then switch to client value after mount
  const localizedMenuItems = mounted 
    ? getLocalizedMenuItems(language)
    : [];

  return (
    <>
      <div
        data-animate="menu-overlay"
        className="fixed inset-0 z-30 opacity-0 pointer-events-none bg-bg/98 backdrop-blur-xl"
      />

      <div
        data-animate="menu-blob"
        className="fixed top-6 right-6 md:top-8 md:right-8 w-10 h-10 md:w-16 md:h-16 z-50 rounded-2xl gradient-primary pointer-events-none"
      />

      <div
        data-animate="menu-trigger"
        className="fixed top-6 right-6 md:top-8 md:right-8 z-[99999] cursor-pointer group p-4 -m-4"
        style={{ pointerEvents: "auto" }}
      >
        <div className="flex items-center justify-center w-10 h-10 md:w-16 md:h-16">
          <div className="flex flex-col items-center justify-center gap-1 md:gap-1.5">
            <div
              data-animate="burger-line-1"
              className={`w-5 md:w-8 h-0.5 rounded-full ${
                isLight ? "bg-text" : "bg-black"
              }`}
            />
            <div
              data-animate="burger-line-2"
              className={`w-5 md:w-8 h-0.5 rounded-full ${
                isLight ? "bg-text" : "bg-black"
              }`}
            />
            <div
              data-animate="burger-line-3"
              className={`w-5 md:w-8 h-0.5 rounded-full ${
                isLight ? "bg-text" : "bg-black"
              }`}
            />
          </div>
        </div>
      </div>

      <div
        data-animate="menu-container"
        className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
      >
        <div data-animate="menu-content" className="h-full w-full opacity-0">
          <div className="h-screen py-16 px-8 md:px-16 lg:px-24 relative">
            
            <div data-animate="menu-item" className="opacity-0 absolute top-16 left-8 md:left-16 lg:left-24">
              <LanguageToggle />
            </div>

            <nav className="h-full flex items-center justify-center">
              <div className="space-y-6 max-w-4xl w-full">
                {mounted && localizedMenuItems.map((item, index) => (
                  <div
                    key={item.labelKey}
                    data-animate="menu-item"
                    className="opacity-0 group"
                  >
                    <Link
                      href={item.localizedHref}
                      onClick={(e) => {
                        e.preventDefault();
                        closeMenuWithAnimation();
                        setTimeout(() => {
                          window.location.href = item.localizedHref;
                        }, 600);
                      }}
                      className="block"
                    >
                      <div className="flex items-baseline gap-6">
                        <div className="flex-1">
                          <div className="text-4xl md:text-6xl lg:text-7xl font-bold mb-2 transition-all duration-300 group-hover:translate-x-2">
                            <span className="gradient-primary bg-clip-text text-transparent">
                              {t(item.labelKey)}
                            </span>
                          </div>
                          <p className="text-text-muted text-xs md:text-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                            {t(item.descriptionKey)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </nav>

            <div
              data-animate="menu-item"
              className="opacity-0 absolute bottom-16 left-8 md:left-16 lg:left-24 flex items-center gap-4 text-text-muted text-xs font-mono"
            >
              <p className="flex items-center gap-2">
                {t("footer.credits").replace(" 🌍 ", " ")}
                <FaHeart className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="gradient-primary bg-clip-text text-transparent font-bold">
                  {t("footer.brand")}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}