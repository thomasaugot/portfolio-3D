"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  routeTranslations,
  defaultLocale,
  type Language,
  locales,
} from "@/utils/route-translations";

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

  // Always initialize from URL to avoid hydration mismatch
  const [language, setLanguage] = useState<Language>(() => {
    const currentLocale = pathname.split("/")[1] as Language;
    return locales.includes(currentLocale) ? currentLocale : defaultLocale;
  });

  const [translations, setTranslations] = useState<any>({});

  const loadTranslations = async (lang: Language) => {
    try {
      const [nav, homepage, portfolio, common, footer, contact, about, blog] = await Promise.all([
        import(`@/locales/${lang}/nav.json`),
        import(`@/locales/${lang}/homepage.json`),
        import(`@/locales/${lang}/portfolio.json`),
        import(`@/locales/${lang}/common.json`),
        import(`@/locales/${lang}/footer.json`),
        import(`@/locales/${lang}/contact.json`),
        import(`@/locales/${lang}/about.json`),
        import(`@/locales/${lang}/blog.json`),
      ]);

      const merged = {
        nav: nav.default,
        homepage: homepage.default,
        portfolio: portfolio.default,
        common: common.default,
        footer: footer.default,
        contact: contact.default,
        about: about.default,
        blog: blog.default,
      };

      setTranslations(merged);
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
    }
  };

  useEffect(() => {
    const urlLocale = pathname.split("/")[1] as Language;

    // If URL has a valid locale, use it
    if (urlLocale && locales.includes(urlLocale)) {
      if (urlLocale !== language) {
        setLanguage(urlLocale);
        if (typeof window !== "undefined") {
          localStorage.setItem("preferred-language", urlLocale);
        }
      }
    }
    // Only auto-detect language on initial load (when pathname is root or empty)
    // Don't auto-switch during navigation between pages
    else if (typeof window !== "undefined" && (pathname === "/" || pathname === "")) {
      const browserLang = detectBrowserLanguage();
      const savedLang = localStorage.getItem("preferred-language") as Language;
      const targetLang = savedLang || browserLang;

      if (targetLang !== defaultLocale || pathname === "/") {
        const newPath = translateRoute(pathname, targetLang);
        window.history.replaceState({}, "", newPath);
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

  const translateRoute = (
    currentPath: string,
    targetLang: Language
  ): string => {
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, "") || "/";
    const segments = pathWithoutLocale.split("/").filter(Boolean);

    if (segments.length === 0) {
      return `/${targetLang}`;
    }

    const mainRoute = segments[0];
    const translations = routeTranslations[targetLang];
    const translatedRoute =
      translations[mainRoute as keyof typeof translations] || mainRoute;

    const remainingSegments = segments.slice(1);
    const newPath = `/${targetLang}/${translatedRoute}${
      remainingSegments.length > 0 ? "/" + remainingSegments.join("/") : ""
    }`;

    return newPath;
  };

  const changeLanguage = async (newLanguage: Language) => {
    const newPath = translateRoute(pathname, newLanguage);
    window.history.replaceState({}, "", newPath);
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