"use client";

import { useLanguageToggle } from "@/hooks/useLanguageToggle";

const languageLabels: Record<string, string> = {
  en: "EN",
  fr: "FR", 
  es: "ES",
};

export default function LanguageToggle() {
  const { currentLanguage, nextLanguage, handleLanguageToggle } = useLanguageToggle();

  return (
    <div 
      className="relative group"
      style={{ pointerEvents: 'auto', zIndex: 10000 }}
    >
      <button
        onClick={handleLanguageToggle}
        data-animate="language-toggle"
        className="relative flex items-center gap-4 px-5 py-3 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full hover:border-[#ccff02]/50 transition-all duration-400 cursor-pointer hover:bg-black/90 group"
        style={{
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          pointerEvents: 'auto'
        }}
      >
        {/* Current language - large and prominent */}
        <div className="text-xl font-bold text-white group-hover:text-[#ccff02] transition-colors duration-300">
          {languageLabels[currentLanguage]}
        </div>
        
        {/* Separator line that rotates */}
        <div className="w-6 h-0.5 bg-white/30 group-hover:bg-[#02bccc] group-hover:rotate-90 transition-all duration-500 origin-center" />
        
        {/* Available languages in smaller text */}
        <div className="flex items-center gap-2">
          {Object.entries(languageLabels)
            .filter(([code]) => code !== currentLanguage)
            .map(([code, label]) => (
              <span 
                key={code}
                className={`text-sm font-mono text-white/40 transition-colors duration-300 ${
                  code === nextLanguage ? 'group-hover:text-[#02bccc] group-hover:scale-110' : ''
                }`}
              >
                {label}
              </span>
            ))
          }
        </div>
      </button>
    </div>
  );
}