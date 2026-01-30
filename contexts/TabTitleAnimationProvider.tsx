"use client";

import { useEffect, useState } from "react";
import { useTabTitleAnimation } from "@/hooks/useTabTitleAnimation";
import { useTranslation } from "@/contexts/TranslationProvider";
import { useTranslationReady } from "@/hooks/useTranslationReady";

export const TabTitleAnimationProvider = () => {
  const { t } = useTranslation();
  const isReady = useTranslationReady();
  const [phrases, setPhrases] = useState<string[]>([]);

  useEffect(() => {
    if (!isReady) return;

    const loadedPhrases = [
      t("hero.tab_title.hello"),
      t("hero.tab_title.name"),
      t("hero.tab_title.role"),
    ];

    setPhrases(loadedPhrases);
  }, [isReady, t]);

  useTabTitleAnimation(phrases, !isReady);

  return null;
};
