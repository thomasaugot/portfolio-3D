"use client";

import { useEffect, useRef } from "react";
import type { Stage } from "./useStageNavigation";

const STAGE_FOCUS_SELECTORS: Record<Stage, string> = {
  hero: '[data-stage-focus-target="hero"]',
  about: '[data-stage-focus-target="about"]',
  projects: '[data-stage-focus-target="projects"]',
  contact: '[data-stage-focus-target="contact"]',
};

interface UseStageFocusOptions {
  stage: Stage;
  isMorphing: boolean;
  isReady: boolean;
  delay?: number;
}

export function useStageFocus({
  stage,
  isMorphing,
  isReady,
  delay = 260,
}: UseStageFocusOptions) {
  const prevStageRef = useRef(stage);
  const shouldFocusStageRef = useRef(false);

  useEffect(() => {
    if (!isReady) return;

    if (prevStageRef.current !== stage) {
      prevStageRef.current = stage;
      shouldFocusStageRef.current = true;
    }

    if (isMorphing || !shouldFocusStageRef.current) return;

    const timeoutId = window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>(
        STAGE_FOCUS_SELECTORS[stage]
      );

      target?.focus();
      shouldFocusStageRef.current = false;
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, isMorphing, isReady, stage]);
}
