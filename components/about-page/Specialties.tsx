"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import {
  Code2,
  Sparkles,
  Settings,
  Globe,
  Smartphone,
  Search,
  ChevronRight,
} from "lucide-react";

export default function Specialties() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const specialties = [
    {
      key: "frontend_dev",
      Icon: Code2,
      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Three.js",
        "GSAP",
      ],
    },
    {
      key: "animations",
      Icon: Sparkles,
      skills: [
        "GSAP",
        "Framer Motion",
        "Three.js",
        "WebGL",
        "Canvas API",
        "CSS Animations",
      ],
    },
    {
      key: "fullstack",
      Icon: Settings,
      skills: [
        "Node.js",
        "Express",
        "PostgreSQL",
        "MongoDB",
        "REST APIs",
        "GraphQL",
      ],
    },
    {
      key: "mobile_apps",
      Icon: Smartphone,
      skills: [
        "React Native",
        "Expo",
        "WebViews",
        "iOS Publishing",
        "Android Publishing",
        "App Store Optimization",
      ],
    },
    {
      key: "seo",
      Icon: Search,
      skills: [
        "Technical SEO",
        "Meta Tags",
        "Schema Markup",
        "Core Web Vitals",
        "Sitemap",
        "Analytics",
      ],
    },
    {
      key: "multilingual",
      Icon: Globe,
      skills: [
        "i18n",
        "Locale Detection",
        "RTL Support",
        "Content Management",
        "Translation APIs",
      ],
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section data-specialties className="relative py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16" data-section-header>
          <h2 data-tetris-title className="title-section text-text mb-4">
            {t("about.specialties.title")}
          </h2>
          <p className="subtitle gradient-text max-w-2xl mx-auto">
            {t("about.specialties.subtitle")}
          </p>
        </div>

        <div className="space-y-4">
          {specialties.map((specialty, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={specialty.key}
                data-specialty-accordion={index}
                className="group relative"
              >
                {/* Gradient border when open */}
                <div
                  className={`absolute -inset-[1px] bg-gradient-to-r from-primary via-secondary to-primary rounded-2xl transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Main container */}
                <div className={`relative bg-bg rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isOpen ? "border-transparent" : "border-border/50 hover:border-primary/30"
                }`}>
                  {/* Header */}
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`p-3 rounded-xl transition-all duration-300 ${
                          isOpen
                            ? "bg-primary/20"
                            : "bg-surface group-hover:bg-primary/10"
                        }`}
                      >
                        <specialty.Icon
                          className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${
                            isOpen
                              ? "text-primary"
                              : "text-text/60 group-hover:text-primary"
                          }`}
                        />
                      </div>

                      <h4
                        className={`text-lg md:text-xl font-semibold transition-colors duration-300 ${
                          isOpen
                            ? "text-primary"
                            : "text-text group-hover:text-primary"
                        }`}
                      >
                        {t(`about.specialties.${specialty.key}.title`)}
                      </h4>
                    </div>

                    <ChevronRight
                      className={`w-5 h-5 text-text/40 flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {/* Content */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-5">
                      {/* Divider */}
                      <div className="h-px bg-border/50" />

                      {/* Description */}
                      <p className="text-sm md:text-base text-text/70 leading-relaxed">
                        {t(`about.specialties.${specialty.key}.description`)}
                      </p>

                      {/* Skills */}
                      <div className="space-y-3">
                        <div className="text-xs font-mono uppercase tracking-wider text-text/50">
                          {t("about.specialties.skills_label")}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {specialty.skills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-3 py-1.5 text-xs font-mono bg-surface text-text/70 rounded-lg border border-border/50"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
