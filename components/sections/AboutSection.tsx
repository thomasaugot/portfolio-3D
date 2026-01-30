"use client";

import { useTranslation } from "@/contexts/TranslationProvider";
import Image from "next/image";

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <div
      className="fixed inset-0 z-20 pointer-events-none"
      style={{ visibility: "hidden", opacity: 0 }}
      data-about-section
    >
      {/* Container matching navbar max-width */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-full relative">
        {/* Portrait area - positioned to the left */}
        <div className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2">
        <div data-about-portrait className="relative h-[500px] lg:h-[600px] flex items-center justify-center" style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>
          {/* Animated gradient orbs */}
          <div
            data-about-glow
            className="absolute w-[300px] h-[300px] bg-primary/30 rounded-full blur-[80px] -top-10 -left-10 animate-[float_6s_ease-in-out_infinite]"
          />
          <div
            className="absolute w-[250px] h-[250px] bg-secondary/25 rounded-full blur-[60px] bottom-10 right-0 animate-[float_8s_ease-in-out_infinite_1s]"
          />

          {/* Portrait with clean frame */}
          <div className="relative group">
            {/* Rotating outer rings */}
            <div className="absolute -inset-8 border-2 border-dashed border-primary/30 rounded-full animate-[spin_30s_linear_infinite]" />
            <div className="absolute -inset-14 border border-secondary/20 rounded-full animate-[spin_45s_linear_infinite_reverse]" />

            {/* Portrait - simple rounded frame */}
            <div className="relative w-[280px] lg:w-[320px] h-[360px] lg:h-[420px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/20">
              <Image
                src="/assets/images/portrait/portrait.png"
                alt={t("about.name")}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                priority
              />

              {/* Subtle bottom fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
            </div>

            {/* Floating accent dots */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-2 h-2 bg-secondary rounded-full animate-pulse" />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
