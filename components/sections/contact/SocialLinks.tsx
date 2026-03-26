"use client";

import { SOCIAL_LINKS } from "@/data/contact";

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SOCIAL_LINKS.filter((link) => link.label !== "Email").map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="keyboard-focus-ring group rounded-xl p-2 text-text/70 transition-colors hover:text-text"
            aria-label={link.label}
          >
            <Icon aria-hidden="true" className={`w-8 h-8 transition-colors ${link.color}`} />
          </a>
        );
      })}
    </div>
  );
}
