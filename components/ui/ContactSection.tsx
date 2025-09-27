"use client";

import { useTranslation } from "@/hooks/useTranslation";

export default function ContactSection() {
  const { t } = useTranslation();

  return (
    <div className="w-72">
      {/* Desktop Version */}
      <div className="hidden lg:block">
        <div className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-6 opacity-60">
          {t("nav.contact.title")}
        </div>
        
        <div className="space-y-3">
          {/* WhatsApp Contact */}
          <div
            onClick={() => window.open("https://wa.me/34684736469", "_blank")}
            className="group cursor-pointer relative overflow-hidden bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg hover:border-white/20 transition-all duration-300 hover:bg-black/30"
          >
            <div className="flex items-center px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-colors duration-300">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-white/70 group-hover:text-white transition-colors duration-300"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              
              <div className="flex-1">
                <div className="text-xs font-mono text-white/50 uppercase tracking-wider mb-0.5">
                  {t("nav.contact.whatsapp")}
                </div>
                <div className="text-sm text-white/90 font-mono group-hover:text-white transition-colors duration-300">
                  +34 684 73 64 69
                </div>
              </div>
              
              <div className="w-4 h-4 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-white"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </div>
            </div>
          </div>

          {/* Email Contact */}
          <div
            onClick={() => (window.location.href = "mailto:thomas.augot@gmail.com")}
            className="group cursor-pointer relative overflow-hidden bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg hover:border-white/20 transition-all duration-300 hover:bg-black/30"
          >
            <div className="flex items-center px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-colors duration-300">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-white/70 group-hover:text-white transition-colors duration-300"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              
              <div className="flex-1">
                <div className="text-xs font-mono text-white/50 uppercase tracking-wider mb-0.5">
                  {t("nav.contact.email")}
                </div>
                <div className="text-sm text-white/90 font-mono group-hover:text-white transition-colors duration-300">
                  thomas.augot@gmail.com
                </div>
              </div>
              
              <div className="w-4 h-4 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-white"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </div>
            </div>
          </div>

          {/* Schedule Contact */}
          <div
            onClick={() => window.open("https://calendly.com/yourusername", "_blank")}
            className="group cursor-pointer relative overflow-hidden bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg hover:border-white/20 transition-all duration-300 hover:bg-black/30"
          >
            <div className="flex items-center px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-colors duration-300">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-white/70 group-hover:text-white transition-colors duration-300"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              
              <div className="flex-1">
                <div className="text-xs font-mono text-white/50 uppercase tracking-wider mb-0.5">
                  {t("nav.contact.schedule")}
                </div>
                <div className="text-sm text-white/90 font-mono group-hover:text-white transition-colors duration-300">
                  {t("nav.contact.bookCall")}
                </div>
              </div>
              
              <div className="w-4 h-4 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-white"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet Version - Square Cards in Row */}
      <div className="hidden md:block lg:hidden">
        <div className="text-xs font-mono text-white/40 uppercase tracking-[0.2em] mb-4 text-center">
          {t("nav.contact.title")}
        </div>
        
        <div className="flex gap-3 justify-center">
          {/* WhatsApp Square */}
          <div
            onClick={() => window.open("https://wa.me/34684736469", "_blank")}
            className="group cursor-pointer relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:border-white/30 transition-all duration-300 hover:bg-white/15 w-20 h-20 flex flex-col items-center justify-center"
          >
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:bg-white/20 transition-colors duration-300">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white/80 group-hover:text-white transition-colors duration-300"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <div className="text-xs text-white/70 font-mono text-center leading-tight group-hover:text-white/90 transition-colors duration-300">
              WhatsApp
            </div>
          </div>

          {/* Email Square */}
          <div
            onClick={() => (window.location.href = "mailto:thomas.augot@gmail.com")}
            className="group cursor-pointer relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:border-white/30 transition-all duration-300 hover:bg-white/15 w-20 h-20 flex flex-col items-center justify-center"
          >
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:bg-white/20 transition-colors duration-300">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white/80 group-hover:text-white transition-colors duration-300"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="text-xs text-white/70 font-mono text-center leading-tight group-hover:text-white/90 transition-colors duration-300">
              Email
            </div>
          </div>

          {/* Schedule Square */}
          <div
            onClick={() => window.open("https://calendly.com/yourusername", "_blank")}
            className="group cursor-pointer relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:border-white/30 transition-all duration-300 hover:bg-white/15 w-20 h-20 flex flex-col items-center justify-center"
          >
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:bg-white/20 transition-colors duration-300">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white/80 group-hover:text-white transition-colors duration-300"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="text-xs text-white/70 font-mono text-center leading-tight group-hover:text-white/90 transition-colors duration-300">
              Schedule
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version - Minimal Icons Only */}
      <div className="md:hidden">
        <div className="text-xs font-mono text-white/40 uppercase tracking-[0.2em] mb-3 text-center">
          {t("nav.contact.title")}
        </div>
        
        <div className="flex justify-center gap-4">
          {/* WhatsApp */}
          <div
            onClick={() => window.open("https://wa.me/34684736469", "_blank")}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white/80"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>

          {/* Email */}
          <div
            onClick={() => (window.location.href = "mailto:thomas.augot@gmail.com")}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white/80"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>

          {/* Schedule */}
          <div
            onClick={() => window.open("https://calendly.com/yourusername", "_blank")}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white/80"
            >
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