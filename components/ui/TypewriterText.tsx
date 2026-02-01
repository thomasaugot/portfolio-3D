"use client";

import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

export default function TypewriterText({ text, speed = 30 }: TypewriterTextProps) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!text) {
      setDisplay("");
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
  }, [text, speed]);

  return <>{display}</>;
}
