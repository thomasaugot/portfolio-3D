"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getViewportConfig, getProjectsIntroSize } from "@/utils/terminal-sizes";

type IntroTerminalSize = { widthCss: string; heightCss: string };

const SSR_VIEWPORT_DEFAULTS = {
  width: 375, height: 812,
  isMobile: true, isTinyMobile: true, isTallMobile: true,
  isTabletPortrait: false, isTablet: false,
  isSmallDesktop: false, useCompactAboutLayout: false, isDesktop: false,
};

export function usePortfolioSetup() {
  const sectionRef = useRef<HTMLElement>(null);
  const [viewportConfig, setViewportConfig] = useState(SSR_VIEWPORT_DEFAULTS);
  const [introSize, setIntroSize] = useState<IntroTerminalSize | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [measurerTarget, setMeasurerTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const sync = () => setViewportConfig(getViewportConfig());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const syncIntroSize = useCallback(() => {
    const size = getProjectsIntroSize();
    if (size.height <= 0) return;
    setIntroSize({ widthCss: size.widthCss, heightCss: size.heightCss });
  }, []);

  useEffect(() => {
    syncIntroSize();
    if ("fonts" in document) {
      void (document as Document & { fonts?: FontFaceSet }).fonts?.ready.then(syncIntroSize);
    }
    window.addEventListener("resize", syncIntroSize);
    return () => window.removeEventListener("resize", syncIntroSize);
  }, [syncIntroSize]);

  useEffect(() => {
    setMeasurerTarget(document.body);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const zone = document.createElement("div");
    zone.setAttribute("data-portfolio-content-zone", "");
    zone.className = "no-scrollbar";
    Object.assign(zone.style, {
      position: "absolute",
      zIndex: "60",
      overflowX: "hidden",
      overflowY: "auto",
      overscrollBehavior: "contain",
      scrollbarWidth: "none",
      touchAction: "pan-y",
      pointerEvents: "none",
    });
    zone.style.setProperty("-ms-overflow-style", "none");
    zone.style.setProperty("-webkit-overflow-scrolling", "touch");
    section.appendChild(zone);
    setPortalTarget(zone);

    let rafId: number;
    const syncZone = () => {
      const terminal = section.querySelector("[data-portfolio-terminal]") as HTMLElement | null;
      if (terminal) {
        const rect = terminal.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        const headerHeight = 44;
        zone.style.left = `${rect.left - sectionRect.left}px`;
        zone.style.top = `${rect.top - sectionRect.top + headerHeight}px`;
        zone.style.width = `${rect.width}px`;
        zone.style.height = `${Math.max(0, rect.height - headerHeight)}px`;
      }
      rafId = requestAnimationFrame(syncZone);
    };
    rafId = requestAnimationFrame(syncZone);

    return () => { cancelAnimationFrame(rafId); zone.remove(); };
  }, []);

  return { sectionRef, viewportConfig, introSize, setIntroSize, portalTarget, measurerTarget };
}
