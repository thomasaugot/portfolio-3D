import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/providers/TranslationProvider";

export function useTranslationReady() {
  const [isReady, setIsReady] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Use a common key that exists on all pages
    const testKey = "common.status.loading";
    const translatedValue = t(testKey);

    if (translatedValue !== testKey) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [t]);

  return isReady;
}

