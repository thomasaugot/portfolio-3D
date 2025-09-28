'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useTheme } from '@/components/theme/ThemeProvider'
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations'
import { languageNames, type Language } from '@/utils/route-translations'
import { initCarousel3D, rotateCarousel3D } from '@/utils/animations/carousel-3d-animations'

const welcomeTexts = {
  en: { welcome: 'Welcome', choose: 'Choose your language' },
  fr: { welcome: 'Bienvenue', choose: 'Choisissez votre langue' },
  es: { welcome: 'Bienvenido', choose: 'Elige tu idioma' }
}

export function LanguageDiscovery() {
  const { language, changeLanguage } = useTranslation()
  const { isDark, isLight } = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  const [selectedLang, setSelectedLang] = useState<Language>('en')
  const [hoverLang, setHoverLang] = useState<Language>('en')
  const [isCarouselReady, setIsCarouselReady] = useState(false)
  const [currentFrontIndex, setCurrentFrontIndex] = useState(0)
  const cardStylesRef = useRef<{ [key: number]: 'front' | 'back' }>({})
  
  const languages: Language[] = ['en', 'fr', 'es']
  const detectedLanguage = typeof window !== 'undefined' 
    ? (['en', 'fr', 'es'].includes(navigator.language.slice(0, 2)) 
       ? navigator.language.slice(0, 2) as Language 
       : 'en')
    : 'en'

  useGSAPAnimations([initCarousel3D])

  // Initialize card styles
  useEffect(() => {
    cardStylesRef.current = {
      0: 'front',
      1: 'back', 
      2: 'back'
    }
  }, [])

  useEffect(() => {
    const hasSeenDiscovery = localStorage.getItem('language-discovery-seen')
    setIsVisible(!hasSeenDiscovery)
  }, [])

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        try {
          initCarousel3D()
          rotateCarousel3D(0)
          console.log('Carousel initialized')
          updateCardStyles(0)
        } catch (error) {
          console.error('Carousel init failed:', error)
        }
        setIsCarouselReady(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  const handleLanguageClick = (lang: Language) => {
    setSelectedLang(lang)
    setHoverLang(lang)
    const selectedIndex = languages.indexOf(lang)
    setCurrentFrontIndex(selectedIndex)
    rotateCarousel3D(selectedIndex)
    
    const updateStyles = () => {
      updateCardStyles(selectedIndex)
    }
    
    setTimeout(updateStyles, 200)
    setTimeout(updateStyles, 500)
    setTimeout(updateStyles, 800)
  }

  const updateCardStyles = (frontIndex: number) => {
    cardStylesRef.current = {}
    languages.forEach((_, index) => {
      cardStylesRef.current[index] = index === frontIndex ? 'front' : 'back'
    })

    setCurrentFrontIndex(frontIndex)
    
    const cards = document.querySelectorAll('[data-animate="card-3d"]') as NodeListOf<HTMLElement>
    if (cards.length === 0) return

    cards.forEach((cardElement, index) => {
      const isFront = index === frontIndex
      const lang = languages[index]
      
      const cardContent = cardElement.querySelector('.card-container') as HTMLElement
      const gradientBorder = cardElement.querySelector('.gradient-border') as HTMLElement
      const langCode = cardElement.querySelector('.lang-code') as HTMLElement
      const langName = cardElement.querySelector('.lang-name') as HTMLElement
      const statusText = cardElement.querySelector('.status-text') as HTMLElement
      
      if (!cardContent || !langCode || !langName || !statusText) return

      if (isFront) {
        // Front card styling
        cardContent.className = isLight
          ? 'card-container relative overflow-hidden rounded-3xl w-40 h-48 transition-all duration-300 transform group-hover:scale-105 gradient-primary shadow-theme-strong'
          : 'card-container relative overflow-hidden rounded-3xl w-40 h-48 transition-all duration-300 transform group-hover:scale-105 gradient-primary shadow-xl shadow-[var(--primary-color)]/40'
        
        if (gradientBorder) gradientBorder.style.display = 'none'
        langCode.className = 'lang-code text-5xl font-bold mb-4 text-black'
        langName.className = 'lang-name text-lg font-medium mb-2 text-black'
        statusText.className = 'status-text text-sm font-medium animate-pulse text-black'
        statusText.textContent = 'Selected'
        statusText.style.display = 'block'
      } else {
        // Back card styling
        cardContent.className = isLight
          ? 'card-container relative overflow-hidden rounded-3xl w-40 h-48 transition-all duration-300 transform group-hover:scale-105 bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-theme-medium hover:shadow-theme-strong'
          : 'card-container relative overflow-hidden rounded-3xl w-40 h-48 transition-all duration-300 transform group-hover:scale-105 bg-[var(--color-surface)] shadow-lg'
        
        if (gradientBorder) {
          if (isLight) {
            gradientBorder.style.display = 'none'
          } else {
            gradientBorder.style.display = 'block'
          }
        }
        
        langCode.className = isLight
          ? 'lang-code text-5xl font-bold mb-4 text-[var(--primary-color)]'
          : 'lang-code text-5xl font-bold mb-4 text-[var(--primary-color)]'
        
        langName.className = isLight
          ? 'lang-name text-lg font-medium mb-2 text-[var(--color-text)]'
          : 'lang-name text-lg font-medium mb-2 text-[var(--color-text)]'
        
        if (lang === detectedLanguage) {
          statusText.className = isLight
            ? 'status-text text-sm font-medium animate-pulse text-[var(--secondary-color)]'
            : 'status-text text-sm font-medium animate-pulse text-[var(--secondary-color)]'
          statusText.textContent = 'Detected'
          statusText.style.display = 'block'
        } else {
          statusText.style.display = 'none'
        }
      }
    })
  }

  const handleContinue = () => {
    changeLanguage(selectedLang)
    setIsVisible(false)
    localStorage.setItem('language-discovery-seen', 'true')
  }

  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 backdrop-blur-md z-[999] flex items-center justify-center p-8 transition-all duration-300 ${
      isLight 
        ? 'bg-[var(--color-bg)]/95' 
        : 'bg-[var(--color-bg)]/90'
    }`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[480px] h-[480px] translate-y-8">
          <div className={`absolute w-[400px] h-[320px] rounded-full animate-[orbit_25s_linear_infinite] top-[80px] left-[40px] ${
            isLight 
              ? 'border border-[var(--color-accent-border)]' 
              : 'border border-[var(--primary-color)]/20'
          }`}>
            <div className={`absolute top-0 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 ${
              isLight 
                ? 'bg-[var(--primary-color)] shadow-theme-light' 
                : 'bg-[var(--primary-color)] shadow-lg shadow-[var(--primary-color)]/50'
            }`} />
            <div className={`absolute bottom-1/4 right-1/4 w-1.5 h-1.5 rounded-full ${
              isLight 
                ? 'bg-[var(--secondary-color)] shadow-theme-light' 
                : 'bg-[var(--secondary-color)] shadow-lg shadow-[var(--secondary-color)]/50'
            }`} />
            <div className={`absolute left-1/4 top-1/3 w-1.5 h-1.5 rounded-full ${
              isLight 
                ? 'bg-[var(--primary-color)] shadow-theme-light' 
                : 'bg-[var(--primary-color)] shadow-lg shadow-[var(--primary-color)]/50'
            }`} />
          </div>
          <div className={`absolute w-[360px] h-[280px] rounded-full animate-[orbit_35s_linear_infinite_reverse] top-[100px] left-[60px] ${
            isLight 
              ? 'border border-[var(--color-accent-border)]/50' 
              : 'border border-[var(--secondary-color)]/15'
          }`}>
            <div className={`absolute top-1/4 right-0 w-1 h-1 rounded-full ${
              isLight ? 'bg-[var(--secondary-color)]' : 'bg-[var(--secondary-color)]'
            }`} />
            <div className={`absolute left-0 bottom-1/3 w-1 h-1 rounded-full ${
              isLight ? 'bg-[var(--primary-color)]' : 'bg-[var(--primary-color)]'
            }`} />
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center w-full">
        <div className="mb-12">
          <h1 className={`text-5xl font-bold mb-4 transition-all duration-500 ${
            isLight ? 'text-[var(--color-text)]' : 'text-[var(--color-text)]'
          }`}>
            {welcomeTexts[hoverLang].welcome}
          </h1>
          <p className={`text-xl transition-all duration-500 ${
            isLight ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-muted)]'
          }`}>
            {welcomeTexts[hoverLang].choose}
          </p>
        </div>

        <div 
          className="relative h-80 flex items-center justify-center" 
          style={{ perspective: '1000px' }}
        >
          {!isCarouselReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 gradient-primary rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div 
            data-animate="carousel-3d"
            className={`relative w-1 h-1 transition-opacity duration-500 ${
              isCarouselReady ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {languages.map((lang, index) => {
              const cardPosition = cardStylesRef.current[index] || (index === currentFrontIndex ? 'front' : 'back')
              const isFront = cardPosition === 'front'
              
              return (
                <div
                  key={lang}
                  data-animate="card-3d"
                  className="absolute cursor-pointer group"
                  onClick={() => handleLanguageClick(lang)}
                  onMouseEnter={() => setHoverLang(lang)}
                  onMouseLeave={() => setHoverLang(selectedLang)}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    left: '-80px',
                    top: '-96px'
                  }}
                >
                  <div className={`card-container relative overflow-hidden rounded-3xl w-40 h-48 transition-all duration-300 transform group-hover:scale-105 ${
                    isFront 
                      ? isLight 
                        ? 'gradient-primary shadow-theme-strong' 
                        : 'gradient-primary shadow-xl shadow-[var(--primary-color)]/40'
                      : isLight
                        ? 'bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-theme-medium hover:shadow-theme-strong'
                        : 'bg-[var(--color-surface)] shadow-lg'
                  }`}>
                    {!isFront && !isLight && (
                      <div className="gradient-border absolute inset-0 rounded-3xl gradient-primary p-[2px]">
                        <div className="w-full h-full bg-[var(--color-surface)] rounded-3xl" />
                      </div>
                    )}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
                      <div className={`lang-code text-5xl font-bold mb-4 ${
                        isFront ? 'text-black' : 'text-[var(--primary-color)]'
                      }`}>
                        {lang.toUpperCase()}
                      </div>
                      
                      <div className={`lang-name text-lg font-medium mb-2 ${
                        isFront ? 'text-black' : 'text-[var(--color-text)]'
                      }`}>
                        {languageNames[lang]}
                      </div>
                      
                      <div className={`status-text text-sm font-medium animate-pulse ${
                        isFront 
                          ? 'text-black block' 
                          : lang === detectedLanguage 
                            ? 'text-[var(--secondary-color)] block' 
                            : 'hidden'
                      }`}>
                        {isFront ? 'Selected' : lang === detectedLanguage ? 'Detected' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <button
          onClick={handleContinue}
          className={`mt-12 px-8 py-4 rounded-full gradient-primary text-black font-semibold text-lg 
                     hover:gradient-primary-hover hover:scale-110 transition-all duration-300 
                     border border-[var(--primary-color)]/30
                     flex items-center gap-3 mx-auto group ${
                       isLight 
                         ? 'shadow-theme-strong hover:shadow-theme-strong' 
                         : 'shadow-xl hover:shadow-2xl'
                     }`}
        >
          Continue
          <svg 
            className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}