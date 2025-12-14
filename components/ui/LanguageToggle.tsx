"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import { animateLanguageChange } from "@/utils/animations/language-toggle-animations";
import { useState, useEffect, useRef } from "react";

const languages = [
  { code: "en", label: "EN", name: "English" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "es", label: "ES", name: "Español" },
];

export default function LanguageToggle() {
  const { language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = async (targetLang: string) => {
    if (targetLang === language) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    await animateLanguageChange(language, targetLang);

    const pathname = window.location.pathname;
    const currentLocale = pathname.split("/")[1];
    const newPath = pathname.replace(`/${currentLocale}`, `/${targetLang}`);
    window.location.href = newPath;
  };

  const currentLang =
    languages.find((l) => l.code === language) || languages[0];

  const displayLabel = mounted ? currentLang.label : "EN";

  return (
    <div ref={dropdownRef} className="relative" style={{ zIndex: 999999 }}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-animate="language-toggle"
        className="relative group cursor-pointer"
        style={{ pointerEvents: "auto" }}
        type="button"
      >
        {/* Gradient border */}
        <div
          className={`absolute -inset-[1px] bg-gradient-to-r from-primary via-secondary to-primary rounded-full transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-50 group-hover:opacity-100"
          }`}
        />

        {/* Glow effect on hover */}
        <div
          className={`absolute -inset-2 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-full blur-lg transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-60"
          }`}
        />

        {/* Button content */}
        <div className="relative flex items-center gap-3 px-5 py-2.5 bg-bg rounded-full">
          <span className="font-bold text-text group-hover:text-primary transition-colors duration-300">
            {displayLabel}
          </span>
          <div className="w-px h-4 bg-border" />
          <svg
            className={`w-4 h-4 text-text-muted group-hover:text-primary transition-all duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown */}
      {mounted && isOpen && (
        <div className="absolute top-full right-0 mt-3">
          {/* Gradient border for dropdown */}
          <div className="absolute -inset-[1px] bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl" />

          {/* Dropdown content */}
          <div className="relative py-2 min-w-[160px] rounded-2xl bg-bg shadow-2xl overflow-hidden">
            {languages.map((lang, index) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full px-5 py-3 text-left flex items-center gap-3 transition-all duration-200 group/item
                  ${
                    lang.code === language
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10"
                      : "hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5"
                  }
                `}
              >
                <span
                  className={`font-bold text-sm transition-colors duration-200 ${
                    lang.code === language
                      ? "text-primary"
                      : "text-text group-hover/item:text-primary"
                  }`}
                >
                  {lang.label}
                </span>
                <span className="text-sm text-text-muted">{lang.name}</span>
                {lang.code === language && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-bg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
