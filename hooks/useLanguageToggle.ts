"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import { animateLanguageChange } from "@/utils/animations/language-toggle-animations";

export function useLanguageToggle() {
  const { language, nextLanguage } = useTranslation();

  const handleLanguageToggle = async () => {
    const nextLang = nextLanguage();
    await animateLanguageChange(language, nextLang);

    // Get the new path and reload to avoid glitches
    const pathname = window.location.pathname;
    const currentLocale = pathname.split('/')[1];
    const newPath = pathname.replace(`/${currentLocale}`, `/${nextLang}`);
    window.location.href = newPath;
  };

  return {
    currentLanguage: language,
    nextLanguage: nextLanguage(),
    handleLanguageToggle,
  };
}
