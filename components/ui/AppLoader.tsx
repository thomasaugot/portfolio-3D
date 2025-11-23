"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/animations";
import { initLoaderAnimations } from "@/utils/animations/loader-animations";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { useTranslationReady } from "@/hooks/useTranslationReady";

interface AppLoaderProps {
  progress: number;
}

export default function AppLoader({ progress }: AppLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null!);
  const scrambleRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const translationsReady = useTranslationReady();
  const [introComplete, setIntroComplete] = useState(false);

  // Tetris animation - word split in two halves
  useEffect(() => {
    if (!scrambleRef.current || !translationsReady) return;

    const finalText = t("common.status.loading");
    const element = scrambleRef.current;
    const midPoint = Math.ceil(finalText.length / 2);
    const firstHalf = finalText.slice(0, midPoint);
    const secondHalf = finalText.slice(midPoint);

    // Create two spans for each half
    element.innerHTML = `<span data-half="first" style="display:inline-block">${firstHalf}</span><span data-half="second" style="display:inline-block">${secondHalf}</span>`;

    const firstSpan = element.querySelector('[data-half="first"]');
    const secondSpan = element.querySelector('[data-half="second"]');

    // Set initial state - first half from left, second from right
    gsap.set(firstSpan, {
      opacity: 0,
      x: -200,
      y: -80,
      rotationZ: -45,
      scale: 0.5,
    });

    gsap.set(secondSpan, {
      opacity: 0,
      x: 200,
      y: -80,
      rotationZ: 45,
      scale: 0.5,
    });

    // Animate both halves
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => setIntroComplete(true), 300);
      },
    });

    // First half
    tl.to(
      firstSpan,
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      0
    );

    tl.to(
      firstSpan,
      {
        rotationZ: 0,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
      },
      0.2
    );

    // Second half - slightly delayed
    tl.to(
      secondSpan,
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      0.1
    );

    tl.to(
      secondSpan,
      {
        rotationZ: 0,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
      },
      0.3
    );
  }, [translationsReady, t]);

  useEffect(() => {
    if (introComplete) {
      const cleanup = initLoaderAnimations(loaderRef, progress);
      return cleanup;
    }
  }, [progress, introComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] h-screen w-screen flex flex-col items-center justify-center bg-black"
    >
      <div
        data-animate="loading-text"
        className="title-section mb-8 text-text h-12"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <span ref={scrambleRef} className="inline-block min-w-[200px]">
          {translationsReady ? "" : ""}
        </span>
      </div>

      <div
        className="w-60 md:w-80 h-1 overflow-hidden rounded-full bg-border"
        style={{ opacity: introComplete ? 1 : 0, transition: "opacity 0.3s" }}
      >
        <div
          data-animate="progress-bar"
          className="h-full gradient-primary rounded-full w-0"
        />
      </div>

      <div
        className="mt-6 subtitle text-text"
        data-animate="percentage"
        style={{ opacity: 0 }}
      >
        0%
      </div>
    </div>
  );
}
