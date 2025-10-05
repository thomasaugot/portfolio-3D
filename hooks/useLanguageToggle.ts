"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import { animateLanguageChange } from "@/utils/animations/language-toggle-animations";

export function useLanguageToggle() {
  const { language, changeLanguage, nextLanguage } = useTranslation();

  const handleLanguageToggle = async () => {
    const nextLang = nextLanguage();
    await animateLanguageChange(language, nextLang);
    changeLanguage(nextLang);
  };

  return {
    currentLanguage: language,
    nextLanguage: nextLanguage(),
    handleLanguageToggle,
  };
}
