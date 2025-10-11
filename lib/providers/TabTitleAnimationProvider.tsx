"use client";

import { useEffect, useState } from "react";
import { useTabTitleAnimation } from "@/hooks/useTabTitleAnimation";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { useTranslationReady } from "@/hooks/useTranslationReady";

export const TabTitleAnimationProvider = () => {
  const { t } = useTranslation();
  const isReady = useTranslationReady();
  const [phrases, setPhrases] = useState<string[]>([]);

  useEffect(() => {
    if (!isReady) return;

    const loadedPhrases = [
      t("common.meta.title.hello"),
      t("common.meta.title.name"),
      t("common.meta.title.role"),
    ];

    setPhrases(loadedPhrases);
  }, [isReady, t]);

  useTabTitleAnimation(phrases, !isReady);

  return null;
};
