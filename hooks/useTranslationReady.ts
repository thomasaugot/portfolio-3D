import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/providers/TranslationProvider";

export function useTranslationReady() {
  const [isReady, setIsReady] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const testKey = "homepage.hero_title";
    const translatedValue = t(testKey);

    if (translatedValue !== testKey) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [t]);

  return isReady;
}
