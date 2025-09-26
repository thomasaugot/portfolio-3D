"use client";

import { useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useMenuAnimations } from "@/hooks/useMenuAnimations";
import { getLocalizedMenuItems } from "@/data/menu";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Link from "next/link";
import { closeMenuWithAnimation } from "@/utils/animations/menu-animations";
import ContactSection from "../ui/ContactSection";
import { ThemeToggle } from "../theme/ThemeToggle";

export default function Menu() {
  const { t, language } = useTranslation();
  const localizedMenuItems = getLocalizedMenuItems(language);
  const menuTriggerRef = useRef<HTMLDivElement>(null);

  useMenuAnimations(menuTriggerRef);

  return (
    <>
      {/* === Overlay === */}
      <div
        data-animate="menu-overlay"
        className="fixed inset-0 z-30 bg-black/90 backdrop-blur-sm opacity-0 pointer-events-none"
      />

      {/* === Blob === */}
      <div
        data-animate="menu-blob"
        className="fixed top-8 right-8 w-16 h-16 z-40 rounded-xl gradient-primary shadow-lg shadow-[var(--primary-color)]/30 pointer-events-none"
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      />

      {/* === Trigger === */}
      <div
        ref={menuTriggerRef}
        data-animate="menu-trigger"
        className="fixed top-8 right-8 z-[999] cursor-pointer"
      >
        <div className="flex items-center justify-center w-16 h-16 relative">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <div
              data-animate="burger-line-1"
              className="w-8 h-0.5 bg-black rounded-full"
            />
            <div
              data-animate="burger-line-2"
              className="w-8 h-0.5 bg-black rounded-full"
            />
            <div
              data-animate="burger-line-3"
              className="w-8 h-0.5 bg-black rounded-full"
            />
          </div>
        </div>
      </div>

      {/* === Menu Items === */}
      <div
        data-animate="menu-container"
        className="fixed inset-0 z-[9999] flex items-center justify-end mr-[14vw] pointer-events-none my-auto"
      >
        <nav className="text-right w-full max-w-lg relative">
          <ul className="space-y-10">
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
                    className="text-3xl md:text-5xl font-bold text-[var(--color-text)] mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)] relative overflow-hidden"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t(item.labelKey)}
                  </div>

                  <div
                    data-animate="menu-desc"
                    className="text-md text-black font-mono opacity-0 translate-y-2 mb-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]"
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

        {/* === Language Toggle (Fixed Top Left) === */}
        <div
          data-animate="menu-item"
          className="fixed top-12 left-12 z-[9999] opacity-0"
        >
          <LanguageToggle />
          {/* <ThemeToggle /> */}
        </div>

        {/* === Contact Info === */}
        <div
          className="absolute bottom-12 left-12 opacity-0"
          data-animate="menu-item"
        >
          <ContactSection />
        </div>
      </div>
    </>
  );
}
