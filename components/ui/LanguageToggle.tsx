"use client";

import { useLanguageToggle } from "@/hooks/useLanguageToggle";
import { useTheme } from "@/lib/providers/ThemeProvider";
import { useState, useEffect } from "react";

const languageLabels: Record<string, string> = {
  en: "EN",
  fr: "FR",
  es: "ES",
};

export default function LanguageToggle() {
  const { currentLanguage, nextLanguage, handleLanguageToggle } =
    useLanguageToggle();
  const { isDark, isLight } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        data-animate="language-toggle"
        className={`relative flex items-center gap-4 px-5 py-3 backdrop-blur-xl rounded-full transition-all duration-400 cursor-pointer group overflow-hidden
          border-2 border-transparent
          [background-image:linear-gradient(var(--color-bg),var(--color-bg)),linear-gradient(222deg,var(--primary-color)_67.22%,var(--secondary-color)_93.57%)]
          [background-origin:border-box,border-box]
          [background-clip:padding-box,border-box]
        `}
        style={{
          pointerEvents: "all !important" as any,
          zIndex: 999999,
          position: "relative",
          isolation: "isolate",
        }}
        type="button"
        disabled
      >
        <div className="text-xl font-bold transition-colors duration-300 pointer-events-none text-[var(--color-text)]">
          --
        </div>
        <div className="w-6 h-0.5 bg-[var(--color-border)] group-hover:rotate-90 transition-all duration-500 origin-center pointer-events-none" />
        <div className="flex items-center gap-2 pointer-events-none">
          <span className="text-sm font-mono transition-all duration-300 pointer-events-none text-[var(--color-text-muted)]">
            --
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleLanguageToggle}
      data-animate="language-toggle"
      className={`relative flex items-center gap-4 px-5 py-3 backdrop-blur-xl rounded-full transition-all duration-400 cursor-pointer group overflow-hidden
        border-2 border-transparent
        [background-image:linear-gradient(var(--color-bg),var(--color-bg)),linear-gradient(222deg,var(--primary-color)_67.22%,var(--secondary-color)_93.57%)]
        [background-origin:border-box,border-box]
        [background-clip:padding-box,border-box]
      `}
      style={{
        pointerEvents: "all !important" as any,
        zIndex: 999999,
        position: "relative",
        isolation: "isolate",
      }}
      type="button"
    >
      <div className="text-xl font-bold transition-colors duration-300 pointer-events-none text-[var(--color-text)]">
        {languageLabels[currentLanguage]}
      </div>

      <div className="w-6 h-0.5 bg-[var(--color-border)] group-hover:rotate-90 transition-all duration-500 origin-center pointer-events-none" />

      <div className="flex items-center gap-2 pointer-events-none">
        {Object.entries(languageLabels)
          .filter(([code]) => code !== currentLanguage)
          .map(([code, label]) => (
            <span
              key={code}
              className={`text-sm font-mono transition-all duration-300 pointer-events-none text-[var(--color-text-muted)]
                ${code === nextLanguage ? "group-hover:scale-110" : ""}
              `}
            >
              {label}
            </span>
          ))}
      </div>
    </button>
  );
}