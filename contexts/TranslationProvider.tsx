"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { defaultLocale, type Language, locales } from "@/utils/locales";

interface TranslationContextType {
  t: (key: string) => string;
  language: Language;
  changeLanguage: (newLanguage: Language) => void;
  nextLanguage: () => Language;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return defaultLocale;

  const browserLang = navigator.language.split("-")[0].toLowerCase();
  return locales.includes(browserLang as Language)
    ? (browserLang as Language)
    : defaultLocale;
}

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [language, setLanguage] = useState<Language>(() => {
    const currentLocale = pathname.split("/")[1] as Language;
    return locales.includes(currentLocale) ? currentLocale : defaultLocale;
  });

  const [translations, setTranslations] = useState<any>({});

  const loadTranslations = async (lang: Language) => {
    try {
      const [hero, about, projects, footer, navbar] = await Promise.all([
        import(`@/locales/${lang}/hero.json`),
        import(`@/locales/${lang}/about.json`),
        import(`@/locales/${lang}/projects.json`),
        import(`@/locales/${lang}/footer.json`),
        import(`@/locales/${lang}/navbar.json`),
      ]);

      const merged = {
        hero: hero.default,
        about: about.default,
        projects: projects.default,
        portfolio: projects.default,
        footer: footer.default,
        navbar: navbar.default,
      };

      setTranslations(merged);
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
    }
  };

  useEffect(() => {
    const urlLocale = pathname.split("/")[1] as Language;

    if (urlLocale && locales.includes(urlLocale)) {
      if (urlLocale !== language) {
        setLanguage(urlLocale);
        if (typeof window !== "undefined") {
          localStorage.setItem("preferred-language", urlLocale);
        }
      }
    } else if (
      typeof window !== "undefined" &&
      (pathname === "/" || pathname === "")
    ) {
      const browserLang = detectBrowserLanguage();
      const savedLang = localStorage.getItem("preferred-language") as Language;
      const targetLang = savedLang || browserLang;

      if (targetLang !== defaultLocale || pathname === "/") {
        window.history.replaceState({}, "", `/${targetLang}`);
        setLanguage(targetLang);
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

  const changeLanguage = async (newLanguage: Language) => {
    window.history.replaceState({}, "", `/${newLanguage}`);
    setLanguage(newLanguage);

    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-language", newLanguage);
    }
  };

  const nextLanguage = (): Language => {
    const currentIndex = locales.indexOf(language);
    return locales[(currentIndex + 1) % locales.length];
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
