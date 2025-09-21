'use client'

import { useLanguageToggle } from '@/hooks/useLanguageToggle'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { initLanguageToggleAnimations } from '@/utils/animations/language-toggle-animations'

const flagEmojis = {
  en: '🇺🇸',
  fr: '🇫🇷', 
  es: '🇪🇸'
} as const

export function LanguageToggle() {
  const { currentLanguage, nextLanguage, handleLanguageToggle } = useLanguageToggle()

  useGSAPAnimations([initLanguageToggleAnimations])

  return (
    <div className="relative w-fit">
      {/* Single Orbiting Ring */}
      <div 
        data-animate="language-orbit"
        className="absolute inset-0 flex items-center justify-center w-20 h-20 border border-electric-blue/20 rounded-full -z-10 m-auto"
      >
        <div className="absolute top-0 left-1/2 w-1 h-1 bg-electric-blue rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-0.5 h-0.5 bg-violet rounded-full" />
      </div>

      <div className="relative flex items-center bg-surface/80 backdrop-blur-md border border-border/50 rounded-2xl p-3 shadow-lg">
        {/* Simple Globe Background */}
        <div
          data-animate="globe"
          className="absolute inset-3 rounded-xl bg-gradient-to-br from-electric-blue/10 to-violet/10 flex items-center justify-center overflow-hidden"
        >
          {/* Minimal Continents */}
          <div
            data-animate="continents"
            className="w-full h-full relative opacity-30"
          >
            <div className="absolute top-1/3 left-1/3 w-1.5 h-1 bg-electric-blue/40 rounded-full" />
            <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-violet/40 rounded-full" />
          </div>
        </div>

        {/* Language Toggle Button */}
        <button
          onClick={handleLanguageToggle}
          className="relative z-10 flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 hover:scale-110 group"
        >
          {/* Current Flag Display */}
          <div 
            data-animate="current-flag"
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <span className="text-xl mb-0.5">{flagEmojis[currentLanguage]}</span>
            <span className="text-xs font-mono text-text/70 uppercase tracking-wide">
              {currentLanguage}
            </span>
          </div>

          {/* Next Flag (Hidden, for animation) */}
          <div 
            data-animate="next-flag"
            className="absolute inset-0 flex flex-col items-center justify-center scale-0 opacity-0"
          >
            <span className="text-xl mb-0.5">{flagEmojis[nextLanguage]}</span>
            <span className="text-xs font-mono text-text/70 uppercase tracking-wide">
              {nextLanguage}
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}