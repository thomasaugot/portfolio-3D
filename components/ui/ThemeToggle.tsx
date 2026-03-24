"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeProvider";
import { useCanva } from "@/components/ui/Canva";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const { stage, heroReady, isMorphing } = useCanva();

  const visible = heroReady && stage === "hero" && !isMorphing;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "keyboard-focus-ring group relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border backdrop-blur-sm transition-all duration-300",
        "bg-text/6 hover:bg-text/12 hover:border-primary/40",
        isDark
          ? "hover:shadow-[0_0_12px_rgba(245,158,11,0.2)]"
          : "hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]",
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      {isDark ? (
        <Sun
          aria-hidden="true"
          size={15}
          className="text-text/60 transition-all duration-300 group-hover:text-secondary group-hover:scale-110 group-hover:rotate-12"
        />
      ) : (
        <Moon
          aria-hidden="true"
          size={15}
          className="text-text/60 transition-all duration-300 group-hover:text-primary group-hover:scale-110 group-hover:-rotate-12"
        />
      )}
    </button>
  );
}
