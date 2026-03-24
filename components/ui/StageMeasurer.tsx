"use client";

import { useRef, useMemo, useLayoutEffect } from "react";
import { getStageContent, getHeaderLabel, type Stage } from "@/data/terminal-content";
import TerminalLines from "@/components/ui/TerminalLines";
import ContactForm from "@/components/ui/ContactForm";
import { Button } from "@/components/ui/Button";
import AboutPortrait from "@/components/ui/AboutPortrait";
import TaglineCarousel from "@/components/ui/TaglineCarousel";

/**
 * Hidden measurer — renders the EXACT same content as the real terminal
 * (same chrome, same padding, same font classes) at the given width,
 * then reports the real offsetHeight so terminal-sizes.ts can use it.
 */
export default function StageMeasurer({
  stage,
  t,
  isDesktop,
  widthCss,
  promptLabel,
  yesLabel,
  noLabel,
  onMeasure,
}: {
  stage: Stage;
  t: (key: string) => string;
  isDesktop: boolean;
  widthCss: string;
  promptLabel: string;
  yesLabel: string;
  noLabel: string;
  onMeasure: (stage: Stage, height: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const content = useMemo(
    () => getStageContent(stage, t, isDesktop),
    [stage, t, isDesktop],
  );

  const taglineBefore = t("hero.tagline_before");
  const taglineAfter = t("hero.tagline_after");
  const taglineWords = t("hero.tagline_words")
    .split(",")
    .map((word) => word.trim())
    .filter(Boolean);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    const measure = () => {
      node.style.height = "auto";
      const h = node.offsetHeight;
      if (h > 0) onMeasure(stage, h);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    if (typeof document !== "undefined" && "fonts" in document) {
      void (document as Document & { fonts?: FontFaceSet }).fonts?.ready.then(measure);
    }

    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [stage, onMeasure, widthCss, t, isDesktop, promptLabel, yesLabel, noLabel, content, taglineBefore, taglineAfter, taglineWords]);

  return (
    <div
      ref={ref}
      data-stage-measurer={stage}
      aria-hidden="true"
      suppressHydrationWarning
      className="fixed -z-50 opacity-0 pointer-events-none top-0 left-0"
      style={{ width: widthCss, maxWidth: "92vw", height: "auto" }}
    >
      <div className="keyboard-focus-ring bg-bg-surface/96 backdrop-blur-sm rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col w-full h-auto [html[data-theme='light']_&]:border-[#c8b99f] [html[data-theme='light']_&]:bg-[#f8f3e9]/96 [html[data-theme='light']_&]:shadow-[0_28px_80px_rgba(16,185,129,0.08),0_18px_40px_rgba(149,115,37,0.12)]">
        {/* Header — identical to real terminal */}
        <div className="flex items-center gap-2 px-4 py-3 bg-bg-panel border-b border-border text-nowrap [html[data-theme='light']_&]:bg-[linear-gradient(90deg,rgba(16,185,129,0.07),rgba(245,158,11,0.06))] [html[data-theme='light']_&]:border-b-[#cdbda3]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
          </div>
          <span className="ml-4 text-xs text-muted font-mono text-nowrap [html[data-theme='light']_&]:text-[#756a5b]">
            {getHeaderLabel(stage, true, t)}
          </span>
        </div>

        {/* Hero tagline section */}
        {stage === "hero" && (
          <div className="px-4 md:px-6 pt-4 pb-2 border-b border-border [html[data-theme='light']_&]:border-b-[#d4c7ae]">
            <p className="text-xs font-mono text-secondary mb-2 tracking-widest uppercase">
              {t("hero.tagline_prefix")}
            </p>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-text leading-tight">
              <TaglineCarousel
                before={taglineBefore}
                after={taglineAfter}
                words={taglineWords}
              />
            </h1>
          </div>
        )}

        {/* Body — identical padding to real terminal body */}
        <div className="relative p-4 md:p-6 font-mono text-sm leading-relaxed overflow-visible">
          <AboutPortrait visible={stage === "about" && !isDesktop} />
          <TerminalLines lines={content} />

          {/* Prompt */}
          {stage !== "contact" && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-text">
                <span className="text-primary">❯</span>
                <span>{promptLabel}</span>
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                <Button type="button" variant="orange" size="md">{yesLabel}</Button>
                <Button type="button" variant="outlined" size="md">{noLabel}</Button>
              </div>
            </div>
          )}
          {stage === "contact" && (
            <ContactForm stage={stage} showPrompt={true} isDesktop={isDesktop} />
          )}
        </div>
      </div>
    </div>
  );
}
