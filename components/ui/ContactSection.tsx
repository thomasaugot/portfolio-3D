"use client";

import { useTranslation } from "@/hooks/useTranslation";

export default function ContactSection() {
  const { t } = useTranslation();

  return (
    <div className="w-72">
      {/* Desktop Version */}
      <div className="hidden lg:block">
        <div className="text-xs font-mono text-subtle uppercase tracking-[0.2em] mb-6">
          {t("nav.contact.title")}
        </div>
        
        <div className="space-y-3">
          {/* WhatsApp Contact */}
          <div
            onClick={() => window.open("https://wa.me/34684736469", "_blank")}
            className="card group cursor-pointer hover:scale-[1.02]"
          >
            <div className="flex items-center px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              
              <div className="flex-1">
                <div className="text-xs font-mono text-subtle uppercase tracking-wider mb-0.5">
                  {t("nav.contact.whatsapp")}
                </div>
                <div className="text-sm text-text font-mono">
                  +34 684 73 64 69
                </div>
              </div>
              
              <div className="w-4 h-4 opacity-40 group-hover:opacity-80 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </div>
            </div>
          </div>

          {/* Email Contact */}
          <div
            onClick={() => (window.location.href = "mailto:thomas.augot@gmail.com")}
            className="card group cursor-pointer hover:scale-[1.02]"
          >
            <div className="flex items-center px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center mr-3 group-hover:bg-secondary/20 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-secondary">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              
              <div className="flex-1">
                <div className="text-xs font-mono text-subtle uppercase tracking-wider mb-0.5">
                  {t("nav.contact.email")}
                </div>
                <div className="text-sm text-text font-mono">
                  thomas.augot@gmail.com
                </div>
              </div>
              
              <div className="w-4 h-4 opacity-40 group-hover:opacity-80 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </div>
            </div>
          </div>

          {/* Schedule Contact */}
          <div
            onClick={() => window.open("https://calendly.com/yourusername", "_blank")}
            className="card group cursor-pointer hover:scale-[1.02]"
          >
            <div className="flex items-center px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3 group-hover:bg-accent/20 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              
              <div className="flex-1">
                <div className="text-xs font-mono text-subtle uppercase tracking-wider mb-0.5">
                  {t("nav.contact.schedule")}
                </div>
                <div className="text-sm text-text font-mono">
                  {t("nav.contact.bookCall")}
                </div>
              </div>
              
              <div className="w-4 h-4 opacity-40 group-hover:opacity-80 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        <div className="text-xs font-mono text-subtle uppercase tracking-[0.2em] mb-3 text-center">
          {t("nav.contact.title")}
        </div>
        
        <div className="flex justify-center gap-4">
          <div
            onClick={() => window.open("https://wa.me/34684736469", "_blank")}
            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 hover:scale-110 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>

          <div
            onClick={() => (window.location.href = "mailto:thomas.augot@gmail.com")}
            className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center cursor-pointer hover:bg-secondary/20 hover:scale-110 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-secondary">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>

          <div
            onClick={() => window.open("https://calendly.com/yourusername", "_blank")}
            className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center cursor-pointer hover:bg-accent/20 hover:scale-110 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}