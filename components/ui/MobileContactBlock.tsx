"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { FaWhatsapp, FaEnvelope, FaCalendarAlt, FaLinkedin, FaGithub } from "react-icons/fa";

interface ContactItem {
  icon: React.ReactNode;
  action: () => void;
}

export default function MobileContactBlock() {
  const { t } = useTranslation();

  const contactItems: ContactItem[] = [
    {
      icon: <FaWhatsapp size={18} />,
      action: () => window.open("https://wa.me/34684736469", "_blank")
    },
    {
      icon: <FaEnvelope size={18} />,
      action: () => (window.location.href = "mailto:thomas.augot@gmail.com")
    },
    {
      icon: <FaCalendarAlt size={18} />,
      action: () => window.open("https://calendly.com/yourusername", "_blank")
    },
    {
      icon: <FaLinkedin size={18} />,
      action: () => window.open("https://www.linkedin.com/in/thomas-augot/", "_blank")
    },
    {
      icon: <FaGithub size={18} />,
      action: () => window.open("https://github.com/thomasaugot", "_blank")
    }
  ];

  return (
    <div className="w-full max-w-xs mx-auto px-6 py-4">
      <div className="text-center mb-6">
        <div className="text-sm font-mono text-text-muted uppercase tracking-[0.3em]">
          {t("nav.contact.title")}
        </div>
      </div>

      <div className="flex justify-center gap-3">
        {contactItems.map((item, index) => (
          <button
            key={index}
            data-animate={`mobile-contact-${index}`}
            onClick={item.action}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:border-white/30 active:scale-95"
            style={{ 
              pointerEvents: 'auto',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            <div className="text-white transition-colors duration-300">
              {item.icon}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}