"use client";

import { useEffect, useState } from "react";
import { useMotionPreference } from "@/contexts/MotionPreferenceProvider";

interface TaglineCarouselProps {
  before: string;
  after: string;
  words: string[];
  interval?: number;
  useCompactLayout?: boolean;
}

export default function TaglineCarousel({
  before,
  after,
  words,
  interval = 2500,
  useCompactLayout = false,
}: TaglineCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { reducedMotion } = useMotionPreference();

  useEffect(() => {
    if (reducedMotion || words.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval, reducedMotion]);

  const word = words[currentIndex] ?? "";

  return (
    <>
      <span className={useCompactLayout ? "hidden" : "hidden whitespace-nowrap md:inline"}>
        {before}
        {before ? " " : ""}
        <span
          key={`desktop-${word}`}
          className={`text-primary ${reducedMotion ? "" : "inline-block animate-slot-in"}`}
        >
          {word}
        </span>
        {after ? " " + after : ""}
      </span>

      <span className={useCompactLayout ? "" : "md:hidden"}>
        <span className="block whitespace-nowrap">{before}</span>
        <span className="block whitespace-nowrap">
          <span
            key={`mobile-${word}`}
            className={`text-primary ${reducedMotion ? "" : "inline-block animate-slot-in"}`}
          >
            {word}
          </span>
          {after ? " " + after : ""}
        </span>
      </span>
    </>
  );
}
