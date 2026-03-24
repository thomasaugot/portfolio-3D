"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { TerminalLine, Stage } from "@/data/terminal-content";
import { CHAR_SPEED } from "@/utils/animations/typewriter";
import { useMotionPreference } from "@/contexts/MotionPreferenceProvider";

interface UseTerminalTypingOptions {
  heroActive: boolean;
  isMorphing: boolean;
  stage: Stage;
  getStageContent: () => TerminalLine[];
  promptLabel: string;
  onTypingComplete: () => void;
}

export function useTerminalTyping({
  heroActive,
  isMorphing,
  stage,
  getStageContent,
  promptLabel,
  onTypingComplete,
}: UseTerminalTypingOptions) {
  const { reducedMotion } = useMotionPreference();
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [typing, setTyping] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [promptLabelTyped, setPromptLabelTyped] = useState("");

  const currentLineIndexRef = useRef(-1);
  const typedStageRef = useRef<Stage | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promptLabelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wait = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        delayTimerRef.current = setTimeout(() => {
          delayTimerRef.current = null;
          resolve();
        }, ms);
      }),
    []
  );

  const appendLine = useCallback((line: TerminalLine) => {
    setLines((prev) => {
      const initialContent =
        line.type === "badge-group" || line.type === "info-grid" ? line.content : "";
      const next = [...prev, { ...line, content: initialContent }];
      currentLineIndexRef.current = next.length - 1;
      return next;
    });
  }, []);

  const updateLineText = useCallback((text: string) => {
    setLines((prev) => {
      const index = currentLineIndexRef.current;
      if (index < 0 || index >= prev.length) return prev;
      const next = [...prev];
      next[index] = { ...next[index], content: text };
      return next;
    });
  }, []);

  const typeLine = useCallback(
    (line: TerminalLine, isCancelled: () => boolean) =>
      new Promise<void>((resolve) => {
        if (
          line.type === "badge-group" ||
          line.type === "info-grid" ||
          !line.content
        ) {
          resolve();
          return;
        }

        if (isCancelled()) {
          resolve();
          return;
        }

        if (reducedMotion) {
          updateLineText(line.content);
          resolve();
          return;
        }

        // Quick character-by-character typewriter
        const fullText = line.content;
        const charSpeed = CHAR_SPEED;
        let charIndex = 0;

        const tick = () => {
          if (isCancelled()) {
            resolve();
            return;
          }
          charIndex++;
          if (charIndex >= fullText.length) {
            updateLineText(fullText);
            resolve();
          } else {
            updateLineText(fullText.slice(0, charIndex));
            typingTimerRef.current = setTimeout(tick, charSpeed);
          }
        };

        typingTimerRef.current = setTimeout(tick, charSpeed);
      }),
    [reducedMotion, updateLineText]
  );

  const resetPromptLabel = useCallback(() => {
    setPromptLabelTyped("");
    if (promptLabelTimerRef.current) {
      clearTimeout(promptLabelTimerRef.current);
      promptLabelTimerRef.current = null;
    }
  }, []);

  const typePromptLabel = useCallback(
    (label: string, speed = 18, isCancelled: () => boolean) =>
      new Promise<void>((resolve) => {
        if (isCancelled()) {
          resolve();
          return;
        }
        if (reducedMotion) {
          setPromptLabelTyped(label);
          resolve();
          return;
        }
        // Quick character-by-character typewriter for prompt label
        let charIndex = 0;
        const tick = () => {
          if (isCancelled()) {
            resolve();
            return;
          }
          charIndex++;
          if (charIndex >= label.length) {
            setPromptLabelTyped(label);
            resolve();
          } else {
            setPromptLabelTyped(label.slice(0, charIndex));
            promptLabelTimerRef.current = setTimeout(tick, speed);
          }
        };
        promptLabelTimerRef.current = setTimeout(tick, speed);
      }),
    [reducedMotion]
  );

  const resetState = useCallback(() => {
    setLines([]);
    setTyping(false);
    setContentReady(false);
    currentLineIndexRef.current = -1;
    typedStageRef.current = null;
    resetPromptLabel();
  }, [resetPromptLabel]);

  // Reset on stage or language change
  const resetForStageChange = useCallback(() => {
    setLines([]);
    setTyping(false);
    currentLineIndexRef.current = -1;
    typedStageRef.current = null;
  }, []);

  // Start content ready state after morph completes
  useEffect(() => {
    if (!heroActive || isMorphing || contentReady) return;
    setContentReady(true);
    setTyping(true);
  }, [heroActive, isMorphing, contentReady]);

  // Main typing effect
  useEffect(() => {
    if (!heroActive || isMorphing || !contentReady) return;
    if (typedStageRef.current === stage) return;

    let cancelled = false;
    setTyping(true);
    setLines([]);
    currentLineIndexRef.current = -1;
    typedStageRef.current = stage;
    resetPromptLabel();

    const runTypingQueue = async () => {
      const content = getStageContent();

      for (const line of content) {
        if (cancelled) break;
        await wait(reducedMotion ? 0 : (line.delay ?? 100));
        if (cancelled) break;

        appendLine(line);
        await typeLine(line, () => cancelled);
      }

      if (cancelled) return;

      if (promptLabel) {
        await typePromptLabel(promptLabel, reducedMotion ? 0 : 26, () => cancelled);
        if (cancelled) return;
      } else {
        setPromptLabelTyped("");
      }

      setTyping(false);
      setTimeout(() => {
        onTypingComplete();
      }, reducedMotion ? 0 : 300);
    };

    runTypingQueue();

    return () => {
      cancelled = true;
      setTyping(false);
      resetPromptLabel();
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
    };
  }, [
    contentReady,
    getStageContent,
    heroActive,
    isMorphing,
    stage,
    promptLabel,
    onTypingComplete,
    wait,
    appendLine,
    typeLine,
    resetPromptLabel,
    typePromptLabel,
    reducedMotion,
  ]);

  return {
    lines,
    typing,
    promptLabelTyped,
    contentReady,
    setContentReady,
    resetState,
    resetForStageChange,
  };
}
