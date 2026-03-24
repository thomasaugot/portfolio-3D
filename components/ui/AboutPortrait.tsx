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
    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border animate-fadeIn [html[data-theme='light']_&]:border-b-[#d1c2aa]">
      <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-[linear-gradient(180deg,rgba(16,185,129,0.04),rgba(245,158,11,0.06))] shadow-[0_10px_30px_rgba(16,185,129,0.08)] [html[data-theme='light']_&]:border-[#ccb99b]">
        <Image
          src="/assets/images/portrait/portrait.webp"
          alt={t("about.name")}
          fill
          className="object-cover object-[center_22%]"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-text">{t("about.name")}</p>
        <p className="text-xs text-primary font-mono mt-1">{t("hero.role")}</p>
      </div>
    </div>
  );
}
