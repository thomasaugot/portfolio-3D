"use client";

import Image from "next/image";
import { useTranslation } from "@/contexts/TranslationProvider";

interface AboutPortraitProps {
  visible: boolean;
}

export default function AboutPortrait({ visible }: AboutPortraitProps) {
  const { t } = useTranslation();

  if (!visible) return null;

  return (
    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10 animate-fadeIn">
      <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden rounded-lg border border-white/10">
        <Image
          src="/assets/images/portrait/portrait.png"
          alt={t("about.name")}
          fill
          className="object-cover object-[center_55%]"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{t("about.name")}</p>
        <p className="text-xs text-primary font-mono mt-1">{t("hero.role")}</p>
      </div>
    </div>
  );
}
