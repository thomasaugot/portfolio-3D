"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { experienceKeys } from "@/data/experience";
import ExperienceItem from "./ExperienceItem";
import ExperienceModal from "./ExperienceModal";

export default function Timeline() {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [pathD, setPathD] = useState("");
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePath = () => {
      if (dotRefs.current.length === 0 || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();

      const positions = dotRefs.current
        .filter((dot): dot is HTMLDivElement => dot !== null)
        .map((dot) => {
          const dotRect = dot.getBoundingClientRect();
          return {
            x: dotRect.left - containerRect.left + dotRect.width / 2,
            y: dotRect.top - containerRect.top + dotRect.height / 2,
          };
        });

      if (positions.length < 2) return;

      let path = `M ${positions[0].x} ${positions[0].y}`;

      for (let i = 1; i < positions.length; i++) {
        const curr = positions[i];
        const prev = positions[i - 1];

        const midX = (prev.x + curr.x) / 2;
        const waveHeight = i % 2 === 0 ? -60 : 60;

        path += ` Q ${midX} ${prev.y + waveHeight}, ${curr.x} ${curr.y}`;
      }

      setPathD(path);
    };

    setTimeout(updatePath, 500);
    window.addEventListener("resize", updatePath);

    return () => window.removeEventListener("resize", updatePath);
  }, []);

  const totalWidth = (450 + 100) * experienceKeys.length + 500;

  return (
    <>
      <section data-timeline-section className="relative min-h-screen">
        <div ref={containerRef} className="h-screen overflow-visible relative">
          {/* Mobile title - top center */}
          <div className="lg:hidden absolute top-8 sm:top-12 left-0 right-0 z-10 text-center px-4 sm:px-6">
            <h2 className="title-section">
              <span className="block text-text">{t("about.timeline.title_1")}</span>
              <span className="block gradient-text font-fun">{t("about.timeline.title_2")}</span>
            </h2>
          </div>

          {/* Desktop title - vertical on left, centered in viewport */}
          <div className="hidden lg:flex absolute left-16 top-0 bottom-0 z-20 items-center pointer-events-none px-4">
            <h2
              className="title-section py-4"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              <span className="block text-text whitespace-nowrap">{t("about.timeline.title_1")}</span>
              <span className="block gradient-text font-fun whitespace-nowrap">{t("about.timeline.title_2")}</span>
            </h2>
          </div>

          <svg
            data-timeline-svg
            className="absolute left-0 top-0 pointer-events-none z-5"
            width={totalWidth}
            height="100%"
            style={{ overflow: "visible" }}
          >
            <path
              d={pathD}
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div
            data-timeline-track
            className="absolute top-[50%] left-0 w-full z-10"
            style={{ transform: "translateY(-50%)" }}
          >
            <div className="relative flex items-center px-4 sm:px-8 md:pl-[20vw] md:pr-12">
              {experienceKeys.map((key, index) => (
                <ExperienceItem
                  key={key}
                  index={index}
                  type={t(`${key}.type`)}
                  isCurrent={t(`${key}.current`) === "true"}
                  period={t(`${key}.period`)}
                  title={t(`${key}.title`)}
                  organization={t(`${key}.organization`)}
                  location={t(`${key}.location`)}
                  tech={t(`${key}.tech`)}
                  onClick={() => setSelectedIndex(index)}
                  dotRef={(el) => {
                    dotRefs.current[index] = el;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {selectedIndex !== null && (
        <ExperienceModal
          index={selectedIndex}
          type={t(`${experienceKeys[selectedIndex]}.type`)}
          period={t(`${experienceKeys[selectedIndex]}.period`)}
          title={t(`${experienceKeys[selectedIndex]}.title`)}
          organization={t(`${experienceKeys[selectedIndex]}.organization`)}
          location={t(`${experienceKeys[selectedIndex]}.location`)}
          description={t(`${experienceKeys[selectedIndex]}.description`)}
          tech={t(`${experienceKeys[selectedIndex]}.tech`)}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
}
