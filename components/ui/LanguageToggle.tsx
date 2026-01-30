"use client";

import { useTranslation } from "@/contexts/TranslationProvider";
import { useState, useEffect, useRef } from "react";

const languages = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "es", label: "ES", flag: "🇪🇸" },
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

  const handleLanguageSelect = (targetLang: string) => {
    if (targetLang === language) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    const pathname = window.location.pathname;
    const currentLocale = pathname.split("/")[1];
    const newPath = pathname.replace(`/${currentLocale}`, `/${targetLang}`);
    window.location.href = newPath;
  };

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <div ref={dropdownRef} className="relative" style={{ zIndex: 999999 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-bg-surface border border-white/10 rounded-lg hover:border-primary/50 transition-colors font-mono text-sm"
        type="button"
      >
        <span>{currentLang.flag}</span>
        <span className="text-white/80">{mounted ? currentLang.label : "EN"}</span>
        <svg
          className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {mounted && isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-bg-surface border border-white/10 rounded-lg overflow-hidden shadow-xl min-w-[120px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors font-mono text-sm ${
                lang.code === language
                  ? "bg-primary/10 text-primary"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
              {lang.code === language && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
