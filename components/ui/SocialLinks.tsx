"use client";

import { SOCIAL_LINKS } from "@/data/contact";

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 shrink-0 ${className}`}>
      {SOCIAL_LINKS.filter((link) => link.label !== "Email").map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="keyboard-focus-ring group rounded-lg text-text/70 transition-colors hover:text-text"
            aria-label={link.label}
          >
            <Icon aria-hidden="true" className={`w-7 h-7 transition-colors ${link.color}`} />
          </a>
        );
      })}
    </div>
  );
}
