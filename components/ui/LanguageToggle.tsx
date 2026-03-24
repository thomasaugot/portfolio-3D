"use client";

import { useTranslation } from "@/contexts/TranslationProvider";
import { useState, useEffect } from "react";
import { getStageFromPathname, getStagePath } from "@/utils/stage-paths";

const languages = ["en", "fr", "es"] as const;

export default function LanguageToggle() {
  const { language } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageSelect = (targetLang: string) => {
    if (targetLang === language) return;
    const { stage } = getStageFromPathname(window.location.pathname);
    const newPath = getStagePath(targetLang as typeof languages[number], stage);
    window.location.href = newPath;
  };

  return (
    <div className="flex items-center gap-1 font-mono text-sm" role="group" aria-label="Language selector">
      {languages.map((lang, i) => (
        <span key={lang} className="flex items-center">
          {i > 0 && <span className="text-muted mx-2">/</span>}
          <button
            onClick={() => handleLanguageSelect(lang)}
            aria-current={mounted && lang === language ? "true" : undefined}
            className={`keyboard-focus-ring rounded-lg px-3 py-2 transition-colors text-base ${
              mounted && lang === language
                ? "text-primary"
                : "text-text/72 hover:text-text"
            }`}
          >
            {lang.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
