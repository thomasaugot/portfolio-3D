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
        "fixed left-4 top-4 z-[100100] inline-flex items-center gap-3 rounded-xl border border-primary/35 bg-bg-panel/95 px-4 py-3 font-mono text-sm font-medium text-text shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_18px_40px_rgba(0,0,0,0.38)] backdrop-blur-md outline-none ring-2 ring-primary/90 ring-offset-2 ring-offset-bg transition-[transform,opacity] duration-150 -translate-y-[180%] opacity-0 pointer-events-none focus:translate-y-0 focus:opacity-100 focus:pointer-events-auto focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:pointer-events-auto",
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
