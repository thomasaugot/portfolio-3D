"use client";

import { useTranslation } from "@/hooks/useTranslation";

export default function ContactSection() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Title */}
      <div className="text-md font-mono text-[var(--color-text-muted)] uppercase tracking-wider mb-4 opacity-70">
        {t("nav.contact.title")}
      </div>
      <div className="space-y-6">
        {/* WhatsApp Contact */}
        <div
          onClick={() => window.open("https://wa.me/1234567890", "_blank")}
          className="group cursor-pointer relative overflow-hidden h-20 w-80 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-xl transform hover:rotate-0 transition-all duration-700 border border-green-500/30 hover:border-green-500/60 rounded-2xl hover:scale-105"
          style={{
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex items-center h-full px-6 relative z-10">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-500/40 transition-colors duration-300 group-hover:scale-110">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>

            <div>
              <div className="text-xs font-mono text-green-500 uppercase tracking-wider mb-1">
                {t("nav.contact.whatsapp")}
              </div>
              <div className="text-base text-white group-hover:text-green-500 transition-colors duration-300 font-mono">
                +34 684 73 64 69
              </div>
            </div>
          </div>
        </div>
        {/* Email Contact */}
        <div
          onClick={() =>
            (window.location.href = "mailto:your.email@domain.com")
          }
          className="group cursor-pointer relative overflow-hidden h-20 w-80 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-xl transform hover:rotate-0 transition-all duration-700 border border-[var(--primary-color)]/30 hover:border-[var(--primary-color)]/60 rounded-2xl hover:scale-105"
          style={{
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-color)]/10 via-transparent to-[var(--primary-color)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex items-center h-full px-6 relative z-10">
            <div className="w-10 h-10 bg-[var(--primary-color)]/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-[var(--primary-color)]/40 transition-colors duration-300 group-hover:scale-110">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary-color)"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>

            <div>
              <div className="text-xs font-mono text-[var(--primary-color)] uppercase tracking-wider mb-1">
                {t("nav.contact.email")}
              </div>
              <div className="text-base text-white group-hover:text-[var(--primary-color)] transition-colors duration-300 font-mono">
                thomas.augot@gmail.com
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Contact */}
        <div
          onClick={() =>
            window.open("https://calendly.com/yourusername", "_blank")
          }
          className="group cursor-pointer relative overflow-hidden h-20 w-80 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-xl transform hover:rotate-0 transition-all duration-700 border border-[var(--secondary-color)]/30 hover:border-[var(--secondary-color)]/60 rounded-2xl hover:scale-105"
          style={{
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--secondary-color)]/10 via-transparent to-[var(--secondary-color)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex items-center h-full px-6 relative z-10">
            <div className="w-10 h-10 bg-[var(--secondary-color)]/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-[var(--secondary-color)]/40 transition-colors duration-300 group-hover:scale-110">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--secondary-color)"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>

            <div>
              <div className="text-xs font-mono text-[var(--secondary-color)] uppercase tracking-wider mb-1">
                {t("nav.contact.schedule")}
              </div>
              <div className="text-base text-white group-hover:text-[var(--secondary-color)] transition-colors duration-300 font-mono">
                {t("nav.contact.bookCall")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
