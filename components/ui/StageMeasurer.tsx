"use client";

import { useRef, useMemo, useLayoutEffect, type ReactNode } from "react";
import {
  getStageContent,
  getHeaderLabel,
  type Stage,
} from "@/data/terminal-content";
import TerminalFrame from "@/components/ui/terminal/TerminalFrame";
import TerminalLines from "@/components/ui/terminal/TerminalLines";
import ContactForm from "@/components/sections/contact/ContactForm";
import { Button } from "@/components/ui/Button";
import AboutPortrait from "@/components/sections/about/AboutPortrait";
import TaglineCarousel from "@/components/ui/terminal/TaglineCarousel";

/**
 * Hidden measurer — renders the EXACT same content as the real terminal
 * (same chrome, same padding, same font classes) at the given width,
 * then reports the real offsetHeight so terminal-sizes.ts can use it.
 */
type StageModeProps = {
  stage: Stage;
  t: (key: string) => string;
  isDesktop: boolean;
  useCompactAboutLayout?: boolean;
  useCompactHeroTitle?: boolean;
  widthCss: string;
  promptLabel: string;
  yesLabel: string;
  noLabel: string;
  onMeasure: (stage: Stage, height: number) => void;
};

type GenericModeProps = {
  measureKey: string;
  widthCss: string;
  onMeasureCustom: (key: string, height: number) => void;
  children: ReactNode;
  maxWidth?: string;
};

type StageMeasurerProps = StageModeProps | GenericModeProps;

export default function StageMeasurer(props: StageMeasurerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isGenericMode = "measureKey" in props;
  const stage = isGenericMode ? null : props.stage;
  const useCompactAboutLayout =
    !isGenericMode && props.stage === "about" && props.useCompactAboutLayout;
  const widthCss = props.widthCss;
  const maxWidth = isGenericMode ? (props.maxWidth ?? "92vw") : "92vw";
  const content = useMemo(() => {
    if (isGenericMode) return [];
    if (useCompactAboutLayout) {
      return getStageContent("about", props.t, false);
    }
    return getStageContent(props.stage, props.t, props.isDesktop);
  }, [isGenericMode, stage, props, useCompactAboutLayout]);

  const taglineBefore = isGenericMode ? "" : props.t("hero.tagline_before");
  const taglineAfter = isGenericMode ? "" : props.t("hero.tagline_after");
  const taglineWords = isGenericMode
    ? []
    : props
        .t("hero.tagline_words")
        .split(",")
        .map((word) => word.trim())
        .filter(Boolean);

  const promptLabel = isGenericMode
    ? ""
    : useCompactAboutLayout
      ? props.t("about.block_skills")
      : props.promptLabel;
  const yesLabel = isGenericMode
    ? ""
    : useCompactAboutLayout
      ? props.t("hero.prompt_yes")
      : props.yesLabel;
  const noLabel = isGenericMode
    ? ""
    : useCompactAboutLayout
      ? props.t("hero.prompt_no")
      : props.noLabel;

  useLayoutEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    const measure = () => {
      node.style.height = "auto";
      const h = node.offsetHeight;
      if (h <= 0) return;
      if (isGenericMode) {
        props.onMeasureCustom(props.measureKey, h);
        return;
      }
      props.onMeasure(props.stage, h);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    if (typeof document !== "undefined" && "fonts" in document) {
      void (document as Document & { fonts?: FontFaceSet }).fonts?.ready.then(
        measure,
      );
    }

    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [
    content,
    isGenericMode,
    maxWidth,
    props,
    stage,
    taglineAfter,
    taglineBefore,
    taglineWords,
    widthCss,
  ]);

  if (isGenericMode) {
    return (
      <div
        ref={ref}
        data-portfolio-terminal-measurer={props.measureKey}
        aria-hidden="true"
        inert
        suppressHydrationWarning
        className="fixed -z-50 opacity-0 pointer-events-none top-0 left-0"
        style={{ width: widthCss, maxWidth, height: "auto" }}
      >
        {props.children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-stage-measurer={props.stage}
      aria-hidden="true"
      inert
      suppressHydrationWarning
      className="fixed -z-50 opacity-0 pointer-events-none top-0 left-0"
      style={{ width: widthCss, maxWidth, height: "auto" }}
    >
      <TerminalFrame
        title={getHeaderLabel(props.stage, true, props.t)}
        shellClassName="h-auto"
      >
        {props.stage === "hero" && (
          <div className="px-4 md:px-6 pt-4 pb-2 border-b border-border [html[data-theme='light']_&]:border-b-[#d4c7ae]">
            <p className="text-xs font-mono text-secondary mb-2 tracking-widest uppercase">
              {props.t("hero.tagline_prefix")}
            </p>
            <h1
              className={`text-lg md:text-2xl lg:text-3xl font-bold text-text leading-tight ${
                props.useCompactHeroTitle ? "" : "md:whitespace-nowrap"
              }`}
            >
              <TaglineCarousel
                before={taglineBefore}
                after={taglineAfter}
                words={taglineWords}
                useCompactLayout={!!props.useCompactHeroTitle}
              />
            </h1>
          </div>
        )}

        {/* Body — identical padding to real terminal body */}
        <div className="relative p-4 md:p-6 font-mono text-sm leading-relaxed overflow-visible">
          <AboutPortrait
            visible={props.stage === "about" && !props.isDesktop}
          />
          <TerminalLines lines={content} />

          {/* Prompt */}
          {props.stage !== "contact" && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-text">
                <span className="text-primary">❯</span>
                <span>{promptLabel}</span>
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                <Button type="button" variant="orange" size="md">
                  {yesLabel}
                </Button>
                <Button type="button" variant="outlined" size="md">
                  {noLabel}
                </Button>
              </div>
            </div>
          )}
          {props.stage === "contact" && (
            <ContactForm
              stage={props.stage}
              showPrompt={true}
              isDesktop={props.isDesktop}
            />
          )}
        </div>
      </TerminalFrame>
    </div>
  );
}
