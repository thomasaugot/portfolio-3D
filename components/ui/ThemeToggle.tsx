"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeProvider";
import { useCanva } from "@/components/ui/Canva";

interface ThemeToggleProps {
  alwaysVisible?: boolean;
  variant?: "floating" | "menu" | "tile";
  className?: string;
}

export default function ThemeToggle({ alwaysVisible = false, variant = "floating", className = "" }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  const { stage, heroReady, isMorphing } = useCanva();

  const visible = alwaysVisible || (heroReady && stage === "hero" && !isMorphing);

  if (variant === "tile") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-pressed={isDark}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={cn(
          "keyboard-focus-ring group flex items-center justify-center h-14 w-full rounded-xl border border-border bg-text/6 text-text/60 hover:bg-text/12 transition-all",
          className
        )}
      >
        {isDark
          ? <Sun size={22} className="transition-colors group-hover:text-secondary" />
          : <Moon size={22} className="transition-colors group-hover:text-primary" />}
      </button>
    );
  }

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-pressed={isDark}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={cn(
          "keyboard-focus-ring inline-flex items-center gap-2 w-full justify-between rounded-xl border border-border bg-text/7 px-3 py-2 text-text/88 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-text/12 hover:text-text",
          className
        )}
      >
        <span className="inline-flex items-center gap-2">
          {isDark ? <Sun size={16} className="text-secondary" /> : <Moon size={16} className="text-primary" />}
          <span className="font-mono text-xs">{isDark ? "Dark mode" : "Light mode"}</span>
        </span>
        <span className="font-mono text-xs text-text/72">{isDark ? "dark" : "light"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "keyboard-focus-ring group relative inline-flex items-center justify-center w-11 h-11 rounded-xl border border-border backdrop-blur-sm transition-all duration-300",
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
