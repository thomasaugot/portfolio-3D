"use client";

import { MouseEvent } from "react";
import { cn } from "@/utils/cn";

interface SkipLinkProps {
  href: string;
  label: string;
  className?: string;
}

export default function SkipLink({ href, label, className }: SkipLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;

    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;

    event.preventDefault();
    target.focus();
    target.scrollIntoView({ block: "start" });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100100] focus:inline-flex focus:items-center focus:gap-3 focus:rounded-xl focus:border focus:border-primary/35 focus:bg-bg-panel/95 focus:px-4 focus:py-3 focus:font-mono focus:text-sm focus:font-medium focus:text-text focus:shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_18px_40px_rgba(0,0,0,0.38)] focus:backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary/90 focus:ring-offset-2 focus:ring-offset-bg",
        className
      )}
    >
      <span aria-hidden="true" className="text-primary">
        ❯
      </span>
      <span className="text-primary/90">./</span>
      <span>{label}</span>
    </a>
  );
}
