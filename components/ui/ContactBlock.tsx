"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { FaWhatsapp, FaEnvelope, FaCalendarAlt, FaLinkedin, FaGithub } from "react-icons/fa";
import Image from "next/image";

export default function ContactBlock() {
  const { t } = useTranslation();

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/34684736469", "_blank");
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:thomas.augot@gmail.com";
  };

  const handleCalendarClick = () => {
    window.open("https://calendly.com/yourusername", "_blank");
  };

  const handleLinkedInClick = () => {
    window.open("https://www.linkedin.com/in/thomas-augot/", "_blank");
  };

  const handleGitHubClick = () => {
    window.open("https://github.com/thomasaugot", "_blank");
  };

  return (
    <div className="h-full flex items-center justify-center p-16 pt-0 mt-16">
      <div className="relative w-[600px] h-[600px]" style={{ perspective: '2000px' }}>
        
        <div className="absolute inset-0 overflow-hidden">
          {/* Plasma Waves */}
          <div data-animate="plasma-field" className="absolute inset-0">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`plasma-${i}`}
                data-animate={`plasma-wave-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${100 + i * 40}px`,
                  height: `${100 + i * 40}px`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: `conic-gradient(from ${i * 30}deg, var(--primary-color), var(--secondary-color), var(--accent-color), var(--primary-color))`,
                  opacity: 0.03 + (i * 0.01),
                  filter: 'blur(2px)'
                }}
              />
            ))}
          </div>

          {/* Energy Grid */}
          <svg className="absolute inset-0 w-full h-full" data-animate="energy-grid">
            <defs>
              <radialGradient id="plasmaGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.8" />
                <stop offset="50%" stopColor="var(--secondary-color)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <filter id="plasma-glow">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Hexagonal Energy Grid */}
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i * 60) * Math.PI / 180;
              const x1 = 50 + Math.cos(angle) * 15;
              const y1 = 50 + Math.sin(angle) * 15;
              const x2 = 50 + Math.cos(angle) * 35;
              const y2 = 50 + Math.sin(angle) * 35;
              
              return (
                <line
                  key={`grid-line-${i}`}
                  data-animate={`grid-line-${i}`}
                  x1={`${x1}%`} y1={`${y1}%`}
                  x2={`${x2}%`} y2={`${y2}%`}
                  stroke="url(#plasmaGrad)"
                  strokeWidth="2"
                  filter="url(#plasma-glow)"
                  opacity="0.6"
                />
              );
            })}
          </svg>
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" data-animate="mega-logo">
          <div className="relative">
            {/* Logo Aura */}
            <div className="absolute -inset-12 rounded-full bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20 blur-3xl opacity-0" data-animate="logo-aura"></div>
            
            <Image 
              src="/assets/images/logo/logo-full-gradient-nobg.png" 
              alt="Logo" 
              width={220}
              height={110}
              className="relative z-10 hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        
        {/* WhatsApp - Floating Crystal */}
        <button 
          data-animate="contact-whatsapp"
          className="absolute cursor-pointer group z-[999] p-4"
          onClick={handleWhatsAppClick}
          style={{ 
            top: '12%', 
            left: '50%', 
            transform: 'translateX(-50%)',
            pointerEvents: 'auto'
          }}
        >
          <div className="relative">
            {/* Orbital Ring */}
            <div className="absolute -inset-8 border border-primary/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all duration-700"></div>
            
            {/* Crystal Core - ENLARGED CLICKABLE AREA */}
            <div className="w-20 h-20 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full backdrop-blur-2xl border border-primary/40 flex items-center justify-center group-hover:scale-125 group-hover:shadow-2xl group-hover:shadow-primary/60 transition-all duration-500"
                   style={{ 
                     background: 'linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.2), rgba(var(--secondary-color-rgb), 0.1))',
                     boxShadow: 'inset 0 0 20px rgba(var(--primary-color-rgb), 0.3), 0 0 40px rgba(var(--primary-color-rgb), 0.2)'
                   }}>
                <FaWhatsapp size={28} className="text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              
              {/* Energy Tendrils */}
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        </button>

        {/* Email - Levitating Sphere */}
        <button 
          data-animate="contact-email"
          className="absolute cursor-pointer group z-40 p-4"
          onClick={handleEmailClick}
          style={{ 
            top: '50%', 
            right: '6%', 
            transform: 'translateY(-50%)',
            transformStyle: 'preserve-3d',
            pointerEvents: 'auto'
          }}
        >
          <div className="relative">
            <div className="absolute -inset-8 border border-secondary/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all duration-700"></div>
            <div className="w-20 h-20 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-accent/20 rounded-full backdrop-blur-2xl border border-secondary/40 flex items-center justify-center group-hover:scale-125 group-hover:shadow-2xl group-hover:shadow-secondary/60 transition-all duration-500"
                   style={{ 
                     background: 'linear-gradient(135deg, rgba(var(--secondary-color-rgb), 0.2), rgba(var(--accent-color-rgb), 0.1))',
                     boxShadow: 'inset 0 0 20px rgba(var(--secondary-color-rgb), 0.3), 0 0 40px rgba(var(--secondary-color-rgb), 0.2)'
                   }}>
                <FaEnvelope size={28} className="text-secondary group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-secondary rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        </button>

        {/* Calendar - Dimensional Cube */}
        <button 
          data-animate="contact-calendar"
          className="absolute cursor-pointer group z-40 p-4"
          onClick={handleCalendarClick}
          style={{ 
            bottom: '14%', 
            right: '21%',
            pointerEvents: 'auto'
          }}
        >
          <div className="relative">
            <div className="absolute -inset-8 border border-accent/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all duration-700"></div>
            <div className="w-20 h-20 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/20 rounded-full backdrop-blur-2xl border border-accent/40 flex items-center justify-center group-hover:scale-125 group-hover:shadow-2xl group-hover:shadow-accent/60 transition-all duration-500"
                   style={{ 
                     background: 'linear-gradient(135deg, rgba(204, 255, 2, 0.2), rgba(var(--primary-color-rgb), 0.1))',
                     boxShadow: 'inset 0 0 20px rgba(204, 255, 2, 0.3), 0 0 40px rgba(204, 255, 2, 0.2)'
                   }}>
                <FaCalendarAlt size={28} className="text-accent group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        </button>

        {/* LinkedIn - Plasma Orb */}
        <button 
          data-animate="contact-linkedin"
          className="absolute cursor-pointer group z-40 p-4"
          onClick={handleLinkedInClick}
          style={{ 
            bottom: '11%', 
            left: '21%',
            transformStyle: 'preserve-3d',
            pointerEvents: 'auto'
          }}
        >
          <div className="relative">
            <div className="absolute -inset-8 border border-primary/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all duration-700"></div>
            <div className="w-20 h-20 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full backdrop-blur-2xl border border-primary/40 flex items-center justify-center group-hover:scale-125 group-hover:shadow-2xl group-hover:shadow-primary/60 transition-all duration-500"
                   style={{ 
                     background: 'linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.2), rgba(var(--accent-color-rgb), 0.1))',
                     boxShadow: 'inset 0 0 20px rgba(var(--primary-color-rgb), 0.3), 0 0 40px rgba(var(--primary-color-rgb), 0.2)'
                   }}>
                <FaLinkedin size={28} className="text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        </button>

        {/* GitHub - Energy Vortex */}
        <button 
          data-animate="contact-github"
          className="absolute cursor-pointer group z-40 p-4"
          onClick={handleGitHubClick}
          style={{ 
            top: '50%', 
            left: '6%', 
            transform: 'translateY(-50%)',
            transformStyle: 'preserve-3d',
            pointerEvents: 'auto'
          }}
        >
          <div className="relative">
            <div className="absolute -inset-8 border border-secondary/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all duration-700"></div>
            <div className="w-20 h-20 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full backdrop-blur-2xl border border-secondary/40 flex items-center justify-center group-hover:scale-125 group-hover:shadow-2xl group-hover:shadow-secondary/60 transition-all duration-500"
                   style={{ 
                     background: 'linear-gradient(135deg, rgba(var(--secondary-color-rgb), 0.2), rgba(var(--primary-color-rgb), 0.1))',
                     boxShadow: 'inset 0 0 20px rgba(var(--secondary-color-rgb), 0.3), 0 0 40px rgba(var(--secondary-color-rgb), 0.2)'
                   }}>
                <FaGithub size={28} className="text-secondary group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-secondary rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        </button>

        {/* Title */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="text-sm font-mono text-subtle uppercase tracking-[0.4em] text-center opacity-80">
            {t("nav.contact.title")}
          </div>
        </div>
      </div>
    </div>
  );
}