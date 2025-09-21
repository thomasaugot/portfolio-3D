export const routeTranslations = {
  en: {
    "about": "about",
    "portfolio": "portfolio",
    "blog": "blog",
    "contact": "contact",
  },
  fr: {
    "about": "a-propos",
    "portfolio": "portfolio",
    "blog": "blog",
    "contact": "contact",
  },
  es: {
    "about": "acerca-de",
    "portfolio": "portfolio",
    "blog": "blog",
    "contact": "contacto",
  },
};

export const locales = ["en", "fr", "es"] as const;
export const defaultLocale = "en" as const;
export type Language = typeof locales[number];

export const languageNames = {
  en: "English",
  fr: "Français", 
  es: "Español"
} as const;