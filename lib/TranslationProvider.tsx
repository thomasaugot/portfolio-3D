"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { routeTranslations, defaultLocale, type Language } from "@/utils/route-translations";

interface TranslationContextType {
  t: (key: string) => string;
  language: Language;
  changeLanguage: (newLanguage: Language) => void;
  nextLanguage: () => Language;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preferred-language') as Language;
      if (saved && ['en', 'fr', 'es'].includes(saved)) {
        return saved;
      }
    }
    const currentLocale = pathname.split('/')[1] as Language;
    return currentLocale || defaultLocale;
  });

  const [translations, setTranslations] = useState<any>({});

  const loadTranslations = async (lang: Language) => {
    try {
      const [nav, homepage, portfolio, common] = await Promise.all([
        import(`@/locales/${lang}/nav.json`),
        import(`@/locales/${lang}/homepage.json`),
        import(`@/locales/${lang}/portfolio.json`),
        import(`@/locales/${lang}/common.json`)
      ]);

      const merged = {
        nav: nav.default,
        homepage: homepage.default,
        portfolio: portfolio.default,
        common: common.default
      };

      setTranslations(merged);
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
    }
  };

  useEffect(() => {
    const urlLocale = pathname.split('/')[1] as Language;
    if (urlLocale && ['en', 'fr', 'es'].includes(urlLocale)) {
      if (urlLocale !== language) {
        setLanguage(urlLocale);
        if (typeof window !== 'undefined') {
          localStorage.setItem('preferred-language', urlLocale);
        }
      }
    }
  }, [pathname, language]);

  useEffect(() => {
    loadTranslations(language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  const translateRoute = (currentPath: string, targetLang: Language): string => {
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, '') || '/';
    const segments = pathWithoutLocale.split('/').filter(Boolean);
    
    if (segments.length === 0) {
      return `/${targetLang}`;
    }

    const mainRoute = segments[0];
    const translations = routeTranslations[targetLang];
    const translatedRoute = translations[mainRoute as keyof typeof translations] || mainRoute;
    
    const remainingSegments = segments.slice(1);
    const newPath = `/${targetLang}/${translatedRoute}${remainingSegments.length > 0 ? '/' + remainingSegments.join('/') : ''}`;
    
    return newPath;
  };

  const changeLanguage = async (newLanguage: Language) => {
    const newPath = translateRoute(pathname, newLanguage);
    window.history.replaceState({}, '', newPath);
    setLanguage(newLanguage);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', newLanguage);
    }
  };

  const nextLanguage = (): Language => {
    const languages: Language[] = ['en', 'fr', 'es'];
    const currentIndex = languages.indexOf(language);
    return languages[(currentIndex + 1) % languages.length];
  };

  return (
    <TranslationContext.Provider
      value={{ t, language, changeLanguage, nextLanguage }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}