"use client";

import { useEffect, useState } from "react";
import { useMotionPreference } from "@/contexts/MotionPreferenceProvider";

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

export default function TypewriterText({ text, speed = 30 }: TypewriterTextProps) {
  const [display, setDisplay] = useState("");
  const { reducedMotion } = useMotionPreference();

  useEffect(() => {
    if (!text) {
      setDisplay("");
      return;
    }

    if (reducedMotion) {
      setDisplay(text);
      return;
    }

    let index = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const typeNext = () => {
      index += 1;
      setDisplay(text.slice(0, index));
      if (index < text.length) {
        timer = setTimeout(typeNext, speed);
      }
    };

    typeNext();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [text, speed, reducedMotion]);

  return <>{display}</>;
}
