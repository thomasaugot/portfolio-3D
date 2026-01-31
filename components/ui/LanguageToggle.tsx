"use client";

import { useTranslation } from "@/contexts/TranslationProvider";
import { useState, useEffect } from "react";

const languages = ["en", "fr", "es"] as const;

export default function LanguageToggle() {
  const { language } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageSelect = (targetLang: string) => {
    if (targetLang === language) return;
    const pathname = window.location.pathname;
    const currentLocale = pathname.split("/")[1];
    const newPath = pathname.replace(`/${currentLocale}`, `/${targetLang}`);
    window.location.href = newPath;
  };

  return (
    <div className="flex items-center gap-1 font-mono text-sm">
      {languages.map((lang, i) => (
        <span key={lang} className="flex items-center">
          {i > 0 && <span className="text-white/20 mx-1">/</span>}
          <button
            onClick={() => handleLanguageSelect(lang)}
            className={`transition-colors ${
              mounted && lang === language
                ? "text-primary"
                : "text-white/40 hover:text-white"
            }`}
          >
            {lang.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
