"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { languageNames, type Language } from "@/utils/route-translations";
import {
  initCarousel3D,
  rotateCarousel3D,
} from "@/utils/animations/carousel-3d-animations";

const welcomeTexts = {
  en: { welcome: "Welcome", choose: "Choose your language" },
  fr: { welcome: "Bienvenue", choose: "Choisissez votre langue" },
  es: { welcome: "Bienvenido", choose: "Elige tu idioma" },
};

export function LanguageDiscovery() {
  const { language, changeLanguage } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [hoverLang, setHoverLang] = useState<Language>(language);

  const languages: Language[] = ["en", "fr", "es"];
  const detectedLanguage =
    typeof window !== "undefined"
      ? ["en", "fr", "es"].includes(navigator.language.slice(0, 2))
        ? (navigator.language.slice(0, 2) as Language)
        : "en"
      : "en";

  useGSAPAnimations([initCarousel3D]);

  // Check visibility after component mounts to avoid hydration mismatch
  useEffect(() => {
    const hasSeenDiscovery = localStorage.getItem("language-discovery-seen");
    const browserLang = navigator.language.slice(0, 2) as Language;
    const supportedLang = ["en", "fr", "es"].includes(browserLang)
      ? browserLang
      : "en";
    setIsVisible(!hasSeenDiscovery && supportedLang !== language);
  }, [language]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        initCarousel3D();
        const selectedIndex = languages.indexOf(selectedLang);
        rotateCarousel3D(selectedIndex);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleLanguageClick = (lang: Language) => {
    setSelectedLang(lang);
    setHoverLang(lang);
    const selectedIndex = languages.indexOf(lang);
    rotateCarousel3D(selectedIndex);
  };

  const handleContinue = () => {
    changeLanguage(selectedLang);
    setIsVisible(false);
    localStorage.setItem("language-discovery-seen", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-bg/90 backdrop-blur-md z-[999] flex items-center justify-center p-8">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-96 h-96 translate-y-8">
          <div className="absolute w-80 h-64 border border-electric-blue/15 rounded-full animate-[orbit_25s_linear_infinite] top-8 left-8">
            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-electric-blue/50 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-violet/50 rounded-full" />
            <div className="absolute left-1/4 top-1/3 w-1 h-1 bg-pink/50 rounded-full" />
          </div>
          <div className="absolute w-72 h-56 border border-violet/10 rounded-full animate-[orbit_35s_linear_infinite_reverse] top-12 left-12">
            <div className="absolute top-1/4 right-0 w-0.5 h-0.5 bg-teal/40 rounded-full" />
            <div className="absolute left-0 bottom-1/3 w-0.5 h-0.5 bg-amber/40 rounded-full" />
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-3 transition-all duration-500">
            {welcomeTexts[hoverLang].welcome}
          </h1>
          <p className="text-text-muted text-lg transition-all duration-500">
            {welcomeTexts[hoverLang].choose}
          </p>
        </div>

        <div
          className="relative h-80 flex items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          <div
            data-animate="carousel-3d"
            className="relative w-1 h-1"
            style={{ transformStyle: "preserve-3d" }}
          >
            {languages.map((lang, index) => {
              const isSelected = lang === selectedLang;

              return (
                <div
                  key={lang}
                  data-animate="card-3d"
                  className="absolute cursor-pointer"
                  onClick={() => handleLanguageClick(lang)}
                  onMouseEnter={() => setHoverLang(lang)}
                  onMouseLeave={() => setHoverLang(selectedLang)}
                  style={{
                    transformStyle: "preserve-3d",
                    left: "-80px", // Half of card width (40px * 2)
                    top: "-96px", // Half of card height (48px * 2)
                  }}
                >
                  <div
                    className={`
                      relative overflow-hidden rounded-2xl border-2 w-40 h-48
                      transition-colors duration-300
                      ${
                        isSelected
                          ? "border-electric-blue bg-electric-blue/15 shadow-xl shadow-electric-blue/30"
                          : "border-border/30 bg-surface/20 hover:border-electric-blue/50"
                      }
                      ${
                        lang === detectedLanguage && !isSelected
                          ? "border-violet/50 bg-violet/5"
                          : ""
                      }
                    `}
                  >
                    <div
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        isSelected ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        background: `linear-gradient(45deg, 
                          ${
                            lang === "en"
                              ? "#00d4ff"
                              : lang === "fr"
                              ? "#8b5cf6"
                              : "#ec4899"
                          }25, 
                          transparent, 
                          ${
                            lang === "en"
                              ? "#00d4ff"
                              : lang === "fr"
                              ? "#8b5cf6"
                              : "#ec4899"
                          }15)`,
                      }}
                    />

                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
                      <div
                        className="text-5xl font-bold mb-4"
                        style={{
                          color:
                            lang === "en"
                              ? "#00d4ff"
                              : lang === "fr"
                              ? "#8b5cf6"
                              : "#ec4899",
                        }}
                      >
                        {lang.toUpperCase()}
                      </div>

                      <div className="text-base font-medium text-text mb-2">
                        {languageNames[lang]}
                      </div>

                      {lang === detectedLanguage && !isSelected && (
                        <div className="text-sm text-violet animate-pulse">
                          Detected
                        </div>
                      )}

                      {isSelected && (
                        <div className="text-sm text-electric-blue animate-pulse">
                          Selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="mt-8 w-14 h-14 rounded-full bg-electric-blue/10 border border-electric-blue/30 flex items-center justify-center hover:bg-electric-blue/20 hover:scale-110 transition-all duration-300 group mx-auto"
        >
          <svg
            className="w-6 h-6 text-electric-blue group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
