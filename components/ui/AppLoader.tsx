"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface AppLoaderProps {
  progress: number;
  phase: "entering" | "loading" | "exiting";
  onEntranceComplete?: () => void;
  onExitComplete?: () => void;
}

export default function AppLoader({
  progress,
  phase,
  onEntranceComplete,
  onExitComplete,
}: AppLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null!);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const [showCursor, setShowCursor] = useState(true);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Update progress
  useEffect(() => {
    if (phase === "loading" || phase === "entering") {
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${progress}%`;
      }
      if (percentRef.current) {
        percentRef.current.textContent = `${progress}`;
      }
    }
  }, [progress, phase]);

  // Entrance animation
  useEffect(() => {
    if (phase !== "entering" || !contentRef.current) return;

    gsap.set(contentRef.current, { opacity: 0, y: 20 });

    const tl = gsap.timeline({
      onComplete: () => onEntranceComplete?.(),
    });

    tl.to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
    });

    return () => {
      tl.kill();
    };
  }, [phase, onEntranceComplete]);

  // Exit animation
  useEffect(() => {
    if (phase !== "exiting" || !contentRef.current) return;

    if (progressBarRef.current) {
      progressBarRef.current.style.width = "100%";
    }
    if (percentRef.current) {
      percentRef.current.textContent = "100";
    }

    const tl = gsap.timeline();

    tl.to(contentRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: "power2.in",
    });

    tl.call(() => onExitComplete?.(), [], 0.3);

    return () => {
      tl.kill();
    };
  }, [phase, onExitComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] h-screen w-screen overflow-hidden bg-bg"
      style={{ pointerEvents: phase === "exiting" ? "none" : "auto" }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(var(--theme-border)_1px,transparent_1px),linear-gradient(90deg,var(--theme-border)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Loading UI */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-full max-w-md px-6">
          {/* Terminal window */}
          <div className="bg-bg-surface rounded-xl border border-border shadow-2xl overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-bg-panel border-b border-border">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
              </div>
              <span className="ml-4 text-xs text-muted font-mono">
                loading.sh
              </span>
            </div>

            {/* Terminal content */}
            <div className="p-6 font-mono text-sm">
              <div className="mb-4">
                <span className="text-primary">❯</span>
                <span className="text-text ml-2">./init-portfolio.sh</span>
              </div>

              <div className="mb-4 text-text/82">
                Loading assets...
              </div>

              {/* Progress */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-2 bg-text/12 rounded-full overflow-hidden">
                  <div
                    ref={progressBarRef}
                    className="h-full w-0 bg-gradient-to-r from-primary to-primary rounded-full transition-all duration-300"
                  />
                </div>
                <div className="flex items-baseline gap-1 min-w-[60px] justify-end">
                  <span
                    ref={percentRef}
                    className="text-primary font-bold tabular-nums"
                  >
                    0
                  </span>
                  <span className="text-muted">%</span>
                </div>
              </div>

              {/* Cursor */}
              <div className="flex items-center gap-2">
                <span className="text-primary">❯</span>
                <span
                  className={`w-2 h-5 bg-primary ${showCursor ? "opacity-100" : "opacity-0"}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
