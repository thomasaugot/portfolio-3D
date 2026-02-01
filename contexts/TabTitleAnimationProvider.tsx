"use client";

import { useMemo } from "react";
import { useTabTitleAnimation } from "@/hooks/useTabTitleAnimation";
import { useIsAppReady } from "@/contexts/LoadingProvider";
import { useTranslation } from "@/contexts/TranslationProvider";

export const TabTitleAnimationProvider = () => {
  const { isReady } = useIsAppReady();
  const { t } = useTranslation();

  const phrases = useMemo(
    () => [
      t("hero.tab_title.p1"),
      t("hero.tab_title.p2"),
      t("hero.tab_title.p3"),
      t("hero.tab_title.p4"),
    ],
    [t]
  );

  useTabTitleAnimation(phrases, !isReady);

  return null;
};
