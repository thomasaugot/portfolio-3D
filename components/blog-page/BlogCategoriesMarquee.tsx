"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import Marquee from "react-fast-marquee";

export default function BlogCategoriesMarquee() {
  const { t } = useTranslation();

  const row1 = [
    "FRONTEND DEVELOPMENT",
    "FULL STACK",
    "WEB DEVELOPMENT",
    "UI/UX DESIGN",
    "CODE TUTORIALS",
    "BEST PRACTICES",
  ];

  const row2 = [
    "REACT & NEXT.JS",
    "JAVASCRIPT",
    "TYPESCRIPT",
    "GSAP ANIMATIONS",
    "THREE.JS",
    "WORDPRESS",
    "WEB PERFORMANCE",
    "OPTIMIZATION",
    "ANIMATION",
    "AWS & CLOUD",
  ];

  return (
    <section className="relative overflow-visible py-16 md:py-24" data-categories-marquee>
      <div className="relative space-y-8">
        {/* First Row */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 py-6 transform -rotate-2 w-[110vw] -ml-[5vw]">
          <Marquee speed={50} gradient={false} autoFill={true}>
            {row1.map((text, index) => (
              <span
                key={`row1-${index}`}
                className="mx-8 md:mx-12 text-2xl md:text-4xl font-fun font-bold text-white whitespace-nowrap"
              >
                {text}
              </span>
            ))}
          </Marquee>
        </div>

        {/* Second Row */}
        <div className="bg-gradient-to-r from-secondary/20 via-secondary/30 to-secondary/20 py-6 transform rotate-2 w-[110vw] -ml-[5vw]">
          <Marquee
            speed={45}
            gradient={false}
            autoFill={true}
            direction="right"
          >
            {row2.map((text, index) => (
              <span
                key={`row2-${index}`}
                className="mx-8 md:mx-12 text-2xl md:text-4xl font-fun font-bold text-white whitespace-nowrap"
              >
                {text}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
