"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from './useTranslation';
import { type Language } from '@/utils/route-translations';

export function useLanguageDiscovery() {
  const { language, changeLanguage } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentGreeting, setCurrentGreeting] = useState<Language>('en');
  const [detectedLanguage, setDetectedLanguage] = useState<Language>('en');

  useEffect(() => {
    const hasSeenDiscovery = localStorage.getItem('language-discovery-seen');
    
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.slice(0, 2) as Language;
      const supportedLang = ['en', 'fr', 'es'].includes(browserLang) ? browserLang : 'en';
      setDetectedLanguage(supportedLang);
      
      // Show discovery if user hasn't seen it and browser language differs from current
      if (!hasSeenDiscovery && supportedLang !== language) {
        setIsVisible(true);
        
        // Animated greeting cycle
        const languages: Language[] = ['en', 'fr', 'es'];
        let index = 0;
        const interval = setInterval(() => {
          setCurrentGreeting(languages[index]);
          index = (index + 1) % languages.length;
        }, 800);

        // Stop on detected language after a few cycles
        setTimeout(() => {
          clearInterval(interval);
          setCurrentGreeting(supportedLang);
        }, 3000);
      }
    }
  }, [language]);

  const handleLanguageSelect = (selectedLang: Language) => {
    changeLanguage(selectedLang);
    setIsVisible(false);
    localStorage.setItem('language-discovery-seen', 'true');
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('language-discovery-seen', 'true');
  };

  return {
    isVisible,
    currentGreeting,
    detectedLanguage,
    currentLanguage: language,
    handleLanguageSelect,
    handleDismiss,
  };
}