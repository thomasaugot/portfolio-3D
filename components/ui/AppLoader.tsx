"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/animations";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { useTranslationReady } from "@/hooks/useTranslationReady";

interface AppLoaderProps {
  progress: number;
  phase: 'entering' | 'loading' | 'exiting';
  onEntranceComplete?: () => void;
  onExitComplete?: () => void;
  clickPosition: { x: number; y: number } | null;
}

export default function AppLoader({
  progress,
  phase,
  onEntranceComplete,
  onExitComplete,
  clickPosition
}: AppLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null!);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const translationsReady = useTranslationReady();
  const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const exitTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });

  // Set click position on mount to avoid hydration mismatch
  useEffect(() => {
    setClickPos(clickPosition || { x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }, [clickPosition]);

  // INITIAL LOAD - Make loader visible immediately when starting in 'loading' phase
  useEffect(() => {
    if (phase === 'loading' && overlayRef.current && contentRef.current) {
      // Check if this is initial load (no previous entrance animation)
      const isInitialLoad = !entranceTimelineRef.current;

      if (isInitialLoad) {

        // Kill any running animations
        if (exitTimelineRef.current) {
          exitTimelineRef.current.kill();
          exitTimelineRef.current = null;
        }

        // Reset progress to 0
        if (progressBarRef.current) {
          progressBarRef.current.style.width = '0%';
        }
        if (percentRef.current) {
          percentRef.current.textContent = '0';
        }

        // Show loader overlay and content
        gsap.set(overlayRef.current, {
          clipPath: 'circle(150% at 50% 50%)',
        });
        gsap.set(contentRef.current, {
          opacity: 1,
        });
      }
    }
  }, [phase]);

  // Update progress - direct updates for 3% jumps
  const lastProgressRef = useRef<number>(0);

  useEffect(() => {
    if (phase === 'loading') {
      // Only update if progress is actually increasing (not a stale high value)
      if (progress === 0 || progress > lastProgressRef.current) {
        if (progressBarRef.current) progressBarRef.current.style.width = `${progress}%`;
        if (percentRef.current) percentRef.current.textContent = `${progress}`;
        lastProgressRef.current = progress;
      } else {
        console.log('[AppLoader] Ignoring stale progress:', progress, 'last was:', lastProgressRef.current);
      }
    }

    // Reset on phase change to entering (new transition starting)
    if (phase === 'entering') {
      lastProgressRef.current = 0;
    }
  }, [progress, phase]);

  // ENTRANCE - Fast explosive wipe
  useEffect(() => {
    if (phase !== 'entering' || !overlayRef.current || !contentRef.current) return;
    if (!translationsReady) return;

    // Kill any existing animations FIRST
    if (entranceTimelineRef.current) {
      entranceTimelineRef.current.kill();
      entranceTimelineRef.current = null;
    }
    if (exitTimelineRef.current) {
      exitTimelineRef.current.kill();
      exitTimelineRef.current = null;
    }

    // Force immediate reset of all elements BEFORE animation
    gsap.set(overlayRef.current, {
      clipPath: `circle(0% at ${clickPos.x}px ${clickPos.y}px)`,
      clearProps: 'all',
    });
    gsap.set(contentRef.current, {
      opacity: 0,
      clearProps: 'all',
    });

    // Reset progress to 0
    if (progressBarRef.current) {
      progressBarRef.current.style.width = '0%';
    }
    if (percentRef.current) {
      percentRef.current.textContent = '0';
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (onEntranceComplete) {
          onEntranceComplete();
        }
      },
    });

    entranceTimelineRef.current = tl;

    if (textRef.current) {
      textRef.current.textContent = t("common.status.loading");
    }

    // Explosive radial burst - FASTER
    tl.fromTo(
      overlayRef.current,
      {
        clipPath: `circle(0% at ${clickPos.x}px ${clickPos.y}px)`,
      },
      {
        clipPath: `circle(150% at ${clickPos.x}px ${clickPos.y}px)`,
        duration: 0.2,
        ease: "expo.out",
      },
      0
    );

    // Content fades in - FASTER
    tl.fromTo(
      contentRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.15,
        ease: "power2.out",
      },
      0.1
    );

    return () => {
      tl.kill();
    };
  }, [phase, translationsReady, t, onEntranceComplete, clickPos.x, clickPos.y]);

  // EXIT - Aggressive implosion with scale
  useEffect(() => {
    if (phase !== 'exiting' || !overlayRef.current || !contentRef.current) return;

    console.log('[AppLoader] EXIT starting');

    // Kill any existing animations
    if (entranceTimelineRef.current) {
      entranceTimelineRef.current.kill();
      entranceTimelineRef.current = null;
    }
    if (exitTimelineRef.current) {
      exitTimelineRef.current.kill();
      exitTimelineRef.current = null;
    }

    // Ensure 100% is displayed
    if (progressBarRef.current) {
      progressBarRef.current.style.width = '100%';
    }
    if (percentRef.current) {
      percentRef.current.textContent = '100';
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const tl = gsap.timeline();

    exitTimelineRef.current = tl;

    // Content fades fast
    tl.to(
      contentRef.current,
      {
        opacity: 0,
        duration: 0.15,
        ease: "power2.in",
      },
      0
    );

    // Trigger content show early (before overlay finishes imploding)
    tl.call(() => {
      console.log('[AppLoader] Triggering content show early');
      if (onExitComplete) {
        onExitComplete();
      }
    }, [], 0.1);

    // Overlay implodes aggressively - FASTER
    tl.to(
      overlayRef.current,
      {
        clipPath: `circle(0% at ${centerX}px ${centerY}px)`,
        duration: 0.3,
        ease: "expo.in",
      },
      0.1
    );

    return () => {
      tl.kill();
    };
  }, [phase, progress, onExitComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] h-screen w-screen"
      style={{ pointerEvents: "none" }}
    >
      {/* Solid overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 w-full h-full bg-bg"
        style={{
          clipPath: `circle(0% at ${clickPos.x}px ${clickPos.y}px)`,
        }}
      />

      {/* Loading UI */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center gap-12"
        style={{ opacity: 0 }}
      >
        {/* Progress percentage - Large and bold */}
        <div className="flex items-baseline gap-2">
          <span
            ref={percentRef}
            className="font-fun text-[120px] font-bold leading-none tabular-nums"
            style={{
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            0
          </span>
          <span
            className="font-fun text-[80px] font-bold leading-none text-white opacity-50"
          >
            %
          </span>
        </div>

        {/* Progress bar - Clean and wide */}
        <div className="w-[600px] max-w-[80vw]">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full w-0 rounded-full transition-all duration-300"
              style={{
                background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
              }}
            />
          </div>
        </div>

        {/* Loading text - Subtle */}
        <span
          ref={textRef}
          className="font-fun text-sm font-medium tracking-[0.3em] uppercase opacity-30"
        >
          {translationsReady ? "" : ""}
        </span>
      </div>
    </div>
  );
}
