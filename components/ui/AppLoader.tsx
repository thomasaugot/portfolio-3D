"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animations";
import { useTranslationReady } from "@/hooks/useTranslationReady";
import { debug } from "@/utils/debug";

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
  const strip1Ref = useRef<HTMLDivElement>(null);
  const strip2Ref = useRef<HTMLDivElement>(null);
  const strip3Ref = useRef<HTMLDivElement>(null);
  const strip4Ref = useRef<HTMLDivElement>(null);
  const strip5Ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const translationsReady = useTranslationReady();
  const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const exitTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // INITIAL LOAD
  useEffect(() => {
    if (phase === 'loading' && strip1Ref.current && contentRef.current) {
      const isInitialLoad = !entranceTimelineRef.current;

      if (isInitialLoad) {
        if (exitTimelineRef.current) {
          exitTimelineRef.current.kill();
          exitTimelineRef.current = null;
        }

        if (progressBarRef.current) {
          progressBarRef.current.style.width = '0%';
        }
        if (percentRef.current) {
          percentRef.current.textContent = '0';
        }

        gsap.set([strip1Ref.current, strip2Ref.current, strip3Ref.current, strip4Ref.current, strip5Ref.current], {
          x: 0,
          y: 0,
          rotation: 0,
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
        debug.log('[AppLoader] Ignoring stale progress:', progress, 'last was:', lastProgressRef.current);
      }
    }

    // Reset on phase change to entering (new transition starting)
    if (phase === 'entering') {
      lastProgressRef.current = 0;
    }
  }, [progress, phase]);

  // ENTRANCE - SMOOTH CASCADING WATERFALL
  useEffect(() => {
    if (phase !== 'entering' || !strip1Ref.current || !contentRef.current) return;

    if (entranceTimelineRef.current) {
      entranceTimelineRef.current.kill();
      entranceTimelineRef.current = null;
    }
    if (exitTimelineRef.current) {
      exitTimelineRef.current.kill();
      exitTimelineRef.current = null;
    }

    // Position strips OFF-SCREEN - cascading from top
    gsap.set(strip1Ref.current, { y: '-100%' });
    gsap.set(strip2Ref.current, { y: '-100%' });
    gsap.set(strip3Ref.current, { y: '-100%' });
    gsap.set(strip4Ref.current, { y: '-100%' });
    gsap.set(strip5Ref.current, { y: '-100%' });

    gsap.set(contentRef.current, {
      opacity: 0,
    });

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

    // SMOOTH CASCADING WATERFALL
    tl.to(strip1Ref.current, { y: '0%', duration: 0.8, ease: "power3.out" }, 0)
      .to(strip2Ref.current, { y: '0%', duration: 0.8, ease: "power3.out" }, 0.08)
      .to(strip3Ref.current, { y: '0%', duration: 0.8, ease: "power3.out" }, 0.16)
      .to(strip4Ref.current, { y: '0%', duration: 0.8, ease: "power3.out" }, 0.24)
      .to(strip5Ref.current, { y: '0%', duration: 0.8, ease: "power3.out" }, 0.32)
      .to(contentRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0.6);

    return () => {
      tl.kill();
    };
  }, [phase, onEntranceComplete]);

  // EXIT - SMOOTH CASCADE UP
  useEffect(() => {
    if (phase !== 'exiting') return;

    // Capture refs at effect time
    const content = contentRef.current;
    const strip1 = strip1Ref.current;
    const strip2 = strip2Ref.current;
    const strip3 = strip3Ref.current;
    const strip4 = strip4Ref.current;
    const strip5 = strip5Ref.current;

    if (!strip1 || !content) return;

    if (entranceTimelineRef.current) {
      entranceTimelineRef.current.kill();
      entranceTimelineRef.current = null;
    }
    if (exitTimelineRef.current) {
      exitTimelineRef.current.kill();
      exitTimelineRef.current = null;
    }

    if (progressBarRef.current) {
      progressBarRef.current.style.width = '100%';
    }
    if (percentRef.current) {
      percentRef.current.textContent = '100';
    }

    const tl = gsap.timeline();
    exitTimelineRef.current = tl;

    // Content fades out - use captured ref
    tl.to(content, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0);

    // Trigger content show early
    tl.call(() => {
      if (onExitComplete) {
        onExitComplete();
      }
    }, [], 0.2);

    // CASCADING UP - REVERSE WATERFALL - use captured refs
    if (strip5) tl.to(strip5, { y: '-100%', duration: 0.6, ease: "power3.in" }, 0.2);
    if (strip4) tl.to(strip4, { y: '-100%', duration: 0.6, ease: "power3.in" }, 0.26);
    if (strip3) tl.to(strip3, { y: '-100%', duration: 0.6, ease: "power3.in" }, 0.32);
    if (strip2) tl.to(strip2, { y: '-100%', duration: 0.6, ease: "power3.in" }, 0.38);
    if (strip1) tl.to(strip1, { y: '-100%', duration: 0.6, ease: "power3.in" }, 0.44);

    return () => {
      tl.kill();
    };
  }, [phase, progress, onExitComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] h-screen w-screen overflow-hidden"
      style={{ pointerEvents: "none" }}
    >
      {/* 5 VERTICAL STRIPS */}
      <div ref={strip1Ref} className="absolute top-0 left-0 w-[20%] h-full bg-bg" />
      <div ref={strip2Ref} className="absolute top-0 left-[20%] w-[20%] h-full bg-bg" />
      <div ref={strip3Ref} className="absolute top-0 left-[40%] w-[20%] h-full bg-bg" />
      <div ref={strip4Ref} className="absolute top-0 left-[60%] w-[20%] h-full bg-bg" />
      <div ref={strip5Ref} className="absolute top-0 left-[80%] w-[20%] h-full bg-bg" />

      {/* Loading UI */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center gap-12"
        style={{
          opacity: 0,
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        {/* Progress percentage - Large and bold */}
        <div className="flex items-baseline gap-2">
          <span
            ref={percentRef}
            className="font-fun text-[80px] md:text-[120px] font-bold leading-none tabular-nums"
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
            className="font-fun text-[50px] md:text-[80px] font-bold leading-none text-white opacity-50"
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
