"use client";

import { Gauge, Waves } from "lucide-react";
import { cn } from "@/utils/cn";
import { useCanva } from "@/components/ui/Canva";
import { useMotionPreference } from "@/contexts/MotionPreferenceProvider";
import { useTranslation } from "@/contexts/TranslationProvider";

interface MotionToggleProps {
  variant?: "floating" | "menu";
  className?: string;
}

export default function MotionToggle({
  variant = "floating",
  className = "",
}: MotionToggleProps) {
  const { stage, heroReady, isMorphing } = useCanva();
  const { reducedMotion, isSystemPreference, toggleMotionMode } = useMotionPreference();
  const { t } = useTranslation();

  const visible = heroReady && stage === "hero" && !isMorphing;
  const Icon = reducedMotion ? Waves : Gauge;
  const statusLabel = reducedMotion
    ? t("footer.motion.reduced")
    : t("footer.motion.full");

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={toggleMotionMode}
        aria-pressed={reducedMotion}
        aria-label={`${t("footer.motion.toggle")}: ${statusLabel}`}
        title={`${t("footer.motion.toggle")}: ${statusLabel}`}
        className={cn(
          "keyboard-focus-ring inline-flex items-center gap-2 w-full justify-between rounded-xl border border-border bg-text/7 px-3 py-2 text-text/88 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-text/12 hover:text-text",
          className
        )}
      >
        <span className="inline-flex items-center gap-2">
          <Icon size={16} aria-hidden="true" className={reducedMotion ? "text-secondary" : "text-primary"} />
          <span className="font-mono text-xs">{t("footer.motion.toggle")}</span>
        </span>
        <span className="font-mono text-xs text-text/72">
          {isSystemPreference ? t("footer.motion.system") : statusLabel}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleMotionMode}
      aria-pressed={reducedMotion}
      aria-label={`${t("footer.motion.toggle")}: ${statusLabel}`}
      title={`${t("footer.motion.toggle")}: ${statusLabel}`}
      className={cn(
        "keyboard-focus-ring group relative hidden lg:inline-flex items-center justify-center w-11 h-11 rounded-xl border border-border backdrop-blur-sm transition-all duration-300",
        "bg-text/6 hover:bg-text/12 hover:border-primary/40",
        reducedMotion
          ? "shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:shadow-[0_0_16px_rgba(245,158,11,0.3)]"
          : "hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]",
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none",
        className
      )}
    >
      <Icon
        size={15}
        aria-hidden="true"
        className={cn(
          "transition-all duration-300 group-hover:scale-110",
          reducedMotion ? "text-secondary" : "text-text/60 group-hover:text-primary"
        )}
      />
    </button>
  );
}
