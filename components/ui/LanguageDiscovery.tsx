"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { languageNames, type Language } from "@/utils/route-translations";
import { ChevronRight, ChevronLeft } from "lucide-react";

export function LanguageDiscovery() {
  const { changeLanguage } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const languages: Language[] = ["en", "fr", "es"];

  useEffect(() => {
    const hasSeenDiscovery = localStorage.getItem("language-discovery-seen");
    setIsVisible(!hasSeenDiscovery);
  }, []);

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % languages.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + languages.length) % languages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    } else if (touchEndX.current - touchStartX.current > 50) {
      handlePrev();
    }
  };

  const handleContinue = () => {
    changeLanguage(languages[selectedIndex]);
    setIsVisible(false);
    localStorage.setItem("language-discovery-seen", "true");
  };

  if (!isVisible) return null;

  const anglePerCard = 360 / languages.length;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg/95 backdrop-blur-md">
      <div className="text-center w-full max-w-2xl px-4">
        <div className="relative h-[250px] flex items-center justify-center mb-12" style={{ perspective: "1000px" }}>
          <button
            onClick={handlePrev}
            className="absolute left-0 z-20 w-10 h-10 rounded-full border border-border hover:border-primary flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-text" />
          </button>

          <div
            className="relative w-[1px] h-[1px]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${-selectedIndex * anglePerCard}deg)`,
              transition: "transform 0.5s ease-out",
            }}
          >
            {languages.map((lang, index) => {
              const angle = index * anglePerCard;
              const radian = (angle * Math.PI) / 180;
              const radius = 200;
              const x = Math.sin(radian) * radius;
              const z = Math.cos(radian) * radius;
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={lang}
                  className="absolute cursor-pointer"
                  style={{
                    transform: `translate3d(${x}px, -80px, ${z}px) rotateY(${angle}deg)`,
                    transformStyle: "preserve-3d",
                    left: "-75px",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => setSelectedIndex(index)}
                >
                  <div
                    className={`w-[150px] h-[160px] rounded-2xl flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? "gradient-primary shadow-xl scale-105"
                        : "bg-surface border border-border shadow-md scale-90 opacity-50"
                    }`}
                  >
                    <div className={`text-4xl font-bold mb-2 ${isSelected ? "text-black" : "text-primary"}`}>
                      {lang.toUpperCase()}
                    </div>
                    <div className={`text-base font-medium ${isSelected ? "text-black" : "text-text-muted"}`}>
                      {languageNames[lang]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="absolute right-0 z-20 w-10 h-10 rounded-full border border-border hover:border-primary flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-text" />
          </button>
        </div>

        <button
          onClick={handleContinue}
          className="px-8 py-3 rounded-full gradient-primary text-black font-semibold hover:scale-105 transition-transform shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}