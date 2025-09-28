"use client";

import { useLanguageToggle } from "@/hooks/useLanguageToggle";
import { useTheme } from "@/components/theme/ThemeProvider";

const languageLabels: Record<string, string> = {
  en: "EN",
  fr: "FR", 
  es: "ES",
};

export default function LanguageToggle() {
  const { currentLanguage, nextLanguage, handleLanguageToggle } = useLanguageToggle();
  const { isDark, isLight } = useTheme();

  return (
    <button
      onClick={handleLanguageToggle}
      data-animate="language-toggle"
      className={`relative flex items-center gap-4 px-5 py-3 backdrop-blur-xl rounded-full transition-all duration-400 cursor-pointer group ${
        isLight 
          ? 'bg-[var(--color-surface)]/90 border-2 border-[var(--color-border)] hover:border-[var(--color-accent-border)] shadow-theme-light hover:shadow-theme-medium hover:bg-[var(--color-surface)]' 
          : 'bg-black/80 border border-white/10 hover:border-[#ccff02]/50 hover:bg-black/90'
      }`}
      style={{
        boxShadow: isLight ? undefined : '0 4px 20px rgba(0,0,0,0.4)',
        pointerEvents: 'all !important' as any,
        zIndex: 999999,
        position: 'relative',
        isolation: 'isolate'
      }}
      type="button"
    >
      {/* Current language - large and prominent */}
      <div className={`text-xl font-bold transition-colors duration-300 pointer-events-none ${
        isLight 
          ? 'text-[var(--color-text)] group-hover:text-[#ccff02]' 
          : 'text-white group-hover:text-[#ccff02]'
      }`}>
        {languageLabels[currentLanguage]}
      </div>
      
      {/* Separator line that rotates */}
      <div className={`w-6 h-0.5 group-hover:rotate-90 transition-all duration-500 origin-center pointer-events-none ${
        isLight 
          ? 'bg-[var(--color-border)] group-hover:bg-[#02bccc]' 
          : 'bg-white/30 group-hover:bg-[#02bccc]'
      }`} />
      
      {/* Available languages in smaller text */}
      <div className="flex items-center gap-2 pointer-events-none">
        {Object.entries(languageLabels)
          .filter(([code]) => code !== currentLanguage)
          .map(([code, label]) => (
            <span 
              key={code}
              className={`text-sm font-mono transition-colors duration-300 pointer-events-none ${
                code === nextLanguage 
                  ? isLight
                    ? 'text-[var(--color-text-muted)] group-hover:text-[#02bccc] group-hover:scale-110'
                    : 'text-white/40 group-hover:text-[#02bccc] group-hover:scale-110'
                  : isLight
                    ? 'text-[var(--color-text-subtle)]'
                    : 'text-white/40'
              }`}
            >
              {label}
            </span>
          ))
        }
      </div>
    </button>
  );
}